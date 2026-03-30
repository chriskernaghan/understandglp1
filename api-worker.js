/**
 * api-worker.js
 * Cloudflare Worker — serves GLP-1 price data from KV as JSON.
 * Deploy this as a separate worker at: understandglp1.com/api/prices
 *
 * KV namespace binding name: GLP1_PRICES (same namespace as price-worker)
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://understandglp1.com',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: CORS_HEADERS,
      });
    }

    try {
      // Read all data from KV in parallel
      const [wegovy, mounjaro, saxenda, ozempic, lastUpdated, lastError] =
        await Promise.all([
          env.GLP1_PRICES.get('prices:wegovy'),
          env.GLP1_PRICES.get('prices:mounjaro'),
          env.GLP1_PRICES.get('prices:saxenda'),
          env.GLP1_PRICES.get('prices:ozempic'),
          env.GLP1_PRICES.get('meta:last_updated'),
          env.GLP1_PRICES.get('meta:last_error'),
        ]);

      // If KV is empty (first deploy), return seeded fallback data
      const response = {
        last_updated: lastUpdated || null,
        last_error: lastError || null,
        data: {
          wegovy:   wegovy   ? JSON.parse(wegovy)   : getSeedData('wegovy'),
          mounjaro: mounjaro ? JSON.parse(mounjaro) : getSeedData('mounjaro'),
          saxenda:  saxenda  ? JSON.parse(saxenda)  : getSeedData('saxenda'),
          ozempic:  ozempic  ? JSON.parse(ozempic)  : getSeedData('ozempic'),
        },
      };

      // Cache at the edge for 30 minutes
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          'Cache-Control': 'public, max-age=1800',
        },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Failed to read price data', detail: e.message }), {
        status: 500,
        headers: CORS_HEADERS,
      });
    }
  },
};

// ─── Seed data ────────────────────────────────────────────────────────────────
// Shown on first load before the scraper has run.
// Prices are approximate March 2026 market rates — update after first real scrape.

function getSeedData(drug) {
  const seeds = {
    wegovy: [
      { provider: 'Pharmacy2U',            drug: 'wegovy', dose: '0.25mg', price: 87,  currency: 'GBP', includes: 'Medication + delivery', discount_code: '',       url: '#', trustpilot: 4.6 },
      { provider: 'Boots Online Pharmacy', drug: 'wegovy', dose: '0.25mg', price: 119, currency: 'GBP', includes: 'Medication + delivery', discount_code: '',       url: '#', trustpilot: 4.4 },
      { provider: 'MedExpress',            drug: 'wegovy', dose: '0.25mg', price: 99,  currency: 'GBP', includes: 'Medication + delivery', discount_code: 'MED30', url: '#', trustpilot: 4.5 },
      { provider: 'Superdrug Online',      drug: 'wegovy', dose: '0.25mg', price: 109, currency: 'GBP', includes: 'Medication + delivery', discount_code: '',       url: '#', trustpilot: 4.3 },
      { provider: 'ZAVA',                  drug: 'wegovy', dose: '0.25mg', price: 104, currency: 'GBP', includes: 'Consultation + medication', discount_code: '',   url: '#', trustpilot: 4.4 },
      { provider: 'Simple Online Pharmacy',drug: 'wegovy', dose: '0.25mg', price: 92,  currency: 'GBP', includes: 'Medication + delivery', discount_code: '',       url: '#', trustpilot: 4.5 },
    ],
    mounjaro: [
      { provider: 'Live Well Weight Loss', drug: 'mounjaro', dose: '2.5mg', price: 124, currency: 'GBP', includes: 'Medication + delivery', discount_code: '',       url: '#', trustpilot: 4.7 },
      { provider: 'Pharmacy2U',            drug: 'mounjaro', dose: '2.5mg', price: 149, currency: 'GBP', includes: 'Medication + delivery', discount_code: 'P2U62', url: '#', trustpilot: 4.6 },
      { provider: 'Boots Online Pharmacy', drug: 'mounjaro', dose: '2.5mg', price: 219, currency: 'GBP', includes: 'Medication + delivery', discount_code: '',       url: '#', trustpilot: 4.4 },
      { provider: 'MedExpress',            drug: 'mounjaro', dose: '2.5mg', price: 139, currency: 'GBP', includes: 'Medication + delivery', discount_code: 'MED30', url: '#', trustpilot: 4.5 },
      { provider: 'Medicspot',             drug: 'mounjaro', dose: '2.5mg', price: 155, currency: 'GBP', includes: 'Consultation + medication', discount_code: '',   url: '#', trustpilot: 4.6 },
      { provider: 'WePrescribe',           drug: 'mounjaro', dose: '2.5mg', price: 134, currency: 'GBP', includes: 'Medication + delivery', discount_code: '',       url: '#', trustpilot: 4.5 },
    ],
    saxenda: [
      { provider: 'Boots Online Pharmacy', drug: 'saxenda', dose: '6mg',  price: 199, currency: 'GBP', includes: 'Medication + delivery', discount_code: '',       url: '#', trustpilot: 4.4 },
      { provider: 'LloydsPharmacy Online', drug: 'saxenda', dose: '6mg',  price: 179, currency: 'GBP', includes: 'Medication + delivery', discount_code: '',       url: '#', trustpilot: 4.3 },
      { provider: 'ZAVA',                  drug: 'saxenda', dose: '6mg',  price: 169, currency: 'GBP', includes: 'Consultation + medication', discount_code: '',   url: '#', trustpilot: 4.4 },
      { provider: 'MedExpress',            drug: 'saxenda', dose: '6mg',  price: 159, currency: 'GBP', includes: 'Medication + delivery', discount_code: 'MED30', url: '#', trustpilot: 4.5 },
      { provider: 'Superdrug Online',      drug: 'saxenda', dose: '6mg',  price: 189, currency: 'GBP', includes: 'Medication + delivery', discount_code: '',       url: '#', trustpilot: 4.3 },
    ],
    ozempic: [
      { provider: 'Boots Online Pharmacy', drug: 'ozempic', dose: '0.25mg', price: 89,  currency: 'GBP', includes: 'Medication + delivery', discount_code: '',       url: '#', trustpilot: 4.4 },
      { provider: 'LloydsPharmacy Online', drug: 'ozempic', dose: '0.25mg', price: 79,  currency: 'GBP', includes: 'Medication + delivery', discount_code: '',       url: '#', trustpilot: 4.3 },
      { provider: 'ZAVA',                  drug: 'ozempic', dose: '0.25mg', price: 84,  currency: 'GBP', includes: 'Consultation + medication', discount_code: '',   url: '#', trustpilot: 4.4 },
      { provider: 'Superdrug Online',      drug: 'ozempic', dose: '0.25mg', price: 94,  currency: 'GBP', includes: 'Medication + delivery', discount_code: '',       url: '#', trustpilot: 4.3 },
      { provider: 'Simple Online Pharmacy',drug: 'ozempic', dose: '0.25mg', price: 82,  currency: 'GBP', includes: 'Medication + delivery', discount_code: '',       url: '#', trustpilot: 4.5 },
    ],
  };
  return seeds[drug] || [];
}
