function removeRating() {
  const sideDetail = document.getElementById("_asideDetail");
  if (sideDetail) {
    const grade_area = sideDetail.getElementsByClassName("grade_area");
    if (grade_area) {
      const rating = grade_area[0].children[2];
      rating.style.visibility = "hidden";
    }
  }
}

removeRating();
