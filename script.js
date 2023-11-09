const addMissileButton = document.querySelector("#add_missile_btn");
const addEwButton = document.querySelector("#ew_btn");
const addCartridgeButton = document.querySelector("#cartridge_btn");
const saveButton = document.querySelector("#save_btn");

const missileTypes = [
  "קרדום K",
  "קרדום R0",
  "קרדום R9",
  'תמוז 2 נ"א',
  'תמוז 2 נ"ט',
  'פתיל 2 נ"א',
  'פתיל 2 נ"ט',
  'טיל GATR'
];

const ewTypes = ["802", "206", "RR-180", "RR-170"];
const ewPoints = [
  "כ.י חיצוני",
  "כ.י פנימי",
  "גב צד ימין",
  "גב צד שמאל",
  "כ.ש פנימי",
  "כ.ש חיצוני",
];

addMissileButton.addEventListener("click", () => addMissileRow());

addEwButton.addEventListener("click", () => addEwRow());

addCartridgeButton.addEventListener("click", () => addCartridgeRow());

saveButton.addEventListener("click", () => saveData());

function addMissileRow() {
  const missilesContainer = document.querySelector(".missile-container");

  const missileRows = document.querySelectorAll(".missile-row");
  if (missileRows.length === 7) return;

  var missileRow = document.createElement("div");
  missileRow.className = "missile-row item-row";

  var selectElement = document.createElement("select");
  selectElement.id = "missile-select";
  selectElement.className = "form-select";
  for (let option of missileTypes) {
    var optionElement = document.createElement("option");
    optionElement.text = option;
    optionElement.value = option;
    selectElement.appendChild(optionElement);
  }

  var inputElement = document.createElement("input");
  inputElement.type = "number";
  inputElement.inputMode = "numeric";
  inputElement.placeholder = "מסד טיל";
  inputElement.className = "form-control";
  inputElement.id = "missile_number";

  missileRow.appendChild(selectElement);
  missileRow.appendChild(inputElement);

  missilesContainer.appendChild(missileRow);
}

function addEwRow() {
  const EwContainer = document.querySelector(".ew-container");

  const ewRows = document.querySelectorAll(".ew-row");
  if (ewRows.length === 6) return;

  var ewRow = document.createElement("div");
  ewRow.className = "ew-row item-row";

  var typeSelectElement = document.createElement("select");
  typeSelectElement.id = "ew-type-select";
  typeSelectElement.className = "form-select";
  for (let option of ewTypes) {
    var optionElement = document.createElement("option");
    optionElement.text = option;
    optionElement.value = option;
    typeSelectElement.appendChild(optionElement);
  }

  var pointSelectElement = document.createElement("select");
  pointSelectElement.id = "ew-point-select";
  pointSelectElement.className = "form-select";

  for (let option of ewPoints) {
    var optionElement = document.createElement("option");
    optionElement.text = option;
    optionElement.value = option;
    pointSelectElement.appendChild(optionElement);
  }

  var inputElement = document.createElement("input");
  inputElement.type = "number";
  inputElement.inputMode = "numeric";
  inputElement.placeholder = "כמות";
  inputElement.id = "ew-quantity-input";

  ewRow.appendChild(typeSelectElement);
  ewRow.appendChild(pointSelectElement);
  ewRow.appendChild(inputElement);

  EwContainer.appendChild(ewRow);
}

function addCartridgeRow() {
  var CartridgesContainer = document.querySelector(".cartridges-container");

  const cartridgeRows = document.querySelectorAll(".cartridge-row");
  if (cartridgeRows.length === 1) return;

  var cartridgeRow = document.createElement("div");
  cartridgeRow.className = "cartridge-row item-row";

  var inputElement = document.createElement("input");
  inputElement.type = "number";
  inputElement.inputMode = "numeric";
  inputElement.placeholder = "כמות פגזים";
  inputElement.id = "cartridge_input";

  cartridgeRow.appendChild(inputElement);
  CartridgesContainer.appendChild(cartridgeRow);
}

function saveData() {
  const heliNumber = document.querySelector("#heli_number").value;
  const missiles = saveMissiles();
  const ews = saveEw();
  const cartridgeQuantity = saveCartridge();

  const data = {
    heliNumber: heliNumber,
    missiles: missiles,
    ews: ews,
    cartridges: cartridgeQuantity,
  };

  const sendToWhatsapp = confirm("Share message to whatsapp?");
  if (sendToWhatsapp) createMessage(data);
}

function saveMissiles() {
  let missileList = [];

  const missilesRows = document.querySelectorAll(".missile-row");
  for (let missileRow of missilesRows) {
    const missileType = missileRow.querySelector("#missile-select").value;
    const missileNumber = missileRow.querySelector("#missile_number").value;
    missileList.push({
      Type: missileType,
      SerialNumber: missileNumber,
    });
  }
  return missileList;
}

function saveEw() {
  let ewList = [];

  const ewRows = document.querySelectorAll(".ew-row");
  for (let ewRow of ewRows) {
    const type = ewRow.querySelector("#ew-type-select").value;
    const point = ewRow.querySelector("#ew-point-select").value;
    const quantity = ewRow.querySelector("#ew-quantity-input").value;
    ewList.push({
      Type: type,
      Point: point,
      Quantity: quantity,
    });
  }
  return ewList;
}

function saveCartridge() {
  const cartridgeRows = document.querySelectorAll(".cartridge-row");
  if (cartridgeRows.length === 0) return null;

  const cartridgeQuantity = document.querySelector("#cartridge_input").value;
  return cartridgeQuantity;
}

function createMessage(data) {
  const missiles = data["missiles"];
  const ews = data["ews"];
  const cartridges = data["cartridges"];
  const heliNumber = data["heliNumber"];

  const heliNumberMessagePart = `מסוק ${heliNumber}`;
  let ewsMessagePart = ``;
  for (let ew of ews) {
    ewsMessagePart += `${ew["Type"]} ${ew["Point"]} - ${ew["Quantity"]}\n`;
  }

  let missilesMessagePart = ``;
  for (let missile of missiles) {
    missilesMessagePart += `${missile["Type"]} מסד ${missile["SerialNumber"]}\n`;
  }

  let cartridgeMessagePart =
    cartridges != null || cartridges != `` ? `פגזים - ${cartridges}` : ``;

  const fullMessage = `
  🐝  ${heliNumberMessagePart}  🐝

  ${ewsMessagePart}
  ${missilesMessagePart}
  ${cartridgeMessagePart}`;

  const message = encodeURIComponent(fullMessage);
  window.open(`whatsapp://send?text=${message}`);
}

function copyToClipboard(fullMessage) {
  // Create a textarea element to hold the text
  const textarea = document.createElement("textarea");
  textarea.value = fullMessage;

  // Make sure the textarea is not visible
  textarea.style.position = "fixed";
  textarea.style.opacity = 0;

  // Append the textarea to the document
  document.body.appendChild(textarea);

  // Select the text in the textarea
  textarea.select();

  // Copy the selected text to the clipboard
  document.execCommand("copy");

  // Remove the textarea from the document
  document.body.removeChild(textarea);

  alert("Message copied to clipboard");
}
