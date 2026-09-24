/* ============================================================
   UnderstandGLP1.com — UK Price Comparison Data
   ============================================================
   PRICES UPDATE AUTOMATICALLY once a day via
   .github/workflows/update-prices.yml (scripts/update-prices.mjs).
   The script rewrites everything below the header, so keep notes
   in this header rather than inline in the data.

   Updated automatically: prices, discount.code, trustpilot,
   lastSeen, lastVerified, lastChecked.
   Never touched by the script (edit by hand): providers list,
   name, type, url, gphc, gphcVerified, deliversNI, note,
   discount.note, sourceSlug.

   To add a provider: add it by hand and commit. The next run
   fills in its prices if the aggregator lists it. If its name
   doesn't match the aggregator's /providers/<slug> URL, add
   sourceSlug: "the-slug".

   Field guide:
   - type:        "pharmacy" or "programme" (drives the filter pills)
   - trustpilot:  score out of 5, or null if unknown
   - url:         provider/affiliate link. "#" = placeholder (renders
                  as a disabled link until you confirm the URL)
   - gphc:        GPhC registration number as a string, or null.
                  Numbers below were sourced from comparewg.co.uk /
                  comparemj.co.uk on 26 Aug 2026 — NOT yet cross-checked
                  by hand against pharmacyregulation.org. Treat as
                  provisional until someone verifies each one directly
                  on the register and flips gphcVerified to true.
   - gphcVerified: true only once a human has checked the number on
                  pharmacyregulation.org directly. Defaults to false.
   - deliversNI:  true / false / null (null renders as "Check").
                  Verify with each provider before setting true.
   - discount:    { code: "CODE" or null, note: "short context" or null }
   - prices:      per-dose monthly price with best discount applied,
                  consultation + standard delivery included.
                  Use null for "not verified" — renders as a dash.
   - note:        optional short note shown under the provider name
   - sourceSlug:  optional aggregator slug if the name doesn't match
   - lastSeen:    set by the script; date the provider was last found

   To add a dose column later (e.g. Mounjaro 5mg): add it to
   doseColumns AND add the matching key to each provider's prices.
   The table renders columns automatically from doseColumns.
   ============================================================ */

const PRICING_DATA = {
  "lastVerified": "24 September 2026",
  "methodology": "Prices are the advertised monthly cost from each provider with the best publicly available new-patient discount applied, including the online consultation and standard UK delivery. New-patient offers usually apply to first orders only — ongoing months are typically charged at the provider's standard rate. Cross-checked against comparewg.co.uk and comparemj.co.uk.",
  "medications": {
    "mounjaro": {
      "label": "Mounjaro",
      "generic": "tirzepatide",
      "doseColumns": [
        {
          "key": "2.5mg",
          "label": "2.5mg",
          "sub": "starting dose"
        },
        {
          "key": "15mg",
          "label": "15mg",
          "sub": "highest dose"
        }
      ],
      "providers": [
        {
          "name": "The Family Chemist",
          "type": "pharmacy",
          "trustpilot": 4.8,
          "url": "https://www.thefamilychemist.co.uk/?product=mounjaro",
          "gphc": "9012318",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": "TFC30",
            "note": "First-order code"
          },
          "prices": {
            "2.5mg": 134.99,
            "15mg": 264.99
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "Oushk",
          "type": "pharmacy",
          "trustpilot": 4.7,
          "url": "https://www.oushkpharmacy.com/?product=mounjaro",
          "gphc": "9012610",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": "WELCOME",
            "note": "First-order code"
          },
          "prices": {
            "2.5mg": 129,
            "15mg": 270
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "Curely",
          "type": "pharmacy",
          "trustpilot": 4.7,
          "url": "https://www.curely.co.uk/?product=mounjaro",
          "gphc": "9012401",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": null,
            "note": "Discount applied automatically"
          },
          "prices": {
            "2.5mg": 136.8,
            "15mg": 274.5
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "Ashcroft Pharmacy",
          "type": "pharmacy",
          "trustpilot": 4.8,
          "url": "https://www.ashcroftpharmacy.co.uk/?product=mounjaro",
          "gphc": "1039428",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": "JULY15",
            "note": "First-order code"
          },
          "prices": {
            "2.5mg": 134.99,
            "15mg": 279.99
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "MedExpress",
          "type": "pharmacy",
          "trustpilot": 4.3,
          "url": "https://www.medexpress.co.uk/?product=mounjaro",
          "gphc": "9011509",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": null,
            "note": "Intro pricing, no code needed"
          },
          "prices": {
            "2.5mg": 139.99,
            "15mg": 269.99
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "Asda Online Doctor",
          "type": "pharmacy",
          "trustpilot": 4.5,
          "url": "https://onlinedoctor.asda.com/uk/?product=mounjaro",
          "gphc": "1091675",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": "WNLC10A",
            "note": "New-patient code"
          },
          "prices": {
            "2.5mg": 138.97,
            "15mg": 288.97
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "Simple Online Pharmacy",
          "type": "pharmacy",
          "trustpilot": 4.7,
          "url": "https://www.simpleonlinepharmacy.co.uk/?product=mounjaro",
          "gphc": "9011287",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": null,
            "note": "Intro pricing, no code needed"
          },
          "prices": {
            "2.5mg": 169,
            "15mg": 319.99
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "The Independent Pharmacy",
          "type": "pharmacy",
          "trustpilot": 4.8,
          "url": "https://www.theindependentpharmacy.co.uk/?product=mounjaro",
          "gphc": "9012559",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": "NEW15",
            "note": "First-order code"
          },
          "prices": {
            "2.5mg": 152.99,
            "15mg": 280.49
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "Boots Online Doctor",
          "type": "pharmacy",
          "trustpilot": 4.4,
          "url": "https://onlinedoctor.boots.com/home?product=mounjaro",
          "gphc": "1096181",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": "WELCOME10",
            "note": "New-patient code"
          },
          "prices": {
            "2.5mg": 159.57,
            "15mg": 301.5
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "Superdrug Online Doctor",
          "type": "pharmacy",
          "trustpilot": 4.4,
          "url": "https://onlinedoctor.superdrug.com/?product=mounjaro",
          "gphc": "9010736",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": "WLNP20",
            "note": "New-patient code"
          },
          "prices": {
            "2.5mg": 156,
            "15mg": 314
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "Numan",
          "type": "programme",
          "trustpilot": 4.5,
          "url": "https://www.numan.com/?product=mounjaro",
          "gphc": "9011408",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": null,
            "note": "Intro offer, first month"
          },
          "prices": {
            "2.5mg": 209,
            "15mg": 339
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "Juniper",
          "type": "programme",
          "trustpilot": 4.5,
          "url": "https://www.myjuniper.co.uk/?product=mounjaro",
          "gphc": "9011842",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": null,
            "note": "Intro offer, first month"
          },
          "prices": {
            "2.5mg": 199,
            "15mg": 339
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "Medicspot",
          "type": "programme",
          "trustpilot": 4.4,
          "url": "https://www.medicspot.co.uk/weight-loss/start?product=mounjaro",
          "gphc": "9012559",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": null,
            "note": "Intro offer, first month"
          },
          "prices": {
            "2.5mg": 149,
            "15mg": 279
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "Voy",
          "type": "programme",
          "trustpilot": 4.7,
          "url": "https://www.joinvoy.com/?product=mounjaro",
          "gphc": "9012134",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": null,
            "note": "Email sign-up offer — no public code"
          },
          "prices": {
            "2.5mg": 194,
            "15mg": 339
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "Second Nature",
          "type": "programme",
          "trustpilot": 4.5,
          "url": "https://www.secondnature.io?product=mounjaro",
          "gphc": "8511152",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": null,
            "note": "Intro offer, first month"
          },
          "prices": {
            "2.5mg": 179,
            "15mg": 299
          },
          "lastSeen": "2026-09-24"
        }
      ]
    },
    "wegovy": {
      "label": "Wegovy",
      "generic": "semaglutide",
      "doseColumns": [
        {
          "key": "0.25mg",
          "label": "0.25mg",
          "sub": "starting dose"
        },
        {
          "key": "2.4mg",
          "label": "2.4mg",
          "sub": "maintenance dose"
        }
      ],
      "providers": [
        {
          "name": "The Family Chemist",
          "type": "pharmacy",
          "trustpilot": 4.8,
          "url": "https://www.thefamilychemist.co.uk/?product=wegovy",
          "gphc": "9012318",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": "TFC30",
            "note": "First-order code"
          },
          "prices": {
            "0.25mg": 69.99,
            "2.4mg": 158.99
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "Oushk",
          "type": "pharmacy",
          "trustpilot": 4.7,
          "url": "https://www.oushkpharmacy.com/?product=wegovy",
          "gphc": "9012610",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": "WELCOME",
            "note": "First-order code"
          },
          "prices": {
            "0.25mg": 85,
            "2.4mg": 150
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "MedExpress",
          "type": "pharmacy",
          "trustpilot": 4.3,
          "url": "https://www.medexpress.co.uk/?product=wegovy",
          "gphc": "9011509",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": null,
            "note": "Intro pricing, no code needed"
          },
          "prices": {
            "0.25mg": 69.99,
            "2.4mg": 159.99
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "Asda Online Doctor",
          "type": "pharmacy",
          "trustpilot": 4.5,
          "url": "https://onlinedoctor.asda.com/uk/?product=wegovy",
          "gphc": "1091675",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": "WNLC10A",
            "note": "New-patient code"
          },
          "prices": {
            "0.25mg": 78.97,
            "2.4mg": 178.97
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "Phlo Clinic",
          "type": "pharmacy",
          "trustpilot": 4.7,
          "url": "https://phloclinic.co.uk/?product=wegovy",
          "gphc": "9011171",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": null,
            "note": "Intro pricing, no code needed"
          },
          "prices": {
            "0.25mg": 89,
            "2.4mg": 199
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "Medicspot",
          "type": "programme",
          "trustpilot": 4.4,
          "url": "https://www.medicspot.co.uk/weight-loss/injections/wegovy-injections-uk",
          "gphc": "9012559",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": null,
            "note": "Intro offer, first month"
          },
          "prices": {
            "0.25mg": 89,
            "2.4mg": 169
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "The Independent Pharmacy",
          "type": "pharmacy",
          "trustpilot": 4.8,
          "url": "https://www.theindependentpharmacy.co.uk/?product=wegovy",
          "gphc": "9012559",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": "NEW15",
            "note": "First-order code"
          },
          "prices": {
            "0.25mg": 84.82,
            "2.4mg": 161.49
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "Pharmacy Online",
          "type": "pharmacy",
          "trustpilot": 4.5,
          "url": "https://www.pharmacyonline.co.uk/?product=wegovy",
          "gphc": "9011756",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": null,
            "note": "Intro pricing, no code needed"
          },
          "prices": {
            "0.25mg": 99.99,
            "2.4mg": 159.99
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "Second Nature",
          "type": "programme",
          "trustpilot": 4.5,
          "url": "https://www.secondnature.io?product=wegovy",
          "gphc": "8511152",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": null,
            "note": "Intro offer, first month"
          },
          "prices": {
            "0.25mg": 99,
            "2.4mg": 199
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "Voy",
          "type": "programme",
          "trustpilot": 4.7,
          "url": "https://www.joinvoy.com/?product=wegovy",
          "gphc": "9012134",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": null,
            "note": "Email sign-up offer — no public code"
          },
          "prices": {
            "0.25mg": 144,
            "2.4mg": 239
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "Ashcroft Pharmacy",
          "type": "pharmacy",
          "trustpilot": 4.8,
          "url": "https://www.ashcroftpharmacy.co.uk/?product=wegovy",
          "gphc": "1039428",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": "JULY15",
            "note": "First-order code"
          },
          "prices": {
            "0.25mg": 105,
            "2.4mg": 210
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "Boots Online Doctor",
          "type": "pharmacy",
          "trustpilot": 4.4,
          "url": "https://onlinedoctor.boots.com/home?product=wegovy",
          "gphc": "1096181",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": null,
            "note": null
          },
          "prices": {
            "0.25mg": 79.97,
            "2.4mg": 185.4
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "Cloud Pharmacy",
          "type": "pharmacy",
          "trustpilot": 4.6,
          "url": "https://www.cloudpharmacy.co.uk/weight-loss-clinic?product=wegovy",
          "gphc": "9012073",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": null,
            "note": null
          },
          "prices": {
            "0.25mg": 114.99,
            "2.4mg": 174.99
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "Fella Health",
          "type": "programme",
          "trustpilot": 4.5,
          "url": "https://www.fellahealth.co.uk/?product=wegovy",
          "gphc": "9012625",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": null,
            "note": null
          },
          "note": "Men only",
          "prices": {
            "0.25mg": 119,
            "2.4mg": 199
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "SheMed",
          "type": "programme",
          "trustpilot": 4.3,
          "url": "https://www.shemed.co.uk/?product=wegovy",
          "gphc": "9012578",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": null,
            "note": null
          },
          "note": "Women only",
          "prices": {
            "0.25mg": 79,
            "2.4mg": 159
          },
          "lastSeen": "2026-09-24"
        },
        {
          "name": "Juniper",
          "type": "programme",
          "trustpilot": 4.5,
          "url": "https://www.myjuniper.co.uk/?product=wegovy",
          "gphc": "9011842",
          "gphcVerified": false,
          "deliversNI": null,
          "discount": {
            "code": null,
            "note": null
          },
          "prices": {
            "0.25mg": 164,
            "2.4mg": 229
          },
          "lastSeen": "2026-09-24"
        }
      ]
    }
  },
  "lastChecked": "2026-09-24T10:01:21.874Z"
};
