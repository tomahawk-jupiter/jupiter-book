import "./register.css";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import axios from "axios";

const Register = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const username = useRef();
  const location = useRef();
  const email = useRef();
  const password = useRef();
  const passwordConfirm = useRef();

  const handleRegister = (e) => {
    e.preventDefault();
    if (password.current.value === passwordConfirm.current.value) {
      const newUser = {
        username: username.current.value,
        location: location.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        axios.post("auth/register", newUser);
        navigate("/login");
      } catch (err) {}
    } else {
      setErrorMessage("Passwords must match!");
    }
  };

  return (
    <div className="registerPage">
      <div className="registerHeader">
        <h1>Jupiter sign up</h1>
      </div>
      <form className="registerForm" onSubmit={handleRegister}>
        <input
          placeholder="Username"
          type="text"
          maxLength="20"
          required
          ref={username}
        />
        <input
          placeholder="Location"
          type="text"
          maxLength="20"
          required
          ref={location}
        />
        <input
          placeholder="Email (used to login)"
          type="email"
          className="email"
          maxLength="50"
          required
          ref={email}
        />
        <input
          placeholder="Password"
          type="password"
          className="password"
          minLength="1"
          required
          ref={password}
        />
        <input
          placeholder="Confirm password"
          type="password"
          className="password"
          minLength="1"
          required
          ref={passwordConfirm}
        />
        <span className="errorMessage">{errorMessage}</span>
        <Button type="submit" variant="contained">
          Sign up
        </Button>
        <Link className="registerCenterBtn" to={"/login"}>
          <Button>Already have account?</Button>
        </Link>
      </form>
    </div>
  );
};

export default Register;
