package com.campusone.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
public class FirebaseTokenFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        String idToken = authHeader.substring(BEARER_PREFIX.length()).trim();

        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);

            Map<String, Object> claims = new HashMap<>();
            claims.put("uid",     decodedToken.getUid());
            claims.put("email",   decodedToken.getEmail());
            claims.put("name",    decodedToken.getName());
            claims.put("picture", decodedToken.getPicture());
            claims.putAll(decodedToken.getClaims());

            // Determine role from custom claims (default STUDENT)
            String role = (String) decodedToken.getClaims().getOrDefault("role", "STUDENT");
            List<SimpleGrantedAuthority> authorities =
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role));

            FirebaseAuthenticationToken authentication =
                    new FirebaseAuthenticationToken(decodedToken.getUid(), claims, authorities);

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Expose claims as a request attribute for controllers
            request.setAttribute("firebaseClaims", claims);

            log.debug("Firebase token verified for UID: {}", decodedToken.getUid());

        } catch (FirebaseAuthException e) {
            log.warn("Invalid Firebase ID token: {}", e.getMessage());
            SecurityContextHolder.clearContext();
            sendUnauthorized(response, "Invalid or expired Firebase token");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void sendUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(
                "{\"success\":false,\"message\":\"" + message + "\"}"
        );
    }
}
