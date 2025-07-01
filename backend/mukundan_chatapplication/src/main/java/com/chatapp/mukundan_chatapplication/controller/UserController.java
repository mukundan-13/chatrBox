package com.chatapp.mukundan_chatapplication.controller;

import com.chatapp.mukundan_chatapplication.dto.UserProfileDTO;
import com.chatapp.mukundan_chatapplication.model.User;
import com.chatapp.mukundan_chatapplication.exception.UserNotFoundException; // Keep this import
import com.chatapp.mukundan_chatapplication.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile(Principal principal) throws UserNotFoundException {

        if (principal == null || principal.getName() == null) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        String phoneNumber = principal.getName();

        User user = userService.getUserByPhoneNumber(phoneNumber);

        UserProfileDTO userProfileDTO = new UserProfileDTO(
                user.getId(),
                user.getName(),
                user.getPhoneNumber(),
                user.getAbout(),
                user.getProfileImageUrl(),
                user.isVerified()
        );

        return ResponseEntity.ok(userProfileDTO);
    }

    @GetMapping("/by-phone/{phoneNumber}")
    public  ResponseEntity<UserProfileDTO> getUserByPhoneNumber(@PathVariable String phoneNumber) throws UserNotFoundException {
        User user = userService.getUserByPhoneNumber(phoneNumber);

        UserProfileDTO userProfileDTO = new UserProfileDTO(
                user.getId(),
                user.getName(),
                user.getPhoneNumber(),
                user.getAbout(),
                user.getProfileImageUrl(),
                user.isVerified()
        );

        return ResponseEntity.ok(userProfileDTO);

    }


    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(@Valid @RequestBody UserProfileDTO updateDTO, Principal principal) throws UserNotFoundException {

        if (principal == null || principal.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        String phoneNumber = principal.getName();

        User updatedUser = userService.updateProfile(
                phoneNumber,
                updateDTO.getName(),
                updateDTO.getAbout(),
                updateDTO.getProfileImageUrl()
        );
        UserProfileDTO responseDTO = new UserProfileDTO(
                updatedUser.getId(),
                updatedUser.getName(),
                updatedUser.getPhoneNumber(),
                updatedUser.getAbout(),
                updatedUser.getProfileImageUrl(),
                updatedUser.isVerified()
        );

        return ResponseEntity.ok(responseDTO);
    }
}
