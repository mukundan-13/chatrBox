import React, { useCallback, useEffect, useRef, useState } from "react";

import EmptyChatBox from "../EmptyChatBox";
import { getChatMessages } from "../../userApi";
import { useWebSocketChat } from "../../useWebSocketChat";
import EmojiPicker from "emoji-picker-react";
import LoadingSpinner from "../LoadingSpinner";

export default function ChatBox({ selectedChat, currentUserPhoneNumber }) {
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const processedMessagesRef = useRef(new Set());

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, []);

  const scrollToBottomImmediate = useCallback(() => {
    return new Promise((resolve) => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: "auto",
          block: "end",
        });
        setTimeout(resolve, 150);
      } else {
        resolve();
      }
    });
  }, []);
  const handleNewMessage = useCallback((receivedMessage) => {
    setMessages((prevMessages) => {
      const existingMessageIndex = prevMessages.findIndex(
        (msg) => msg.id === receivedMessage.id
      );

      if (existingMessageIndex !== -1) {
        const updatedMessages = [...prevMessages];
        updatedMessages[existingMessageIndex] = {
          ...updatedMessages[existingMessageIndex],
          status: receivedMessage.status,
        };
        console.log(
          `Updated message ${receivedMessage.id} status to ${receivedMessage.status}`
        );
        return updatedMessages;
      } else {
        // This is a new message
        console.log("Received new message:", receivedMessage);
        return [...prevMessages, receivedMessage];
      }
    });
  }, []);

  const {
    isConnected,
    error: websocketError,
    sendMessage,
    markMessageAsDelivered,
    markMessageAsRead,
  } = useWebSocketChat(
    selectedChat && selectedChat !== "none" ? selectedChat.chatId : null,
    handleNewMessage
  );

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedChat && selectedChat !== "none" && selectedChat.chatId) {
        setIsInitialLoading(true);
        setLoadingMessages(true);
        setMessagesError(null);
        setIsFirstLoad(true);
        processedMessagesRef.current.clear();

        const loadingStartTime = Date.now();
        const minLoadingTime = 2000;

        try {
          const fetchedMessages = await getChatMessages(selectedChat.chatId);
          setMessages(fetchedMessages);

          setTimeout(async () => {
            await scrollToBottomImmediate();

            const elapsedTime = Date.now() - loadingStartTime;
            const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

            setTimeout(() => {
              setIsInitialLoading(false);
              setIsFirstLoad(false);
            }, remainingTime);
          }, 0);
        } catch (error) {
          console.error("Error fetching messages:", error);
          setMessagesError("Failed to load messages. Please try again.");
          setIsInitialLoading(false);
          setIsFirstLoad(false);
        } finally {
          setLoadingMessages(false);
        }
      } else {
        setMessages([]);
        setIsInitialLoading(false);
        setIsFirstLoad(false);
        processedMessagesRef.current.clear();
      }
    };

    fetchMessages();
  }, [selectedChat, scrollToBottomImmediate]);
  useEffect(() => {
    if (!loadingMessages && !isInitialLoading && !isFirstLoad) {
      scrollToBottom();
    }
  }, [
    messages,
    loadingMessages,
    isInitialLoading,
    isFirstLoad,
    scrollToBottom,
  ]);

  useEffect(() => {
    if (
      selectedChat &&
      selectedChat !== "none" &&
      currentUserPhoneNumber &&
      markMessageAsDelivered &&
      markMessageAsRead &&
      !isInitialLoading &&
      !loadingMessages
    ) {
      messages.forEach((message) => {
        if (
          processedMessagesRef.current.has(message.id) ||
          message.sender.phoneNumber === currentUserPhoneNumber
        ) {
          return;
        }

        if (message.status === "SENT") {
          console.log(`Marking message ${message.id} as DELIVERED`);
          markMessageAsDelivered(message.id);
          processedMessagesRef.current.add(message.id);
        } else if (message.status === "DELIVERED") {
          console.log(`Marking message ${message.id} as READ`);
          setTimeout(() => {
            markMessageAsRead(message.id);
            processedMessagesRef.current.add(message.id);
          }, 500);
        }
      });
    }
  }, [
    messages,
    selectedChat,
    currentUserPhoneNumber,
    markMessageAsDelivered,
    markMessageAsRead,
    isInitialLoading,
    loadingMessages,
  ]);

  useEffect(() => {
    processedMessagesRef.current.clear();
  }, [selectedChat]);

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderMessageStatus = (status) => {
    switch (status) {
      case "SENT":
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            className="text-gray-400"
          >
            <path
              fill="currentColor"
              d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"
            />
          </svg>
        );
      case "DELIVERED":
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            className="text-gray-500"
          >
            <path
              fill="currentColor"
              d="M0.41,13.41L6,19L7.41,17.58L1.83,12M22.24,5.58L11.66,16.17L7.5,12L6.07,13.41L11.66,19L23.66,7M18,7L19.41,5.58L16.17,2.34L14.76,3.75"
            />
          </svg>
        );
      case "READ":
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            className="text-blue-500"
          >
            <path
              fill="currentColor"
              d="M0.41,13.41L6,19L7.41,17.58L1.83,12M22.24,5.58L11.66,16.17L7.5,12L6.07,13.41L11.66,19L23.66,7M18,7L19.41,5.58L16.17,2.34L14.76,3.75"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const handleMessageInputChange = (event) => {
    setMessageInput(event.target.value);
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput("");
      setShowEmojiPicker(false);
      // Immediately scroll to bottom after sending
      setTimeout(() => scrollToBottom(), 100);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const onEmojiClick = (emojiObject) => {
    setMessageInput((prevMsg) => prevMsg + emojiObject.emoji);
  };

  let chatHeaderName = "";
  let chatHeaderImageUrl =
    "https://res.cloudinary.com/dapki3g81/image/upload/v1747918087/icon-5359553_1280_lml1l5.png";
  let participantCount = 0;

  if (selectedChat && selectedChat !== "none") {
    if (selectedChat.type === "SINGLE" && selectedChat.participants) {
      const otherParticipant = selectedChat.participants.find(
        (p) => p.phoneNumber !== currentUserPhoneNumber
      );

      chatHeaderName =
        otherParticipant?.name ||
        otherParticipant?.phoneNumber ||
        "Unknown User";
      chatHeaderImageUrl =
        otherParticipant?.profileImageUrl || chatHeaderImageUrl;
    } else if (selectedChat.type === "GROUP") {
      chatHeaderName = selectedChat.name || "Group Chat";
      chatHeaderImageUrl = selectedChat.profileImageUrl || chatHeaderImageUrl;
      participantCount = selectedChat.participants
        ? selectedChat.participants.length
        : 0;
    } else {
      chatHeaderName = "Unknown Chat";
    }
  }

  const isInputDisabled =
    !selectedChat || selectedChat === "none" || !isConnected;

  return (
    <>
      {selectedChat === "none" && <EmptyChatBox />}
      {selectedChat !== "none" && (
        <div className="flex flex-col flex-1 bg-gray-900 relative h-screen overflow-hidden">
          <>
            {/* Chat Header */}
            <div className="flex items-center p-4 h-16 bg-gray-800 border-b border-gray-700 flex-shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <img
                  src={chatHeaderImageUrl}
                  alt={chatHeaderName || "Chat Avatar"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="text-white font-medium text-lg">
                  {chatHeaderName}
                </div>
                <div className="text-gray-400 text-xs">
                  {participantCount > 0 ? `${participantCount} participants` : ""}
                </div>
              </div>
              <div className="flex gap-4">
                <button className="text-gray-400 hover:text-white transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M17,10.5V7c0-0.55-0.45-1-1-1H4c-0.55,0-1,0.45-1,1v10c0,0.55,0.45,1,1,1h12c0.55,0,1-0.45,1-1v-3.5l4,4v-11L17,10.5z M15,16H5V8h10V16z"
                    />
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12,9c-1.65,0-3,1.35-3,3s1.35,3,3,3s3-1.35,3-3S13.65,9,12,9z M12,13c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S12.55,13,12,13z M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M16.03,15.67L15.2,14.84c-0.44,0.37-0.95,0.66-1.5,0.84l0.24,1.2C13.4,16.95,12.7,17,12,17c-0.7,0-1.4-0.05-1.94-0.12l0.24-1.2c-0.55-0.18-1.06-0.47-1.5-0.84l-0.83,0.83c-0.65-0.41-1.25-0.89-1.77-1.42l0.83-0.83c-0.37-0.44-0.66-0.95-0.84-1.5l-1.2,0.24C4.05,11.4,4,10.7,4,10c0-0.7,0.05-1.4,0.12-1.94l1.2,0.24c0.18-0.55,0.47-1.06,0.84-1.5L5.33,5.97c0.53-0.41,1.1-0.77,1.77-1.09l0.83,0.83c0.44-0.37,0.95-0.66,1.5-0.84L9.19,3.67C9.94,3.05,10.7,3,12,3c1.3,0,2.06,0.05,2.81,0.67l-0.24,1.2c0.55,0.18,1.06,0.47,1.5,0.84l0.83-0.83c0.67,0.32,1.24,0.68,1.77,1.09l-0.83,0.83c0.37,0.44,0.66,0.95,0.84,1.5l1.2-0.24C19.95,8.6,20,9.3,20,10c0,0.7-0.05,1.4-0.12,1.94l-1.2-0.24c-0.18,0.55-0.47,1.06-0.84,1.5l0.83,0.83C17.79,14.78,16.71,15.37,16.03,15.67z"
                    />
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12,16c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S10.9,16,12,16z M12,10c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S10.9,10,12,10z M12,22c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S10.9,22,12,22z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* WebSocket Error Message */}
            {websocketError && (
              <div className="p-2 bg-red-600 text-white text-center font-medium">
                WebSocket Error: {websocketError}
              </div>
            )}

            {/* Chat Messages Container */}
            <div
              className="flex-1 p-4 overflow-y-auto bg-cover bg-center bg-fixed bg-no-repeat bg-gray-800"
              style={{
                backgroundImage: `url("../../assets/bg.jpeg")`,
              }}
            >
              {isInitialLoading ? (
                <div className="flex items-center justify-center h-full">
                  <LoadingSpinner />
                </div>
              ) : messagesError ? (
                <div className="flex items-center justify-center h-full text-red-400 font-semibold">
                  {messagesError}
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <div className="w-24 h-24 mb-4 opacity-60">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      <path d="M8 10h.01" />
                      <path d="M12 10h.01" />
                      <path d="M16 10h.01" />
                    </svg>
                  </div>
                  <div className="text-xl font-semibold text-gray-300">
                    No messages yet
                  </div>
                  <div className="text-sm text-gray-400 mt-2 max-w-xs">
                    Start the conversation by sending your first message
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`max-w-[80%] p-3 rounded-lg relative break-words shadow-md
                        ${
                          message.sender.phoneNumber === currentUserPhoneNumber
                            ? "self-end bg-teal-800 text-white rounded-tr-none" // Sent message bubble
                            : "self-start bg-gray-700 text-white rounded-tl-none" // Received message bubble
                        }
                      `}
                    >
                      {selectedChat.type === "GROUP" &&
                        message.sender.phoneNumber !==
                          currentUserPhoneNumber && (
                          <div className="text-xs font-semibold mb-1 text-teal-300">
                            {message.sender.name || message.sender.phoneNumber}
                          </div>
                        )}
                      <div className="text-sm">{message.content}</div>
                      <div
                        className={`flex items-center justify-end mt-1
                          ${
                            message.sender.phoneNumber === currentUserPhoneNumber
                              ? "ml-auto" // Align to the right for sent messages
                              : "mr-auto" // Align to the left for received messages
                          }
                        `}
                      >
                        <div className="text-xs text-gray-400">
                          {formatMessageTime(message.timestamp)}
                        </div>
                        {message.sender.phoneNumber ===
                          currentUserPhoneNumber && (
                          <div className="ml-1 flex items-center">
                            {renderMessageStatus(message.status)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Container */}
            <div className="relative p-4 bg-gray-800 border-t border-gray-700 flex-shrink-0 min-h-[70px]">
              {showEmojiPicker && (
                <div
                  className="absolute bottom-20 left-4 z-10 shadow-lg rounded-lg overflow-hidden"
                  ref={emojiPickerRef}
                >
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
              <div className="flex items-center gap-2">
                <button
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={toggleEmojiPicker}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M11.99,2C6.47,2,2,6.48,2,12s4.47,10,9.99,10C17.52,22,22,17.52,22,12S17.52,2,11.99,2z M12,20c-4.42,0-8-3.58-8-8s3.58-8,8-8s8,3.58,8,8S16.42,20,12,20z M15.5,11c0.83,0,1.5-0.67,1.5-1.5S16.33,8,15.5,8S14,8.67,14,9.5S14.67,11,15.5,11z M8.5,11c0.83,0,1.5-0.67,1.5-1.5S9.33,8,8.5,8S7,8.67,7,9.5S7.67,11,8.5,11z M12,17.5c2.33,0,4.31-1.46,5.11-3.5H6.89C7.69,16.04,9.67,17.5,12,17.5z"
                    />
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M19,13h-6v6h-2v-6H5v-2h6V5h2v6h6V13z"
                    />
                  </svg>
                </button>
                <input
                  type="text"
                  className="flex-1 h-10 px-4 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Type a message"
                  value={messageInput}
                  onChange={handleMessageInputChange}
                  onKeyPress={handleKeyPress}
                  disabled={isInputDisabled}
                />
                <button
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors
                    ${
                      isInputDisabled
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-teal-600 hover:bg-teal-500 text-white"
                    }
                  `}
                  onClick={handleSendMessage}
                  disabled={isInputDisabled}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M2.01,21L23,12L2.01,3L2,10l15,2L2,14L2.01,21z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </>
        </div>
      )}
    </>
  );
}