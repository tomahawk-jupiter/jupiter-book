import "./login.css";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import axiosInstance from "../../axios.config";
import { useContext, useRef } from "react";
import { UserContext } from "../../context/UserContext";

const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axiosInstance.post("/auth/login", userCredential);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
};

const Login = () => {
  const email = useRef();
  const password = useRef();
  const { isFetching, error, dispatch } = useContext(UserContext);

  /// Sample user login ///
  const handleDemoLogin = (e) => {
    const sampleUser = e.target.id;
    loginCall(
      {
        email: `${sampleUser}@doe`,
        password: "123456",
      },
      dispatch
    );
  };

  const handleSubmitLogin = (e) => {
    e.preventDefault();

    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };

  return (
    <div className="loginPage">
      <div className="loginHeader">
        <h1>Jupiter log in</h1>
      </div>
      <div className="demoLoginContainer">
        <h4>Demo login</h4>
        <div className="demoButtonRow">
          <Button id="john" onClick={handleDemoLogin}>
            {isFetching ? "Loading..." : "John Doe"}
          </Button>
          <Button id="jane" onClick={handleDemoLogin}>
            {isFetching ? "Loading..." : "Jane Doe"}
          </Button>
        </div>
      </div>
      <form className="loginForm" onSubmit={handleSubmitLogin}>
        <input
          placeholder="Email"
          type="email"
          className="email"
          required
          ref={email}
        />
        <input
          placeholder="Password"
          type="password"
          className="password"
          required
          ref={password}
        />
        <span className="errorMessage">{error ? error.response.data : ""}</span>
        <Button type="submit" variant="contained">
          {isFetching ? "Loading..." : "Login"}
        </Button>
        <Link className="loginCenterBtn" to={"/register"}>
          <Button>Register</Button>
        </Link>
      </form>
    </div>
  );
};

export default Login;
