function roundThousand(value) {
  return Math.round(value / 1000);
}
function roundSubCounter() {
  const sideDetail = document.getElementById("_asideDetail");
  if (sideDetail) {
    const grade_area = sideDetail.getElementsByClassName("grade_area");
    if (grade_area) {
      const subCounterElement = grade_area[0].children[1].children[1];
      var regExpLetters = /[a-zA-Z]/g;
      if (!regExpLetters.test(subCounterElement.innerText)) {
        const subCounter = parseInt(
          subCounterElement.innerText.replaceAll(",", "")
        );
        if (subCounter >= 1000)
          subCounterElement.innerText =
            roundThousand(subCounter).toLocaleString("hi-IN") + "k";
      }
    }
  }
}

roundSubCounter();
