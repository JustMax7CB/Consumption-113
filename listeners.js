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
