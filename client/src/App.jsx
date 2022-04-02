import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Friends from "./pages/friends/Friends";
import Suggested from "./pages/suggested/Suggested";
import Requests from "./pages/requests/Requests";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";

function App() {
  const { user } = useContext(UserContext);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Home /> : <Login />} />
          <Route
            path="/profile/:profileId"
            element={user ? <Profile /> : <Login />}
          />
          <Route path="/login" element={user ? <Home /> : <Login />} />
          <Route path="/register" element={user ? <Home /> : <Register />} />
          <Route path="/friends" element={user ? <Friends /> : <Login />} />
          <Route path="/requests" element={user ? <Requests /> : <Login />} />
          <Route path="/suggested" element={user ? <Suggested /> : <Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
