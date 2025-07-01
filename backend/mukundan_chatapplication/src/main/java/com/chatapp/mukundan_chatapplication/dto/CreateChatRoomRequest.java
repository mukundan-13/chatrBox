package com.chatapp.mukundan_chatapplication.dto;

import com.chatapp.mukundan_chatapplication.model.ChatRoom;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.Objects;

public class CreateChatRoomRequest {

    @NotNull(message = "Chat type is required")
    private ChatRoom.ChatType type;

    private String name;

    @NotNull(message = "Participant IDs are required")
    private List<Long> participantIds;


    public @NotNull(message = "Chat type is required") ChatRoom.ChatType getType() {
        return type;
    }

    public void setType(@NotNull(message = "Chat type is required") ChatRoom.ChatType type) {
        this.type = type;
    }

    public CreateChatRoomRequest() {
    }

    public CreateChatRoomRequest(ChatRoom.ChatType type, String name, List<Long> participantIds) {
        this.type = type;
        this.name = name;
        this.participantIds = participantIds;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Long> getParticipantIds() {
        return participantIds;
    }

    public void setParticipantIds(List<Long> participantIds) {
        this.participantIds = participantIds;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CreateChatRoomRequest that = (CreateChatRoomRequest) o;
        return type == that.type &&
                Objects.equals(name, that.name) &&
                Objects.equals(participantIds, that.participantIds);
    }

    @Override
    public int hashCode() {
        return Objects.hash(type, name, participantIds);
    }

    @Override
    public String toString() {
        return "CreateChatRoomRequest{" +
                "type=" + type +
                ", name='" + name + '\'' +
                ", participantIds=" + participantIds +
                '}';
    }
}
