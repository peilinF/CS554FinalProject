import "./App.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ChatPage from "./pages/ChatPage";
import ChangePassword from "./components/ChangePassword";
import MyMapPage from "./pages/MyMapPage";
import HomePage from "./pages/HomePage";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      console.log(uid);
      // ...
    } else {
      // User is signed out
      // ...
    }
  });

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/mymap" element={<MyMapPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
