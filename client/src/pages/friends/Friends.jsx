import "./friends.css";
import FriendCardList from "../../components/userList/FriendCardList";
import Navigation from "../../components/navigation/Navigation";

const Friends = () => {
  return (
    <>
      <Navigation />
      <FriendCardList title={"Friends"} />
    </>
  );
};

export default Friends;
