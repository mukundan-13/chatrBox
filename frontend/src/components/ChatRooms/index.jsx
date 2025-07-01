import React, { useState, useEffect } from "react";
import LoadingSpinner from "../LoadingSpinner";
import { getLatestChat } from "../../userApi";

export default function ChatRooms({
  loading,
  error,
  chatRooms,
  onClick,
  currentUserPhoneNumber,
  onChatClick,
}) {
  const [latestMessages, setLatestMessages] = useState({});
  const [loadingMessages, setLoadingMessages] = useState({});

  const formatChatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    return date.toDateString() === now.toDateString()
      ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : date.toLocaleDateString("en-GB");
  };

  const truncateMessage = (msg, max = 50) =>
    !msg ? "" : msg.length > max ? msg.substring(0, max) + "..." : msg;

  const fetchLatestMessage = async (chatId) => {
    if (latestMessages[chatId] || loadingMessages[chatId]) return;

    setLoadingMessages((prev) => ({ ...prev, [chatId]: true }));
    try {
      const latestMessage = await getLatestChat(chatId);
      setLatestMessages((prev) => ({ ...prev, [chatId]: latestMessage }));
    } catch (error) {
      console.error("Error fetching latest message:", error);
      setLatestMessages((prev) => ({ ...prev, [chatId]: null }));
    } finally {
      setLoadingMessages((prev) => ({ ...prev, [chatId]: false }));
    }
  };

  useEffect(() => {
    if (chatRooms?.length) {
      chatRooms.forEach((chat) => fetchLatestMessage(chat.chatId));
    }
  }, [chatRooms]);

  const renderLatestMessage = (chatId) => {
    if (loadingMessages[chatId]) return <span className="text-gray-400">Loading...</span>;

    const latest = latestMessages[chatId];
    if (!latest) return <span className="text-gray-400">No messages yet...</span>;

    const sender =
      latest.sender?.phoneNumber === currentUserPhoneNumber
        ? "You"
        : latest.sender?.phoneNumber || "Unknown";

    const text = latest.content || latest.message || latest.text || "";
    return (
      <span className="text-sm text-gray-400">
        <span className="font-medium text-white">{sender}: </span>
        {truncateMessage(text)}
      </span>
    );
  };

  const sortedChatRooms = [...(chatRooms || [])].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  return (
    <div className="w-full h-full bg-gray-900 text-white overflow-y-auto">
      {loading && (
        <div className="flex justify-center items-center h-full">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="text-red-500 p-4 text-center">{error}</div>
      )}

      {!loading && !error && chatRooms?.length === 0 && (
        <div className="text-center py-10 px-4">
          <p className="text-lg font-semibold text-white">No chats yet!</p>
          <p className="text-sm text-gray-400 mb-4">
            Start a new conversation to connect with friends.
          </p>
          <button
            onClick={onClick}
            className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded"
          >
            Start New Chat
          </button>
        </div>
      )}

      {!loading && !error && sortedChatRooms.length > 0 && (
        <div>
          {sortedChatRooms.map((chat) => {
            const isSingle = chat.type === "SINGLE" && chat.participants.length > 1;
            const otherUser = chat.participants.find((p) => p.phoneNumber !== currentUserPhoneNumber);

            const avatar =
              isSingle && otherUser?.profileImageUrl
                ? otherUser.profileImageUrl
                : "https://res.cloudinary.com/dapki3g81/image/upload/v1747918087/icon-5359553_1280_lml1l5.png";

            const displayName = isSingle
              ? otherUser?.phoneNumber || "Unknown User"
              : "New Chat";

            return (
              <div
                key={chat.chatId}
                onClick={() => onChatClick(chat)}
                className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-800 transition duration-150 border-b border-gray-700"
              >
                <img
                  src={avatar}
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold truncate">{displayName}</p>
                    <p className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      {formatChatTime(chat.updatedAt)}
                    </p>
                  </div>
                  <div className="truncate">{renderLatestMessage(chat.chatId)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
