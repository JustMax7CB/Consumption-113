const addMissileButton = document.querySelector("#add_missile_btn");
const addEwButton = document.querySelector("#ew_btn");
const addCartridgeButton = document.querySelector("#cartridge_btn");
const notesTextArea = document.querySelector("#notes");
const clearButton = document.querySelector("#clear_btn");

const whatsappShareContainer = document.querySelector("#whatsapp-container");
const telegramShareContainer = document.querySelector("#telegram-container");
const flightTimeInput = document.querySelector("#flight_time");

function formatTime(value) {
  if (value.length > 2) {
    return value.slice(0, -2) + ":" + value.slice(-2);
  }
  return value;
}

flightTimeInput.addEventListener("input", () => {
  flightTimeInput.value = flightTimeInput.value.replace(/\D/g, ""); // Remove non-numeric characters
  let formattedValue = formatTime(flightTimeInput.value);
  flightTimeInput.value = formattedValue;
});

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


let missileIndex = 0;
let ewIndex = 0;
let cartridgeIndex = 0;



function addMissileRow() {
  const missilesContainer = document.querySelector(".missile-container");

  const missileRows = document.querySelectorAll(".missile-row");
  if (missileRows.length === 7) return;

  const currentIndex = missileIndex++;

  var missileRow = document.createElement("div");
  missileRow.className = `missile-row item-row`;
  missileRow.setAttribute("index", `${currentIndex}`);

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

  var removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.innerText = "מחק";
  removeButton.className = "btn btn-danger";
  removeButton.onclick = () => removeElement("missile-row", currentIndex);

  console.log(removeButton);

  missileRow.appendChild(selectElement);
  missileRow.appendChild(inputElement);
  missileRow.appendChild(resultSelectElement);
  missileRow.appendChild(removeButton);

  missilesContainer.appendChild(missileRow);
}

function addEwRow() {
  const EwContainer = document.querySelector(".ew-container");

  const ewRows = document.querySelectorAll(".ew-row");
  if (ewRows.length === 6) return;

  const currentIndex = ewIndex++;

  var ewRow = document.createElement("div");
  ewRow.className = "ew-row item-row";
  ewRow.setAttribute("index", currentIndex);

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

  var removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.innerText = "מחק";
  removeButton.className = "btn btn-danger";
  removeButton.onclick = () => removeElement("ew-row", currentIndex);

  ewRow.appendChild(typeSelectElement);
  ewRow.appendChild(pointSelectElement);
  ewRow.appendChild(inputElement);
  ewRow.appendChild(removeButton);

  EwContainer.appendChild(ewRow);
}

function addCartridgeRow() {
  var CartridgesContainer = document.querySelector(".cartridges-container");

  const cartridgeRows = document.querySelectorAll(".cartridge-row");
  if (cartridgeRows.length === 2) return;

  const currentIndex = cartridgeIndex++;

  var cartridgeRow = document.createElement("div");
  cartridgeRow.className = "cartridge-row item-row";
  cartridgeRow.setAttribute("index", currentIndex);

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

  var removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.innerText = "מחק";
  removeButton.className = "btn btn-danger";
  removeButton.onclick = () => removeElement("cartridge-row", currentIndex);

  cartridgeRow.appendChild(typeSelectElement);
  cartridgeRow.appendChild(inputElement);
  cartridgeRow.appendChild(removeButton);

  CartridgesContainer.appendChild(cartridgeRow);
}

function saveData(sendFunction) {
  const flightDetails = saveFlightDetails();
  const heliNumber = document.querySelector("#heli_number").value;
  const missiles = saveMissiles();
  const ews = saveEw();
  const cartridgeQuantity = saveCartridge();
  const note = saveNotes();

  const data = {
    flightDetails: flightDetails,
    heliNumber: heliNumber,
    missiles: missiles,
    ews: ews,
    cartridges: cartridgeQuantity,
    note: note,
  };

  const fullMessage = createMessage(data);

  sendFunction(fullMessage);
}

function saveFlightDetails() {
  const pilotName = document.querySelector("#pilot_name").value;
  const flightTime = document.querySelector("#flight_time").value;
  console.log(pilotName);
  console.log(flightTime);
  if (pilotName === "" || flightTime === "") return null;
  return {
    Pilot: pilotName,
    Time: flightTime,
  };
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

function saveNotes() {
  const note = document.querySelector("textarea").value;
  if (note !== undefined && note !== null) return note;
  return "";
}

function createMessage(data) {
  const flightDetails = data.flightDetails;
  const missiles = data.missiles;
  const ews = data.ews;
  const cartridges = data.cartridges;
  const heliNumber = data.heliNumber;
  const note = data.note;

  let flightDetailsMessagePart = ``;
  if (flightDetails !== null) {
    flightDetailsMessagePart = `שם טייס: ${flightDetails.Pilot} , זמן טיסה: ${flightDetails.Time}`;
  }

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

  let noteMessagePart = note !== null ? note : null;

  const fullMessage = `🐝  ${heliNumberMessagePart}  🐝
${flightDetailsMessagePart}

${ewsMessagePart}
${missilesMessagePart}
${cartridgeMessagePart}

${noteMessagePart}`;

  console.log(fullMessage);

  return fullMessage;
}

function sendToWhatsapp(fullMessage) {
  const message = encodeURIComponent(fullMessage);
  window.open(`whatsapp://send?text=${message}`);
}

function sendToTelegram(fullMessage) {
  const message = encodeURIComponent(fullMessage);
  window.open(`tg://msg?text=${message}`);
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

function removeElement(className, index) {
  const query = `.${className}[index="${index}"]`;
  console.log(query);
  const element = document.querySelector(query);

  if (element) {
    element.remove();
  } else {
    console.error("Element not found");
  }
}

function clearData() {
  const elements = document.querySelectorAll("input, textarea");
  for (let element of elements) {
    element.value = null;
  }

  const rows = document.querySelectorAll(".item-row");
  for (let row of rows) {
    row.remove();
  }
}
