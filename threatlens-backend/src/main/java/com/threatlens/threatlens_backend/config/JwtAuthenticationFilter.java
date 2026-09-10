package com.threatlens.threatlens_backend.config;

import com.threatlens.threatlens_backend.entity.User;
import com.threatlens.threatlens_backend.repository.UserRepository;
import com.threatlens.threatlens_backend.service.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(
            JwtUtil jwtUtil,
            UserRepository userRepository
    ) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            try {

                String username = jwtUtil.extractUsername(token);

                User user = userRepository
                        .findByUsername(username)
                        .orElse(null);

                if (user != null &&
                        SecurityContextHolder
                                .getContext()
                                .getAuthentication() == null) {

                    String role = user.getRole();

                    var authority =
                            new SimpleGrantedAuthority(
                                    "ROLE_" + role
                            );

                    var authentication =
                            new UsernamePasswordAuthenticationToken(
                                    username,
                                    null,
                                    List.of(authority)
                            );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authentication);
                }

            } catch (Exception e) {

                System.out.println(
                        "Invalid JWT token: " + e.getMessage()
                );
            }
        }

        filterChain.doFilter(request, response);
    }
}