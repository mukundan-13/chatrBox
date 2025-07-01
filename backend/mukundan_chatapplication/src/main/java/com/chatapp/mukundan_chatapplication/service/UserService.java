package com.chatapp.mukundan_chatapplication.service;

import com.chatapp.mukundan_chatapplication.model.User;
import com.chatapp.mukundan_chatapplication.exception.IncorrectOtpException;
import com.chatapp.mukundan_chatapplication.exception.RegisteredUserException;
import com.chatapp.mukundan_chatapplication.exception.UserNotFoundException;
import com.chatapp.mukundan_chatapplication.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.Random;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private static final int OTP_LENGTH = 6;
    private static final int OTP_VALIDITY_MINUTES = 5;


    @Autowired
    UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    private final Random random = new Random();

    @Async
    public void sendOtpAsync(String phoneNumber) throws UserNotFoundException {
        String otp = generateOtp(OTP_LENGTH);
        Optional<User> searchUser = userRepository.findByPhoneNumber(phoneNumber);
        if(searchUser.isPresent()){
            User user = searchUser.get();
            user.setOtp(otp);
            user.setOtpCreatedAt(LocalDateTime.now());
            user.setVerified(false);
            userRepository.save(user);
            logger.info("OTP sent to phone number: {}", phoneNumber);
           sendOtpNotification(user.getEmail(), otp);
        }
        else {
            logger.warn("Attempted OTP sent to unregistered phone number: {}", phoneNumber);
            throw new UserNotFoundException("This user is not registered to ChatrBox app");
        }
    }

    private void sendOtpNotification(String email, String otp){
        logger.info("Simulating sending OTP '{}' to phone number: {}", otp, email);
        emailService.sendOtpEmail(email, otp);
    }

    public User getUserByPhoneNumber(String phoneNumber) throws UserNotFoundException {
        Optional<User> optionalUser = userRepository.findByPhoneNumber(phoneNumber);
        if(optionalUser.isPresent()){
            User user = optionalUser.get();
            return user;
        }else{
            throw new UserNotFoundException("This user is not registered to ChatrBox app");
        }
    }


@Transactional
    public boolean verifyOtp(String phoneNumber, String otp) throws UserNotFoundException {
        Optional<User> optionalUser = userRepository.findByPhoneNumber(phoneNumber);
        if(optionalUser.isPresent()){
            User user = optionalUser.get();
           if(user.getOtp() != null && user.getOtpCreatedAt() != null && LocalDateTime.now().isBefore(user.getOtpCreatedAt().plus(OTP_VALIDITY_MINUTES, ChronoUnit.MINUTES))){
               if(user.getOtp().equals(otp)){
                   user.setVerified(true);
                   user.setOtp(null);
                   user.setOtpCreatedAt(null);
                   userRepository.save(user);
                   logger.info("OTP Verified for phone number: {}", phoneNumber);
                   return true;
               }else{
                   logger.warn("Incorrect OTP provided for phonr number: {}", phoneNumber);
                   throw new IncorrectOtpException("Incorrect OTP!");
               }
           }else{
               logger.warn("OTP expired for phone number: {}", phoneNumber);
               user.setVerified(false);
               user.setOtp(null);
               user.setOtpCreatedAt(null);
               userRepository.save(user);
               return false;
           }
        }else {
            logger.warn("Attempted OTP sent to unregistered phone number: {}", phoneNumber);
            throw new UserNotFoundException("This user is not registered to ChatrBox app");

        }
    }

    @Transactional
    public User registerPhoneNumber(String name, String email, String phoneNumber){
        Optional<User> optionalUser = userRepository.findByPhoneNumber(phoneNumber);
        if (optionalUser.isPresent()){
            logger.warn("Attempted registration with already registered phone number: {}", phoneNumber);
throw new RegisteredUserException("This Phone Number Already Registered!");
        }else {
            User user = new User(name, email, phoneNumber);
            userRepository.save(user);
            logger.info("New user registered with phone number: {}", phoneNumber);
            return user;
        }
    }

    @Transactional
    public User updateProfile(String phoneNumber, String name, String about, String profileImageUrl) throws UserNotFoundException {
        Optional<User> optionalUser = userRepository.findByPhoneNumber(phoneNumber);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            if (name != null && !name.trim().isEmpty()) {
                user.setName(name.trim());
            }
            if (about != null) {
                user.setAbout(about.trim());
            }
            if (profileImageUrl != null && !profileImageUrl.trim().isEmpty()) {
                user.setProfileImageUrl(profileImageUrl.trim());
            } else if (profileImageUrl != null && profileImageUrl.trim().isEmpty()) {
                user.setProfileImageUrl(null);
            }


            User updatedUser = userRepository.save(user);
            logger.info("User profile updated for phone number: {}", phoneNumber);
            return updatedUser;
        } else {
            logger.warn("Attempted to update profile for unregistered phone number: {}", phoneNumber);
            throw new UserNotFoundException("User not found with phone number: " + phoneNumber);
        }
    }

    private String generateOtp(int length){
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i<length; i++){
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }
}
