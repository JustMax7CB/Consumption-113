
const ewTypes = ["706", "802", "206", "RR-180", "RR-170"];


const resultOptions = [
  "אלפא",
  "אלפא טכנית",
  "בראבו",
  "דלתא",
  'לנ"פ',
  "נפל",
  "Missile Fail",
  "Missfire",
  "Hangfire",
];

const ewColors = {
  "706": "\u{1F533}",
  "802": "\u{1F7EA}",
  "206": "\u{1F7E5}",
  "RR-180": "\u2B1B\uFE0F",
  "RR-170": "\u2B1C\uFE0F"
}

const explosionEmoji = "\u{1F4A5}"
const fireEmoji = "\u{1F525}"
const rocketEmoji = "\u{1F680}"

/**
 * Default when the URL has no flavor in the path and none was stored yet (see sessionStorage).
 * Point short URLs at paths like https://your.app/113/ or …/190/ — those segments set the flavor.
 * Debug override: ?flavor=190
 */
const SITE_FLAVOR = "113";

const FLAVOR_BRANDING = {
  "113": {
    title: "צריכות 113",
    adminTitle: "צריכות 113 - עמוד מנהל",
    shortName: "Tzrihot113",
    adminHeading: "🐝 מעקב צריכות GATR 🐝",
    bannerSrc: "/assets/Banner113.png",
    faviconBase: "/favicon",
    manifestHref: "/favicon/site.webmanifest",
    shareHeader(heli) {
      return `🐝  מסוק ${heli}  🐝`;
    },
    ewPoints: [
      "כ.י חיצוני",
      "כ.י פנימי",
      "גב צד ימין",
      "גב צד שמאל",
      "כ.ש פנימי",
      "כ.ש חיצוני",
    ],
    missileTypes: [
      "קרדום C",
      "קרדום K",
      "קרדום R0",
      "קרדום R9",
      "קרדום RM",
      "קרדום KA",
      "קרדום N",
      "קרדום M",
      "קרדום F",
      "קרדום FA",
      "מקוש L",
      'תמוז 2 נ"א',
      'תמוז 2 נ"ט',
      'תמוז 2 נב"ר',
      "תמוז 4",
      'פתיל 2 נ"א',
      'פתיל 2 נ"ט',
      'פתיל 2 נב"ר',
      "פתיל 4",
      'תמוז 5 נב"ר 9',
      'תמוז 5 נב"ר 18',
      'תמוז 5 נ"ט',
      'תמוז 5 נ"א',
    ],
  },
  "190": {
    title: "צריכות 190",
    adminTitle: "צריכות 190 - עמוד מנהל",
    shortName: "Tzrihot190",
    adminHeading: "🚁 מעקב צריכות GATR (190) 🚁",
    bannerSrc: "/assets/Banner190.png",
    faviconBase: "/favicon-190",
    manifestHref: "/favicon-190/site.webmanifest",
    shareHeader(heli) {
      return `🚁  מסוק ${heli}  🚁`;
    },
    ewPoints: [
      "כנף שמאל",
      "כנף ימין",
      "FAB ש. חיצוני",
      "FAB ש. פנימי",
      "FAB י. חיצוני",
      "FAB י. פנימי",
    ],
    missileTypes: [
      "קרדום C",
      "קרדום K",
      "קרדום R0",
      "קרדום R9",
      "קרדום RM",
      "קרדום KA",
      "קרדום N",
      "קרדום M",
      "קרדום F",
      "קרדום FA",
      "מקוש L",
    ],
  },
};

/**
 * Path segment exactly "113" or "190" (not a substring — "Consumption-113" is ignored).
 * If several match, the last one wins (e.g. …/113/190 → 190).
 */
function flavorFromPathname() {
  let found = null;
  for (const seg of location.pathname.split("/")) {
    if (seg === "113" || seg === "190") found = seg;
  }
  return found;
}

function getActiveFlavor() {
  try {
    const q = new URLSearchParams(window.location.search).get("flavor");
    if (q === "113" || q === "190") return q;
  } catch (e) {
    /* ignore */
  }
  const fromPath = flavorFromPathname();
  if (fromPath) {
    try {
      sessionStorage.setItem("activeFlavor", fromPath);
    } catch (e) {
      /* ignore */
    }
    return fromPath;
  }
  try {
    const stored = sessionStorage.getItem("activeFlavor");
    if (stored === "113" || stored === "190") return stored;
  } catch (e) {
    /* ignore */
  }
  return SITE_FLAVOR === "190" ? "190" : "113";
}

function getFlavorBranding() {
  const f = getActiveFlavor();
  return FLAVOR_BRANDING[f] || FLAVOR_BRANDING["113"];
}