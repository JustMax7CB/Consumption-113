// const normalBorderStyle = flightTimeInput.style.border;

let loadedMessages = null;

// flightTimeInput.addEventListener("input", () => flightTimeFormatter());

// clearMemoryButton.addEventListener("click", () => clearMessagesFromStorage());

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

// saveButton.addEventListener("click", () => saveMessage());

// loadMessagesButton.addEventListener("click", () => loadMessages());

let missileIndex = 0;
let ewIndex = 0;
let cartridgeIndex = 0;

const saveData = (sendFunction) => {
  // if (loadedMessages !== null) {

  //   sendFunction(loadedMessages);
  //   return;
  // }
  // if (!formValidation()) return;

  // const flightDetails = saveFlightDetails();
  // const timeValid = flightDetails !== null ? checkTime(flightDetails) : true;
  // if (!timeValid) {
  //   flightTimeInput.style.border = "2px solid red";
  //   alert("זמן טיסה לא חוקי");
  // } else {
  //   flightTimeInput.style.border = normalBorderStyle;

  const heliNumber = document.querySelector("#heli_number").value;
  const missiles = saveMissiles();
  const ews = saveEw();
  const cartridgeQuantity = saveCartridge();
  const note = saveNotes();

  const data = {
    // flightDetails: flightDetails,
    heliNumber: heliNumber,
    missiles: missiles,
    ews: ews,
    cartridges: cartridgeQuantity,
    note: note,
  };

  const fullMessage = createMessage(data);
  // const savedMessages = getAllSavedMessages() + [, fullMessage];
  sendFunction(fullMessage);
};

const sendSavedMessages = (sendFunction, savedMessages) => {
  let fullMessage = ``;
  for (let message of savedMessages) {
    fullMessage += `${message}\n\n`;
  }
  sendFunction(fullMessage);
};

const saveMessage = () => {
  if (!formValidation()) return;
  const timeValid = flightDetails !== null ? checkTime(flightDetails) : true;
  if (!timeValid) {
    flightTimeInput.style.border = "2px solid red";
    alert("זמן טיסה לא חוקי");
  } else {
    flightTimeInput.style.border = normalBorderStyle;

    const heliNumber = document.querySelector("#heli_number").value;
    const missiles = saveMissiles();
    const ews = saveEw();
    const cartridgeQuantity = saveCartridge();
    const note = saveNotes();

    const data = {
      heliNumber: heliNumber,
      missiles: missiles,
      ews: ews,
      cartridges: cartridgeQuantity,
      note: note,
    };

    const fullMessage = createMessage(data);
    saveMessageToLocalStorage(fullMessage);
    alert(`דיווח מסוק ${data.heliNumber} נשמר בהצלחה בזיכרון`);
    clearData();
  }
};

const loadMessages = () => {
  loadedMessages = getAllSavedMessages();
  if (
    loadedMessages.length === 0 ||
    loadedMessages === null ||
    loadedMessages === undefined
  )
    alert("אין דיווחים בזיכרון");
  else alert("דיווחים נטענו בהצלחה");
};


const saveMissiles = () => {
  let missileList = [];
  let gatrTube = null;

  const missilesRows = document.querySelectorAll(".missile-row");
  for (let missileRow of missilesRows) {
    const missileType = missileRow.querySelector(".missile-select").value;
    const missileNumber = missileRow.querySelector(".missile-number").value;
    const missileResult = missileRow.querySelector(".missile-result").value;

    missileList.push({
      Type: missileType,
      SerialNumber: missileNumber,
      Result: missileResult,
      Tube: gatrTube,
    });
  }

  const gatrMissiles = document.querySelectorAll(".gatr-row");
  for (let gatrMissile of gatrMissiles) {
    const missileType = "פיגיון";
    const missileTube = gatrMissile.getAttribute("tube");
    const missileNumber = gatrMissile.querySelector(".gatr-input").value;
    const missileResult = gatrMissile.querySelector(".gatr-select").value;
    missileList.push({
      Type: missileType,
      SerialNumber: missileNumber,
      Result: missileResult,
      Tube: missileTube,
    });
  }
  return missileList;
};

const saveEw = () => {
  let ewList = [];

  const ewRows = document.querySelectorAll(".ew-row");
  for (let ewRow of ewRows) {
    const type = ewRow.querySelector(".ew-type-select").value;
    const point = ewRow.querySelector(".ew-point-select").value;
    const quantity = ewRow.querySelector(".ew-quantity-input").value;
    ewList.push({
      Type: type,
      Point: point,
      Quantity: quantity,
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
      Type: type,
      Quantity: quantity,
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
  const missiles = data.missiles;
  const ews = data.ews;
  const cartridges = data.cartridges;
  const heliNumber = data.heliNumber;
  const note = data.note;


  const heliNumberMessagePart = `מסוק ${heliNumber}`;
  let ewsMessagePart = ``;
  for (let ew of ews) {

    ewsMessagePart += `${ewColors[ew.Type]} ${ew.Type} ${ew.Point} - ${ew.Quantity}\n`;
  }

  let missilesMessagePart = ``;
  let TubeMessagePart = ``;
  for (let missile of missiles) {
    if (missile.Tube !== null) {
      TubeMessagePart = `צינור #${missile.Tube}`;
    }
    missilesMessagePart += `${explosionEmoji} ${explosionEmoji} טיל ${missile.Type} מסד ${missile.SerialNumber} ${TubeMessagePart} - ${missile.Result}\n`;
  }

  let cartridgeMessagePart = ``;
  for (let cartridge of cartridges) {
    cartridgeMessagePart += `${fireEmoji} פגזים ${cartridge.Type} - ${cartridge.Quantity}\n`;
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

const removeElement = (className, index) => {
  const query = `.${className}[index="${index}"]`;

  console.log(`Remove Element query: ${query}`);
  const element = document.querySelector(query);

  if (element) {
    element.remove();
  } else {
    console.error("Element not found");
  }
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
};
