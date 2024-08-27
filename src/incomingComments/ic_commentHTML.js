function buildAndAppendHTML(comicId) {
  const commentList = document.getElementById("commentList");

  addProgressBar();

  const loadedComicObject = JSON.parse(
    localStorage.getItem(STORAGE_COMIC_KEY_PREFIX + comicId)
  );
  let allComments = [];
  for (const [_, entry] of Object.entries(loadedComicObject.episodes)) {
    allComments = [
      ...allComments,
      ...entry.comments
        .flat((comment) => comment)
        .filter((comment) => !discardDisabledComments(comment)),
    ];
  }

  allComments.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  for (const comment of allComments) {
    const episode = loadedComicObject.episodes[comment.objectId];
    commentList.appendChild(
      buildCommentHTML(comment, loadedComicObject, episode, false)
    );
  }
}

function discardDisabledComments(comment) {
  if (switchOnFeature(KEY_DISCARD_DISABLED_COMMENTS)) {
    return comment.isWritePostRestricted;
  }
  return false;
}

function buildCommentHTML(comment, comic, episode, isReply) {
  const body = comment.body.deentitize();
  const userName = comment.userName.deentitize();
  const commentId = comment.id;
  const objectId = comment.objectId;
  const createdAt = getDateString(comment.createdAt);
  const likeCount = comment.likeCount;
  const liked = comment.like;
  const dislikeCount = comment.dislikeCount;
  const disliked = comment.dislike;
  const replyCount = comment.replyCount;
  const serviceTicketId = comment.serviceTicketId;
  const isOwner = comment.isOwner;

  const episodeUrl = episode.url;
  const episodeTitle = episode.title;
  const episodeSeq = episode.seq;

  const my_comment_item = document.createElement("li");
  my_comment_item.setAttribute("class", "my_comment_item _commentItem ");
  my_comment_item.setAttribute("data-id", commentId);
  my_comment_item.setAttribute("data-service-ticket-id", serviceTicketId);
  my_comment_item.setAttribute("data-dim-and-remove-links", "false");

  // EPISODE TITLE
  const my_comment_name = document.createElement("div");
  my_comment_name.setAttribute("class", "my_comment_name");
  my_comment_item.appendChild(my_comment_name);

  const goToEpisodeViewerLink = document.createElement("a");
  goToEpisodeViewerLink.setAttribute("class", "_goToEpisodeViewerLink");
  goToEpisodeViewerLink.innerText =
    userName + " left a comment on " + episodeTitle;
  goToEpisodeViewerLink.setAttribute("href", episodeUrl);
  my_comment_name.appendChild(goToEpisodeViewerLink);

  // COMMENT TEXT
  const my_comment_text = document.createElement("div");
  my_comment_text.setAttribute("class", "my_comment_text _commentText");
  my_comment_item.append(my_comment_text);

  const commentTextInner = document.createElement("a");
  commentTextInner.setAttribute("class", "_commentTextInner _goToCommentLink");
  commentTextInner.innerText = body;
  commentTextInner.setAttribute("href", episodeUrl + "&cursorId=" + commentId);
  my_comment_text.appendChild(commentTextInner);

  // TODO button "more"

  // TODO Taglist

  // DATE
  const date = document.createElement("a");
  date.setAttribute("class", "link _goToCommentLink");
  date.setAttribute("href", episodeUrl + "&cursorId=" + commentId);
  my_comment_item.appendChild(date);

  const my_comment_date = document.createElement("span");
  date.setAttribute("class", "my_comment_date");
  date.innerText = createdAt;
  date.appendChild(my_comment_date);

  // REPLIES
  const my_comment_button_wrap = document.createElement("div");
  my_comment_button_wrap.setAttribute("class", "my_comment_button_wrap");
  my_comment_item.append(my_comment_button_wrap);

  const replyToggleButton = document.createElement("button");
  replyToggleButton.setAttribute(
    "class",
    "my_comment_button type_reply _replyToggleButton"
  );
  replyToggleButton.setAttribute("aria-expanded", "false");
  replyToggleButton.setAttribute("aria-controls", "replies_" + commentId);
  replyToggleButton.innerText = " Replies " + replyCount + " ";
  my_comment_button_wrap.appendChild(replyToggleButton);

  const likeButton = document.createElement("button");
  likeButton.setAttribute("class", "my_comment_button type_like _likeButton");
  likeButton.setAttribute("data-is-owner", isOwner);
  likeButton.innerText = likeCount;
  likeButton.style.pointerEvents = "none";
  if (liked) {
    likeButton.style.color = "#00dc64";
    likeButton.style.border = "solid #00dc64";
  }
  my_comment_button_wrap.appendChild(likeButton);

  const dislikeButton = document.createElement("button");
  dislikeButton.setAttribute(
    "class",
    "my_comment_button type_dislike _dislikeButton"
  );
  dislikeButton.setAttribute("data-is-owner", isOwner);
  dislikeButton.innerText = dislikeCount;
  dislikeButton.style.pointerEvents = "none";
  if (disliked) {
    dislikeButton.style.color = "#00dc64";
    dislikeButton.style.border = "solid #00dc64";
  }
  my_comment_button_wrap.appendChild(dislikeButton);

  return my_comment_item;
}
