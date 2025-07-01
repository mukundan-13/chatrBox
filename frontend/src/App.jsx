import { useState } from "react";
import "./App.css";
import Registration from "./views/Registration";
import { Route, Routes } from "react-router-dom";
import OtpVerification from "./views/OtpVerification";
import Login from "./views/Login/Index";
import Chats from "./views/Chats";
import LoadingPage from "./views/LoadingPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<Registration />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<LoadingPage />} />
      </Routes>
    </>
  );
}

export default App;
