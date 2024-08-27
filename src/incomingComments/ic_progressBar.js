let INTERVAL = 100;
let PROGRESS_BAR;
let PROGRESS = 0;

function addProgressBar() {
  if (!document.getElementById("commentLoadingProgressBar")) {
    const container = document.createElement("div");
    container.id = "commentLoadingProgressBar";
    container.style.width = "100%";
    container.style.borderRadius = "34px";
    container.style.backgroundColor = "#ddd";
    container.style.textAlign = "middle";
    container.style.position = "relative";

    const loadingTextContainer = document.createElement("div");
    loadingTextContainer.style.position = "absolute";
    loadingTextContainer.style.width = "100%";
    loadingTextContainer.style.display = "flex";
    loadingTextContainer.style.justifyContent = "center";
    loadingTextContainer.style.alignItems = "center";
    container.appendChild(loadingTextContainer);

    const loadingText = document.createElement("div");
    loadingText.id = "progressBarText";
    loadingText.innerText = "Fetching comments...";
    loadingText.style.height = "100%";
    loadingText.style.textAlign = "middle";
    loadingTextContainer.appendChild(loadingText);

    const progressStatus = document.createElement("div");
    progressStatus.id = "commentLoadingProgress";
    progressStatus.style.width = "0";
    progressStatus.style.height = "20px";
    progressStatus.style.borderRadius = "34px";
    progressStatus.style.backgroundColor = "#00dc64";
    progressStatus.style.transition = "width 2s";
    progressStatus.addEventListener(
      "transitionend",
      () => {
        document.getElementById("progressBarText").innerText = "DONE!";
      },
      false
    );
    container.appendChild(progressStatus);

    const commentArea = document.getElementById("commentArea");
    commentArea.insertBefore(container, commentArea.firstChild);
  }
  PROGRESS_BAR = document.getElementById("commentLoadingProgress");
}

function resetProgressBar() {
  PROGRESS = 0;
  PROGRESS_BAR.style.transition = "none";
  PROGRESS_BAR.style.width = "0";
  document.getElementById("progressBarText").innerText = "Fetching comments...";
}

function setIntervalForProgressBar(numberOfEpisodes) {
  const timeToSortAndDisplay = 5;
  if (numberOfEpisodes > 0)
    INTERVAL = (100 - timeToSortAndDisplay) / numberOfEpisodes;
}

function setProgressBarFull() {
  PROGRESS_BAR.style.transition = "width 2s";
  PROGRESS = 100;
  updateProgressBar();
}

function updateProgressBar() {
  PROGRESS_BAR.style.transition = "width 2s";
  PROGRESS += INTERVAL;
  if (PROGRESS >= 100) {
    PROGRESS_BAR.style.width = "100%";
  } else {
    PROGRESS_BAR.style.width = PROGRESS + "%";
  }
}
