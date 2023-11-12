const saveMessageToLocalStorage = (message) => {
  let savedMessages = localStorage.getItem("messages");
  if (savedMessages === null) {
    localStorage.setItem("messages", [message]);
  } else {
    savedMessages += [, message];
    localStorage.setItem("messages", savedMessages);
  }
};

const getAllSavedMessages = () => {
  const savedMessages = localStorage.getItem("messages");
  return savedMessages;
};

const getNumberOfSavedMessages = () => {
  const savedMessages = localStorage.getItem("messages");
  return savedMessages.length;
};

const clearMessagesFromStorage = () => {
  localStorage.clear();
  alert("הודעות נמחקו מהזיכרון בהצלחה!");
};
