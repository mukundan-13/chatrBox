package com.chatapp.mukundan_chatapplication.repository;


import com.chatapp.mukundan_chatapplication.model.ChatMessage;
import com.chatapp.mukundan_chatapplication.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByChatRoomOrderByTimestampAsc(ChatRoom chatRoom);

    @Query("SELECT cm FROM ChatMessage cm " +
            "JOIN FETCH cm.chatRoom " +
            "JOIN FETCH cm.sender " +
            "WHERE cm.id = :messageId")
    Optional<ChatMessage> findByIdWithChatRoomAndSender(@Param("messageId") Long messageId);
}