/* ============================================================
   UnderstandGLP1.com — UK Price Comparison Data
   ============================================================
   THIS IS THE ONLY FILE YOU EDIT FOR PRICE UPDATES.

   How to update:
   1. Change the price numbers below (numbers only, no £ sign).
   2. Update "lastVerified" to today's date.
   3. Commit and push. Done.

   Field guide:
   - type:        "pharmacy" or "programme" (drives the filter pills)
   - trustpilot:  score out of 5, or null if unknown
   - url:         provider/affiliate link. "#" = placeholder (renders
                  as a disabled link until you confirm the URL)
   - gphc:        GPhC registration number as a string, or null.
                  Only fill this in once YOU have verified it on
                  pharmacyregulation.org — aggregator GPhC data was
                  contradictory, so all start as null.
   - deliversNI:  true / false / null (null renders as "Check").
                  Verify with each provider before setting true.
   - discount:    { code: "CODE" or null, note: "short context" or null }
   - prices:      per-dose monthly price with best discount applied,
                  consultation + standard delivery included.
                  Use null for "not verified" — renders as a dash.
   - note:        optional short note shown under the provider name

   To add a dose column later (e.g. Mounjaro 5mg): add it to
   doseColumns AND add the matching key to each provider's prices.
   The table renders columns automatically from doseColumns.
   ============================================================ */

const PRICING_DATA = {
  lastVerified: "10 June 2026",
  methodology:
    "Prices are the advertised monthly cost from each provider with the best publicly available new-patient discount applied, including the online consultation and standard UK delivery. New-patient offers usually apply to first orders only — ongoing months are typically charged at the provider's standard rate.",

  medications: {
    mounjaro: {
      label: "Mounjaro",
      generic: "tirzepatide",
      doseColumns: [
        { key: "2.5mg", label: "2.5mg", sub: "starting dose" },
        { key: "15mg", label: "15mg", sub: "highest dose" }
      ],
      providers: [
        {
          name: "Pharmacy2U",
          type: "pharmacy",
          trustpilot: 4.6,
          url: "https://www.pharmacy2u.co.uk/online-doctor/weight-loss",
          gphc: null,
          deliversNI: null,
          discount: { code: "A4TNUY", note: "First-order code" },
          prices: { "2.5mg": 134.99, "15mg": 264.99 }
        },
        {
          name: "Ashcroft Pharmacy",
          type: "pharmacy",
          trustpilot: 4.8,
          url: "https://www.ashcroftpharmacy.co.uk/weight-loss",
          gphc: null,
          deliversNI: null,
          discount: { code: "WINTER15", note: "First-order code" },
          prices: { "2.5mg": 134.99, "15mg": null }
        },
        {
          name: "Curely",
          type: "pharmacy",
          trustpilot: 4.7,
          url: "https://www.curely.co.uk/",
          gphc: null,
          deliversNI: null,
          discount: { code: null, note: "Discount applied automatically" },
          prices: { "2.5mg": 136.80, "15mg": 270.00 }
        },
        {
          name: "Asda Online Doctor",
          type: "pharmacy",
          trustpilot: 4.3,
          url: "https://onlinedoctor.asda.com/consultation/weight-loss",
          gphc: null,
          deliversNI: null,
          discount: { code: "ASNYWL30", note: "New-patient code" },
          prices: { "2.5mg": 138.97, "15mg": 268.97 }
        },
        {
          name: "Simple Online Pharmacy",
          type: "pharmacy",
          trustpilot: 4.6,
          url: "https://www.simpleonlinepharmacy.co.uk/weight-loss",
          gphc: null,
          deliversNI: null,
          discount: { code: null, note: "Intro pricing, no code needed" },
          prices: { "2.5mg": 144.00, "15mg": null }
        },
        {
          name: "The Independent Pharmacy",
          type: "pharmacy",
          trustpilot: 4.7,
          url: "https://www.theindependentpharmacy.co.uk/weight-loss",
          gphc: null,
          deliversNI: null,
          discount: { code: "NEW15", note: "First-order code" },
          prices: { "2.5mg": 149.59, "15mg": 271.99 }
        },
        {
          name: "Boots Online Doctor",
          type: "pharmacy",
          trustpilot: 4.4,
          url: "https://onlinedoctor.boots.com/weight-loss",
          gphc: null,
          deliversNI: null,
          discount: { code: "WELCOME10", note: "New-patient code" },
          prices: { "2.5mg": 159.57, "15mg": 301.50 }
        },
        {
          name: "Superdrug Online Doctor",
          type: "pharmacy",
          trustpilot: 4.4,
          url: "https://onlinedoctor.superdrug.com/weight-loss.html",
          gphc: null,
          deliversNI: null,
          discount: { code: "SAVE10", note: "New-patient code" },
          prices: { "2.5mg": 175.50, "15mg": null }
        },
        {
          name: "Numan",
          type: "programme",
          trustpilot: 4.5,
          url: "https://www.numan.com/weight-loss",
          gphc: null,
          deliversNI: null,
          discount: { code: null, note: "Intro offer, first month" },
          prices: { "2.5mg": 149.00, "15mg": 359.00 }
        },
        {
          name: "Juniper",
          type: "programme",
          trustpilot: 4.5,
          url: "https://www.myjuniper.co.uk/",
          gphc: null,
          deliversNI: null,
          discount: { code: null, note: "Intro offer, first month" },
          prices: { "2.5mg": 149.00, "15mg": 289.00 }
        },
        {
          name: "Medicspot",
          type: "programme",
          trustpilot: 4.4,
          url: "https://www.medicspot.co.uk/weight-loss",
          gphc: null,
          deliversNI: null,
          discount: { code: null, note: "Intro offer, first month" },
          prices: { "2.5mg": 149.00, "15mg": 279.00 }
        },
        {
          name: "Voy",
          type: "programme",
          trustpilot: 4.7,
          url: "https://joinvoy.com/",
          gphc: null,
          deliversNI: null,
          discount: { code: null, note: "Email sign-up offer — no public code" },
          prices: { "2.5mg": 164.00, "15mg": 314.00 }
        },
        {
          name: "Second Nature",
          type: "programme",
          trustpilot: 4.5,
          url: "https://www.secondnature.io/uk",
          gphc: null,
          deliversNI: null,
          discount: { code: null, note: "Intro offer, first month" },
          prices: { "2.5mg": 179.00, "15mg": 299.00 }
        }
      ]
    },

    wegovy: {
      label: "Wegovy",
      generic: "semaglutide",
      doseColumns: [
        { key: "0.25mg", label: "0.25mg", sub: "starting dose" },
        { key: "2.4mg", label: "2.4mg", sub: "maintenance dose" }
      ],
      providers: [
        {
          name: "Numan",
          type: "programme",
          trustpilot: 4.5,
          url: "https://www.numan.com/weight-loss",
          gphc: null,
          deliversNI: null,
          discount: { code: null, note: "Intro offer, first month" },
          prices: { "0.25mg": 79.00, "2.4mg": 299.00 }
        },
        {
          name: "Asda Online Doctor",
          type: "pharmacy",
          trustpilot: 4.3,
          url: "https://onlinedoctor.asda.com/consultation/weight-loss",
          gphc: null,
          deliversNI: null,
          discount: { code: "START25", note: "New-patient code" },
          prices: { "0.25mg": 88.98, "2.4mg": null }
        },
        {
          name: "Phlo Clinic",
          type: "pharmacy",
          trustpilot: 4.7,
          url: "https://phloclinic.com/weight-loss",
          gphc: null,
          deliversNI: null,
          discount: { code: null, note: "Intro pricing, no code needed" },
          prices: { "0.25mg": 89.00, "2.4mg": null }
        },
        {
          name: "Medicspot",
          type: "programme",
          trustpilot: 4.4,
          url: "https://www.medicspot.co.uk/weight-loss",
          gphc: null,
          deliversNI: null,
          discount: { code: null, note: "Intro offer, first month" },
          prices: { "0.25mg": 89.00, "2.4mg": 169.00 }
        },
        {
          name: "The Independent Pharmacy",
          type: "pharmacy",
          trustpilot: 4.7,
          url: "https://www.theindependentpharmacy.co.uk/weight-loss",
          gphc: null,
          deliversNI: null,
          discount: { code: "NEW15", note: "First-order code" },
          prices: { "0.25mg": 89.24, "2.4mg": 161.49 }
        },
        {
          name: "Pharmacy Online",
          type: "pharmacy",
          trustpilot: 4.5,
          url: "https://www.pharmacyonline.co.uk/weight-loss",
          gphc: null,
          deliversNI: null,
          discount: { code: "W20", note: "First-order code" },
          prices: { "0.25mg": 99.00, "2.4mg": 164.99 }
        },
        {
          name: "Second Nature",
          type: "programme",
          trustpilot: 4.5,
          url: "https://www.secondnature.io/uk",
          gphc: null,
          deliversNI: null,
          discount: { code: null, note: "Intro offer, first month" },
          prices: { "0.25mg": 99.00, "2.4mg": 199.00 }
        },
        {
          name: "Voy",
          type: "programme",
          trustpilot: 4.7,
          url: "https://joinvoy.com/",
          gphc: null,
          deliversNI: null,
          discount: { code: null, note: "Intro offer, first month" },
          prices: { "0.25mg": 104.00, "2.4mg": 199.00 }
        },
        {
          name: "Ashcroft Pharmacy",
          type: "pharmacy",
          trustpilot: 4.8,
          url: "https://www.ashcroftpharmacy.co.uk/weight-loss",
          gphc: null,
          deliversNI: null,
          discount: { code: "WINTER15", note: "First-order code" },
          prices: { "0.25mg": 104.99, "2.4mg": null }
        },
        {
          name: "Boots Online Doctor",
          type: "pharmacy",
          trustpilot: 4.4,
          url: "https://onlinedoctor.boots.com/weight-loss",
          gphc: null,
          deliversNI: null,
          discount: { code: "WELCOME10", note: "New-patient code" },
          prices: { "0.25mg": 112.59, "2.4mg": 185.40 }
        },
        {
          name: "Cloud Pharmacy",
          type: "pharmacy",
          trustpilot: 4.6,
          url: "https://www.cloudpharmacy.co.uk/weight-loss-clinic",
          gphc: null,
          deliversNI: null,
          discount: { code: null, note: null },
          prices: { "0.25mg": 114.99, "2.4mg": 174.99 }
        },
        {
          name: "Fella Health",
          type: "programme",
          trustpilot: 4.5,
          url: "https://www.fellahealth.com/",
          gphc: null,
          deliversNI: null,
          discount: { code: null, note: null },
          note: "Men only",
          prices: { "0.25mg": 119.00, "2.4mg": 189.00 }
        },
        {
          name: "SheMed",
          type: "programme",
          trustpilot: 4.4,
          url: "https://www.shemed.co.uk/",
          gphc: null,
          deliversNI: null,
          discount: { code: null, note: null },
          note: "Women only",
          prices: { "0.25mg": 139.00, "2.4mg": 159.00 }
        },
        {
          name: "Juniper",
          type: "programme",
          trustpilot: 4.5,
          url: "https://www.myjuniper.co.uk/",
          gphc: null,
          deliversNI: null,
          discount: { code: null, note: null },
          prices: { "0.25mg": 164.00, "2.4mg": 229.00 }
        }
      ]
    }
  }
};