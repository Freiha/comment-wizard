function getPaginationHTML(comicId, numberOfPages, currentPage) {
    const fromPage = Math.max(Math.ceil(currentPage / 10) * 10 - 9, 1)
    const toPage = Math.min(fromPage + 9, numberOfPages);

    let u_cbox_paginate = document.getElementsByClassName("u_cbox_paginate _paginateArea")[0];

    if (!u_cbox_paginate) {
        u_cbox_paginate = document.createElement('div');
        u_cbox_paginate.setAttribute("class", "u_cbox_paginate _paginateArea");
    } else {
        removeAllChildren(u_cbox_paginate);
    }

    const u_cbox_page_wrap = document.createElement('div');
    u_cbox_page_wrap.setAttribute("class", "u_cbox_page_wrap _pageWrap loaded");
    u_cbox_paginate.appendChild(u_cbox_page_wrap);

    if (currentPage > 1) {

        // GO TO FIRST PAGE
        const u_cbox_pre_a = document.createElement('a');
        u_cbox_pre_a.setAttribute("href", URL_SUFFIX + "_" + comicId);
        u_cbox_pre_a.setAttribute("class", "u_cbox_pre u_cbox_pre_end N=a:myc.page,g:en_en");
        u_cbox_pre_a.setAttribute("title", "Move to first page list");
        u_cbox_page_wrap.appendChild(u_cbox_pre_a);
        u_cbox_pre_a.addEventListener("click", function () {
            movePage(comicId, 1);
        });

        const u_cbox_ico_page_a = document.createElement('span');
        u_cbox_ico_page_a.setAttribute("class", "u_cbox_ico_page");
        u_cbox_pre_a.appendChild(u_cbox_ico_page_a);

        const u_cbox_cnt_page_a = document.createElement('span');
        u_cbox_cnt_page_a.setAttribute("class", "u_cbox_cnt_page");
        u_cbox_cnt_page_a.innerText = "First page";
        u_cbox_pre_a.appendChild(u_cbox_cnt_page_a);

        const u_vc_a = document.createElement('span');
        u_vc_a.setAttribute("class", "u_vc");
        u_vc_a.innerText = "Move to page list";
        u_cbox_pre_a.appendChild(u_vc_a);

        // GO TO NEXT 10TH PAGE
        if( fromPage > 1) {
            const u_cbox_pre = document.createElement('div');
            u_cbox_pre.setAttribute("class", "u_cbox_pre");
            u_cbox_pre.setAttribute("title", "Move to first page list");
			u_cbox_pre.style.cursor = "pointer";
            u_cbox_pre.addEventListener("click", function () {
                movePage(comicId, fromPage - 1);
            });
            u_cbox_page_wrap.appendChild(u_cbox_pre);

            const u_cbox_ico_page = document.createElement('span');
            u_cbox_ico_page.setAttribute("class", "u_cbox_ico_page");
            u_cbox_pre.appendChild(u_cbox_ico_page);

            const u_cbox_cnt_page = document.createElement('span');
            u_cbox_cnt_page.setAttribute("class", "u_cbox_cnt_page");
            u_cbox_cnt_page.innerText = "First page";
            u_cbox_pre.appendChild(u_cbox_cnt_page);

            const u_vc = document.createElement('span');
            u_vc.setAttribute("class", "u_vc");
            u_vc.innerText = "Move to page list";
            u_cbox_pre.appendChild(u_vc);
        }
    }

    for (let i = fromPage; i <= toPage; i++) {

        let u_cbox_page = document.createElement('a');
        u_cbox_page.setAttribute("href", URL_SUFFIX + "_" + comicId);
        u_cbox_page.setAttribute("class", "u_cbox_page N=a:myc.page,g:en_en first-child");

        if (i === currentPage) {
            u_cbox_page = document.createElement('strong');
            u_cbox_page.setAttribute("class", "u_cbox_page");
        }
        if (i === 0)
            u_cbox_page.classList.add("first-child");
        else if (i === numberOfPages)
            u_cbox_page.classList.add("last-child");
        u_cbox_page_wrap.appendChild(u_cbox_page);
        u_cbox_page.addEventListener("click", function () {
            movePage(comicId, i);
        });

        const u_cbox_num_page = document.createElement('span');
        u_cbox_num_page.setAttribute("class", "u_cbox_num_page");
        u_cbox_num_page.innerText = i.toString();
        u_cbox_page.appendChild(u_cbox_num_page);
        if (i === currentPage) {
            const u_vc = document.createElement('span');
            u_vc.setAttribute("class", "u_vc");
            u_vc.innerText = "Current Page";
            u_cbox_page.appendChild(u_vc);
        }
    }
    if (currentPage < numberOfPages) {
        if( toPage < numberOfPages) {
            // GO TO NEXT 10TH PAGE
            const u_cbox_next = document.createElement('div');
            u_cbox_next.setAttribute("class", "u_cbox_next");
            u_cbox_next.setAttribute("title", "Move to next page list");
			u_cbox_next.style.cursor = "pointer";
            u_cbox_next.addEventListener("click", function () {
                movePage(comicId, toPage + 1);
            });
            u_cbox_page_wrap.appendChild(u_cbox_next);
			
            const u_cbox_cnt_page_next = document.createElement('span');
            u_cbox_cnt_page_next.setAttribute("class", "u_cbox_cnt_page");
            u_cbox_cnt_page_next.innerText = "Next page";
            u_cbox_next.appendChild(u_cbox_cnt_page_next);

            const u_cbox_ico_page_next = document.createElement('span');
            u_cbox_ico_page_next.setAttribute("class", "u_cbox_ico_page");
            u_cbox_next.appendChild(u_cbox_ico_page_next);

            const u_vc_next = document.createElement('span');
            u_vc_next.setAttribute("class", "u_vc");
            u_vc_next.innerText = "Move to page list";
            u_cbox_next.appendChild(u_vc_next);
        }

        // GO TO LAST PAGE
        const u_cbox_next_a = document.createElement('a');
        u_cbox_next_a.setAttribute("href", URL_SUFFIX + "_" + comicId);
        u_cbox_next_a.setAttribute("class", "u_cbox_next u_cbox_next_end N=a:myc.page,g:en_en");
        u_cbox_next_a.setAttribute("title", "Move to last page list");
        u_cbox_next_a.setAttribute("data-log", "RPC.pglast");
        u_cbox_page_wrap.appendChild(u_cbox_next_a);
        u_cbox_next_a.addEventListener("click", function () {
            movePage(comicId, numberOfPages);
        });

        const u_cbox_cnt_page_a_next = document.createElement('span');
        u_cbox_cnt_page_a_next.setAttribute("class", "u_cbox_cnt_page");
        u_cbox_cnt_page_a_next.setAttribute("data-log", "RPC.pglast");
        u_cbox_cnt_page_a_next.innerText = "Last page";
        u_cbox_next_a.appendChild(u_cbox_cnt_page_a_next);

        const u_cbox_ico_page_a_next = document.createElement('span');
        u_cbox_ico_page_a_next.setAttribute("class", "u_cbox_ico_page");
        u_cbox_ico_page_a_next.setAttribute("data-log", "RPC.pglast");
        u_cbox_next_a.appendChild(u_cbox_ico_page_a_next);

        const u_vc_a_next = document.createElement('span');
        u_vc_a_next.setAttribute("class", "u_vc");
        u_vc_a_next.setAttribute("data-log", "RPC.pglast");
        u_vc_a_next.innerText = "Move to page list";
        u_cbox_next_a.appendChild(u_vc_a_next);
    }
    return u_cbox_paginate;
}

function movePage(comicId, pageNo) {
    setUpPageWithPagination(comicId, pageNo, false);
}

function discardDisabledComments(comment){
    if(switchOnFeature(KEY_DISCARD_DISABLED_COMMENTS)) {
        return comment.deleted || comment.hiddenByCleanbot || comment.userBlocked;
    }
    return false;
}

function clearCommentListAndBuildBasicHTML() {
    const u_cbox_list = buildBasicHTML();
    removeAllChildren(u_cbox_list);
    return u_cbox_list;
}

function setUpPageWithPagination(comicId, pageNo, initialPageLoad) {
    let allComments = [];

    const loadedComicObject = JSON.parse(localStorage.getItem(STORAGE_COMIC_KEY_PREFIX + comicId));
    for (const [_, entry] of Object.entries(loadedComicObject.episodes)) {
        allComments = [...allComments, ...entry.comments.flat(comment => comment).filter(comment => !discardDisabledComments(comment))];
    }

    const emptyListDiv = document.getElementById("emptyList");
    const u_cbox_list = clearCommentListAndBuildBasicHTML();
    if (allComments.length > 0) {
        if (emptyListDiv) {
            emptyListDiv.style.display = "none";
            u_cbox_list.appendChild(emptyListDiv);
        }

        allComments.sort((a, b) => (a.regTime < b.regTime ? 1 : -1));

        const numberOfPages = Math.ceil(allComments.length / NUMBER_OF_ELEMENTS_IN_PAGE);

        const u_cbox_wrap = document.getElementsByClassName("u_cbox_wrap")[0];
        if (u_cbox_wrap)
            u_cbox_wrap.appendChild(getPaginationHTML(comicId, numberOfPages, pageNo));

        const startIndex = NUMBER_OF_ELEMENTS_IN_PAGE * (pageNo - 1);
        let endIndex = NUMBER_OF_ELEMENTS_IN_PAGE + (NUMBER_OF_ELEMENTS_IN_PAGE * (pageNo - 1));
        if (allComments.length < endIndex)
            endIndex = allComments.length;
        const commentsOfPage = allComments.slice(startIndex, endIndex);

        for (const comment of commentsOfPage) {
            const episode = loadedComicObject.episodes[comment.objectId];
            buildAndAppendCommentHTML(u_cbox_list, comment, loadedComicObject, episode, false);
        }
        if (!initialPageLoad) {
            const logo = document.getElementsByClassName("logo")[0]
            logo.scrollIntoView();
        }
    } else {
        if (emptyListDiv) {
            emptyListDiv.style.display = "";
            u_cbox_list.appendChild(emptyListDiv);
            const dsc = document.getElementsByClassName('dsc')[0];
            dsc.innerText = "'" + loadedComicObject.title + "' does not have any comments yet.";

        } else {
            const no_comments_yet_text = document.createElement('div');
            no_comments_yet_text.setAttribute("class", "u_cbox_comment_box");
            no_comments_yet_text.style.textAlign = "center";
            no_comments_yet_text.style.fontSize = "20px";

            no_comments_yet_text.innerText = "'" + loadedComicObject.title + "' does not have any comments yet.";
            u_cbox_list.appendChild(no_comments_yet_text);
        }


    }
}