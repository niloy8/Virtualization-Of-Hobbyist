import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import Signin from "./SigninPage/Signin";
import Signup from "./SignupPage/Signup";
import Home from "./HomePage/Home";
import Choose from "./Choose Hobby/Choose";
import CommunityPage from "./CommunityPage/CommunityPage";
import Chat from "./CommunityPage/Chat";



const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/sign-in" element={<Signin></Signin>}></Route>
      <Route path="/sign-up" element={<Signup></Signup>}></Route>
      <Route path="/home-page" element={<Home></Home>}></Route>
      <Route path="/hobby-selection" element={<Choose></Choose>}></Route>
      <Route path="/community-page" element={<CommunityPage />}>
        {/* Nested route for Chat */}
        <Route path="chat" element={<Chat />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
