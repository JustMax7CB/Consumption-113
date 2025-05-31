var selectedLauncherId;
var selectedTubeEl;

const clearSelections = () => {
  selectedLauncherId = null;
  selectedTubeEl = null;
  getElementByClass("tube_number_subtitle").innerText = "";
};

const loadLauncher = (sid) => {
  if (selectedLauncherId) {
    saveAction();
  }

  console.log(`Loaded Launcher id: ${sid}`);
  clearSelections();
  getElementByClass("tube_number_subtitle").innerText = "";

  const launcherData = loadLauncherData(sid);
  const launcherStatus = launcherData.status;
  selectedLauncherId = sid;

  launcherStatus.forEach((tube) => {
    console.log(tube);
    const circleElement = document.querySelector(`[data-tube="${tube.tube}"]`);
    circleElement.setAttribute("launch-count", tube.launches);
  });

  setTubeContent();
};

const loadLauncherData = (sid) => {
  const configFile = loadConfigFile();
  console.log(configFile);
  return configFile.find((launcher) => launcher.sid === sid);
};

const loadJsonFile = () => {
  // Trigger the hidden file input
  document.getElementById("jsonFileInput").click();
};

document
  .getElementById("jsonFileInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        const alreadyStoredConfig = loadConfigFile();
        if (alreadyStoredConfig) {
          console.log(alreadyStoredConfig);
        }
        setConfigFile(jsonData);
        handleConfigChange();
        // You can now use jsonData programmatically

        refresh();
      } catch (err) {
        console.error("error parsing json file");
      }
    };

    reader.onerror = () => {
      document.getElementById("output").textContent = "Error reading file.";
    };

    reader.readAsText(file);
  });

const handleConfigChange = () => {
  const addTab = (tabElement) => {
    const tabsDiv = document.querySelector(".tabs");
    tabsDiv.appendChild(tabElement);
  };

  const config = loadConfigFile();

  if (Array.isArray(config)) {
    config.forEach((launcher) => {
      const tabElement = document.createElement("li");
      tabElement.classList.add("nav-item");

      const buttonElement = document.createElement("button");
      buttonElement.classList.add("tablinks", "nav-link");
      buttonElement.innerText = launcher.sid;

      buttonElement.onclick = (e) => {
        // Remove "active" class from all tabs
        document.querySelectorAll(".tablinks").forEach((btn) => {
          btn.classList.remove("active");
        });

        // Add "active" class to clicked tab
        e.currentTarget.classList.add("active");

        // Load launcher
        loadLauncher(launcher.sid);

        document.querySelector(
          ".selected-launcher-id"
        ).textContent = `משגר מס"ד ${launcher.sid}`;
      };

      tabElement.appendChild(buttonElement);
      addTab(tabElement);
    });
  } else {
    console.warn("Expected config to be an array.");
  }
};

const addNewLauncher = () => {
  const sid = document.querySelector("#launcher_input").value;

  if (!sid) {
    alert('נדרש מס"ד להוספה');
    return;
  }
  const newLauncher = new Launcher(sid);

  const loadedConfig = loadConfigFile();

  if (loadedConfig) {
    loadedConfig.push(newLauncher);
    setConfigFile(loadedConfig);
  } else {
    const config = [newLauncher];
    setConfigFile(config);
  }

  saveAction();
  refresh();
};

const setTubeColor = (element, count, isSelected = false) => {
  let bgColor = "#000000";
  if (count <= 30) {
    bgColor = "#03ff90";
  } else if (count <= 45) {
    bgColor = "#fcdb03";
  } else if (count < 50) {
    bgColor = "#fa8323";
  } else if (count == 50) {
    bgColor = "#fc0f03";
  }

  // Brighten if selected
  if (isSelected) {
    bgColor = brightenHexColor(bgColor, 75);
    element.style.borderWidth = "3px";
  } else {
    element.style.borderWidth = "1px";
  }

  element.style.backgroundColor = bgColor;
};

const setTubeContent = () => {
  document.querySelectorAll(".inner-circle").forEach((el) => {
    const tube = el.getAttribute("data-tube");
    const count = parseInt(el.getAttribute("launch-count"), 0);
    el.setAttribute("data-label", `${tube}\n${count}`);

    setTubeColor(el, count);
  });
};

let intervalId;
let timeoutId;

const startIncreasing = () => {
  // Start with slow interval
  intervalId = setInterval(increaseQuantity, 200);

  // After 2.5 seconds, switch to faster interval
  timeoutId = setTimeout(() => {
    clearInterval(intervalId);
    intervalId = setInterval(increaseQuantity, 80);
  }, 2500);
};

const stopIncreasing = () => {
  clearInterval(intervalId);
  clearTimeout(timeoutId);
};

const increaseQuantity = () => {
  if (!selectedLauncherId || !selectedTubeEl) return;
  const tubeElement = selectedTubeEl;
  const tubeNumber = tubeElement.getAttribute("data-tube");
  const currentQuantity = parseInt(tubeElement.getAttribute("launch-count"));

  if (currentQuantity === 50) return;
  const quantityInputEl = document.querySelector(".quantity-input");

  const newQuantity = currentQuantity + 1;
  quantityInputEl.value = newQuantity;
  tubeElement.setAttribute("launch-count", newQuantity);

  tubeElement.setAttribute("data-label", `${tubeNumber}\n${newQuantity}`);
  setTubeColor(tubeElement, newQuantity, true);
};

const startDecreasing = () => {
  // Start with slow interval
  intervalId = setInterval(decreaseQuantity, 200);

  // After 2.5 seconds, switch to faster interval
  timeoutId = setTimeout(() => {
    clearInterval(intervalId);
    intervalId = setInterval(decreaseQuantity, 80);
  }, 2500);
};

const stopDecreasing = () => {
  clearInterval(intervalId);
  clearTimeout(timeoutId);
};

const decreaseQuantity = () => {
  if (!selectedLauncherId || !selectedTubeEl) return;
  const tubeElement = selectedTubeEl;
  const tubeNumber = tubeElement.getAttribute("data-tube");
  const currentQuantity = parseInt(tubeElement.getAttribute("launch-count"));

  if (currentQuantity == 0) return;

  const quantityInputEl = document.querySelector(".quantity-input");

  const newQuantity = currentQuantity - 1;
  quantityInputEl.value = newQuantity;
  tubeElement.setAttribute("launch-count", newQuantity);

  tubeElement.setAttribute("data-label", `${tubeNumber}\n${newQuantity}`);
  setTubeColor(tubeElement, newQuantity, true);
};

const hideNonLoadedUI = () => {
  getElementByClass("launcher").style.display = "none";
  getElementByClass("quantity-control").style.display = "none";
  getElementByClass("tabs").style.display = "none";
};

const showLoadedUI = () => {
  getElementByClass("launcher").style.display = "block";
  getElementByClass("quantity-control").style.display = "flex";
  getElementByClass("tabs").style.display = "flex";
};

document.addEventListener("DOMContentLoaded", function () {
  checkAuthentication();

  if (!selectedLauncherId) {
    hideNonLoadedUI();
  }

  document.querySelector("#launcher_input").value = "";
  const configFile = loadConfigFile();
  if (configFile) {
    handleConfigChange();
    setTubeContent();
    showLoadedUI();
  }

  document.querySelector(".quantity-input").value = 0;

  // Get all inner-circle elements
  var innerCircles = document.querySelectorAll(".inner-circle");

  innerCircles.forEach((circle) => {
    circle.addEventListener("click", () => {
      if (!selectedLauncherId) return;

      const launchCount = parseInt(circle.getAttribute("launch-count"), 10);
      const tubeId = circle.getAttribute("data-tube");
      const quantityInputEl = document.querySelector(".quantity-input");

      if (quantityInputEl) {
        quantityInputEl.value = launchCount;
      }

      // Reset previously selected element's color
      if (selectedTubeEl) {
        const previousCount = parseInt(
          selectedTubeEl.getAttribute("launch-count"),
          10
        );
        setTubeColor(selectedTubeEl, previousCount, false);
      }

      // Set new selection
      selectedTubeEl = circle;
      setTubeColor(selectedTubeEl, launchCount, true); // highlight selected

      const tubeLabel = getElementByClass("tube_number_subtitle");
      if (tubeLabel) {
        tubeLabel.innerText = `צינור מס' ${tubeId}`;
      }
    });
  });
});

const saveAction = (saveToDevice = false) => {
  try {
    const tubeElements = document.querySelectorAll(".inner-circle");

    const tubeObjects = Array.from(tubeElements).map((el) => ({
      tube: el.getAttribute("data-tube"),
      launches: el.getAttribute("launch-count"),
    }));

    const newLauncherData = {
      sid: selectedLauncherId,
      status: tubeObjects,
    };

    const configFile = loadConfigFile();
    const launcherIndex = configFile.findIndex(
      (launcher) => launcher.sid === selectedLauncherId
    );

    if (launcherIndex === -1) {
      console.warn("Launcher ID not found in config file.");
      return;
    }

    configFile[launcherIndex] = newLauncherData;

    setConfigFile(configFile);
    if (saveToDevice) {
      saveConfigFileToDevice(configFile);
      alert("נתונים נשמרו בהצלחה!");
    }
  } catch (error) {
    console.error("Failed to save new launcher data json", error);
  }
};

document.querySelector(".quantity-input").addEventListener("input", (e) => {
  if (!selectedTubeEl) return;
  const newValue = parseInt(e.target.value);
  if (newValue >= 50) {
    selectedTubeEl.setAttribute("launch-count", 50);
    e.target.value = 50;
  } else if (newValue <= 0) {
    selectedTubeEl.setAttribute("launch-count", 0);
    e.target.value = 0;
  } else {
    selectedTubeEl.setAttribute("launch-count", newValue);
  }

  setTubeContent();
});
