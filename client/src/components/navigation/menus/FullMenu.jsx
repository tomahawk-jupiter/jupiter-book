import "./fullMenu.css";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";

const FullMenu = () => {
  const { user, dispatch } = useContext(UserContext);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <div className="fullMenuContainer">
      <Link to={"/"}>
        <Button className="menuButton">Feed</Button>
      </Link>
      <Link to={`/profile/${user._id}`}>
        <Button className="menuButton">Profile</Button>
      </Link>
      <Link to={"/requests"}>
        <Button className="menuButton">Requests</Button>
      </Link>
      <Link to={"/login"}>
        <Button onClick={handleLogout} className="menuButton">
          Logout
        </Button>
      </Link>
    </div>
  );
};

export default FullMenu;
