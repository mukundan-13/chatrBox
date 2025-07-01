import React, { useState } from "react";
import { createChatRoom, getUserByPhoneNumber } from "../../userApi";
import { useSelector } from "react-redux";
import { userData } from "../../userSlice";

export default function AddContact({ onBack, onStartChat }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const user = useSelector(userData);

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;

    const cleanedValue = value.replace(/[^\d+]/g, "");
    setPhoneNumber(cleanedValue);
    setError("");
  };

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10,14}$/;
    return phoneRegex.test(number.replace(/\s/g, ""));
  };

  const handleStartChat = async () => {
    if (!phoneNumber.trim()) {
      setError("Please enter a phone number");
      return;
    }


    setIsLoading(true);
    setError("");

    try {
      const targetUser = await getUserByPhoneNumber(phoneNumber);

      console.log("Target User: ", targetUser);

      if (targetUser && targetUser.id && user.id) {
        const currentUserId = Number(user.id);
        const targetUserId = targetUser.id;

        const createChatRoomReq = {
          name: "Unknown User",
          type: "SINGLE",
          participantIds: [currentUserId, targetUserId],
        };

        console.log("Chat Room Req: ", createChatRoomReq);

        const response = await createChatRoom(createChatRoomReq);

        console.log("Chat Room Res: ", response);

        onStartChat(response);
        onBack();
      }

      setPhoneNumber("");
    } catch (error) {
      console.log("Here is error message: ", error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleStartChat();
    }
  };

  return (
    <div className="add-contact-container">
      <div className="add-contact-header">
        <button className="back-button" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
            />
          </svg>
        </button>
        <div className="header-title">Add Contact</div>
      </div>

      <div className="add-contact-content">
        <div className="contact-form">
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="phone-input"
              placeholder="Enter phone number (e.g., +1234567890)"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            className="start-chat-button"
            onClick={handleStartChat}
            disabled={isLoading || !phoneNumber.trim()}
          >
            {isLoading ? "Starting Chat..." : "Start Chat"}
          </button>
        </div>

        <div className="help-text">
          <p>Enter a phone number to start a new conversation.</p>
          <p>Make sure to include the country code (e.g., +1 for US).</p>
        </div>
      </div>
    </div>
  );
}
