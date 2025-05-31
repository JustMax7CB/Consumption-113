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
