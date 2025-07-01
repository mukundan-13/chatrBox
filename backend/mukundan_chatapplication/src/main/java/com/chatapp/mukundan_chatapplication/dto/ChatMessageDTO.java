package com.chatapp.mukundan_chatapplication.dto;

import com.chatapp.mukundan_chatapplication.model.ChatMessage;

import java.time.LocalDateTime;
import java.util.Objects;

public class ChatMessageDTO {

    private Long id;
    private String chatRoomId; 
    private UserProfileDTO sender; 
    private String content;
    private LocalDateTime timestamp;
    private ChatMessage.MessageStatus status;

    public ChatMessageDTO() {
    }

    public ChatMessageDTO(Long id, String chatRoomId, UserProfileDTO sender, String content, LocalDateTime timestamp, ChatMessage.MessageStatus status) {
        this.id = id;
        this.chatRoomId = chatRoomId;
        this.sender = sender;
        this.content = content;
        this.timestamp = timestamp;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getChatRoomId() {
        return chatRoomId;
    }

    public void setChatRoomId(String chatRoomId) {
        this.chatRoomId = chatRoomId;
    }

    public UserProfileDTO getSender() {
        return sender;
    }

    public void setSender(UserProfileDTO sender) {
        this.sender = sender;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public ChatMessage.MessageStatus getStatus() {
        return status;
    }

    public void setStatus(ChatMessage.MessageStatus status) {
        this.status = status;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChatMessageDTO that = (ChatMessageDTO) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(chatRoomId, that.chatRoomId) &&
                Objects.equals(sender, that.sender) &&
                Objects.equals(content, that.content) &&
                Objects.equals(timestamp, that.timestamp) &&
                status == that.status;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, chatRoomId, sender, content, timestamp, status);
    }

    @Override
    public String toString() {
        return "ChatMessageDTO{" +
                "id=" + id +
                ", chatRoomId='" + chatRoomId + '\'' +
                ", sender=" + sender +
                ", content='" + content + '\'' +
                ", timestamp=" + timestamp +
                ", status=" + status +
                '}';
    }
}
