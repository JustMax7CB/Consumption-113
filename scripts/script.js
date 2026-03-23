import { SummaryReport } from "../model/summary_report.js";


addMissileButton.addEventListener("click", () => addMissileRow());

addEwButton.addEventListener("click", () => addEwRow());

addCartridgeButton.addEventListener("click", () => addCartridgeRow());

whatsappShareContainer.addEventListener("click", () =>
  saveData(sendToWhatsapp)
);

telegramShareContainer.addEventListener("click", () =>
  saveData(sendToTelegram)
);

clearButton.addEventListener("click", () => clearData());



const saveData = async (sendFunction) => {
  if (!formValidation()) return;
  const heliNumber = document.querySelector("#heli_number").value;


  const missiles = saveMissiles();
  const ews = saveEw();
  const cartridges = saveCartridge();
  const note = saveNotes();

  const report = new SummaryReport(cartridges, ews, missiles);

  const data = {
    heliNumber: heliNumber,
    report: report,
    note: note,
  };

  const submitted = await submitToServer(data);
  if (!submitted) return;

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

const saveNotes = () => {
  const note = document.querySelector("textarea").value;
  if (note !== undefined && note !== null) return note;
  return "";
};

const createMessage = (data) => {
  const missiles = data.report.missiles;
  const ews = data.report.ews;
  const cartridges = data.report.cartridges;
  const heliNumber = data.heliNumber;
  const note = data.note;


  const heliNumberMessagePart = `מסוק ${heliNumber}`;
  let ewsMessagePart = ``;
  for (let ew of ews) {

    ewsMessagePart += `${ewColors[ew.type]} ${ew.type} ${ew.station} - ${ew.quantity}\n`;
  }

  let missilesMessagePart = ``;
  let tubeMessagePart = ``;
  for (let missile of missiles) {
    if (missile.tube) {
      tubeMessagePart = `צינור #${missile.tube}`;
    }
    missilesMessagePart += `${explosionEmoji} טיל ${missile.type} מסד ${missile.number} ${tubeMessagePart} - ${missile.result}\n`;
  }

  let cartridgeMessagePart = ``;
  for (let cartridge of cartridges) {
    cartridgeMessagePart += `${fireEmoji} פגזים ${cartridge.type} - ${cartridge.quantity}\n`;
  }

  let noteMessagePart = note !== null ? note : null;

  const fullMessage = `🐝  ${heliNumberMessagePart}  🐝
${ewsMessagePart}
${missilesMessagePart}
${cartridgeMessagePart}

${noteMessagePart}`;
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
