import React, { useEffect, useState } from "react";
import "./style.css";
import { MdEdit } from "react-icons/md";
import Profile from "../Profile";
import { useSelector } from "react-redux";
import { userData } from "../../userSlice";
import { getChatRooms } from "../../userApi";
import ChatRooms from "../ChatRooms";
import AddContact from "../AddContact";

export default function ChatList({ activeTab, selectedChat }) {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewChat, setIsNewChat] = useState(false);

  const user = useSelector(userData);

  const token = user.token;
  const currentUserPhoneNumber = user.phoneNumber;
  console.log("Current user phone Number: ", currentUserPhoneNumber);

  useEffect(() => {
    const fetchChatRooms = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!token) {
          setError("Authentication token not found. Please log in.");
          setLoading(false);
          return;
        }

        if (!currentUserPhoneNumber) {
          setError("User phone number not found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await getChatRooms();

        setChatRooms(response);
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
        setError("Failed to load chats. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (activeTab !== "profile") {
      fetchChatRooms();
    }
  }, [activeTab, token, currentUserPhoneNumber, isNewChat]);

  const handleNewChat = () => {
    setIsNewChat(true);
  };

  const handleBackToChats = () => {
    setIsNewChat(false);
  };

  const handleChatClick = (chatRoom) => {
    selectedChat(chatRoom);
  };

  return (
    <>
      {activeTab !== "profile" && (
        <div className="chat-list">
          <div className="chat-list-header">
            <div className="header-title">
              {activeTab === "chats" && "Chats"}{" "}
              {activeTab === "status" && "Status"}{" "}
              {activeTab === "groups" && "Groups"}{" "}
              {activeTab === "settings" && "Settings"}
            </div>
            <div className="header-actions">
              {activeTab === "chats" && (
                <button className="icon-button" onClick={handleNewChat}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
                  </svg>
                </button>
              )}
              <button className="icon-button">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12,16c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S10.9,16,12,16z M12,10c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S10.9,10,12,10z M12,22c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S10.9,22,12,22z"
                  />
                </svg>
              </button>
            </div>
          </div>
          {activeTab === "chats" && (
            <>
              <div className="search-container">
                <input type="text" class="search-input" placeholder="Search" />
              </div>

              <div className="filter-tabs">
                <div className="filter-tab active">All</div>
                <div className="filter-tab">Unread</div>
                <div className="filter-tab">Favorites</div>
                <div className="filter-tab">Groups</div>
              </div>
            </>
          )}
          {activeTab === "chats" && !isNewChat && (
            <ChatRooms
              loading={loading}
              error={error}
              chatRooms={chatRooms}
              onClick={handleNewChat}
              currentUserPhoneNumber={currentUserPhoneNumber}
              onChatClick={handleChatClick}
            />
          )}
          {isNewChat && (
            <AddContact
              onBack={handleBackToChats}
              onStartChat={handleChatClick}
            />
          )}
          {(activeTab === "status" ||
            activeTab === "groups" ||
            activeTab === "settings") && (
            <>
              <UnderDevelopment />
            </>
          )}
        </div>
      )}
      {activeTab === "profile" && <Profile />}
    </>
  );
}
