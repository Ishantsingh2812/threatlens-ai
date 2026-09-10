package com.threatlens.threatlens_backend.controller;

import com.threatlens.threatlens_backend.entity.User;
import com.threatlens.threatlens_backend.repository.UserRepository;
import com.threatlens.threatlens_backend.service.JwtUtil;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public Map<String, String> register(
            @RequestBody User user
    ) {

        if (userRepository.existsByUsername(user.getUsername())) {
            return Map.of(
                    "message",
                    "Username already exists"
            );
        }

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        user.setRole("USER");

        userRepository.save(user);

        return Map.of(
                "message",
                "Registration successful"
        );
    }

    @PostMapping("/login")
    public Map<String, String> login(
            @RequestBody User user
    ) {

        User existingUser = userRepository
                .findByUsername(user.getUsername())
                .orElseThrow(() ->
                        new RuntimeException("Invalid username or password")
                );

        if (!passwordEncoder.matches(
                user.getPassword(),
                existingUser.getPassword()
        )) {
            throw new RuntimeException(
                    "Invalid username or password"
            );
        }

        String token = jwtUtil.generateToken(
                existingUser.getUsername()
        );

        return Map.of(
                "token", token,
                "username", existingUser.getUsername(),
                "role", existingUser.getRole()
        );
    }
}
