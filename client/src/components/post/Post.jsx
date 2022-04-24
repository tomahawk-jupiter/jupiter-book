import ThumbUp from "@mui/icons-material/ThumbUp";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { format } from "timeago.js";
import axiosInstance from "../../axios.config";
import Comment from "../comment/Comment";
import { UserContext } from "../../context/UserContext";
import Share from "../share/Share";
import FlashMessage from "../flashMessage/FlashMessage";

const PF = process.env.REACT_APP_PUBLIC_FOLDER;

const Post = ({ post }) => {
  const [postAuthor, setPostAuthor] = useState({});
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(post.likes.length);
  const [hasLiked, setHasLiked] = useState(false);
  const { user, newPost, isFetching, error, dispatch } =
    useContext(UserContext);

  /// See if the user already liked the post ///
  useEffect(() => {
    setHasLiked(post.likes.includes(user._id));
  }, [user._id, post.likes]);

  /// Get the posts author info ///
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/users/${post.authorId}`);
        setPostAuthor(res.data);
      } catch (err) {}
    };
    fetchUser();
  }, [post]);

  /// Incr or decr likes display and DB ///
  const handleLike = () => {
    if (post.authorId !== user._id) {
      try {
        axiosInstance.put(`posts/${post._id}/like`, { userId: user._id });
      } catch (err) {}
      setLikes(hasLiked ? likes - 1 : likes + 1);

      setHasLiked(!hasLiked);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get(`/posts/${post._id}/comments`);
      setComments(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    } catch (err) {}
  };

  /// Reload comments ///
  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [newPost]);

  /// Display and get comments when clicked ///
  const handleCommentDisplay = () => {
    fetchComments();
    setShowComments(!showComments);
  };

  /// Delete btn only renders if the post belongs to current user ///
  const handleDeletePost = async () => {
    dispatch({ type: "UPDATE_POSTS" });
    try {
      await axiosInstance.delete(`posts/${post._id}`, {
        data: {
          userId: user._id,
        },
      });

      dispatch({ type: "POSTS_SUCCESS" });
    } catch (err) {
      dispatch({ type: "POSTS_FAILURE", payload: err });
    }
  };

  return (
    <>
      <div className="postCard">
        <div className="postAuthorRow">
          <Link to={`/profile/${post.authorId}`}>
            <img
              src={
                postAuthor &&
                postAuthor.profilePicture &&
                postAuthor.profilePicture.url
                  ? postAuthor.profilePicture.url
                  : `${PF}noAvatar.png`
              }
              alt=""
              className="postAuthorImg"
            />
          </Link>
          <span className="postAuthor">{postAuthor.username}</span>
          <span className="timeAgo">{format(post.createdAt)}</span>
        </div>
        <div className="postContent">
          <span className="postText">{post.text}</span>
          <img
            src={post.img.url ? post.img.url : ""}
            alt=""
            className="postImg"
          />
        </div>
        <div className="postBottom">
          <div className="postLikes">
            <ThumbUp onClick={handleLike} className="thumbIcon" />
            <span>{likes} likes</span>
          </div>
          <Button onClick={handleCommentDisplay}>
            {post.comments.length} comments
          </Button>
        </div>
        <div className="commentsContainer">
          {showComments && <Share shareType={"comment"} postId={post._id} />}
          {showComments &&
            comments.map((comment) => {
              return <Comment key={comment._id} comment={comment} />;
            })}
        </div>
        <hr />
        {user._id === post.authorId && (
          <Button
            style={{ color: "red" }}
            disabled={isFetching}
            onClick={handleDeletePost}
          >
            {isFetching ? "Loading..." : "Delete"}
          </Button>
        )}
        {error && <FlashMessage type="error" msg="Delete failed" />}
      </div>
    </>
  );
};

export default Post;
