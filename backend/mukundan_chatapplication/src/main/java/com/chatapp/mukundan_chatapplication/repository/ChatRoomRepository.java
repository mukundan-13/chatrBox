package com.chatapp.mukundan_chatapplication.repository;

import com.chatapp.mukundan_chatapplication.model.ChatMessage;
import com.chatapp.mukundan_chatapplication.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    Optional<ChatRoom> findByChatId(String chatId);

    @Query("SELECT cr FROM ChatRoom cr JOIN cr.participants p WHERE cr.type = 'SINGLE' AND p.id IN :userIds GROUP BY cr HAVING COUNT(p.id) = 2")
    Optional<ChatRoom> findSingleChatRoomByParticipantIds(@Param("userIds") Set<Long> userIds);

    @Query("SELECT cr FROM ChatRoom cr JOIN cr.participants p WHERE p.id = :userId")
    List<ChatRoom> findChatRoomsByParticipantId(@Param("userId") Long userId);

    @Query("SELECT cm FROM ChatMessage cm JOIN cm.chatRoom cr WHERE cr.chatId = :chatRoomChatId ORDER BY cm.timestamp DESC LIMIT 1")
    Optional<ChatMessage> findLatestMessageByChatRoomChatId(@Param("chatRoomChatId") String chatRoomChatId);
}
