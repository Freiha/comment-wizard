class Comment {
  constructor(objectId, comment) {
    this.createdAt = new Date(parseInt(comment.createdAt));
    this.updatedAt = new Date(parseInt(comment.updatedAt));
    this.id = comment.id;
    this.objectId = objectId;
    this.body = comment.body;
    this.like = getReaction("like", comment.reactions);
    this.dislike = getReaction("dislike", comment.reactions);
    this.likeCount = getReactionCount("like", comment.reactions);
    this.dislikeCount = getReactionCount("dislike", comment.reactions);
    this.replyCount = comment.childPostCount;
    this.userName = comment.createdBy.name;
    this.comicId = objectId.split("_")[1];
    this.serviceTicketId = comment.serviceTicketId;
    this.isWritePostRestricted =
      comment.createdBy.restriction.isWritePostRestricted;
    this.isOwner = comment.isOwner;
  }
}

function getReaction(type, emotions) {
  const emotion = emotions.filter((obj) => {
    return obj.reactionId === "post_like";
  });
  if (emotion.length == 1) {
    const reaction = emotion[0].emotions.filter((obj) => {
      return obj.emotionId === type;
    });
    return reaction.length == 1 ? reaction[0].reacted : false;
  }
  return false;
}

function getReactionCount(type, emotions) {
  const emotion = emotions.filter((obj) => {
    return obj.reactionId === "post_like";
  });
  if (emotion.length == 1) {
    const reaction = emotion[0].emotions.filter((obj) => {
      return obj.emotionId === type;
    });
    return reaction.length == 1 ? reaction[0].count : 0;
  }
  return 0;
}

class Episode {
  constructor(title, url, id, seq) {
    this.title = title;
    this.url = url;
    this.id = id;
    this.seq = seq;
    this.comments = [];
  }

  addComment(objectId, comment) {
    this.comments.push(new Comment(objectId, comment));
  }
}

class Comic {
  constructor(title, url, id) {
    this.title = title;
    this.url = url;
    this.id = id;
    this.episodes = {};
  }

  addEpisode(episodeId, episodeTitle, episodeUrl, episodeSeq) {
    this.episodes[episodeId] = new Episode(
      episodeTitle,
      episodeUrl,
      episodeId,
      episodeSeq
    );
  }

  updateEpisode(episode) {
    this.episodes[episode.id] = episode;
  }

  getEpisode(episodeId) {
    return this.episodes[episodeId];
  }
}

function updateCommentInEpisode(
  objectId,
  commentNo,
  voteStatus,
  newCount,
  newStatus
) {
  const comicId = objectId.split("_")[1];
  const comic = JSON.parse(
    localStorage.getItem(STORAGE_COMIC_KEY_PREFIX + comicId)
  );
  const episode = comic.episodes[objectId];
  for (let i = 0; i < episode.comments.length; i++) {
    const comment = episode.comments[i];
    if (comment.commentNo === commentNo) {
      if (voteStatus === "SYMPATHY") {
        comment.sympathyCount = newCount;
        comment.sympathy = newStatus;
      } else {
        comment.antipathyCount = newCount;
        comment.antipathy = newStatus;
      }
      episode.comments[i] = comment;
      comic[objectId] = episode;
      localStorage.setItem(
        STORAGE_COMIC_KEY_PREFIX + comic.id,
        JSON.stringify(comic)
      );
    }
  }
}
