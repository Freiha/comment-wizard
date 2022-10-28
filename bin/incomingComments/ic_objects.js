class Comment {
    constructor(comment) {
        this.regTime = comment.regTime;
        this.commentNo = comment.commentNo;
        this.objectId = comment.objectId;
        this.contents = comment.contents;
        this.sympathy = comment.sympathy;
        this.antipathy = comment.antipathy;
        this.sympathyCount = comment.sympathyCount;
        this.antipathyCount = comment.antipathyCount;
        this.replyCount = comment.replyCount;
        this.userName = comment.userName;
        this.comicId = comment.objectId.split("_")[1];
        this.deleted = comment.deleted;
        this.hiddenByCleanbot = comment.hiddenByCleanbot;
        this.userBlocked = comment.userBlocked;
        this.isTopComment = comment.isTopComment;
    }
}

class Episode {
    constructor(title, url, id, seq) {
        this.title = title;
        this.url = url;
        this.id = id;
        this.seq = seq;
        this.comments = [];
    }

    addComment(date, newComment, commentAsHTML) {
        this.comments.push(new Comment(date, newComment, commentAsHTML));
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
        this.episodes[episodeId] = new Episode(episodeTitle, episodeUrl, episodeId, episodeSeq);
    }

    updateEpisode(episode) {
        this.episodes[episode.id] = episode;
    }

    getEpisode(episodeId) {
        return this.episodes[episodeId];
    }
}

function updateCommentInEpisode(objectId, commentNo, voteStatus, newCount, newStatus) {
    const comicId = objectId.split("_")[1];
    const comic = JSON.parse(localStorage.getItem(STORAGE_COMIC_KEY_PREFIX + comicId));
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
            localStorage.setItem(STORAGE_COMIC_KEY_PREFIX + comic.id, JSON.stringify(comic));
        }
    }
}