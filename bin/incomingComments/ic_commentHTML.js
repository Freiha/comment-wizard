function buildAndAppendCommentHTML(
  u_cbox_list,
  comment,
  comic,
  episode,
  isReply
) {
  const commentContents = comment.contents.deentitize();
  const userName = comment.userName.deentitize();
  const commentNo = comment.commentNo;
  const objectId = comment.objectId;
  const regTime = getDateString(comment.regTime);
  const sympathyCount = comment.sympathyCount;
  const didLike = comment.sympathy;
  const antipathyCount = comment.antipathyCount;
  const didDislike = comment.antipathy;
  const replyCount = comment.replyCount;
  const isTopComment = comment.isTopComment ? comment.isTopComment : false;

  const episodeSeq = episode.seq;

  const u_cbox_comment = document.createElement("li");
  u_cbox_comment.setAttribute("class", "u_cbox_comment _commentItem");
  u_cbox_comment.setAttribute("data-comment-no", commentNo);
  u_cbox_comment.setAttribute("data-object-id", objectId);
  u_cbox_list.appendChild(u_cbox_comment);

  const u_cbox_comment_box = document.createElement("div");
  u_cbox_comment_box.setAttribute("class", "u_cbox_comment_box");
  u_cbox_comment.appendChild(u_cbox_comment_box);

  if (isReply) {
    const u_cbox_ico_reply = document.createElement("span");
    u_cbox_ico_reply.setAttribute("class", "u_cbox_ico_reply");
    u_cbox_comment_box.appendChild(u_cbox_ico_reply);
  }

  const u_cbox_area = document.createElement("div");
  u_cbox_area.setAttribute("class", "u_cbox_area");
  u_cbox_comment_box.appendChild(u_cbox_area);

  if (isReply) {
    const u_cbox_info = document.createElement("div");
    u_cbox_info.setAttribute("class", "u_cbox_info");
    u_cbox_area.append(u_cbox_info);

    const u_cbox_info_main = document.createElement("span");
    u_cbox_info_main.setAttribute("class", "u_cbox_info_main");
    u_cbox_info.append(u_cbox_info_main);

    const u_cbox_name = document.createElement("span");
    u_cbox_name.setAttribute("class", "u_cbox_name");
    u_cbox_name.innerText = userName;
    u_cbox_info_main.append(u_cbox_name);
  } else {
    const my_cbox_title = document.createElement("div");
    my_cbox_title.setAttribute("class", "my_cbox_title");
    u_cbox_area.append(my_cbox_title);

    const anchor_to_comment = document.createElement("a");
    anchor_to_comment.setAttribute("class", "N=a:myc.type,g:en_en");
    anchor_to_comment.innerText = userName + " left a comment on";
    anchor_to_comment.setAttribute(
      "href",
      episode.url + "&comment_no=" + commentNo
    );
    my_cbox_title.appendChild(anchor_to_comment);

    const barElement = document.createElement("span");
    barElement.setAttribute("class", "bar");
    barElement.innerText = "|";
    my_cbox_title.appendChild(barElement);

    const anchor_to_episode = document.createElement("a");
    anchor_to_episode.setAttribute("href", episode.url);
    anchor_to_episode.setAttribute("class", "N=a:myc.type,g:en_en");
    my_cbox_title.appendChild(anchor_to_episode);

    const ellipsis = document.createElement("span");
    ellipsis.setAttribute("class", "ellipsis");
    ellipsis.innerText = comic.title;
    anchor_to_episode.appendChild(ellipsis);

    const sub_num = document.createElement("span");
    sub_num.setAttribute("class", "sub_num");
    sub_num.innerText = "# " + episodeSeq;
    anchor_to_episode.appendChild(sub_num);
  }

  const u_cbox_text_wrap = document.createElement("div");
  u_cbox_text_wrap.setAttribute("class", "u_cbox_text_wrap");
  u_cbox_area.appendChild(u_cbox_text_wrap);

  if (isTopComment) {
    const u_cbox_ico_best = document.createElement("span");
    u_cbox_ico_best.setAttribute("class", "u_cbox_ico_best");
    u_cbox_ico_best.innerText = "TOP";
    u_cbox_text_wrap.appendChild(u_cbox_ico_best);
  }

  const u_cbox_contents = document.createElement("span");
  u_cbox_contents.setAttribute("class", "u_cbox_contents");
  u_cbox_contents.innerText = commentContents;
  u_cbox_text_wrap.appendChild(u_cbox_contents);

  const u_cbox_info_base = document.createElement("div");
  u_cbox_info_base.setAttribute("class", "u_cbox_info_base");
  u_cbox_area.appendChild(u_cbox_info_base);

  const u_cbox_date = document.createElement("span");
  u_cbox_date.setAttribute("class", "u_cbox_date");
  u_cbox_date.innerText = regTime;
  u_cbox_info_base.appendChild(u_cbox_date);

  const u_cbox_tool = document.createElement("div");
  u_cbox_tool.setAttribute("class", "u_cbox_tool");
  u_cbox_area.appendChild(u_cbox_tool);

  if (!isReply && replyCount > 0) {
    const u_cbox_btn_reply = document.createElement("a");
    u_cbox_btn_reply.setAttribute(
      "class",
      "u_cbox_btn_reply _btnReply N=a:myc.reply,g:en_en"
    );
    u_cbox_btn_reply.setAttribute("href", URL_SUFFIX);
    u_cbox_btn_reply.setAttribute("data-parent-comment-no", commentNo);
    u_cbox_btn_reply.setAttribute("data-object-id", objectId);
    u_cbox_btn_reply.setAttribute("data-reply-count", replyCount);
    u_cbox_tool.appendChild(u_cbox_btn_reply);
    applyGetRepliesEventListener(
      u_cbox_btn_reply,
      u_cbox_comment,
      comic,
      episode,
      commentNo,
      objectId
    );

    const u_cbox_reply_txt = document.createElement("strong");
    u_cbox_reply_txt.setAttribute("class", "u_cbox_reply_txt");
    u_cbox_reply_txt.innerText = "Replies";
    u_cbox_btn_reply.appendChild(u_cbox_reply_txt);

    const u_cbox_reply_cnt = document.createElement("span");
    u_cbox_reply_cnt.setAttribute("class", "u_cbox_reply_cnt");
    u_cbox_reply_cnt.innerText = replyCount;
    u_cbox_btn_reply.appendChild(u_cbox_reply_cnt);
  }

  const u_cbox_recomm_set = document.createElement("div");
  u_cbox_recomm_set.setAttribute("class", "u_cbox_recomm_set _likeArea");
  u_cbox_tool.appendChild(u_cbox_recomm_set);

  const u_vc = document.createElement("strong");
  u_vc.setAttribute("class", "u_vc");
  u_vc.innerText = "Like/Dislike";
  u_cbox_recomm_set.appendChild(u_vc);

  const u_cbox_btn_recomm = document.createElement("a");
  u_cbox_btn_recomm.setAttribute("href", URL_SUFFIX);
  if (didLike)
    u_cbox_btn_recomm.setAttribute(
      "class",
      "u_cbox_btn_recomm _btnLike N=a:myc.rpup,g:en_en u_cbox_btn_recomm_on"
    );
  else u_cbox_btn_recomm.setAttribute("class", "u_cbox_btn_recomm  _btnLike");

  u_cbox_btn_recomm.setAttribute("title", "");
  u_cbox_recomm_set.appendChild(u_cbox_btn_recomm);

  const u_cbox_ico_recomm = document.createElement("span");
  u_cbox_ico_recomm.setAttribute("class", "u_cbox_ico_recomm");
  u_cbox_ico_recomm.innerText = "Like";
  u_cbox_btn_recomm.appendChild(u_cbox_ico_recomm);

  const u_cbox_cnt_recomm = document.createElement("em");
  u_cbox_cnt_recomm.setAttribute("class", "u_cbox_cnt_recomm _countArea");
  u_cbox_cnt_recomm.innerText = sympathyCount;
  u_cbox_btn_recomm.appendChild(u_cbox_cnt_recomm);
  applyLikeDislikeEventListener(
    u_cbox_btn_recomm,
    u_cbox_cnt_recomm,
    commentNo,
    objectId,
    "SYMPATHY"
  );

  const u_cbox_btn_unrecomm = document.createElement("a");
  u_cbox_btn_unrecomm.setAttribute("href", URL_SUFFIX);
  if (didDislike)
    u_cbox_btn_unrecomm.setAttribute(
      "class",
      "u_cbox_btn_unrecomm _btnDislike N=a:myc.rpdown,g:en_en u_cbox_btn_unrecomm_on"
    );
  else
    u_cbox_btn_unrecomm.setAttribute(
      "class",
      "u_cbox_btn_unrecomm  _btnDislike"
    );
  u_cbox_btn_unrecomm.setAttribute("title", "");
  u_cbox_recomm_set.appendChild(u_cbox_btn_unrecomm);

  const u_cbox_ico_unrecomm = document.createElement("span");
  u_cbox_ico_unrecomm.setAttribute("class", "u_cbox_ico_unrecomm");
  u_cbox_ico_unrecomm.innerText = "Dislike";
  u_cbox_btn_unrecomm.appendChild(u_cbox_ico_unrecomm);

  const u_cbox_cnt_unrecomm = document.createElement("em");
  u_cbox_cnt_unrecomm.setAttribute("class", "u_cbox_cnt_unrecomm _countArea");
  u_cbox_cnt_unrecomm.innerText = antipathyCount;
  u_cbox_btn_unrecomm.appendChild(u_cbox_cnt_unrecomm);
  applyLikeDislikeEventListener(
    u_cbox_btn_unrecomm,
    u_cbox_cnt_unrecomm,
    commentNo,
    objectId,
    "ANTIPATHY"
  );
}

function buildBasicHTML() {
  const my_comments_wrap =
    document.getElementsByClassName("my_comments_wrap")[0];

  let u_cbox_list = document.getElementsByClassName(
    "u_cbox_list _commentList"
  )[0];
  let commentArea = document.getElementById("commentArea");
  if (!commentArea) {
    commentArea = document.createElement("div");
    commentArea.setAttribute("class", "my_comments");
    commentArea.setAttribute("id", "commentArea");
    commentArea.setAttribute("style", "");
    my_comments_wrap.appendChild(commentArea);

    const u_cbox = document.createElement("div");
    u_cbox.setAttribute("class", "u_cbox");
    u_cbox.setAttribute("id", "typeSocial");
    u_cbox.setAttribute("style", "display: block");
    commentArea.appendChild(u_cbox);

    const u_cbox_wrap = document.createElement("div");
    u_cbox_wrap.setAttribute("class", "u_cbox_wrap");
    u_cbox.appendChild(u_cbox_wrap);

    const u_cbox_content_wrap = document.createElement("div");
    u_cbox_content_wrap.setAttribute("class", "u_cbox_content_wrap");
    u_cbox_wrap.appendChild(u_cbox_content_wrap);

    u_cbox_list = document.createElement("ul");
    u_cbox_list.setAttribute("class", "u_cbox_list _commentList");
    u_cbox_content_wrap.appendChild(u_cbox_list);
  }
  addProgressBar();

  return u_cbox_list;
}
