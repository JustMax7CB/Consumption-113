import { SummaryReport } from "../model/summary_report.js";


addMissileButton.addEventListener("click", () => addMissileRow());

toggleGatrMissileButton.addEventListener("click", () => ToggleGatrContainer());

addEwButton.addEventListener("click", () => addEwRow());

addCartridgeButton.addEventListener("click", () => addCartridgeRow());

addCompletionButton.addEventListener("click", () => addCompletionRow());

whatsappShareContainer.addEventListener("click", () =>
  saveData(sendToWhatsapp)
);

telegramShareContainer.addEventListener("click", () =>
  saveData(sendToTelegram)
);

clearButton.addEventListener("click", () => clearData());


const ToggleGatrContainer = () => {
  gatrContainer.classList.toggle("open");
  toggleGatrMissileButton.textContent = gatrContainer.classList.contains("open") ? "הסתר טילי פיגיון" : "הוסף טילי פיגיון";
  toggleGatrMissileButton.classList.toggle("toggle-gatr-missile-btn--active");

  if (!gatrContainer.classList.contains("open")) {
    clearGatrSelections();
  }
};

const saveData = async (sendFunction) => {
  if (!formValidation()) return;
  const heliNumber = document.querySelector("#heli_number").value;
  const location = locationToggle.checked ? "רמת דוד" : "רמון";


  const missiles = saveMissiles();
  const ews = saveEw();
  const cartridges = saveCartridge();
  const completion = saveCompletion();
  const note = saveNotes();

  const report = new SummaryReport(location, cartridges, ews, missiles, completion);

  const data = {
    heliNumber: heliNumber,
    report: report,
    note: note,
  };

  // const submitted = await submitToServer(data);
  // if (!submitted) return;

  const fullMessage = createMessage(data);
  sendFunction(fullMessage);
};

const submitToServer = async (data) => {
  console.log("submitToServer: Submitting data...", data);

  try {
    const response = await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("submitToServer: Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("submitToServer: API error:", errorData);
      alert(`שגיאה בשמירת הנתונים: ${errorData.error || response.status}`);
      return false;
    }

    console.log("submitToServer: Data saved successfully");
    return true;
  } catch (error) {
    console.error("submitToServer: Error:", error.message);
    alert(`שגיאה בשמירת הנתונים: ${error.message}`);
    return false;
  }
};




const saveMissiles = () => {
  let missileList = [];

  const missilesRows = document.querySelectorAll(".missile-row");
  for (let missileRow of missilesRows) {
    const missileType = missileRow.querySelector(".missile-select").value;
    const missileNumber = missileRow.querySelector(".missile-number").value;
    const missileResult = missileRow.querySelector(".missile-result").value;

    missileList.push({
      type: missileType,
      number: missileNumber,
      result: missileResult,
    });
  }

  const gatrMissiles = document.querySelectorAll(".gatr-row");
  for (let gatrMissile of gatrMissiles) {
    const missileType = "פיגיון";
    const missileTube = gatrMissile.getAttribute("tube");
    const missileNumber = gatrMissile.querySelector(".gatr-input").value;
    const missileResult = gatrMissile.querySelector(".gatr-select").value;
    missileList.push({
      type: missileType,
      number: missileNumber,
      result: missileResult,
      tube: missileTube,
    });
  }
  return missileList;
};

const saveEw = () => {
  let ewList = [];

  const ewRows = document.querySelectorAll(".ew-row");
  for (let ewRow of ewRows) {
    const type = ewRow.querySelector(".ew-type-select").value;
    const station = ewRow.querySelector(".ew-point-select").value;
    const quantity = ewRow.querySelector(".ew-quantity-input").value;
    ewList.push({
      type: type,
      station: station,
      quantity: quantity,
    });
  }
  return ewList;
};

const saveCartridge = () => {
  let cartridgeList = [];

  const cartridgeRows = document.querySelectorAll(".cartridge-row");
  if (cartridgeRows.length === 0) return [];

  for (let row of cartridgeRows) {
    const type = row.querySelector(".cartridge-type-select").value;
    const quantity = row.querySelector(".cartridge-input").value;
    cartridgeList.push({
      type: type,
      quantity: quantity,
    });
  }
  return cartridgeList;
};

const saveCompletion = () => {
  let completionList = [];

  const completionRows = document.querySelectorAll(".completion-row");
  for (let missileRow of completionRows) {
    const missileType = missileRow.querySelector(".missile-select").value;
    const missileNumber = missileRow.querySelector(".missile-number").value;

    completionList.push({
      type: missileType,
      number: missileNumber,
    });
  }

  return completionList;
}

const saveNotes = () => {
  const note = document.querySelector("textarea").value;
  if (note !== undefined && note !== null) return note;
  return "";
};

const createMessage = (data) => {
  const location = data.report.location;
  const missiles = data.report.missiles;
  const ews = data.report.ews;
  const cartridges = data.report.cartridges;
  const heliNumber = data.heliNumber;
  const completions = data.report.completion;
  const note = data.note != null ? String(data.note).trim() : "";

  const header = `🐝  מסוק ${heliNumber}  🐝`;
  const locationLine = `מיקום: ${location}\n`;

  const ewLines = [];
  for (const ew of ews) {
    ewLines.push(`${ewColors[ew.type]} ${ew.type} ${ew.station} - ${ew.quantity}`);
  }

  const missileLines = [];
  for (const missile of missiles) {
    const tubePart = missile.tube ? ` צינור #${missile.tube}` : "";
    missileLines.push(
      `${explosionEmoji} טיל ${missile.type} מסד ${missile.number}${tubePart} - ${missile.result}`
    );
  }

  const cartridgeLines = [];
  for (const cartridge of cartridges) {
    cartridgeLines.push(`${fireEmoji} פגזים ${cartridge.type} - ${cartridge.quantity}`);
  }

  let completionBlock = "";
  if (completions.length > 0) {
    completionBlock += "\n"
    const completionLines = completions.map(
      (c) => `✚ ${c.type} מסד ${c.number}`
    );
    completionBlock += ["השלמות", ...completionLines].join("\n");
  }

  const parts = [
    header,
    locationLine,
    ewLines.length ? ewLines.join("\n") : "",
    missileLines.length ? missileLines.join("\n") : "",
    cartridgeLines.length ? cartridgeLines.join("\n") : "",
    completionBlock,
    note,
  ].filter((s) => s !== "");

  const fullMessage = parts.join("\n");
  console.log("Full Message:");
  console.log(fullMessage);

  return fullMessage;
};

const sendToWhatsapp = (fullMessage) => {
  const message = encodeURIComponent(fullMessage);
  window.open(`whatsapp://send?text=${message}`);
};

const sendToTelegram = (fullMessage) => {
  const message = encodeURIComponent(fullMessage);
  window.open(`tg://msg?text=${message}`);
};


const clearData = () => {
  const elements = document.querySelectorAll("input, textarea");
  for (let element of elements) {
    element.value = null;
  }

  const rows = document.querySelectorAll(".item-row");
  for (let row of rows) {
    row.remove();
  }

  const tubes = document.querySelectorAll(".inner-circle")
  for (let circle of tubes) {
    circle.classList.remove("selected");
  }

  const gatrMissiles = document.querySelectorAll(".gatr-row");
  for (let row of gatrMissiles) {
    row.remove();
  }

};

const formValidation = () => {
  const heliNumber = document.querySelector("#heli_number").value;
  if (heliNumber === "" || heliNumber === null || heliNumber === undefined) {
    alert("חובה לציין מספר מסוק");
    return false;
  }
  return true;
}
