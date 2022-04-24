import { Button, Input } from "@mui/material";
import { Cancel, PermMedia } from "@mui/icons-material";
import axiosInstance from "../../axios.config";
import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import "./share.css";
import FlashMessage from "../flashMessage/FlashMessage";
const PF = process.env.REACT_APP_PUBLIC_FOLDER;

/**
 * RELOADING POSTS WHEN A NEW ONE IS ADDED
 *
 * There is a CONTEXT value and REDUCER that increments a count
 * when the user shares ( ie. creates a new post).
 * The feed component has a useEffect that will get the posts again
 * when the newPost CONTEXT changes.
 */

const Share = ({ postId }) => {
  const { user, isFetching, dispatch } = useContext(UserContext);
  const shareText = useRef();
  const [base64Img, setBase64Img] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file.size > 5242880) {
      setErrMessage("Max file size of 5 MB exceeded");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setBase64Img(reader.result);
    };
  };

  const handleShare = async () => {
    setSuccessMessage("");
    setErrMessage("");

    try {
      dispatch({ type: "UPDATE_POSTS" });

      if (postId) {
        const newPost = {
          authorId: user._id,
          text: shareText.current.value,
        };
        const res = await axiosInstance.put(
          `/posts/${postId}/comment`,
          newPost
        );
      } else {
        const newPost = {
          authorId: user._id,
          text: shareText.current.value,
          base64Img: base64Img,
        };
        const res = await axiosInstance.post("/posts", newPost);
        setSuccessMessage("Post successful!");
        setBase64Img("");
      }
      /// Clear the text input after post ///
      shareText.current.value = "";
      /// This will increment the newPost count ///
      dispatch({ type: "POSTS_SUCCESS" });
    } catch (err) {
      setErrMessage("Something went wrong");
    }
  };

  return (
    <div className="shareComponent">
      <div className="shareInputRow">
        <Link to={`/profile/${user._id}`}>
          <img
            src={
              user.profilePicture.url
                ? user.profilePicture.url
                : `${PF}noAvatar.png`
            }
            alt=""
            className="shareProfileImg"
          />
        </Link>
        <Input
          placeholder={postId ? "Add a comment..." : "Whats on your mind?"}
          style={{ width: "100%" }}
          inputRef={shareText}
        />
      </div>

      {!postId && (
        <label
          className="addImgLabel"
          htmlFor="file"
          onClick={() => setErrMessage("")}
        >
          <PermMedia />
          <span>Upload image</span>
          <input
            type="file"
            accept=".png, .jpeg, .jpg"
            name="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </label>
      )}

      {errMessage && <FlashMessage type="error" msg={errMessage} />}
      {successMessage && <FlashMessage type="success" msg={successMessage} />}

      {base64Img && (
        <div className="previewImageContainer">
          <img className="previewImage" src={base64Img} alt="" />
          <Cancel
            className="clearPreviewImg"
            onClick={() => setBase64Img("")}
          />
        </div>
      )}

      <Button onClick={handleShare}>
        {isFetching ? "Loading..." : postId ? "Share comment" : "Share post"}
      </Button>
    </div>
  );
};

export default Share;
