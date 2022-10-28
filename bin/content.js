"use strict";
const KEY_SETTING_INCOMING_COMMENTS = "incomingComments";
const KEY_SETTING_LIKE_DISLIKE_INDICATOR = "likeDislike";
const KEY_SETTING_DELETE_BUTTON = "deleteButton";
const KEY_SETTING_REORDER_HEADER = "reorderHeader";
const KEY_SETTING_REMOVE_RATING = "removeRating";
const KEY_DISCARD_DISABLED_COMMENTS = "discardDisabledComments";
const KEY_ROUND_SUB_COUNTER = "roundSubs";
const SETTINGS_DEFAULT_VALUES = {
  [KEY_SETTING_INCOMING_COMMENTS]: true,
  [KEY_SETTING_LIKE_DISLIKE_INDICATOR]: false,
  [KEY_SETTING_DELETE_BUTTON]: true,
  [KEY_SETTING_REORDER_HEADER]: false,
  [KEY_SETTING_REMOVE_RATING]: false,
  [KEY_DISCARD_DISABLED_COMMENTS]: true,
  [KEY_ROUND_SUB_COUNTER]: false,
};

function getUrl(path) {
  return chrome.runtime.getURL(path);
}

function getSettings(returnVal) {
  const key_setting_keys = Object.keys(SETTINGS_DEFAULT_VALUES);
  chrome.storage.sync.get(key_setting_keys, function (items) {
    returnVal(Object.assign({}, SETTINGS_DEFAULT_VALUES, items));
  });
}

let content = [];
getSettings(function (items) {
  content["settings"] = items;
});

window.onload = async function () {
  const currURL = document.location.href;

  function sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }
  while (!content.settings) {
    await sleep(2);
  }

  function injectScriptTag(list_of_files = []) {
    for (const file of list_of_files) {
      const s = document.createElement("script");
      s.src = getUrl(file);
      (document.head || document.documentElement).appendChild(s);
    }
  }

  let helperFunctionsInjected = false;
  async function inject_helperFunctions() {
    if (!helperFunctionsInjected) {
      injectScriptTag(["inject_helperFunctions.js"]);
      helperFunctionsInjected = true;
    }
  }

  if (content.settings.incomingComments) {
    const s_addLinkToLoginDropdown = document.createElement("script");
    s_addLinkToLoginDropdown.src = getUrl("inject_update_loginDropdown.js");
    (document.head || document.documentElement).appendChild(
      s_addLinkToLoginDropdown
    );
  }

  if (
    content.settings.incomingComments &&
    document.location.href.match(
      new RegExp("https://www.webtoons.com/[a-z]{2,4}?/mycomment*")
    )
  ) {
    await inject_helperFunctions();
    const path = "incomingComments/";
    const list_of_files = [
      path + "ic_objects.js",
      path + "ic_likeDislike_Buttons.js",
      path + "ic_replies.js",
      path + "ic_commentHTML.js",
      path + "ic_pagination.js",
      path + "ic_progressBar.js",
      path + "ic_tabRows.js",
      path + "ic_loadComments.js",
    ];
    injectScriptTag(list_of_files);

    const s_incomingComments = document.createElement("script");
    let content_to_submit = [];
    content_to_submit["settings"] = {
      likeDislike: content.settings.likeDislike
        ? content.settings.likeDislike
        : false,
      discardDisabledComments: false,
    };
    s_incomingComments.onload = async function () {
      // This fires after the page script finishes executing
      const event = new CustomEvent("ReceiveContent", {
        detail: content_to_submit,
      });
      window.dispatchEvent(event);
    };
    s_incomingComments.src = getUrl("inject_incoming_comments.js");
    (document.head || document.documentElement).appendChild(s_incomingComments);
  }

  if (
    content.settings.deleteButton &&
    currURL.match(
      new RegExp("https://www.webtoons.com/[a-z]{2,4}?/challenge/dashboard*")
    )
  ) {
    injectScriptTag(["inject_delete_button.js"]);
  }

  if (content.settings.removeRating) {
    injectScriptTag(["inject_remove_rating.js"]);
  }

  if (content.settings.roundSubs) {
    injectScriptTag(["inject_round_subs.js"]);
  }

  if (content.settings.reorderHeader) {
    injectScriptTag(["inject_reorder_header.js"]);
  }
};
