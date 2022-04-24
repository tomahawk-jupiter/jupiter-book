import { useContext } from "react";
import Feed from "../../components/feed/Feed";
import FriendCardList from "../../components/userList/FriendCardList";
import Navigation from "../../components/navigation/Navigation";
import Share from "../../components/share/Share";
import { UserContext } from "../../context/UserContext";
import useIsWide from "../../customHook/useIsWide";
const PF = process.env.REACT_APP_PUBLIC_FOLDER;

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
        <div className="jupiterImgContainer">
          <h2 className="jupiterTitle">Jupiter Book</h2>
          <img className="jupiterImg" src={PF + "jupiter.png"} />
          <div className="jupiterBackground"></div>
        </div>
        <Share />
        <hr />
        <h4 className="timelineTitle">Timeline</h4>
        <div className="italicNote">
          <strong>Note:</strong> user pics link to their profile page.
        </div>
        <Feed />
      </div>
    </div>
  );
};

export default Home;
