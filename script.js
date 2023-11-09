const addMissileButton = document.querySelector("#add_missile_btn");
const addEwButton = document.querySelector("#ew_btn");
const addCartridgeButton = document.querySelector("#cartridge_btn");
const saveButton = document.querySelector("#save_btn");

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

  var resultSelectElement = document.createElement("select");
  resultSelectElement.id = "missile_result";
  resultSelectElement.className = "form-select";

  for (let option of resultOptions) {
    var optionElement = document.createElement("option");
    optionElement.text = option;
    optionElement.value = option;
    resultSelectElement.appendChild(optionElement);
  }

  missileRow.appendChild(selectElement);
  missileRow.appendChild(inputElement);
  missileRow.appendChild(resultSelectElement);

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
  if (cartridgeRows.length === 2) return;

  var cartridgeRow = document.createElement("div");
  cartridgeRow.className = "cartridge-row item-row";

  var typeSelectElement = document.createElement("select");
  typeSelectElement.id = "cartridge_type_select";
  typeSelectElement.className = "form-select";
  for (let type of ["אימונים", "מבצעי"]) {
    var optionElement = document.createElement("option");
    optionElement.selected = true;
    optionElement.text = type;
    optionElement.value = type;
    typeSelectElement.appendChild(optionElement);
  }

  var inputElement = document.createElement("input");
  inputElement.type = "number";
  inputElement.inputMode = "numeric";
  inputElement.placeholder = "כמות פגזים";
  inputElement.id = "cartridge_input";

  cartridgeRow.appendChild(typeSelectElement);
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
    const missileResult = missileRow.querySelector("#missile_result").value;
    missileList.push({
      Type: missileType,
      SerialNumber: missileNumber,
      Result: missileResult,
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
  let cartridgeList = [];

  const cartridgeRows = document.querySelectorAll(".cartridge-row");
  if (cartridgeRows.length === 0) return [];

  for (let row of cartridgeRows) {
    const type = row.querySelector("#cartridge_type_select").value;
    const quantity = row.querySelector("#cartridge_input").value;
    cartridgeList.push({
      Type: type,
      Quantity: quantity,
    });
  }
  return cartridgeList;
}

function createMessage(data) {
  const missiles = data.missiles;
  const ews = data.ews;
  const cartridges = data.cartridges;
  const heliNumber = data.heliNumber;

  const heliNumberMessagePart = `מסוק ${heliNumber}`;
  let ewsMessagePart = ``;
  for (let ew of ews) {
    ewsMessagePart += `${ew.Type} ${ew.Point} - ${ew.Quantity}\n`;
  }

  let missilesMessagePart = ``;
  for (let missile of missiles) {
    missilesMessagePart += `טיל ${missile.Type} מסד ${missile.SerialNumber} - ${missile.Result}\n`;
  }

  let cartridgeMessagePart = ``;
  for (let cartridge of cartridges) {
    cartridgeMessagePart += `פגזים ${cartridge.Type} - ${cartridge.Quantity}\n`;
  }

  const fullMessage = `
  🐝  ${heliNumberMessagePart}  🐝

  ${ewsMessagePart}
  ${missilesMessagePart}
  ${cartridgeMessagePart}`;

  console.log(fullMessage);

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
