package com.chatapp.mukundan_chatapplication.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("mukundan386@gmail.com ");
        message.setTo(toEmail);
        message.setSubject("Your ChatrBox OTP Code");
        message.setText("Your OTP code is: " + otp + "\nThis code is valid for 5 minutes.");

        mailSender.send(message);
    }
}
