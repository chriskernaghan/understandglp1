// Build-time helper: reads public/pricing-data.js so pages can show
// the last-checked date and provider count in static HTML.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

export function getPriceMeta() {
  try {
    const file = path.join(process.cwd(), 'public', 'pricing-data.js');
    const data = vm.runInNewContext(`${fs.readFileSync(file, 'utf8')}\n;PRICING_DATA`);
    const names = new Set();
    for (const med of Object.values(data.medications)) {
      for (const p of med.providers) names.add(p.name);
    }
    const checked = data.lastChecked ? new Date(data.lastChecked) : new Date();
    return {
      lastVerified: data.lastVerified,
      monthYear: new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'Europe/London' }).format(checked),
      providerCount: names.size,
    };
  } catch (err) {
    console.warn('[price-meta] Could not read pricing-data.js:', err.message);
    return null;
  }
}
