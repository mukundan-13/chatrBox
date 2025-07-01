package com.chatapp.mukundan_chatapplication.controller;

import com.chatapp.mukundan_chatapplication.dto.ChatMessageDTO;
import com.chatapp.mukundan_chatapplication.dto.MessageRequestDTO;
import com.chatapp.mukundan_chatapplication.model.ChatMessage;
import com.chatapp.mukundan_chatapplication.exception.UserNotFoundException;
import com.chatapp.mukundan_chatapplication.service.ChatMessageService;
import com.chatapp.mukundan_chatapplication.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class WebSocketChatController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private ChatMessageService chatMessageService;

    @Autowired
    private UserService userService;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload MessageRequestDTO messageRequestDTO, Principal principal) {
        try {
            String senderPhoneNumber = principal.getName();

            ChatMessageDTO savedMessage = chatMessageService.saveMessage(
                    messageRequestDTO.getChatRoomId(),
                    senderPhoneNumber,
                    messageRequestDTO.getContent()
            );

            simpMessagingTemplate.convertAndSend("/topic/chat/" + savedMessage.getChatRoomId(), savedMessage);
            System.out.println("Backend: Sent message ID " + savedMessage.getId() + " with status " + savedMessage.getStatus() + " to chat room " + savedMessage.getChatRoomId());

        } catch (UserNotFoundException | IllegalArgumentException e) {
            System.err.println("Error sending message: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Unexpected error during message sending: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @MessageMapping("/chat.markAsDelivered")
    public void markAsDelivered(@Payload ChatMessageDTO messageDTO, Principal principal) {
        try {
            chatMessageService.updateMessageStatus(messageDTO.getId(), ChatMessage.MessageStatus.DELIVERED);

            ChatMessageDTO updatedMessage = chatMessageService.getChatMessageById(messageDTO.getId());

            simpMessagingTemplate.convertAndSend("/topic/chat/" + updatedMessage.getChatRoomId(), updatedMessage);
            System.out.println("Backend: Marked message ID " + updatedMessage.getId() + " as DELIVERED and broadcasted.");

        } catch (IllegalArgumentException e) {
            System.err.println("Error marking message as delivered: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Unexpected error during marking message as delivered: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @MessageMapping("/chat.markAsRead")
    public void markAsRead(@Payload ChatMessageDTO messageDTO, Principal principal) {
        try {
            chatMessageService.updateMessageStatus(messageDTO.getId(), ChatMessage.MessageStatus.READ);

            ChatMessageDTO updatedMessage = chatMessageService.getChatMessageById(messageDTO.getId());

            simpMessagingTemplate.convertAndSend("/topic/chat/" + updatedMessage.getChatRoomId(), updatedMessage);
            System.out.println("Backend: Marked message ID " + updatedMessage.getId() + " as READ and broadcasted.");

        } catch (IllegalArgumentException e) {
            System.err.println("Error marking message as read: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Unexpected error during marking message as read: " + e.getMessage());
            e.printStackTrace();
        }
    }
}