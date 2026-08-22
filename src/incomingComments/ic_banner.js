function addBanner(nextNode) {
  let bannerBox = document.getElementById("textBox_AnD");
  let adBox = document.getElementById("adBox_AnD");
  if (!bannerBox && !adBox && BACKGROUND_IMAGE_URL && AD_IMAGE_URL) {
    const adBoxAnchor = document.createElement("a");
    adBoxAnchor.href =
      "https://www.webtoons.com/en/canvas/arindia-no-densetsu/list?title_no=563025";
    adBoxAnchor.target = "_blank";
    nextNode.parentNode.insertBefore(adBoxAnchor, nextNode);

    adBox = document.createElement("img");
    adBox.setAttribute("id", "adBox_AnD");
    adBox.setAttribute("class", "u_cbox_contents");
    adBox.setAttribute("src", AD_IMAGE_URL);
    adBoxAnchor.appendChild(adBox);

    bannerBox = document.createElement("div");
    bannerBox.setAttribute("id", "textBox_AnD");

    const text =
      "<div style='padding: 20px 0 10px 10px;'><p>Hi, more changes from wt. This is a regular monthly occurrence by now.</p><p>The comments take longer to load due to wt's new comment management. <b>Please, keep this browser tab open while it is loading!</b></p>If it doesn't show any comments, refresh the page. New comments might take up to 20 minutes to be listed.<br>Check out my comic or buy me a coffee on <u><a href=\"https://ko-fi.com/freiha\" target=\"_blank\">ko-fi.com/freiha</a></u> if you like. ~Freiha</p> </div>";

    const bannerTextBox = document.createElement("div");
    bannerTextBox.setAttribute("class", "u_cbox_contents");
    bannerTextBox.style.display = "inline-block";
    bannerTextBox.style.fontSize = "16px";
    bannerTextBox.style.lineHeight = "21px";
    bannerTextBox.style.color = "black";
    bannerTextBox.style.wordBreak = "break-word";
    bannerTextBox.style.wordWrap = "break-word";
    bannerTextBox.style.textAlign = "left";
    bannerTextBox.style.marginLeft = "60px";
    bannerTextBox.innerHTML = text;

    bannerBox.append(bannerTextBox);

    nextNode.parentNode.insertBefore(bannerBox, nextNode);
  }
}
