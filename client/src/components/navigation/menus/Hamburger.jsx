import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useContext, useState } from "react";
import { UserContext } from "../../../context/UserContext";

const Hamburger = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { user, dispatch } = useContext(UserContext);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    // handleClose();
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MenuIcon style={{ color: "white" }} />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Link to={"/"} style={{ textDecoration: "none", color: "black" }}>
          <MenuItem onClick={handleClose}>Feed</MenuItem>
        </Link>
        <Link
          to={`/profile/${user._id}`}
          style={{ textDecoration: "none", color: "black" }}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
        </Link>
        <Link
          to={"/friends"}
          style={{ textDecoration: "none", color: "black" }}
        >
          <MenuItem onClick={handleClose}>Friends</MenuItem>
        </Link>
        <Link
          to={"/requests"}
          style={{ textDecoration: "none", color: "black" }}
        >
          <MenuItem onClick={handleClose}>Requests</MenuItem>
        </Link>
        <Link
          to={"/suggested"}
          style={{ textDecoration: "none", color: "black" }}
        >
          <MenuItem onClick={handleClose}>Suggested</MenuItem>
        </Link>
        <Link to={"/login"} style={{ textDecoration: "none", color: "black" }}>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Link>
      </Menu>
    </div>
  );
};

export default Hamburger;
