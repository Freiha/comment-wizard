function switchTabInRow(tabRowId, elementId) {
    const tabRow = document.getElementById(tabRowId);
    for (const childElement of tabRow.childNodes) {
        childElement.removeAttribute("class");
    }

    const newChosenTab = document.getElementById(elementId);
    newChosenTab.classList.add("on");
}

function switchIntoOutgoingTab() {
    switchTabInRow('incoming_outgoing', 'outgoing_comments');
}

function addTabRow(tabRowId) {
    const content = document.getElementById("content");
    const commentsWrap = document.getElementsByClassName("my_comments_wrap")[0];
    const newTabs = document.createElement("div");
    newTabs.setAttribute("class", "snb_wrap my");
    content.insertBefore(newTabs, commentsWrap);

    const commentSelectionTabs = document.createElement("div");
    commentSelectionTabs.setAttribute("class", "snb_inner");
    newTabs.appendChild(commentSelectionTabs);

    const commentSelectionTabSNB = document.createElement("ul");
    commentSelectionTabSNB.setAttribute("class", "snb");
    commentSelectionTabSNB.setAttribute("id", tabRowId);
    commentSelectionTabs.appendChild(commentSelectionTabSNB);

    return commentSelectionTabSNB;
}