package com.chatapp.mukundan_chatapplication.controller;

import com.chatapp.mukundan_chatapplication.dto.ChatMessageDTO;
import com.chatapp.mukundan_chatapplication.dto.ChatRoomDTO;
import com.chatapp.mukundan_chatapplication.dto.CreateChatRoomRequest;
import com.chatapp.mukundan_chatapplication.dto.UserProfileDTO;
import com.chatapp.mukundan_chatapplication.model.ChatMessage;
import com.chatapp.mukundan_chatapplication.model.ChatRoom;
import com.chatapp.mukundan_chatapplication.model.User;
import com.chatapp.mukundan_chatapplication.exception.UserNotFoundException;
import com.chatapp.mukundan_chatapplication.service.ChatMessageService;
import com.chatapp.mukundan_chatapplication.service.ChatRoomService;
import com.chatapp.mukundan_chatapplication.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chat")
public class ChatRoomController {

    @Autowired
    private ChatRoomService chatRoomService;

    @Autowired
    private ChatMessageService chatMessageService;

    @Autowired
    private UserService userService;

    @PostMapping("/rooms")
    public ResponseEntity<ChatRoomDTO> createChatRoom(@RequestBody CreateChatRoomRequest request, Authentication authentication) {
        try {
            String authenticatedUserPhoneNumber = authentication.getName();
            User currentUser = userService.getUserByPhoneNumber(authenticatedUserPhoneNumber);

            if (!request.getParticipantIds().contains(currentUser.getId())) {
                request.getParticipantIds().add(currentUser.getId());
            }

            ChatRoomDTO newRoom = chatRoomService.createChatRoom(request);
            return new ResponseEntity<>(newRoom, HttpStatus.CREATED);
        } catch (UserNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomDTO>> getUserChatRooms(Authentication authentication) {
        try {
            String authenticatedUserPhoneNumber = authentication.getName();
            List<ChatRoomDTO> chatRooms = chatRoomService.getChatRoomsForUser(authenticatedUserPhoneNumber);
            return new ResponseEntity<>(chatRooms, HttpStatus.OK);
        } catch (UserNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/rooms/{chatId}/latest")
    public ResponseEntity<ChatMessageDTO> getLatestMsg(@PathVariable String chatId){
        try{
            Optional<ChatMessage> chatMessageOptional = chatRoomService.getLatestMessage(chatId); 

            if (chatMessageOptional.isEmpty()){ 
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            ChatMessage chatMessage = chatMessageOptional.get();

            UserProfileDTO userProfileDTO = new UserProfileDTO(
                    chatMessage.getSender().getId(),
                    chatMessage.getSender().getPhoneNumber(),
                    chatMessage.getSender().getName(),
                    chatMessage.getSender().getProfileImageUrl()
            );

            // Ensure you have a constructor in ChatMessageDTO that matches these parameters
            ChatMessageDTO chatMessageDTO = new ChatMessageDTO(
                    chatMessage.getId(),
                    chatId, // The chatId String from path variable
                    userProfileDTO,
                    chatMessage.getContent(),
                    chatMessage.getTimestamp(),
                    chatMessage.getStatus()
            );

            return new ResponseEntity<>(chatMessageDTO, HttpStatus.OK);

        } catch (Exception e) {
            // Log the exception for debugging
            System.err.println("Error fetching latest message for chat ID " + chatId + ": " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // Use 500 for unexpected errors
        }
    }


    @GetMapping("/rooms/{chatId}/messages")
    public ResponseEntity<List<ChatMessageDTO>> getChatMessages(@PathVariable String chatId, Authentication authentication) {
        try {
            String authenticatedUserPhoneNumber = authentication.getName();

            User currentUser = userService.getUserByPhoneNumber(authenticatedUserPhoneNumber);
            if (currentUser == null) {
                throw new UserNotFoundException("Authenticated user could not be found in database.");
            }

            Optional<ChatRoom> chatRoomOptional = chatRoomService.getChatRoomByChatId(chatId);
            if (chatRoomOptional.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            ChatRoom chatRoom = chatRoomOptional.get();

            if (!chatRoom.getParticipants().contains(currentUser)) {

                throw new AccessDeniedException("User is not authorized to access messages in this chat room.");
            }

            List<ChatMessageDTO> messages = chatMessageService.getMessagesByChatRoomId(chatId);
            return new ResponseEntity<>(messages, HttpStatus.OK);

        } catch (UserNotFoundException e) {

            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (AccessDeniedException e) {

            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

}
