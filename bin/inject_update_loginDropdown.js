async function waitForAndGetLoginDropdown() {
  function sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  let loginDropdown = undefined;
  let getDropdownCounter = 0;
  while (!loginDropdown && getDropdownCounter < 200) {
    await sleep(2);
    loginDropdown = document.getElementsByClassName("loginbox_cont")[0];
    getDropdownCounter++;
  }
  return loginDropdown;
}

function findLinkButton(loginDropdown, expectedInnerText = "Comments") {
  for (const loginDropdownElement of loginDropdown.children) {
    if (loginDropdownElement.innerText === expectedInnerText)
      return loginDropdownElement;
  }
}

function addLinkToLoginDropdown(
  linkButton,
  incomingText,
  outgoingText,
  suffix = "#incoming"
) {
  const link_listElement = document.createElement("li");
  const link = document.createElement("a");
  link.setAttribute("href", linkButton.children[0] + suffix);
  link.innerText = incomingText;
  link_listElement.appendChild(link);
  linkButton.parentElement.insertBefore(
    link_listElement,
    linkButton.nextSibling
  );
  linkButton.children[0].innerText = outgoingText;
}
async function prepareAndAddIncomingCommentsToLoginDropdown() {
  const loginDropdown = await waitForAndGetLoginDropdown();
  if (loginDropdown) {
    if (window.location.href.includes("/en/")) {
      const commentLinkButton = findLinkButton(loginDropdown);
      if (commentLinkButton) {
        addLinkToLoginDropdown(
          commentLinkButton,
          "Comments (IN)",
          "Comments (OUT)"
        );
      }
    } else if (window.location.href.includes("/es/")) {
      const commentLinkButton = findLinkButton(loginDropdown, "Comentarios");
      if (commentLinkButton) {
        addLinkToLoginDropdown(
          commentLinkButton,
          "Comentarios (IN)",
          "Comentarios (OUT)"
        );
      }
    }
  }
}

if (
  !document.location.href.match(
    new RegExp("https://www.webtoons.com/[a-z]{2,4}?/mycomment*")
  )
)
  prepareAndAddIncomingCommentsToLoginDropdown().then();
