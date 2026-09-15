#!/usr/bin/env node
/* ============================================================
   UnderstandGLP1.com — daily price updater
   ============================================================
   Run by .github/workflows/update-prices.yml once a day.
   Local run:  node scripts/update-prices.mjs [--dry-run]

   What it does
   - Fetches comparewg.co.uk / comparemj.co.uk for each dose column
     in public/pricing-data.js.
   - For providers ALREADY on our list, updates: price per dose,
     discount code, Trustpilot score, lastSeen.
   - Never adds or removes providers, and never touches url, type,
     gphc, gphcVerified, deliversNI or note. Those stay editorial.

   Safety rails
   - A page yielding fewer than MIN_PROVIDERS_PER_PAGE is treated as
     a layout change: the run fails and nothing is written.
   - A price outside PRICE_BOUNDS, or moving more than MAX_DAILY_SWING
     from the current value, is held back and reported. Held moves are
     applied on a manual run with "accept_swings" ticked.
   - Providers not found keep their existing values. Anything unseen
     for STALE_DAYS or more is flagged in the run summary.
   ============================================================ */

import { readFile, writeFile, appendFile } from "node:fs/promises";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_FILE = path.join(ROOT, "public", "pricing-data.js");
const DRY_RUN = process.argv.includes("--dry-run");
// Set ACCEPT_SWINGS=true (manual workflow run) to apply held moves you've checked by hand.
const ACCEPT_SWINGS = process.env.ACCEPT_SWINGS === "true";

const MIN_PROVIDERS_PER_PAGE = 15;
const PRICE_BOUNDS = [30, 600];
const MAX_DAILY_SWING = 0.35;
const STALE_DAYS = 7;

const SOURCES = {
  wegovy: {
    "0.25mg": "https://www.comparewg.co.uk/",
    "2.4mg": "https://www.comparewg.co.uk/wegovy-2.4mg-price-comparison-uk",
  },
  mounjaro: {
    "2.5mg": "https://www.comparemj.co.uk/",
    "15mg": "https://www.comparemj.co.uk/mounjaro-15mg-price-comparison-uk",
  },
};

// Our display name → aggregator slug, where kebab-casing the name doesn't match.
// A provider can also carry `sourceSlug` in pricing-data.js, which wins.
const SLUG_OVERRIDES = {
  "Asda Online Doctor": "asda",
  "Boots Online Doctor": "boots",
  "Superdrug Online Doctor": "superdrug",
  "Lloyds Online Doctor": "lloyds",
};

// ── Helpers ─────────────────────────────────────────────────

const slugify = (s) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const slugFor = (p) => p.sourceSlug || SLUG_OVERRIDES[p.name] || slugify(p.name);

function decode(s) {
  return s
    .replace(/&pound;/g, "£")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

const toText = (html) =>
  decode(html.replace(/<[^>]+>/g, "\n"))
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n");

const todayIso = () => new Date().toISOString().slice(0, 10);

const ukDate = () =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  }).format(new Date());

const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "UnderstandGLP1-PriceCheck/1.0 (+https://understandglp1.com)",
      Accept: "text/html",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  return res.text();
}

// ── Parser ──────────────────────────────────────────────────
// Each provider card links to /providers/<slug>. We slice the page at the
// first link for each slug, then read the card as plain text, so styling
// or class-name changes on the aggregator don't break anything. Only a
// structural change (no provider links, no "per month") will, and that
// trips MIN_PROVIDERS_PER_PAGE.

export function parseListing(html) {
  const clean = html.replace(/<(script|style|svg|noscript)\b[\s\S]*?<\/\1>/gi, "");
  const re = /href="(?:https?:\/\/(?:www\.)?compare(?:wg|mj)\.co\.uk)?\/providers\/([a-z0-9-]+)\/?"/gi;
  const starts = [];
  const seen = new Set();
  let m;
  while ((m = re.exec(clean))) {
    const slug = m[1].toLowerCase();
    if (seen.has(slug)) continue;
    seen.add(slug);
    starts.push({ slug, index: m.index });
  }

  const results = new Map();
  starts.forEach(({ slug, index }, i) => {
    const end = i + 1 < starts.length ? starts[i + 1].index : clean.length;
    const chunk = clean.slice(index, end);
    const text = toText(chunk);

    const perMonth = text.search(/per month/i);
    if (perMonth === -1) return;
    const amounts = [...text.slice(0, perMonth).matchAll(/£\s*([\d,]+(?:\.\d{1,2})?)/g)].map((x) =>
      Number(x[1].replace(/,/g, ""))
    );
    if (!amounts.length) return;

    const afterPrice = text.slice(perMonth, text.search(/visit site/i) > perMonth ? text.search(/visit site/i) + 10 : perMonth + 200);
    const codeMatch = afterPrice.match(/\n([A-Z0-9]{3,20})\s*\n?Copy code/);
    const tp = text.match(/(\d\.\d)\s*\(\s*[\d.,]+k?\s*reviews?\)/i);
    const h3 = chunk.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);

    results.set(slug, {
      slug,
      name: h3 ? toText(h3[1]) : slug,
      price: amounts[amounts.length - 1],
      code: codeMatch ? codeMatch[1] : null,
      trustpilot: tp ? Number(tp[1]) : null,
    });
  });
  return results;
}

// ── Main ────────────────────────────────────────────────────

async function loadData() {
  const src = await readFile(DATA_FILE, "utf8");
  const marker = src.indexOf("const PRICING_DATA");
  if (marker === -1) throw new Error("Couldn't find `const PRICING_DATA` in pricing-data.js");
  const data = vm.runInNewContext(`${src}\n;PRICING_DATA`);
  return { header: src.slice(0, marker), data };
}

export async function main() {
  const { header, data } = await loadData();
  const today = todayIso();
  const log = { changes: [], held: [], missing: [], stale: [], newOnSource: [] };

  for (const [medKey, doses] of Object.entries(SOURCES)) {
    const med = data.medications[medKey];
    if (!med) throw new Error(`pricing-data.js has no medication "${medKey}"`);

    const pages = {};
    for (const [dose, url] of Object.entries(doses)) {
      const listing = parseListing(await fetchHtml(url));
      if (listing.size < MIN_PROVIDERS_PER_PAGE) {
        throw new Error(
          `${medKey} ${dose}: only ${listing.size} providers parsed from ${url}. ` +
            `The aggregator layout has probably changed, so nothing was written.`
        );
      }
      pages[dose] = listing;
    }

    const ourSlugs = new Set(med.providers.map(slugFor));
    const firstDose = Object.keys(doses)[0];
    for (const [slug, entry] of pages[firstDose]) {
      if (!ourSlugs.has(slug)) log.newOnSource.push(`${med.label}: ${entry.name} (£${entry.price})`);
    }

    for (const p of med.providers) {
      const slug = slugFor(p);
      let foundAnywhere = false;

      for (const dose of Object.keys(doses)) {
        const hit = pages[dose].get(slug);
        if (!hit) continue;
        foundAnywhere = true;

        const old = p.prices?.[dose] ?? null;
        const next = hit.price;
        const label = `${med.label} ${dose} · ${p.name}`;

        if (next < PRICE_BOUNDS[0] || next > PRICE_BOUNDS[1]) {
          log.held.push(`${label}: £${next} is outside the sanity range, kept £${old}`);
        } else if (!ACCEPT_SWINGS && old != null && Math.abs(next - old) / old > MAX_DAILY_SWING) {
          log.held.push(`${label}: £${old} → £${next} is a ${Math.round((Math.abs(next - old) / old) * 100)}% move, held for a manual check`);
        } else if (old !== next) {
          p.prices = { ...p.prices, [dose]: next };
          log.changes.push(`${label}: £${old ?? "–"} → £${next}`);
        }

        // Codes and ratings are the same across doses, so take them from the first dose found.
        if (dose === firstDose || !pages[firstDose].has(slug)) {
          const oldCode = p.discount?.code ?? null;
          if (hit.code && hit.code !== oldCode) {
            p.discount = { code: hit.code, note: oldCode ? p.discount.note : "First-order code" };
            log.changes.push(`${med.label} · ${p.name}: code ${oldCode ?? "none"} → ${hit.code}`);
          } else if (!hit.code && oldCode) {
            p.discount = { code: null, note: null };
            log.changes.push(`${med.label} · ${p.name}: code ${oldCode} removed`);
          }
          if (hit.trustpilot != null && hit.trustpilot !== p.trustpilot) {
            log.changes.push(`${med.label} · ${p.name}: Trustpilot ${p.trustpilot ?? "–"} → ${hit.trustpilot}`);
            p.trustpilot = hit.trustpilot;
          }
        }
      }

      if (foundAnywhere) {
        p.lastSeen = today;
      } else {
        log.missing.push(`${med.label} · ${p.name} (looked for "${slug}")`);
        if (p.lastSeen && daysBetween(p.lastSeen, today) >= STALE_DAYS) {
          log.stale.push(`${med.label} · ${p.name}: not seen since ${p.lastSeen}`);
        }
      }
    }
  }

  const priceOrCodeChanged = log.changes.length > 0;
  data.lastVerified = ukDate();
  data.lastChecked = new Date().toISOString();

  const output = `${header}const PRICING_DATA = ${JSON.stringify(data, null, 2)};\n`;
  if (!DRY_RUN) await writeFile(DATA_FILE, output);

  await report(log, priceOrCodeChanged);
}

async function report(log, changed) {
  const section = (title, items) =>
    items.length ? `\n### ${title} (${items.length})\n${items.map((i) => `- ${i}`).join("\n")}\n` : "";
  const md =
    `## Price update ${DRY_RUN ? "(dry run) " : ""}— ${ukDate()}\n` +
    (changed ? "" : "\nNo price, code or rating changes today.\n") +
    section("Changes applied", log.changes) +
    section("⚠️ Held for manual check", log.held) +
    section("⚠️ Stale providers", log.stale) +
    section("Not found today", log.missing) +
    section("On the aggregator but not on our list", log.newOnSource);

  console.log(md);
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, md);
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(process.env.GITHUB_OUTPUT, `needs_attention=${log.held.length || log.stale.length ? "true" : "false"}\n`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(`::error::${err.message}`);
    process.exit(1);
  });
}
