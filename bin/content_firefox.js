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
  return browser.runtime.getURL(path);
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

const injectScripts = async function () {
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

  function addSettingsToPage(content) {
    const extensionSettingsDiv = document.createElement("div");
    extensionSettingsDiv.setAttribute("id", "cw_settings");
    extensionSettingsDiv.style.visibility = "hidden";
    extensionSettingsDiv.innerText = JSON.stringify(content);
    (document.head || document.documentElement).appendChild(
      extensionSettingsDiv
    );
  }

  if (content.settings.incomingComments) {
    const s_addLinkToLoginDropdown = document.createElement("script");
    s_addLinkToLoginDropdown.src = getUrl("ild.js");
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
    const content_to_submit = {
      likeDislike: content.settings.likeDislike
        ? content.settings.likeDislike
        : false,
      discardDisabledComments: false,
    };
    addSettingsToPage(content_to_submit);

    const s_incomingComments = document.createElement("script");

    s_incomingComments.src = getUrl("iic.js");
    (document.head || document.documentElement).appendChild(s_incomingComments);
  }

  if (
    content.settings.deleteButton &&
    currURL.match(
      new RegExp("https://www.webtoons.com/[a-z]{2,4}?/challenge/dashboard*")
    )
  ) {
    injectScriptTag(["idb.js"]);
  }

  if (content.settings.removeRating) {
    injectScriptTag(["irr.js"]);
  }

  if (content.settings.roundSubs) {
    injectScriptTag(["irs.js"]);
  }

  if (content.settings.reorderHeader) {
    injectScriptTag(["irh.js"]);
  }
};

injectScripts().then();
