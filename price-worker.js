/**
 * price-worker.js
 * Cloudflare Worker — runs on cron trigger (7am + 7pm UTC)
 * Scrapes UK GLP-1 price aggregators and writes results to KV.
 *
 * KV namespace binding name: GLP1_PRICES
 * KV keys used:
 *   prices:wegovy     → JSON array of provider objects
 *   prices:mounjaro   → JSON array of provider objects
 *   prices:saxenda    → JSON array of provider objects
 *   prices:ozempic    → JSON array of provider objects
 *   meta:last_updated → ISO timestamp string
 *   meta:last_error   → last scrape error message (if any)
 */

export default {
  // Cron trigger entry point
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runScrape(env));
  },

  // Also allow manual trigger via GET /trigger (protect with a secret)
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/trigger') {
      const secret = request.headers.get('x-trigger-secret');
      if (secret !== env.TRIGGER_SECRET) {
        return new Response('Unauthorized', { status: 401 });
      }
      ctx.waitUntil(runScrape(env));
      return new Response(JSON.stringify({ ok: true, message: 'Scrape triggered' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response('GLP-1 Price Worker', { status: 200 });
  },
};

// ─── Main scrape orchestrator ────────────────────────────────────────────────

async function runScrape(env) {
  const results = {};
  const errors = [];

  // Wegovy — comparemj/comparewg style aggregators
  try {
    results.wegovy = await scrapeCompareMJ(
      'https://comparewg.co.uk/',
      'wegovy'
    );
  } catch (e) {
    errors.push(`wegovy: ${e.message}`);
    results.wegovy = await getExisting(env, 'prices:wegovy');
  }

  // Mounjaro
  try {
    results.mounjaro = await scrapeCompareMJ(
      'https://www.comparemj.co.uk/',
      'mounjaro'
    );
  } catch (e) {
    errors.push(`mounjaro: ${e.message}`);
    results.mounjaro = await getExisting(env, 'prices:mounjaro');
  }

  // Saxenda — less aggregator coverage; use medino + fallback
  try {
    results.saxenda = await scrapeMedino(
      'https://www.medino.com/article/saxenda-price-comparison',
      'saxenda'
    );
  } catch (e) {
    errors.push(`saxenda: ${e.message}`);
    results.saxenda = await getExisting(env, 'prices:saxenda');
  }

  // Ozempic — medino
  try {
    results.ozempic = await scrapeMedino(
      'https://www.medino.com/article/ozempic-price-comparison',
      'ozempic'
    );
  } catch (e) {
    errors.push(`ozempic: ${e.message}`);
    results.ozempic = await getExisting(env, 'prices:ozempic');
  }

  // Write to KV
  const timestamp = new Date().toISOString();
  await Promise.all([
    env.GLP1_PRICES.put('prices:wegovy',   JSON.stringify(results.wegovy   || [])),
    env.GLP1_PRICES.put('prices:mounjaro', JSON.stringify(results.mounjaro || [])),
    env.GLP1_PRICES.put('prices:saxenda',  JSON.stringify(results.saxenda  || [])),
    env.GLP1_PRICES.put('prices:ozempic',  JSON.stringify(results.ozempic  || [])),
    env.GLP1_PRICES.put('meta:last_updated', timestamp),
    env.GLP1_PRICES.put('meta:last_error', errors.length ? errors.join(' | ') : ''),
  ]);

  console.log(`Scrape complete at ${timestamp}. Errors: ${errors.join(', ') || 'none'}`);
}

// ─── Fetch helper ─────────────────────────────────────────────────────────────

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; UnderstandGLP1PriceBot/1.0)',
      'Accept': 'text/html,application/xhtml+xml',
    },
    cf: { cacheTtl: 0 }, // always fetch fresh
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

// ─── CompareMJ / CompareWG scraper ───────────────────────────────────────────
// These sites render a price table. We parse structured data from the HTML.
// Pattern targets: provider name, dose, price, discount code, affiliate link.

async function scrapeCompareMJ(url, drug) {
  const html = await fetchPage(url);

  // Extract JSON-LD structured data if present (most reliable)
  const jsonLdMatch = html.match(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
  if (jsonLdMatch) {
    for (const block of jsonLdMatch) {
      try {
        const json = JSON.parse(block.replace(/<\/?script[^>]*>/gi, ''));
        if (json['@type'] === 'ItemList' || (Array.isArray(json) && json[0]?.['@type'])) {
          const parsed = parseItemList(json, drug);
          if (parsed.length > 0) return parsed;
        }
      } catch {}
    }
  }

  // Fallback: parse HTML table rows
  return parseHtmlTable(html, drug);
}

function parseItemList(json, drug) {
  const items = json['@type'] === 'ItemList' ? json.itemListElement : json;
  const results = [];
  for (const item of items) {
    const offer = item.offers || item;
    if (!offer.price) continue;
    results.push({
      provider: item.name || item.seller?.name || 'Unknown',
      drug,
      dose: extractDose(item.name || ''),
      price: parseFloat(String(offer.price).replace(/[^0-9.]/g, '')),
      currency: 'GBP',
      includes: item.description || '',
      discount_code: '',
      url: item.url || offer.url || '#',
      trustpilot: null,
    });
  }
  return results;
}

function parseHtmlTable(html, drug) {
  const results = [];

  // Match table rows: look for patterns like provider name + £price
  // This regex is intentionally broad to handle varying table structures
  const rowPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellPattern = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
  const pricePattern = /£\s*(\d+(?:\.\d{2})?)/;
  const linkPattern = /href="([^"]+)"/;
  const namePattern = />([A-Z][a-zA-Z0-9 &;'.-]{2,40})</;

  let rowMatch;
  while ((rowMatch = rowPattern.exec(html)) !== null) {
    const row = rowMatch[1];
    const cells = [];
    let cellMatch;
    const cellRe = new RegExp(cellPattern.source, 'gi');
    while ((cellMatch = cellRe.exec(row)) !== null) {
      cells.push(cellMatch[1].replace(/<[^>]+>/g, ' ').trim());
    }

    if (cells.length < 2) continue;

    // Look for a price in any cell
    let price = null;
    for (const cell of cells) {
      const m = cell.match(pricePattern);
      if (m) { price = parseFloat(m[1]); break; }
    }
    if (!price || price < 50 || price > 500) continue; // sanity bounds

    // Provider name — usually first cell with meaningful text
    const providerCell = cells[0] || '';
    const nameMatch = providerCell.match(namePattern);
    if (!nameMatch) continue;
    const provider = nameMatch[1].trim();
    if (provider.length < 3) continue;

    // Affiliate URL from row
    const linkMatch = row.match(linkPattern);
    const url = linkMatch ? linkMatch[1] : '#';

    results.push({
      provider,
      drug,
      dose: extractDose(cells.join(' ')),
      price,
      currency: 'GBP',
      includes: '',
      discount_code: '',
      url: url.startsWith('http') ? url : '#',
      trustpilot: null,
    });
  }

  // Deduplicate by provider + dose
  const seen = new Set();
  return results.filter(r => {
    const key = `${r.provider}|${r.dose}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ─── Medino scraper ───────────────────────────────────────────────────────────

async function scrapeMedino(url, drug) {
  const html = await fetchPage(url);
  return parseHtmlTable(html, drug);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractDose(text) {
  const m = text.match(/(\d+(?:\.\d+)?)\s*mg/i);
  return m ? `${m[1]}mg` : 'starter';
}

async function getExisting(env, key) {
  try {
    const val = await env.GLP1_PRICES.get(key);
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}
