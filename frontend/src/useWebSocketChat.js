import React, { useCallback, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useSelector } from "react-redux";
import { userData } from "./userSlice";


export const useWebSocketChat = (chatRoomId, onMessageReceived) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const stompClientRef = useRef(null);
  const subscriptionRef = useRef(null);

  const user = useSelector(userData);

  const getAuthHeaders = useCallback(() => {
    const accessToken = user.token;
    if (!accessToken) {
      console.warn("No authentication token found.");
      return {};
    }
    return {
      Authorization: `Bearer ${accessToken}`,
    };
  }, [user.token]);

  const sendMessage = useCallback(
    (messageContent) => {
      if (
        stompClientRef.current &&
        stompClientRef.current.connected &&
        chatRoomId &&
        messageContent.trim()
      ) {
        const chatMessage = {
          chatRoomId: chatRoomId,
          content: messageContent.trim(),
        };
        const headers = getAuthHeaders();

        try {
          stompClientRef.current.send(
            "/app/chat.sendMessage",
            headers,
            JSON.stringify(chatMessage)
          );
          console.log("Message sent:", chatMessage);
        } catch (sendError) {
          console.error("Failed to send message via WebSocket:", sendError);
          setError("Failed to send message.");
        }
      } else {
        console.warn(
          "WebSocket not connected or chatRoomId/messageContent missing."
        );
        setError("Cannot send message: Not connected or invalid input.");
      }
    },
    [chatRoomId, getAuthHeaders]
  );

  // Improved function to mark a message as delivered
  const markMessageAsDelivered = useCallback(
    (messageId) => {
      if (
        stompClientRef.current &&
        stompClientRef.current.connected &&
        chatRoomId &&
        messageId
      ) {
        const messageUpdate = {
          id: messageId,
          chatRoomId: chatRoomId,
        };
        const headers = getAuthHeaders();
        try {
          stompClientRef.current.send(
            "/app/chat.markAsDelivered",
            headers,
            JSON.stringify(messageUpdate)
          );
          console.log(
            `Sent request to mark message ${messageId} as DELIVERED.`
          );
        } catch (updateError) {
          console.error(
            `Failed to mark message ${messageId} as delivered:`,
            updateError
          );
        }
      } else {
        console.warn(
          "Cannot mark message as delivered: WebSocket not connected or missing IDs."
        );
      }
    },
    [chatRoomId, getAuthHeaders]
  );

  // Improved function to mark a message as read
  const markMessageAsRead = useCallback(
    (messageId) => {
      if (
        stompClientRef.current &&
        stompClientRef.current.connected &&
        chatRoomId &&
        messageId
      ) {
        const messageUpdate = {
          id: messageId,
          chatRoomId: chatRoomId,
        };
        const headers = getAuthHeaders();
        try {
          stompClientRef.current.send(
            "/app/chat.markAsRead",
            headers,
            JSON.stringify(messageUpdate)
          );
          console.log(`Sent request to mark message ${messageId} as READ.`);
        } catch (updateError) {
          console.error(
            `Failed to mark message ${messageId} as read:`,
            updateError
          );
        }
      } else {
        console.warn(
          "Cannot mark message as read: WebSocket not connected or missing IDs."
        );
      }
    },
    [chatRoomId, getAuthHeaders]
  );

  useEffect(() => {
    // Cleanup function
    const cleanup = () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
        console.log("Unsubscribed from previous chat topic.");
      }
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.deactivate();
        console.log("Disconnected existing WebSocket clients.");
      }
      setIsConnected(false);
    };

    // Clean up previous connection
    cleanup();

    if (!chatRoomId) {
      setError(null);
      return;
    }

    const accessToken = user.token;
    if (!accessToken) {
      setError("No authentication token found for WebSocket connection.");
      return;
    }

    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = Stomp.over(socket);
    stompClientRef.current = stompClient;

    const headers = getAuthHeaders();

    stompClient.connect(
      headers,
      () => {
        console.log(`Connected to WebSocket for chat room: ${chatRoomId}`);
        setIsConnected(true);
        setError(null);

        subscriptionRef.current = stompClient.subscribe(
          `/topic/chat/${chatRoomId}`,
          (message) => {
            try {
              const receivedMessage = JSON.parse(message.body);
              console.log("Raw WebSocket message received:", receivedMessage);

              if (onMessageReceived) {
                onMessageReceived(receivedMessage);
              }
            } catch (parseError) {
              console.error("Failed to parse WebSocket message:", parseError);
            }
          },
          headers
        );
      },
      (connectError) => {
        console.error("WebSocket connection error:", connectError);
        setIsConnected(false);
        setError(
          `WebSocket connection failed: ${connectError.message || connectError}`
        );
      }
    );

    // Return cleanup function
    return cleanup;
  }, [chatRoomId, onMessageReceived, getAuthHeaders, user.token]);

  return {
    isConnected,
    error,
    sendMessage,
    markMessageAsDelivered,
    markMessageAsRead,
  };
};

