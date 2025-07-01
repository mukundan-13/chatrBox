import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userData } from "../../userSlice";
import SideNavBar from "../../components/SideNavBar";
import ChatList from "../../components/ChatList";
import ChatBox from "../../components/ChatBox";
import { useNavigate } from "react-router-dom";

export default function Chats() {
  const userState = useSelector(userData);
  console.log("Redux User State: ", userState);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("chats");
  const [selectedChat, setSelectedChat] = useState("none");

  useEffect(() => {
    if (userState.token === "") {
      navigate("/login");
    }
  });

  useEffect(() => {
    if (activeTab !== "chats") {
      setSelectedChat("none");
    }
  }, [activeTab]);

  const handleActiveTab = (tabName) => {
    setActiveTab(tabName);
  };

  const handleSelectedChat = (chatId) => {
    setSelectedChat(chatId);
  };
  console.log("Selected chat after: ", selectedChat);
  return (
    <div style={{ display: "flex" }}>
      <SideNavBar activeTab={activeTab} onTabChange={handleActiveTab} />
      <ChatList activeTab={activeTab} selectedChat={handleSelectedChat} />
      <ChatBox
        selectedChat={selectedChat}
        currentUserPhoneNumber={userState.phoneNumber}
      />
    </div>
  );
}
