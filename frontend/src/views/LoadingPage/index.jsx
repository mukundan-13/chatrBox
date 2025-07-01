import React, { useState, useEffect } from "react";
import Login from "../Login/Index";
import { useSelector } from "react-redux";
import { userData } from "../../userSlice";
import Chats from "../Chats";

export default function LoadingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [progress, setProgress] = useState(0);

  const userState = useSelector(userData);
  const content = userState.token === "" ? "login" : "chats";

  useEffect(() => {
    const totalDuration = 5000; 
    const steps = 100;
    const intervalTime = totalDuration / steps; 

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, intervalTime);

    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setShowLogin(true), 300); 
    }, totalDuration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#111b21] text-white">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-green-500">ChatrBox</span>
        </h1>
        <p className="text-gray-400 mb-6">Loading your chat experience...</p>

        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-t-green-500 border-gray-600 rounded-full animate-spin mb-6" />

        {/* Progress Bar */}
        <div className="w-64">
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2 text-center">
            {progress}% Complete
          </p>
        </div>
      </div>
    );
  }

  if (showLogin) {
    return <>{content === "chats" ? <Chats /> : <Login />}</>;
  }

  return null;
}
