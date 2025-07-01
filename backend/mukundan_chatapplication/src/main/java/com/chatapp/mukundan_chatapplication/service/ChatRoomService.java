package com.chatapp.mukundan_chatapplication.service;


import com.chatapp.mukundan_chatapplication.dto.ChatRoomDTO;
import com.chatapp.mukundan_chatapplication.dto.CreateChatRoomRequest;
import com.chatapp.mukundan_chatapplication.dto.UserProfileDTO;
import com.chatapp.mukundan_chatapplication.model.ChatMessage;
import com.chatapp.mukundan_chatapplication.model.ChatRoom;
import com.chatapp.mukundan_chatapplication.model.User;
import com.chatapp.mukundan_chatapplication.exception.UserNotFoundException;
import com.chatapp.mukundan_chatapplication.repository.ChatRoomRepository;
import com.chatapp.mukundan_chatapplication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ChatRoomService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public ChatRoomDTO createChatRoom(CreateChatRoomRequest request){
        Set<User> participants = request.getParticipantIds().stream()
                .map(id -> userRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("User with ID " + id + " not found"))).collect(Collectors.toSet());

        if (participants.size() != request.getParticipantIds().size()) {
            throw new IllegalArgumentException("One or more participant IDs are invalid.");
        }

        if (request.getType() == ChatRoom.ChatType.SINGLE) {
            if (participants.size() != 2) {
                throw new IllegalArgumentException("Single chat room must have exactly two participants.");
            }
            Optional<ChatRoom> existingRoom = chatRoomRepository.findSingleChatRoomByParticipantIds(
                    participants.stream().map(User::getId).collect(Collectors.toSet())
            );
            if (existingRoom.isPresent()) {
                return convertToDto(existingRoom.get());
            }
        }

        ChatRoom chatRoom = new ChatRoom(
                request.getType(),
                request.getName(),
                participants
        );

        if (request.getType() == ChatRoom.ChatType.SINGLE && (request.getName() == null || request.getName().isEmpty())) {

            chatRoom.setName(null);
        }

        chatRoom = chatRoomRepository.save(chatRoom);
        return convertToDto(chatRoom);

    }

    public List<ChatRoomDTO> getChatRoomsForUser(String phoneNumber) throws UserNotFoundException {
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new UserNotFoundException("User not found with phone number: " + phoneNumber));

        List<ChatRoom> chatRooms = chatRoomRepository.findChatRoomsByParticipantId(user.getId());
        return chatRooms.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<ChatRoom> getChatRoomByChatId(String chatId) {
        return chatRoomRepository.findByChatId(chatId);
    }

    public Optional<ChatMessage> getLatestMessage(String chatId){
        return chatRoomRepository.findLatestMessageByChatRoomChatId(chatId);
    }

    private ChatRoomDTO convertToDto(ChatRoom chatRoom) {
        List<UserProfileDTO> participantDTOs = chatRoom.getParticipants().stream()
                .map(user -> new UserProfileDTO(
                        user.getId(),
                        user.getName(),
                        user.getPhoneNumber(),
                        user.getAbout(),
                        user.getProfileImageUrl(),
                        user.isVerified()
                ))
                .collect(Collectors.toList());

        return new ChatRoomDTO(
                chatRoom.getChatId(),
                chatRoom.getType(),
                chatRoom.getName(),
                participantDTOs,
                chatRoom.getCreatedAt(),
                chatRoom.getUpdatedAt()
        );
    }

    public Optional<ChatRoom> getChatRoomById(Long id) {
        return chatRoomRepository.findById(id);
    }

}

