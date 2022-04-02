import { useContext } from "react";
import Feed from "../../components/feed/Feed";
import FriendCardList from "../../components/userList/FriendCardList";
import Navigation from "../../components/navigation/Navigation";
import Share from "../../components/share/Share";
import { UserContext } from "../../context/UserContext";
import useIsWide from "../../customHook/useIsWide";

const Home = () => {
  const { isWide } = useIsWide();
  const { user } = useContext(UserContext);

  return (
    <div className="homePage">
      <Navigation />
      {isWide && (
        <>
          <div className="sidebarLeft">
            <FriendCardList title={"Friends"} />
          </div>
          <div className="sidebarRight">
            <FriendCardList title={"Suggested"} />
          </div>
        </>
      )}
      <div className="feedAreaContainer">
        {/* <h4 className="userName">Welcome {user.username}</h4> */}
        <Share />
        <Feed />
      </div>
    </div>
  );
};

export default Home;
