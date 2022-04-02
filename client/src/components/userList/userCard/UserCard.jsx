import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const PF = process.env.REACT_APP_PUBLIC_FOLDER;

const FriendCard = ({ friend, friendStatus }) => {
  const { user } = useContext(UserContext);
  const [requestBtn, setRequestBtn] = useState(friendStatus);
  const profileId = friend._id;

  const handleFriendRequest = async (e) => {
    try {
      if (friendStatus === "add") {
        await axios.put(`/users/${profileId}/friend-request`, {
          userId: user._id,
        });
        setRequestBtn("cancel");
      }
      if (friendStatus === "accept") {
        await axios.put(`/users/${profileId}/accept`, {
          userId: user._id,
        });
        setRequestBtn("unfriend");
      }
      if (friendStatus === "cancel") {
        await axios.put(`/users/${profileId}/cancel`, {
          userId: user._id,
        });
        setRequestBtn("add");
      }
      if (friendStatus === "unfriend") {
        await axios.put(`/users/${profileId}/unfriend`, {
          userId: user._id,
        });
        setRequestBtn("add");
      }
      /// REMOVE THE FRIEND CARD FROM DOM ///
      e.target.parentElement.remove();
      return;
    } catch (err) {}
  };

  return (
    <div className="friendCard">
      <div className="friendCardImgInfoSection">
        <Link to={`/profile/${friend._id}`}>
          <img
            src={
              friend.profilePicture.url
                ? friend.profilePicture.url
                : `${PF}noAvatar.png`
            }
            alt=""
            className="friendCardImg"
          />
        </Link>
        <div className="friendCardInfo">
          <span className="friendCardName">{friend.username}</span>
          <span className="friendCardLocation">{friend.location}</span>
        </div>
      </div>
      <Button onClick={handleFriendRequest} size="small">
        {requestBtn}
      </Button>
    </div>
  );
};

export default FriendCard;
