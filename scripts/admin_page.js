const loadLauncher = (sid) => {
  // Declare all variables
  var i, tabcontent, tablinks;

  console.log(`Loaded Launcher id: ${sid}`);

  const launcherData = loadLauncherData(sid);
  const launcherStatus = launcherData.status;

  launcherStatus.forEach((tube) => {
    const circleElement = document.querySelector(`[data-tube="${tube.tube}"]`);
    circleElement.setAttribute("launch-count", tube.launches);
  });

  setTubeContent();
};

const loadLauncherData = (sid) => {
  const configFile = JSON.parse(localStorage.getItem("configFile"));
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
        console.table(jsonData);
        localStorage.setItem("configFile", JSON.stringify(jsonData));

        handleConfigChange();
        // You can now use jsonData programmatically
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

  const config = JSON.parse(localStorage.getItem("configFile"));

  if (Array.isArray(config)) {
    config.forEach((launcher) => {
      const tabElement = document.createElement("li");
      tabElement.classList.add("nav-item");

      const buttonElement = document.createElement("button");
      buttonElement.classList.add("tablinks", "nav-link");
      buttonElement.innerText = launcher.sid;

      buttonElement.onclick = (e) => loadLauncher(launcher.sid);

      tabElement.appendChild(buttonElement);
      addTab(tabElement);
    });
  } else {
    console.warn("Expected config to be an array.");
  }
};

const addNewLauncher = () => {
  const sid = document.querySelector("#launcher_input").value;
  console.log(sid);
  const newLauncher = {
    sid: sid,
    status: [
      {
        tube: 2,
        launches: 0,
      },
      {
        tube: 5,
        launches: 0,
      },
      {
        tube: 6,
        launches: 0,
      },
    ],
  };

  const loadedConfig = JSON.parse(localStorage.getItem("configFile"));

  if (loadedConfig) {
    loadedConfig.push(newLauncher);
    localStorage.setItem("configFile", JSON.stringify(loadedConfig));
  }
};

const setTubeColor = (element, count) => {
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

  element.style.backgroundColor = bgColor;
};
const setTubeContent = () => {
  document.querySelectorAll(".inner-circle").forEach((el) => {
    const tube = el.getAttribute("data-tube");
    const count = parseInt(el.getAttribute("launch-count"), 10);
    el.setAttribute("data-label", `${tube}\n${count}`);

    setTubeColor(el, count);
  });
};

setTubeContent();