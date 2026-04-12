const maxCartrigesRows = 2;
const maxEwRows = 6;
const maxMissileRows = 16;

let missileIndex = 0;
let ewIndex = 0;
let cartridgeIndex = 0;
let completionIndex = 0;

const removeElement = (className, index) => {
  const query = `.${className}[index="${index}"]`;

  console.log(`Remove Element query: ${query}`);
  const element = document.querySelector(query);

  if (element) {
    element.remove();
    if (className === "ew-row") {
      addEwButton.disabled = false;
      addEwButton.style.display = "block";
    }
    if (className === "missile-row") {
      addMissileButton.disabled = false;
      addMissileButton.style.disply = "block";
    }
    if (className === "cartridge-row") {
      addCartridgeButton.disabled = false;
      addCartridgeButton.style.display = "block";
    }
  } else {
    console.error("Element not found");
  }
};

const addEwRow = () => {
  const EwContainer = document.querySelector(".ew-container");

  var ewRows = document.querySelectorAll(".ew-row");
  if (ewRows.length === 6) return;

  const currentIndex = ewIndex++;

  var ewRow = document.createElement("div");
  ewRow.className = "ew-row item-row";
  ewRow.setAttribute("index", currentIndex);

  var typeSelectElement = document.createElement("select");
  typeSelectElement.id = `ew_type_select_${currentIndex}`;
  typeSelectElement.className = "form-select ew-type-select";
  for (let option of ewTypes) {
    var optionElement = document.createElement("option");
    optionElement.text = option;
    optionElement.value = option;
    typeSelectElement.appendChild(optionElement);
  }

  var pointSelectElement = document.createElement("select");
  pointSelectElement.id = `ew_point_select_${currentIndex}`;
  pointSelectElement.className = "form-select ew-point-select";

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
  inputElement.id = `ew_quantity_input_${currentIndex}`;
  inputElement.className = "ew-quantity-input form-control  data-number";

  var removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.innerText = "מחק";
  removeButton.className = "btn btn-danger remove-btn";
  removeButton.onclick = () => removeElement("ew-row", currentIndex);

  ewRow.appendChild(typeSelectElement);
  ewRow.appendChild(pointSelectElement);
  ewRow.appendChild(inputElement);
  ewRow.appendChild(removeButton);

  EwContainer.insertBefore(ewRow, addEwButton);

  ewRows = document.querySelectorAll(".ew-row");
  if (ewRows.length === maxEwRows) {
    addEwButton.disabled = true;
    addEwButton.style.display = "none";
  }
};

const addMissileRow = () => {
  let missilesContainer = document.querySelector(".missile-container");

  var missileRows = document.querySelectorAll(".missile-row");
  if (missileRows.length === 7) return;

  const currentIndex = missileIndex++;

  var missileRow = document.createElement("div");
  missileRow.className = `missile-row item-row`;
  missileRow.setAttribute("index", `${currentIndex}`);

  var selectElement = document.createElement("select");
  selectElement.id = `missile_select_${currentIndex}`;
  selectElement.className = "form-select missile-select";
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
  inputElement.className = "form-control missile-number data-number";
  inputElement.id = `missile_number_${currentIndex}`;

  var resultSelectElement = document.createElement("select");
  resultSelectElement.id = `missile_result_${currentIndex}`;
  resultSelectElement.className = "form-select missile-result";

  for (let option of resultOptions) {
    var optionElement = document.createElement("option");
    optionElement.text = option;
    optionElement.value = option;
    resultSelectElement.appendChild(optionElement);
  }

  var removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.innerText = "מחק";
  removeButton.className = "btn btn-danger  remove-btn";
  removeButton.onclick = () => removeElement("missile-row", currentIndex);

  missileRow.appendChild(selectElement);
  missileRow.appendChild(inputElement);
  missileRow.appendChild(resultSelectElement);
  missileRow.appendChild(removeButton);

  missilesContainer.insertBefore(missileRow, addMissileButton);

  missileRows = document.querySelectorAll(".missile-row");
  if (missileRows.length === maxMissileRows) {
    addMissileButton.disabled = true;
    addMissileButton.style.display = "none";
  }
};

const addCartridgeRow = () => {
  var CartridgesContainer = document.querySelector(".cartridges-container");

  var cartridgeRows = document.querySelectorAll(".cartridge-row");
  if (cartridgeRows.length === 2) return;

  const currentIndex = cartridgeIndex++;

  var cartridgeRow = document.createElement("div");
  cartridgeRow.className = "cartridge-row item-row";
  cartridgeRow.setAttribute("index", currentIndex);

  var typeSelectElement = document.createElement("select");
  typeSelectElement.id = `cartridge_type_select_${currentIndex}`;
  typeSelectElement.className = "form-select cartridge-type-select";
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
  inputElement.id = `cartridge_input_${currentIndex}`;
  inputElement.className = "cartridge-input form-control data-number";

  var removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.innerText = "מחק";
  removeButton.className = "btn btn-danger  remove-btn";
  removeButton.onclick = () => removeElement("cartridge-row", currentIndex);

  cartridgeRow.appendChild(typeSelectElement);
  cartridgeRow.appendChild(inputElement);
  cartridgeRow.appendChild(removeButton);

  CartridgesContainer.insertBefore(cartridgeRow, addCartridgeButton);

  cartridgeRows = document.querySelectorAll(".cartridge-row");
  if (cartridgeRows.length === maxCartrigesRows) {
    addCartridgeButton.disabled = true;
    addCartridgeButton.style.display = "none";
  }
};

const addCompletionRow = () => {
  var CompletionContainer = document.querySelector(".completion-container");

  const currentIndex = completionIndex++;
  
  var completionRow = document.createElement("div");
  completionRow.className = "completion-row item-row";
  completionRow.setAttribute("index", currentIndex);

  var selectElement = document.createElement("select");
  selectElement.id = `missile_completion_select_${currentIndex}`;
  selectElement.className = "form-select missile-select";
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
  inputElement.className = "form-control missile-number data-number";
  inputElement.id = `missile_completion_number_${currentIndex}`;

  var removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.innerText = "מחק";
  removeButton.className = "btn btn-danger  remove-btn";
  removeButton.onclick = () => removeElement("completion-row", currentIndex);

  completionRow.appendChild(selectElement);
  completionRow.appendChild(inputElement);
  completionRow.appendChild(removeButton);

  CompletionContainer.insertBefore(completionRow, addCompletionButton);
}
