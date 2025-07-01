import React from "react";
import chatEmpty from "../../assets/empty.jpg";
import logo from "../../assets/logo.png";
import MyButton from "../../components/MyButton";

export default function EmptyChatBox() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#1e293b] text-white px-6 py-10 text-center">
      <div className="mb-6">
        <img src={logo} alt="Logo" className="w-20 md:w-24 mx-auto" />
      </div>
      <div className="mb-10">
        <img src={chatEmpty} alt="Empty Chat" className="w-72 md:w-96 opacity-95" />
      </div>
      <div className="max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          Download ChatrBox for Windows
        </h1>
        <p className="text-lg text-gray-300 mb-10 px-2">
          Connect, chat, and collaborate — faster and easier on desktop.
          Enjoy seamless messaging, make voice or video calls, and share
          your screen with ease using the ChatrBox desktop app.
        </p>
        <div className="mb-8">
          <MyButton name="Download" />
        </div>
        <p className="text-base text-gray-400">
          🔒 Your conversations stay private with end-to-end encryption
        </p>
      </div>
    </div>
  );
}
