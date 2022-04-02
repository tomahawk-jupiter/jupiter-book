import { PermMedia } from "@mui/icons-material";
import { Button } from "@mui/material";
import axios from "axios";
import { useContext, useRef, useState } from "react";
import { UserContext } from "../../context/UserContext";
import "./editProfile.css";

const EditProfile = ({ profileId }) => {
  const { user, isFetching, dispatch } = useContext(UserContext);
  const [profileImgIsUrl, setProfileImgIsUrl] = useState(true);
  const [bgImgIsUrl, setBgImgIsUrl] = useState(true);
  const [profileImgPreview, setProfileImgPreview] = useState("");
  const [backgroundImgPreview, setBackgroundImgPreview] = useState("");

  const username = useRef();
  const location = useRef();
  const profileUrl = useRef();
  const backgroundUrl = useRef();

  const convertToBase64 = (e) => {
    const file = e.target.files[0];

    if (file.size > 5242880) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (e.target.id === "profileImg") {
        setProfileImgIsUrl(false);
        setProfileImgPreview(reader.result);
        return;
      }
      if (e.target.id === "backgroundImg") {
        setBgImgIsUrl(false);
        setBackgroundImgPreview(reader.result);
        return;
      }
    };
  };

  const submitUpdateUser = async () => {
    dispatch({ type: "UPDATE_USER_START" });

    const newUserData = { userId: user._id };

    if (profileImgIsUrl) {
      // Is the url valid? //
      try {
        await axios.get(profileImgPreview);
        newUserData.profilePicture = { url: profileImgPreview };
      } catch (err) {}
    } else if (profileImgPreview) {
      // profileImgPreview is base64 //
      newUserData.profileBase64 = profileImgPreview;
    }

    if (bgImgIsUrl) {
      // Is the url valid? //
      try {
        await axios.get(backgroundImgPreview);
        newUserData.coverPicture = { url: backgroundImgPreview };
      } catch (err) {}
    } else if (!bgImgIsUrl && backgroundImgPreview) {
      // profileImgPreview is base64 //
      newUserData.backgroundBase64 = backgroundImgPreview;
    }

    if (username.current.value) {
      newUserData.username = username.current.value;
    }
    if (location.current.value) {
      newUserData.location = location.current.value;
    }

    /// Axios update user route ///
    try {
      const res = await axios.put(`/users/${profileId}`, newUserData);
      dispatch({ type: "UPDATE_USER_SUCCESS", payload: res.data });
      window.scrollTo(0, 0);

      /// Take response and update the user context ///
    } catch (err) {
      dispatch({ type: "UPDATE_USER_FAILURE", payload: err });
    }
  };

  return (
    <div className="editProfileContainer">
      <fieldset>
        <legend>Edit Profile</legend>
        <input type="text" placeholder="Username" ref={username} />
        <input type="text" placeholder="Location" ref={location} />
      </fieldset>
      <span className="inputInfo">
        NOTE: Images can be either a link or an image file. There is a 5 MB
        upload limit so resize first if necessary.
      </span>
      <fieldset>
        <legend>Profile Picture</legend>
        <input
          type="url"
          placeholder="URL link to an image"
          onChange={(e) => {
            setProfileImgPreview(e.target.value);
            setProfileImgIsUrl(true);
          }}
          ref={profileUrl}
        />
        <label htmlFor="profileImg">
          <input
            id="profileImg"
            type="file"
            accept=".png, .jpeg, .jpg"
            name="file"
            style={{ display: "none" }}
            onChange={convertToBase64}
          />
          <PermMedia />
          <span>Upload a File</span>
        </label>
        <div className="profileImgPreview">
          <img src={profileImgPreview} alt="" />
        </div>
      </fieldset>
      <fieldset>
        <legend>Background Picture</legend>
        <input
          type="url"
          placeholder="URL link to an image"
          ref={backgroundUrl}
          onChange={(e) => {
            setBackgroundImgPreview(e.target.value);
            setBgImgIsUrl(true);
          }}
        />
        <label htmlFor="backgroundImg">
          <input
            id="backgroundImg"
            type="file"
            accept=".png, .jpeg, .jpg"
            name="file"
            style={{ display: "none" }}
            onChange={convertToBase64}
          />
          <PermMedia />
          <span>Upload Pic</span>
        </label>
        <div className="backgroundImgPreview">
          <img src={backgroundImgPreview} alt="" />
        </div>
      </fieldset>
      <Button
        disabled={isFetching}
        variant="contained"
        onClick={submitUpdateUser}
      >
        {isFetching ? "Loading..." : "Update Profile"}
      </Button>
    </div>
  );
};

export default EditProfile;
