package com.chatapp.mukundan_chatapplication.controller;

import com.chatapp.mukundan_chatapplication.model.User;
import com.chatapp.mukundan_chatapplication.exception.UserNotFoundException;
import com.chatapp.mukundan_chatapplication.security.JwtTokenProvider;
import com.chatapp.mukundan_chatapplication.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;



    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> payload){
        String name = payload.get("name");
        String phoneNumber = payload.get("phoneNumber");
        String email = payload.get("email");

        if(name == null || name.trim().isEmpty() || phoneNumber == null || phoneNumber.trim().isEmpty() || email == null || email.trim().isEmpty()){
            Map<String, String> error = new HashMap<>();
            error.put("Error", "Bad Request");
            error.put("message", "Name and phone number are required!");

            return ResponseEntity.badRequest().body(error);
        }

        User regUser = userService.registerPhoneNumber(name, email,phoneNumber );
        Map<String, String> response = new HashMap<>();

        response.put("message", "User registered successfully.");
        response.put("userId", regUser.getId().toString());
        response.put("phoneNumber", regUser.getPhoneNumber());
        response.put("code", "0");


        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> payload) throws UserNotFoundException {
        String phoneNumber = payload.get("phoneNumber");

        if(phoneNumber == null || phoneNumber.trim().isEmpty()){
            Map<String, String> errorResponse = new HashMap<>();

            errorResponse.put("Error", "Bad Request");
            errorResponse.put("message", "Phone number is required");

            return ResponseEntity.badRequest().body(errorResponse);
        }

        userService.sendOtpAsync(phoneNumber);

        Map<String, String> response = new HashMap<>();
        response.put("message", "OTP sent successfully.");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> payload) throws UserNotFoundException {
        String phoneNumber = payload.get("phoneNumber");
        String otp = payload.get("otp");

        if(phoneNumber == null || phoneNumber.trim().isEmpty() || otp == null || otp.trim().isEmpty()){
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("Error", "Bad Request");
            errorResponse.put("message", "Phone number and OTP are required.");

            return ResponseEntity.badRequest().body(errorResponse);
        }

        boolean isVerified = userService.verifyOtp(phoneNumber, otp);

        if(isVerified){
            String token =jwtTokenProvider.generateToken(phoneNumber);
            User user = userService.getUserByPhoneNumber(phoneNumber);
            Long id = user.getId();
            String name = user.getName();
            String about = user.getAbout();
            String profileImageUrl = user.getProfileImageUrl();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Phone number verified successfully.");
            response.put("id", String.valueOf(id));
            response.put("token", token);
            response.put("name", name);
            response.put("phoneNumber", phoneNumber);
            response.put("about", about);
            response.put("profileImageUrl", profileImageUrl);

            return ResponseEntity.ok(response);
        }else {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Unauthorized");
            errorResponse.put("message", "Invalid OTP or OTP expired.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }


}
