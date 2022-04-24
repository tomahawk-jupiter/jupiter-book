import axiosInstance from "../../axios.config";
import { useContext, useEffect, useState } from "react";
import "./userList.css";
import { UserContext } from "../../context/UserContext";
import FriendCard from "./userCard/UserCard";
const PF = process.env.REACT_APP_PUBLIC_FOLDER;

/***** FRIENDS FOR THE PROFILE OF ANOTHER USER *************
 * The buttons on the friend cards should display relative
 * to the logged in user's friend status with them.
 ***********************************************************/

const ProfileCardList = ({ title, profileId }) => {
  const [friends, setFriends] = useState([]);
  const { user } = useContext(UserContext);

  const fetchFriends = async () => {
    try {
      const profileFriends = await axiosInstance.get(
        `/users/${profileId}/friends`
      );
      setFriends(profileFriends.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchFriends();
  }, [title, user._id, profileId]);

  return (
    <>
      <div className="friendCardListComponent">
        <h2 className="componentTitle">{title}</h2>
        {friends.map((u) => {
          if (user.friends.includes(u._id)) {
            return (
              <FriendCard key={u._id} friend={u} friendStatus={"unfriend"} />
            );
          } else if (user.receivedRequests.includes(u._id)) {
            return (
              <FriendCard key={u._id} friend={u} friendStatus={"accept"} />
            );
          } else if (user.sentRequests.includes(u._id)) {
            return (
              <FriendCard key={u._id} friend={u} friendStatus={"cancel"} />
            );
          } else if (user._id === u._id) {
            return <FriendCard key={u._id} friend={u} friendStatus={null} />;
          } else {
            return <FriendCard key={u._id} friend={u} friendStatus={"add"} />;
          }
        })}
      </div>
    </>
  );
};

export default ProfileCardList;
