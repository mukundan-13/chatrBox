package com.chatapp.mukundan_chatapplication.dto;

import com.chatapp.mukundan_chatapplication.model.ChatRoom;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

public class ChatRoomDTO {

    private String chatId;
    private ChatRoom.ChatType type;
    private String name;
    private List<UserProfileDTO> participants;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ChatRoomDTO() {
    }

    public ChatRoomDTO(String chatId, ChatRoom.ChatType type, String name, List<UserProfileDTO> participants, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.chatId = chatId;
        this.type = type;
        this.name = name;
        this.participants = participants;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getChatId() {
        return chatId;
    }

    public void setChatId(String chatId) {
        this.chatId = chatId;
    }

    public ChatRoom.ChatType getType() {
        return type;
    }

    public void setType(ChatRoom.ChatType type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<UserProfileDTO> getParticipants() {
        return participants;
    }

    public void setParticipants(List<UserProfileDTO> participants) {
        this.participants = participants;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChatRoomDTO that = (ChatRoomDTO) o;
        return Objects.equals(chatId, that.chatId) &&
                type == that.type &&
                Objects.equals(name, that.name) &&
                Objects.equals(participants, that.participants) &&
                Objects.equals(createdAt, that.createdAt) &&
                Objects.equals(updatedAt, that.updatedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(chatId, type, name, participants, createdAt, updatedAt);
    }

    @Override
    public String toString() {
        return "ChatRoomDTO{" +
                "chatId='" + chatId + '\'' +
                ", type=" + type +
                ", name='" + name + '\'' +
                ", participants=" + participants +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
