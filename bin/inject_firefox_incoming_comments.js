const STORAGE_GENERAL_PREFIX = "cw_";
const STORAGE_COMIC_KEY_PREFIX = STORAGE_GENERAL_PREFIX + "comic_";
const STORAGE_LAST_CRAWL_KEY = STORAGE_GENERAL_PREFIX + "last_crawl";
const STORAGE_COMIC_LIST_KEY = STORAGE_GENERAL_PREFIX + "comicList";

// general settings for extension
const KEY_SETTING_LIKE_DISLIKE_INDICATOR = "likeDislike";
const KEY_DISCARD_DISABLED_COMMENTS = "discardDisabledComments";

const URL_SUFFIX = "#incoming";

const NUMBER_OF_ELEMENTS_IN_PAGE = 30;
const RECRAWL_INTERVAL = 10; // reduce load from wt server
const FETCH_DELAY = 5; // avoid spam to wt server
const LAST_CRAWL = localStorage.getItem(STORAGE_LAST_CRAWL_KEY);

let settings = document.getElementById("cw_settings");
if (!settings || settings.innerText === "undefined") {
  SETTINGS = {};
} else {
  SETTINGS = JSON.parse(settings.innerText);
}

const languageCode = getLanguageFromURL();
const commentSelectionTabSNB = addTabRow("incoming_outgoing");

const li_outgoing = document.createElement("li");
li_outgoing.setAttribute("id", "outgoing_comments");
li_outgoing.setAttribute("class", "on");
commentSelectionTabSNB.appendChild(li_outgoing);

const anchor_OUTGOING = document.createElement("a");
anchor_OUTGOING.setAttribute(
  "href",
  "https://www.webtoons.com/" + languageCode + "/mycomment"
);
anchor_OUTGOING.innerText = "OUTGOING";
li_outgoing.appendChild(anchor_OUTGOING);
anchor_OUTGOING.addEventListener("click", switchIntoOutgoingTab);

const li_incoming = document.createElement("li");
li_incoming.setAttribute("id", "incoming_comments");
commentSelectionTabSNB.appendChild(li_incoming);

const anchor_INCOMING = document.createElement("a");
anchor_INCOMING.setAttribute("href", URL_SUFFIX);
anchor_INCOMING.innerText = "INCOMING";
li_incoming.appendChild(anchor_INCOMING);
anchor_INCOMING.addEventListener("click", getComments);

if (window.location.href.includes(URL_SUFFIX)) getComments();
