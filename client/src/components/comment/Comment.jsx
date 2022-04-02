import { Link } from "react-router-dom";
import { format } from "timeago.js";
import axios from "axios";
import { useState, useEffect } from "react";
const PF = process.env.REACT_APP_PUBLIC_FOLDER;

const Comment = ({ comment }) => {
  const [commentAuthor, setCommentAuthor] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios(`/users/${comment.authorId}`);
      setCommentAuthor(res.data);
    };

    fetchUser();
  }, []);
  return (
    <div className="commentCard">
      <div className="postAuthorRow">
        <Link to={`/profile/${comment.authorId}`}>
          <img
            src={
              commentAuthor &&
              commentAuthor.profilePicture &&
              commentAuthor.profilePicture.url
                ? commentAuthor.profilePicture.url
                : `${PF}noAvatar.png`
            }
            alt=""
            className="postAuthorImg"
          />
        </Link>
        <span className="postAuthor smText">{commentAuthor.username}</span>
        <span className="timeAgo smText">{format(comment.createdAt)}</span>
      </div>
      <div className="postContent">
        <span className="postText smText">{comment.text}</span>
      </div>
    </div>
  );
};

export default Comment;
