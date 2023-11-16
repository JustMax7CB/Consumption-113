document.addEventListener("DOMContentLoaded", function () {
  // Get all inner-circle elements
  var innerCircles = document.querySelectorAll(".inner-circle");

  // Add click event listener to each inner-circle
  innerCircles.forEach(function (circle) {
    circle.addEventListener("click", function () {
      const tube = circle.getAttribute("data-tube");
      // Toggle the 'selected' class on click
      circle.classList.toggle("selected");

      if (circle.classList.contains("selected")) {
        const GATR_InputDiv = document.querySelector("#gatr_inputs");

        const gatrRow = document.createElement("div");
        gatrRow.className = "gatr-row";
        gatrRow.id = `gatr_row_${tube}`;
        gatrRow.setAttribute("tube", tube);

        const inputElement = document.createElement("input");
        inputElement.type = "number";
        inputElement.inputmode = "numeric";
        inputElement.placeholder = `מסד פיגיון - צינור #${tube}`;
        inputElement.id = `input_${tube}`;
        inputElement.className = "form-control gatr-input";

        const selectElement = document.createElement("select");
        selectElement.className = "form-select gatr-select";
        selectElement.id = `gatr_select_${tube}`;

        for (let option of resultOptions) {
          var optionElement = document.createElement("option");
          optionElement.text = option;
          optionElement.value = option;
          selectElement.appendChild(optionElement);
        }

        gatrRow.appendChild(inputElement);
        gatrRow.appendChild(selectElement);

        GATR_InputDiv.appendChild(gatrRow);
      } else {
        try {
          const inputElementToRemove = document.querySelector(`#input_${tube}`);
          const selectElementToRemove = document.querySelector(
            `#gatr_select_${tube}`
          );
          if (inputElementToRemove && selectElementToRemove) {
            inputElementToRemove.remove();
            selectElementToRemove.remove();
          } else {
            throw error;
          }
        } catch {
          console.error("No Input element for tube " + tube);
        }
      }
    });
  });
});
