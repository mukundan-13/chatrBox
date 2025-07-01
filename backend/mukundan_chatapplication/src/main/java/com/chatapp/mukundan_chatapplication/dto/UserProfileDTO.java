package com.chatapp.mukundan_chatapplication.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

public class UserProfileDTO {


    private Long id;
    private String phoneNumber;
    private boolean isVerified;


    @NotBlank(message = "Name cannot be empty")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    private String name;

    @Size(max = 500, message = "About must be less than 500 characters")
    private String about;

    @Pattern(regexp = "^(http|https|ftp)://.*\\.(jpeg|jpg|png|gif|bmp|webp)$|^$", message = "Invalid profile image URL format")
    @Size(max = 2048, message = "Profile image URL is too long")
    private String profileImageUrl;


    public UserProfileDTO() {
    }


    public UserProfileDTO(Long id, String name, String phoneNumber, String about, String profileImageUrl, boolean isVerified) {
        this.id = id;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.about = about;
        this.profileImageUrl = profileImageUrl;
        this.isVerified = isVerified;
    }

    public UserProfileDTO(Long id, String phoneNumber, String name, String profileImageUrl) {
        this.id = id;
        this.phoneNumber = phoneNumber;
        this.name = name;
        this.profileImageUrl = profileImageUrl;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getAbout() {
        return about;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public boolean getIsVerified() {
        return isVerified;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public void setIsVerified(boolean verified) {
        isVerified = verified;
    }
}
