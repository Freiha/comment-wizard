function getReplies(u_cbox_comment, comic, episode, parentCommentNo, objectId) {


    const u_cbox_btn_reply = u_cbox_comment.getElementsByClassName("u_cbox_btn_reply _btnReply N=a:myc.reply,g:en_en")[0];

    if (u_cbox_btn_reply.classList.contains("u_cbox_btn_reply_on")) {
        u_cbox_btn_reply.classList.remove("u_cbox_btn_reply_on");

        const replyBox = u_cbox_comment.getElementsByClassName("u_cbox_reply_area _replyArea")[0];//childNodes.querySelector("[data-object-id='" + episode.id + "']");
        u_cbox_comment.removeChild(replyBox);
    } else {
        const reply_request_url = "https://www.webtoons.com/comment/list";
        const params =
            {
                'lang': 'en',
                'ticket': 'webtoon',
                'pageSize': NUMBER_OF_ELEMENTS_IN_PAGE,
                'indexSize': '10',
                'page': '1',
                'parentCommentNo': parentCommentNo,
                'objectId': objectId
            };

        const reply_request_url_with_query = getURLWithQuery(reply_request_url, params);

        client.get(reply_request_url_with_query,
            function (response) {

                u_cbox_btn_reply.classList.add("u_cbox_btn_reply_on");

                const u_cbox_reply_area = document.createElement('div');
                u_cbox_reply_area.setAttribute("class", "u_cbox_reply_area _replyArea");
                u_cbox_comment.appendChild(u_cbox_reply_area);

                const u_cbox_list = document.createElement('ul');
                u_cbox_list.setAttribute("class", "u_cbox_list _replyList");
                u_cbox_reply_area.appendChild(u_cbox_list);

                response = JSON.parse(response);
                for (const comment of response.result.commentList) {
                    buildAndAppendCommentHTML(u_cbox_list, comment, comic, episode, true);
                }
            });
    }
}

function applyGetRepliesEventListener(u_cbox_btn_reply, u_cbox_comment, comic, episode, parentCommentNo, objectId) {
    u_cbox_btn_reply.addEventListener("click", function () {
        getReplies(u_cbox_comment, comic, episode, parentCommentNo, objectId);
    });
}