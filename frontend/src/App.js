import "./App.scss";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ChatPage from "./pages/ChatPage";
import ChangePassword from "./components/ChangePassword";
import MyMapPage from "./pages/MyMapPage";
import HomePage from "./pages/HomePage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { useState } from "react";

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
            <Route path="/mymap" element={<MyMapPage />} />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
