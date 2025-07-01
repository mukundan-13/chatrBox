package com.chatapp.mukundan_chatapplication.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JoinColumnOrFormula;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @Column
    private String otp;

    @Column
    private LocalDateTime otpCreatedAt;

    @Column(nullable = false)
    private boolean isVerified;


    @Column(length = 2048)
    private String profileImageUrl;

    @Column(length = 500)
    private String about;


    public User() {
    }

    public User(String name, String phoneNumber, String otp, boolean isVerified) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.otp = otp;
        this.isVerified = isVerified;
        this.otpCreatedAt = LocalDateTime.now();
    }

    public User(String name, String phoneNumber) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.otp = null;
        this.isVerified = false;
        this.otpCreatedAt = null;
        this.profileImageUrl = null;
        this.about = null;
    }

    public User(String name, String email, String phoneNumber) {
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.otp = null;
        this.isVerified = false;
        this.otpCreatedAt = null;
        this.profileImageUrl = null;
        this.about = null;
    }

    public User(Long id, String name, String phoneNumber, String otp, boolean isVerified) {
        this.id = id;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.otp = otp;
        this.isVerified = isVerified;
        this.otpCreatedAt = LocalDateTime.now();
    }


    public User(Long id, String name, String phoneNumber, String otp, LocalDateTime otpCreatedAt, boolean isVerified, String profileImageUrl, String about) {
        this.id = id;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.otp = otp;
        this.otpCreatedAt = otpCreatedAt;
        this.isVerified = isVerified;
        this.profileImageUrl = profileImageUrl;
        this.about = about;
    }

    public User(String name, String phoneNumber, String otp, LocalDateTime otpCreatedAt, boolean isVerified, String profileImageUrl, String about) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.otp = otp;
        this.otpCreatedAt = otpCreatedAt;
        this.isVerified = isVerified;
        this.profileImageUrl = profileImageUrl;
        this.about = about;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
        this.otpCreatedAt = LocalDateTime.now();
    }

    public LocalDateTime getOtpCreatedAt() {
        return otpCreatedAt;
    }

    public void setOtpCreatedAt(LocalDateTime otpCreatedAt) {
        this.otpCreatedAt = otpCreatedAt;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getPassword() {
        return "";
    }

    @Override
    public String getUsername() {
        return "";
    }

    @Override
    public boolean isAccountNonExpired() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'isAccountNonExpired'");
    }

    @Override
    public boolean isAccountNonLocked() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'isAccountNonLocked'");
    }

    @Override
    public boolean isCredentialsNonExpired() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'isCredentialsNonExpired'");
    }

    @Override
    public boolean isEnabled() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'isEnabled'");
    }
}
