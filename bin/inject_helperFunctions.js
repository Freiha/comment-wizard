function switchOnFeature(key) {
  return SETTINGS[key];
}

function getLanguageFromURL() {
  const languageCodes = ["es"];
  const baseurl = "https://www.webtoons.com/";
  const url = window.location.href;
  for (const langCode of languageCodes) {
    if (url.includes(baseurl + langCode + "/")) return langCode;
  }
  return "en";
}

const HttpClient = function () {
  this.get = function (
    aUrl,
    aCallback,
    action = "GET",
    body = null,
    header = null
  ) {
    const anHttpRequest = new XMLHttpRequest();
    anHttpRequest.onreadystatechange = function () {
      if (anHttpRequest.readyState === 4 && anHttpRequest.status === 200)
        aCallback(anHttpRequest.responseText);
    };

    anHttpRequest.open(action, aUrl, true);
    if (header) {
      for (let [key, value] of Object.entries(header)) {
        anHttpRequest.setRequestHeader(key, value);
      }
    }
    anHttpRequest.send(body);
  };
};

const client = new HttpClient();

const stringToHTML = function (str) {
  const parser = new DOMParser();
  return parser.parseFromString(str, "text/html");
};

function getQueryStrings(queryString, divider = "&") {
  const assoc = {};
  const decode = function (s) {
    return decodeURIComponent(s.replace(/\+/g, " "));
  };
  const keyValues = queryString.split(divider);

  for (const i in keyValues) {
    const key = keyValues[i].split("=");
    if (key.length > 1) {
      assoc[decode(key[0])] = decode(key[1]);
    }
  }

  return assoc;
}

function getMinutes(dateDiff) {
  return Math.floor(dateDiff / 1000 / 60);
}

function getHours(dateDiff) {
  return Math.floor(dateDiff / 1000 / 60 / 60);
}

function getDays(dateDiff) {
  return Math.floor(dateDiff / 1000 / 60 / 60 / 24);
}

function getDateString(date) {
  const currentDate = new Date();
  const commentDate = new Date(date);
  const diffSeconds = Math.abs(currentDate - commentDate);
  if (getMinutes(diffSeconds) < 60)
    return getMinutes(diffSeconds) + " mins ago";
  else if (getHours(diffSeconds) < 24)
    return getHours(diffSeconds) + " hours ago";
  else if (getDays(diffSeconds) < 7) return getDays(diffSeconds) + " days ago";

  return (
    commentDate.getFullYear() +
    "-" +
    (commentDate.getMonth() + 1) +
    "-" +
    commentDate.getDate() +
    " " +
    commentDate.getHours() +
    ":" +
    commentDate.getMinutes()
  );
}

function isRecrawlPossible() {
  return (
    !LAST_CRAWL ||
    getMinutes(Math.floor(new Date() - new Date(LAST_CRAWL))) > RECRAWL_INTERVAL
  );
}

String.prototype.deentitize = function () {
  let ret = this.replace(/&gt;/g, ">");
  ret = ret.replace(/&lt;/g, "<");
  ret = ret.replace(/&quot;/g, '"');
  ret = ret.replace(/&apos;/g, "'");
  ret = ret.replace(/&amp;/g, "&");
  return ret;
};

function getURLWithQuery(url, params) {
  const esc = encodeURIComponent;
  const query = Object.keys(params)
    .map((k) => esc(k) + "=" + esc(params[k]))
    .join("&");
  return url + "?" + query;
}

window.getCookie = function (name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
};

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function removeNode(nodeToRemove) {
  nodeToRemove.parentNode.removeChild(nodeToRemove);
}

function removeAllChildren(htmlNode) {
  while (htmlNode.lastElementChild) {
    htmlNode.removeChild(htmlNode.lastElementChild);
  }
}
