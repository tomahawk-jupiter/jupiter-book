import { Button } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import EditProfile from "../editProfile/EditProfile";
import "./hero.css";
const PF = process.env.REACT_APP_PUBLIC_FOLDER;

const Hero = () => {
  const { user } = useContext(UserContext);
  const [profileUser, setProfileUser] = useState(user);
  const { profileId } = useParams();
  const [friendStatus, setFriendStatus] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setEditMode(false);
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/users/${profileId}`);
        setProfileUser(res.data);

        /// Is the users profile ///
        if (profileId === user._id) {
          setFriendStatus("you");
          return;
        }
        /// Is a friend ///
        if (res.data.friends.includes(user._id)) {
          setFriendStatus("unfriend");
          return;
        }
        /// User sent a request to them ///
        if (res.data.receivedRequests.includes(user._id)) {
          setFriendStatus("cancel");
          return;
        }
        /// They sent a request to user ///
        if (res.data.sentRequests.includes(user._id)) {
          setFriendStatus("accept");
          return;
        }
        setFriendStatus("add");
        return;
      } catch (err) {}
    };
    fetchUser();
  }, [profileId, user]);

  const handleFriendRequest = async () => {
    try {
      if (friendStatus === "add") {
        await axios.put(`/users/${profileId}/friend-request`, {
          userId: user._id,
        });
        setFriendStatus("cancel");
      }
      if (friendStatus === "accept") {
        await axios.put(`/users/${profileId}/accept`, {
          userId: user._id,
        });
        setFriendStatus("unfriend");
      }
      if (friendStatus === "cancel") {
        await axios.put(`/users/${profileId}/cancel`, {
          userId: user._id,
        });
        setFriendStatus("add");
      }
      if (friendStatus === "unfriend") {
        await axios.put(`/users/${profileId}/unfriend`, {
          userId: user._id,
        });
        setFriendStatus("add");
      }
      return;
    } catch (err) {}
  };

  const FriendStatusButton = () => {
    if (friendStatus === "add" || friendStatus === "accept") {
      return (
        <Button variant="contained" size="small" onClick={handleFriendRequest}>
          {friendStatus}
        </Button>
      );
    }
    if (friendStatus === "unfriend" || friendStatus === "cancel") {
      return (
        <Button
          size="small"
          style={{ color: "red" }}
          onClick={handleFriendRequest}
        >
          {friendStatus}
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="heroComponent">
      <div className="heroCover">
        <img
          src={profileUser.coverPicture.url ? profileUser.coverPicture.url : ""}
          alt=""
          className="heroCoverImg"
        />
        <img
          src={
            profileUser.profilePicture.url
              ? profileUser.profilePicture.url
              : `${PF}noAvatar.png`
          }
          alt=""
          className="heroProfileImg"
        />
      </div>
      <div className="profileInfo">
        <h4 className="profileInfoName">{profileUser.username}</h4>
        <span className="profileInfoLocation">{profileUser.location}</span>
        <FriendStatusButton />
        {profileId === user._id && (
          <Button onClick={() => setEditMode(!editMode)}>
            {editMode ? "Cancel Edit" : "Edit Profile"}
          </Button>
        )}
        {editMode && <EditProfile user={user} profileId={profileId} />}
      </div>
    </div>
  );
};

export default Hero;
