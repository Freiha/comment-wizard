let numberOfEpisodesLeft = 0;

let associatedComic = "";
async function processComments(dictOfComics, objectId, result) {
  numberOfEpisodesLeft -= 1;

  if (result.posts.length > 0) {
    const comicId = objectId.split("_")[1];
    associatedComic = dictOfComics[comicId];
    const episode = associatedComic.getEpisode(objectId);
    for (const comment of result.posts) {
      if (comment.userName !== "") {
        episode.addComment(objectId, comment);
      }
    }
    associatedComic.updateEpisode(episode);
    if (associatedComic.id) {
      localStorage.setItem(
        STORAGE_COMIC_KEY_PREFIX + associatedComic.id,
        JSON.stringify(associatedComic)
      );
      if (numberOfEpisodesLeft <= 0) {
        buildAndAppendHTML(associatedComic.id);
      }
    }
    localStorage.setItem(STORAGE_LAST_CRAWL_KEY, new Date().toISOString());
  }
  updateProgressBar();
}

async function extractCommentsFromEpisode(comic, dictOfComics) {
  document.getElementById("commentList").replaceChildren();

  const webcomicInStorage = JSON.parse(
    localStorage.getItem(STORAGE_COMIC_KEY_PREFIX + comic.id)
  );

  numberOfEpisodesLeft = Object.keys(comic.episodes).length;

  if (
    isRecrawlPossible() ||
    !webcomicInStorage ||
    Object.keys(webcomicInStorage.episodes).length <
      Object.keys(comic.episodes).length
  ) {
    const commentRequests = document.createElement("div");
    commentRequests.setAttribute(
      "class",
      "comments::" + comic.title.replaceAll(" ", "_")
    );
    document.body.appendChild(commentRequests);

    for (const entry of Object.entries(comic.episodes)) {
      await sleep(FETCH_DELAY);
      const comment_request_url =
        "https://www.webtoons.com/p/api/community/v2/posts";

      const params = {
        pageId: entry[0],
        categoryId: "",
        pinRepresentation: "none",
        isplayBlindCommentAsService: "false",
        prevSize: 0, // TODO
        nextSize: 100, // TODO
        withCursor: false, // TODO
        offsetPostId: "", // TODO
      };

      const comment_request_url_with_query = getURLWithQuery(
        comment_request_url,
        params
      );

      const headers = {
        "service-ticket-id": "epicom",
      };

      client.get(
        comment_request_url_with_query,
        function (response) {
          const result = JSON.parse(response).result;
          processComments(dictOfComics, entry[0], result);
        },
        "GET",
        null,
        headers
      );
    }
  } else {
    buildAndAppendHTML(comic.id);
  }
}

function scanForEpisodes(webcomic, dictOfComics) {
  client.get(webcomic.url, function (response) {
    response = stringToHTML(response);
    let latest_episode = response
      .getElementById("_listUl")
      .getElementsByTagName("li")[0];
    const latest_episode_url = latest_episode.children[0].href.replace(
      "/en/",
      `/${languageCode}/`
    );

    client.get(latest_episode_url, function (response) {
      response = stringToHTML(response);
      let episode_list = response.getElementById("topEpisodeList");
      episode_list = episode_list.getElementsByTagName("li");

      const objectIdsJsonList = [];
      var assumedEpisodeSeq = 1;

      for (const item of episode_list) {
        const episode_url = item.children[0].href;
        const queryString = getQueryStrings(episode_url.split("?")[1]);
        const title_no = queryString["title_no"];
        const episode_no = queryString["episode_no"];
        const episode_title = episode_url.split("/")[6];

        const objectId = ["c", title_no, episode_no].join("_");
        webcomic.addEpisode(
          objectId,
          episode_title,
          episode_url,
          assumedEpisodeSeq
        );
        assumedEpisodeSeq++;
      }
      setIntervalForProgressBar(Object.keys(webcomic.episodes).length);
      extractCommentsFromEpisode(webcomic, dictOfComics).then(() =>
        setProgressBarFull()
      );
    });
  });
}

async function getComicUrls() {
  const listOfComics = [];
  const dictOfComics = {};
  await client.get(
    `https://www.webtoons.com/${languageCode}/challenge/dashboard`,
    async function (response) {
      response = stringToHTML(response);

      const comicList = response.getElementById("_listUl").children;

      const number_of_comics_in_list = comicList.length;
      for (let i = 0; i < number_of_comics_in_list; i++) {
        const linkElement = comicList[i].getElementsByClassName("subj")[0];
        const anchor = linkElement.getElementsByTagName("a")[0];
        const comicUrl = anchor
          .getAttribute("data-challenge-url")
          .replace("/en/", `/${languageCode}/`);
        const comicTitle = anchor.innerText;
        const comicId = comicList[i].id.split("_")[2];
        const comic = new Comic(comicTitle, comicUrl, comicId);
        listOfComics.push(comic);
        dictOfComics[comicId] = comic;

        const comicFromStorage = localStorage.getItem(
          STORAGE_COMIC_KEY_PREFIX + comicId
        );

        if (comicId && !comicFromStorage) {
          localStorage.setItem(
            STORAGE_COMIC_KEY_PREFIX + comicId,
            JSON.stringify(comic)
          );
        }
      }

      localStorage.setItem(
        STORAGE_COMIC_LIST_KEY,
        JSON.stringify(listOfComics)
      );

      let selectedComicId = listOfComics[0].id;
      if (listOfComics.length > 1) {
        const tabRowId = "comicTabRow";
        const tabRowElement = document.getElementById(tabRowId);

        selectedComicId = window.location.href.split("#");
        selectedComicId = selectedComicId[1]
          .replace("incoming", "")
          .replace("_", "");
        if (selectedComicId === "") {
          selectedComicId = listOfComics[0].id;
        }

        if (!tabRowElement) {
          const commentSelectionTabSNB = addTabRow(tabRowId);

          if (window.location.href.includes(URL_SUFFIX))
            for (const comicFromList of listOfComics) {
              const tabElement = document.createElement("li");
              const comicHTMLElementId = "comic_" + comicFromList.id;
              tabElement.setAttribute("id", comicHTMLElementId);
              tabElement.setAttribute("comicId", comicFromList.id);
              if (selectedComicId === comicFromList.id)
                tabElement.setAttribute("class", "on");
              tabElement.addEventListener("click", function () {
                resetProgressBar();
                switchTabInRow(tabRowId, comicHTMLElementId);
                scanForEpisodes(dictOfComics[comicFromList.id], dictOfComics);
              });

              const comicAnchor = document.createElement("a");
              comicAnchor.innerText = comicFromList.title;
              comicAnchor.setAttribute(
                "href",
                URL_SUFFIX + "_" + comicFromList.id
              );
              tabElement.appendChild(comicAnchor);

              commentSelectionTabSNB.appendChild(tabElement);
            }
        }

        switchTabInRow(tabRowId, "comic_" + selectedComicId);
      }

      scanForEpisodes(dictOfComics[selectedComicId], dictOfComics);
    }
  );
}

window.getComments = function () {
  switchTabInRow("incoming_outgoing", "incoming_comments");
  getComicUrls().then();

  document.getElementById("commentList").replaceChildren();
  const moreButton = document.getElementsByClassName(
    "my_comment_button_list_more _moreCommentsButton"
  );
  if (moreButton.length > 0) removeNode(moreButton[0]);
  addBanner(document.getElementById("commentArea"));
  addProgressBar();
};
