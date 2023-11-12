const checkTime = (flightDetails) => {
  const flightTime = flightDetails.Time;
  const flightHour = flightTime.split(":")[0];
  const flightMinute = flightTime.split(":")[1];
  const hourValid = Number(flightHour) >= 0 && Number(flightHour) < 24;
  const minuteValid = Number(flightMinute) >= 0 && Number(flightMinute) < 60;
  return hourValid && minuteValid;
};

const flightTimeFormatter = () => {
  if (flightTimeInput.value.length > flightTimeInput.maxlength) {
    flightTimeInput.blur();
  }

  flightTimeInput.value = flightTimeInput.value.replace(/\D/g, ""); // Remove non-numeric characters
  let formattedValue = formatTime(flightTimeInput.value);
  flightTimeInput.value = formattedValue;
};

function formatTime(value) {
  if (value.length > 2) {
    return value.slice(0, -2) + ":" + value.slice(-2);
  }
  return value;
}
