import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useContext, useState } from "react";
import { UserContext } from "../../../context/UserContext";

import { useMatch, useResolvedPath } from "react-router-dom";

function CustomLink({ children, to, ...props }) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <div>
      <Link
        className="hamburgerLink"
        style={{
          color: match ? "#1868df" : "black",
        }}
        to={to}
        {...props}
      >
        {children}
      </Link>
    </div>
  );
}

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
        <CustomLink to="/">
          <MenuItem onClick={handleClose}>Feed</MenuItem>
        </CustomLink>

        <CustomLink to={`/profile/${user._id}`}>
          <MenuItem onClick={handleClose}>Profile</MenuItem>
        </CustomLink>

        <CustomLink to={"/friends"}>
          <MenuItem onClick={handleClose}>Friends</MenuItem>
        </CustomLink>

        <CustomLink to={"/requests"}>
          <MenuItem onClick={handleClose}>Requests</MenuItem>
        </CustomLink>

        <CustomLink to={"/suggested"}>
          <MenuItem onClick={handleClose}>Suggested</MenuItem>
        </CustomLink>

        <CustomLink to={"/login"}>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </CustomLink>

        {/* <Link to={"/"} className="hamburgerLink">
          <MenuItem onClick={handleClose}>Feed</MenuItem>
        </Link> */}

        {/* <Link to={`/profile/${user._id}`} className="hamburgerLink">
          <MenuItem onClick={handleClose}>Profile</MenuItem>
        </Link> */}

        {/* <Link to={"/friends"} className="hamburgerLink">
          <MenuItem onClick={handleClose}>Friends</MenuItem>
        </Link> */}

        {/* <Link to={"/requests"} className="hamburgerLink">
          <MenuItem onClick={handleClose}>Requests</MenuItem>
        </Link> */}

        {/* <Link to={"/suggested"} className="hamburgerLink">
          <MenuItem onClick={handleClose}>Suggested</MenuItem>
        </Link> */}

        {/* <Link to={"/login"} className="hamburgerLink">
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Link> */}
      </Menu>
    </div>
  );
};

export default Hamburger;
