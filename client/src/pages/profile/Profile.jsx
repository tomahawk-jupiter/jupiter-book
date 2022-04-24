import Navigation from "../../components/navigation/Navigation";
import Hero from "../../components/hero/Hero";
import Share from "../../components/share/Share";
import Feed from "../../components/feed/Feed";
import FriendCardList from "../../components/userList/FriendCardList";
import ProfileCardList from "../../components/userList/ProfileCardList";
import "./profile.css";
import useIsWide from "../../customHook/useIsWide";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const Profile = () => {
  const { isWide } = useIsWide();
  const { profileId } = useParams();
  const { user } = useContext(UserContext);

  return (
    <div className="profilePage">
      <Navigation />
      <Hero />
      {isWide && (
        <>
          <div className="sidebarLeft">
            {profileId == user._id ? (
              <FriendCardList title={"Friends"} />
            ) : (
              <ProfileCardList title={"Friends"} profileId={profileId} />
            )}
          </div>
          <div className="sidebarRight">
            <FriendCardList title={"Suggested"} />
          </div>
        </>
      )}
      <div className="feedAreaContainer">
        {(!profileId && <Share />) || (profileId === user._id && <Share />)}
        {profileId == user._id && <h4 className="timelineTitle">Your posts</h4>}
        <Feed profileId={profileId ? profileId : user._id} />
      </div>
    </div>
  );
};

export default Profile;
