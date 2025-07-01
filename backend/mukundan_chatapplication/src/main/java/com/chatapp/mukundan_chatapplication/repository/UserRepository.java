package com.chatapp.mukundan_chatapplication.repository;

import com.chatapp.mukundan_chatapplication.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
Optional<User> findByPhoneNumber(String phoneNumber);
}
