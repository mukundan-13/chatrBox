package com.chatapp.mukundan_chatapplication.dto;

import java.util.Objects;

public class MessageRequestDTO {

    private String chatRoomId;
    private String content;

    public MessageRequestDTO() {
    }

    public MessageRequestDTO(String chatRoomId, String content) {
        this.chatRoomId = chatRoomId;
        this.content = content;
    }

    public String getChatRoomId() {
        return chatRoomId;
    }

    public void setChatRoomId(String chatRoomId) {
        this.chatRoomId = chatRoomId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MessageRequestDTO that = (MessageRequestDTO) o;
        return Objects.equals(chatRoomId, that.chatRoomId) &&
                Objects.equals(content, that.content);
    }

    @Override
    public int hashCode() {
        return Objects.hash(chatRoomId, content);
    }

    @Override
    public String toString() {
        return "MessageRequestDTO{" +
                "chatRoomId='" + chatRoomId + '\'' +
                ", content='" + content + '\'' +
                '}';
    }
}
