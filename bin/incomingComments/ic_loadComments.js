let numberOfEpisodesLeft = 0;

async function extractCommentsFromEpisode(comic, dictOfComics) {

    clearCommentListAndBuildBasicHTML();

    const webcomicInStorage = JSON.parse(localStorage.getItem(STORAGE_COMIC_KEY_PREFIX + comic.id));

    numberOfEpisodesLeft = Object.keys(comic.episodes).length;

    if (isRecrawlPossible() || !webcomicInStorage || (Object.keys(webcomicInStorage.episodes).length < Object.keys(comic.episodes).length)) {
        let associatedComic = "";
        window.processComments = function (data) {
            numberOfEpisodesLeft -= 1;
            const completeCommentList = [
                ...data.result.bestList.map( comment => ({...comment, isTopComment: true})),
                ...data.result.commentList.map( comment => ({...comment, isTopComment: false}))
            ];
            if (completeCommentList.length > 0) {
                const objectId = completeCommentList[0].objectId;
                const comicId = objectId.split("_")[1];
                associatedComic = dictOfComics[comicId];
                const episode = associatedComic.getEpisode(objectId);
                for (const comment of completeCommentList) {
                    if (comment.userName !== "") {
                        episode.addComment(comment);
                    }
                }
                associatedComic.updateEpisode(episode);
                if (associatedComic.id) {
                    localStorage.setItem(STORAGE_COMIC_KEY_PREFIX + associatedComic.id, JSON.stringify(associatedComic));
                    if(numberOfEpisodesLeft <= 0){
                        setUpPageWithPagination(associatedComic.id, 1, true);
                    }
                }
                localStorage.setItem(STORAGE_LAST_CRAWL_KEY, new Date().toISOString());
                const scriptElem = document.getElementById("fetch_comments_script_" + objectId);
                scriptElem.parentElement.removeChild(scriptElem);
            } else {
                let comicId = window.location.href.split("#")[1].split("_")[1];
                if (!comicId) {
                    comicId = comic.id;
                }
                if(numberOfEpisodesLeft <= 0) {
                    setUpPageWithPagination(comicId, 0, true);
                }

            }
            updateProgressBar();
        };
        const comment_request_url = "https://global.apis.naver.com/commentBox/cbox/web_neo_list_jsonp.json";

        const commentRequests = document.createElement("div");
        commentRequests.setAttribute("class", "comments::" + comic.title.replaceAll(" ", "_"));
        document.body.appendChild(commentRequests);

        for (const entry of Object.entries(comic.episodes)) {
            await sleep(FETCH_DELAY);
            const params =
                {
                    'ticket': 'webtoon',
                    'templateId': `ch_${window.getCookie('locale')}`,
                    'pool': 'cbox',
                    '_wr': '',
                    'lang': window.getCookie('locale'),
                    '_callback': 'processComments',
                    // 'country': '',
                    // 'categoryId': '',
                    // 'initialize': 'true',
                    // 'groupId': '',
                    // 'indexSize': '10',
                    // 'listType': 'OBJECT',
                    // 'page': '1',
                    // 'pageSize': '150',
                    // 'pageType': 'default',
                    // 'userType': 'MANAGER',
                    // 'replyPageSize': '100',
                    // 'snsCode': 'email',
                    // 'sort': 'new',
                    // 'useAltSort': 'true',
                    'token': switchOnFeature(KEY_SETTING_LIKE_DISLIKE_INDICATOR) ? window.getCookie('NEO_SES').replaceAll('"', '') : "",
                    'objectId': entry[0],
                    'consumerKey': 'BiqLr39tq3iAWWxuiOXg'
                };

            const comment_request_url_with_query = getURLWithQuery(comment_request_url, params);
            const comments = document.createElement("script");
            comments.setAttribute("type", "text/javascript");
            comments.setAttribute("id", "fetch_comments_script_" + entry[0]);
            comments.setAttribute("object_id", entry[0]);
            comments.src = comment_request_url_with_query;
            commentRequests.appendChild(comments);
        }
    } else {
        setUpPageWithPagination(comic.id, 1, true);
    }
}

function getTitleEpisodeInfoAndExtractComments(objectIdsJsonList, objectId_url_dict, webcomic, dictOfComics) {
    const objectIdsJson = new FormData();
    objectIdsJson.append("objectIdsJson", JSON.stringify(objectIdsJsonList));
    client.get("https://www.webtoons.com/comment/titleEpisodeInfo", function (response) {
        const result = JSON.parse(response).result;

        for (const [objectId, episodeInfo] of Object.entries(result)) {
            webcomic.addEpisode(objectId, episodeInfo.episodeTitle, objectId_url_dict[objectId], episodeInfo.episodeSeq);
        }
        setIntervalForProgressBar(Object.keys(webcomic.episodes).length);
        extractCommentsFromEpisode(webcomic, dictOfComics).then(
            () => setProgressBarFull()
        );
    }, "POST", objectIdsJson);
}

function scanForURLs(webcomic, dictOfComics) {

    client.get(webcomic.url, function (response) {
        response = stringToHTML(response);
        let latest_episode = response.getElementById("_listUl").getElementsByTagName("li")[0];
        const latest_episode_url = latest_episode.children[0].href.replace("/en/", `/${languageCode}/`);

        client.get(latest_episode_url, function (response) {
            response = stringToHTML(response);
            let episode_list = response.getElementById("topEpisodeList");
            episode_list = episode_list.getElementsByTagName("li");

            const objectIdsJsonList = [];
            const objectId_url_dict = [];

            for (const item of episode_list) {
                const queryString = getQueryStrings(item.children[0].href.split("?")[1]);
                const title_no = queryString['title_no'];
                const episode_no = queryString['episode_no'];
                const objectId = ["c", title_no, episode_no].join("_");

                objectIdsJsonList.push(objectId);
                objectId_url_dict[objectId] = item.children[0].href.replace("/en/", `/${languageCode}/`);
            }
            getTitleEpisodeInfoAndExtractComments(objectIdsJsonList, objectId_url_dict, webcomic, dictOfComics);
        });
    });
}

async function getComicUrls() {
    const listOfComics = [];
    const dictOfComics = {};
    await client.get(`https://www.webtoons.com/${languageCode}/challenge/dashboard`, async function (response) {
        response = stringToHTML(response);

        const comicList = response.getElementById("_listUl").children;

        const number_of_comics_in_list = comicList.length;
        for (let i = 0; i < number_of_comics_in_list; i++) {

            const linkElement = comicList[i].getElementsByClassName("subj")[0];
            const anchor = linkElement.getElementsByTagName("a")[0];
            const comicUrl = anchor.href.replace("/en/", `/${languageCode}/`);
            const comicTitle = anchor.innerText;
            const comicId = comicList[i].id.split("_")[2];
            const comic = new Comic(comicTitle, comicUrl, comicId);
            listOfComics.push(comic);
            dictOfComics[comicId] = comic;

            const comicFromStorage = localStorage.getItem(STORAGE_COMIC_KEY_PREFIX + comicId);

            if (comicId && !comicFromStorage) {
                localStorage.setItem(STORAGE_COMIC_KEY_PREFIX + comicId, JSON.stringify(comic));
            }
        }

        localStorage.setItem(STORAGE_COMIC_LIST_KEY, JSON.stringify(listOfComics));

        let selectedComicId = listOfComics[0].id;
        if (listOfComics.length > 1) {
            const tabRowId = "comicTabRow";
            const tabRowElement = document.getElementById(tabRowId);

            selectedComicId = window.location.href.split("#")
            selectedComicId = selectedComicId[1].replace("incoming", "").replace("_", "");
            if (selectedComicId === "") {
                selectedComicId = listOfComics[0].id;
            }

            if (!tabRowElement) {

                const commentSelectionTabSNB = addTabRow(tabRowId);


                if (window.location.href.includes(URL_SUFFIX))
                    for (const comicFromList of listOfComics) {
                        const tabElement = document.createElement('li');
                        const comicHTMLElementId = "comic_" + comicFromList.id;
                        tabElement.setAttribute("id", comicHTMLElementId);
                        tabElement.setAttribute("comicId", comicFromList.id);
                        if (selectedComicId === comicFromList.id)
                            tabElement.setAttribute("class", "on");
                        tabElement.addEventListener("click", function () {
                            resetProgressBar();
                            switchTabInRow(tabRowId, comicHTMLElementId);
                            scanForURLs(dictOfComics[comicFromList.id], dictOfComics);
                        });

                        const comicAnchor = document.createElement('a');
                        comicAnchor.innerText = comicFromList.title;
                        comicAnchor.setAttribute("href", URL_SUFFIX + "_" + comicFromList.id);
                        tabElement.appendChild(comicAnchor);

                        commentSelectionTabSNB.appendChild(tabElement);
                    }
            }

            switchTabInRow(tabRowId, "comic_" + selectedComicId);
        }

        scanForURLs(dictOfComics[selectedComicId], dictOfComics);
    });
}

window.getComments = function () {
    switchTabInRow("incoming_outgoing", "incoming_comments");
    getComicUrls();
    const commentsWrap = document.getElementsByClassName("my_comments_wrap")[0];

    const commentArea = document.getElementById("commentArea");
    if (commentArea)
        commentsWrap.removeChild(commentArea);
    const pagination = document.getElementsByClassName("u_cbox_paginate _paginateArea")[0];
    if (pagination)
        pagination.parentElement.removeChild(pagination);
}