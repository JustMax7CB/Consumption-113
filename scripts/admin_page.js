function openTab(evt, tab) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabs-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tab).style.display = "block";
  evt.currentTarget.className += " active";
}

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
      tabElement.classList += "nav-item";

      const buttonElement = document.createElement("button");
      buttonElement.classList += "tablinks nav-link";
      buttonElement.onclick = `openTab(event, "{launcher.sid}")`;
      buttonElement.innerText = launcher.sid;

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
