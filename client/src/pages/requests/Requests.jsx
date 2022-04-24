import "./requests.css";
import FriendCardList from "../../components/userList/FriendCardList";
import Navigation from "../../components/navigation/Navigation";

const Requests = () => {
  return (
    <>
      <Navigation />
      <div className="requestContainer">
        <FriendCardList title={"Requests"} />
        <hr />
        <FriendCardList title={"Pending"} />
      </div>
    </>
  );
};

export default Requests;
