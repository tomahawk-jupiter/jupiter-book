import "./navigation.css";
import useIsWide from "../../customHook/useIsWide";
import Hamburger from "./menus/Hamburger";
import FullMenu from "./menus/FullMenu";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
const PF = process.env.REACT_APP_PUBLIC_FOLDER;

const Navigation = () => {
  const { isWide } = useIsWide();
  const { user } = useContext(UserContext);

  return (
    <div className="navigationComponent">
      <div className="navUserContainer">
        <Link to={`/profile/${user._id}`}>
          <img
            src={
              user.profilePicture.url
                ? user.profilePicture.url
                : `${PF}noAvatar.png`
            }
            alt=""
            className="navUserImg"
          />
        </Link>
        <span className="navUsername">{user.username}</span>
      </div>
      {isWide ? <FullMenu /> : <Hamburger />}
    </div>
  );
};

export default Navigation;
