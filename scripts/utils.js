const checkTime = (flightDetails) => {
  const flightTime = flightDetails.Time;
  const flightHour = flightTime.split(":")[0];
  const flightMinute = flightTime.split(":")[1];
  const hourValid = Number(flightHour) >= 0 && Number(flightHour) < 24;
  const minuteValid = Number(flightMinute) >= 0 && Number(flightMinute) < 60;
  return hourValid && minuteValid;
};

const flightTimeFormatter = () => {
  if (flightTimeInput.value.length > flightTimeInput.maxlength) {
    flightTimeInput.blur();
  }

  flightTimeInput.value = flightTimeInput.value.replace(/\D/g, ""); // Remove non-numeric characters
  let formattedValue = formatTime(flightTimeInput.value);
  flightTimeInput.value = formattedValue;
};

function formatTime(value) {
  if (value.length > 2) {
    return value.slice(0, -2) + ":" + value.slice(-2);
  }
  return value;
}

function loadConfigFile() {
  return JSON.parse(localStorage.getItem("configFile", null));
}

function setConfigFile(config) {
  localStorage.setItem("configFile", JSON.stringify(config));
}

async function saveConfigFileToDevice(configJsonArray) {
  const fileHandle = await window.showSaveFilePicker({
    suggestedName: "GATRConfigFile.json",
    types: [
      {
        description: "JSON Files",
        accept: { "application/json": [".json"] },
      },
    ],
  });

  const writableStream = await fileHandle.createWritable();
  const content = JSON.stringify(configJsonArray, null, 2); // Pretty print

  await writableStream.write(content);
  await writableStream.close();
}

const brightenHexColor = (hex, percent) => {
  const num = parseInt(hex.replace("#", ""), 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00ff) + percent;
  let b = (num & 0x0000ff) + percent;

  r = r < 255 ? (r < 0 ? 0 : r) : 255;
  g = g < 255 ? (g < 0 ? 0 : g) : 255;
  b = b < 255 ? (b < 0 ? 0 : b) : 255;

  return `rgb(${r}, ${g}, ${b})`;
};

const getElementByClass = (className) => {
  return document.querySelector(`.${className}`);
};

const refresh = () => location.reload(true);

// Encrypted reports cache helpers
const REPORTS_CACHE_KEY = "encrypted_reports_cache";

const saveEncryptedReport = (encryptedReports) => {
  try {
    const existing = loadEncryptedReports();

    let reportsToSave;
    if (existing && existing.length > 0) {
      // Get existing timestamps to check for duplicates
      const existingTimestamps = new Set(existing.map(r => r.ts));

      // Filter out duplicates from new reports
      const newReports = encryptedReports.filter(r => !existingTimestamps.has(r.ts));

      if (newReports.length > 0) {
        reportsToSave = [...existing, ...newReports];
        console.log("saveEncryptedReports: Appending", newReports.length, "new reports to existing", existing.length);
      } else {
        console.log("saveEncryptedReports: No new reports to add");
        return true;
      }
    } else {
      reportsToSave = encryptedReports;
      console.log("saveEncryptedReports: Saving", reportsToSave.length, "reports (no existing cache)");
    }

    localStorage.setItem(REPORTS_CACHE_KEY, JSON.stringify(reportsToSave));
    console.log("saveEncryptedReports: Total saved:", reportsToSave.length, "encrypted reports");
    return true;
  } catch (error) {
    console.error("saveEncryptedReports: Failed to save:", error.message);
    return false;
  }
};

const loadEncryptedReports = () => {
  try {
    const cached = localStorage.getItem(REPORTS_CACHE_KEY);
    if (!cached) {
      console.log("loadEncryptedReports: No cache found");
      return null;
    }
    const reports = JSON.parse(cached);
    console.log("loadEncryptedReports: Loaded", reports.length, "encrypted reports");
    return reports;
  } catch (error) {
    console.error("loadEncryptedReports: Failed to load:", error.message);
    return null;
  }
};

const clearEncryptedReports = () => {
  localStorage.removeItem(REPORTS_CACHE_KEY);
  console.log("clearEncryptedReports: Cache cleared");
};

