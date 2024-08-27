const defaultValues = {
  incomingComments: true,
  deleteButton: true,
  reorderHeader: false,
  removeRating: false,
  roundSubs: false,
};

function saveValueInStorage(txtKey, txtValue) {
  chrome.storage.sync.set({ [txtKey]: txtValue });
}

function getValueFromStorage() {
  const switchElements = document.getElementsByClassName("switch");
  chrome.storage.sync.get(function (items) {
    for (const element of switchElements) {
      if (!(element.id in items)) {
        saveValueInStorage(element.id, defaultValues[element.id]);
      }
      document.getElementById(element.id + "Checkbox").checked =
        element.id in items ? items[element.id] : defaultValues[element.id];
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  getValueFromStorage();
});

function switchClicked(item) {
  const checkbox = document.getElementById(item.id + "Checkbox");
  saveValueInStorage(item.id, checkbox.checked);
}

document.querySelectorAll(".switch").forEach((item) => {
  item.addEventListener("click", function () {
    switchClicked(item);
  });
});
