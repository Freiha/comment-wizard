function likeOrDislikeComment(thumbsButton, likeDislikeCounter, commentNo, objectId, voteStatus) {
    const likeDislike_request_url = "https://www.webtoons.com/comment/recommend";

    const params =
        {
            'ticket': 'webtoon',
            'lang': 'en',
            'pageSize': NUMBER_OF_ELEMENTS_IN_PAGE,
            'indexSize': '10',
            'commentNo': commentNo,
            'objectId': objectId,
            'voteStatus': voteStatus
        };

    const likeDislike_request_url_with_query = getURLWithQuery(likeDislike_request_url, params)

    client.get(likeDislike_request_url_with_query,
        function (response) {
            response = JSON.parse(response);

            if (response.success) {
                if (voteStatus === "SYMPATHY") {
                    const didLike = response.result.comment.sympathy;
                    likeDislikeCounter.innerText = response.result.comment.sympathyCount;
                    if (didLike)
                        thumbsButton.classList.add("u_cbox_btn_recomm_on");
                    else
                        thumbsButton.classList.remove("u_cbox_btn_recomm_on");

                    updateCommentInEpisode(objectId, commentNo, voteStatus, response.result.comment.sympathyCount, didLike);
                } else {
                    const didDislike = response.result.comment.antipathy;
                    likeDislikeCounter.innerText = response.result.comment.antipathyCount;
                    if (didDislike)
                        thumbsButton.classList.add("u_cbox_btn_unrecomm_on");
                    else
                        thumbsButton.classList.remove("u_cbox_btn_unrecomm_on");
                    updateCommentInEpisode(objectId, commentNo, voteStatus, response.result.comment.antipathyCount, didDislike);

                }
            } else {
                alert(response.message);
            }
        });
}

function applyLikeDislikeEventListener(thumbsButton, likeDislikeCounter, commentNo, objectId, voteStatus) {

    thumbsButton.addEventListener("click", function () {
        if(switchOnFeature(KEY_SETTING_LIKE_DISLIKE_INDICATOR)) {
            likeOrDislikeComment(thumbsButton, likeDislikeCounter, commentNo, objectId, voteStatus);
        } else {
            alert("You have to give Comment Wizard permission to read your authentication token to use this feature. \nYou can enable this in the extension settings. \nPlease read the tool tip of this setting before switching it on and/or check out Comment Wizard's web store page for further information!");
        }
    });
}