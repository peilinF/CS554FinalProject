import "./App.scss";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ChangePassword from "./components/ChangePassword";

import HomePage from "./pages/HomePage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { useState } from "react";

//Pages
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import MyMapPage from "./pages/MapPage";
import FriendsPage from "./pages/FriendsPage";
// import MyMapPage from "./pages/MyMapPage";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      setUser(user);
      setLoading(false);
    } else {
      setLoading(false);
      setUser(null);
    }
  });

  return (
    <div className="App">
      {loading ? (
        <div className="loader"></div>
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={user ? <Navigate to={"/"} /> : <SignInPage />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to={"/"} /> : <SignUpPage />}
            />
            <Route
              path="/chat"
              element={user ? <ChatPage /> : <Navigate to={"/login"} />}
            />
            <Route path="/changePassword" element={<ChangePassword />} />
            {/* Do not change this route 
            Make seperate route map for
            implementation or merging */}
            <Route
              path="/mymap"
              element={user ? <MyMapPage /> : <Navigate to={"/login"} />}
            />
            <Route
              path="/profile"
              element={user ? <ProfilePage /> : <Navigate to={"/login"} />}
            />
            <Route
              path="/friends"
              element={user ? <FriendsPage /> : <Navigate to={"/login"} />}
            />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
