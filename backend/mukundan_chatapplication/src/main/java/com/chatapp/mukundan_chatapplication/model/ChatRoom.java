package com.chatapp.mukundan_chatapplication.model;

import jakarta.persistence.*;


import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "chat_rooms")
public class ChatRoom {

    public enum ChatType{
        SINGLE,
        GROUP
    }

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;
    @Column(name = "chat_id", unique = true, updatable = false, nullable = false)
    private String chatId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChatType type;

    private String name;

    @ManyToMany
    @JoinTable(name = "chat_room_participants",
            joinColumns = @JoinColumn(name = "chat_room_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> participants = new HashSet<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public ChatRoom() {
    }

    public ChatRoom(Long id, String chatId, ChatType type, String name, Set<User> participants, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.chatId = chatId;
        this.type = type;
        this.name = name;
        this.participants = participants;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }


    public ChatRoom(String chatId, ChatType type, String name, Set<User> participants, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.chatId = chatId;
        this.type = type;
        this.name = name;
        this.participants = participants;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public ChatRoom(ChatType type, String name, Set<User> participants) {
        this.type = type;
        this.name = name;
        this.participants = participants;
    }

    public ChatRoom(ChatType type, Set<User> participants) {
        this(type, null, participants);
    }

    public Long getId() {
        return id;
    }


    public String getChatId() {
        return chatId;
    }
    public ChatType getType() {
        return type;
    }

    public void setType(ChatType type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<User> getParticipants() {
        return participants;
    }

    public void setParticipants(Set<User> participants) {
        this.participants = participants;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate(){
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if(this.chatId == null || this.chatId.isEmpty()){ 
            this.chatId = java.util.UUID.randomUUID().toString();
        }
    }

    @PreUpdate
    protected void onUpdate(){
        this.updatedAt = LocalDateTime.now();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChatRoom chatRoom = (ChatRoom) o;
       
        if (id != null) {
            return Objects.equals(id, chatRoom.id);
        } else {
            return Objects.equals(chatId, chatRoom.chatId);
        }
    }

    @Override
    public int hashCode() {
        return id != null ? Objects.hash(id) : Objects.hash(chatId != null ? chatId : System.identityHashCode(this));
    }

    @Override
    public String toString() {
        return "ChatRoom{" +
                "id=" + id +
                ", chatId='" + chatId + '\'' +
                ", type=" + type +
                ", name='" + name + '\'' +
                ", participantsCount=" + (participants != null ? participants.size() : 0) +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
