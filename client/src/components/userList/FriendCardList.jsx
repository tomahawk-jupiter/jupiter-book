import axios from "axios";
import { useContext, useEffect, useState } from "react";
import "./userList.css";
import { UserContext } from "../../context/UserContext";
import FriendCard from "./userCard/UserCard";
const PF = process.env.REACT_APP_PUBLIC_FOLDER;

/// Some mock data to help when styling ///
// const loopMockFriends = () => {
//   const demoFriend = {
//     _id: "123",
//     username: "bobby bobby bo-brown",
//     location: "Los Angeles",
//   };
//   const demoArray = [];
//   for (let i = 0; i < 3; i++) {
//     demoArray.push(demoFriend);
//   }
//   return demoArray;
// };

const FriendCardList = ({ title }) => {
  const [friends, setFriends] = useState([]);
  const { user } = useContext(UserContext);
  const [friendStatus, setFriendStatus] = useState(null);

  /// FOR CURRENT USER'S FRIENDS ///
  const fetchFriends = async () => {
    try {
      let res = null;
      if (title === "Friends") {
        res = await axios.get(`/users/${user._id}/friends`);
        setFriendStatus("unfriend");
      }
      if (title === "Suggested") {
        res = await axios.get(`/users/suggested/${user._id}`);
        setFriendStatus("add");
      }
      if (title === "Requests") {
        res = await axios.get(`/users/${user._id}/received-requests`);
        setFriendStatus("accept");
      }
      if (title === "Pending") {
        res = await axios.get(`/users/${user._id}/sent-requests`);
        setFriendStatus("cancel");
      }
      setFriends(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchFriends();
  }, [title, user._id]);

  return (
    <>
      <div className="friendCardListComponent">
        <h2 className="componentTitle">{title}</h2>
        {friends.map((friend) => {
          return (
            <FriendCard
              key={friend._id}
              friend={friend}
              friendStatus={friendStatus}
            />
          );
        })}
        {/* {loopMockFriends().map((i) => (
          <FriendCard key={i._id} friend={i} friendStatus={"cancel"} />
        ))} */}
      </div>
    </>
  );
};

export default FriendCardList;
