package com.campusone.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.Map;

/**
 * Custom Spring Security Authentication token backed by a verified Firebase ID token.
 */
public class FirebaseAuthenticationToken extends AbstractAuthenticationToken {

    private final Map<String, Object> claims;
    private final String uid;

    public FirebaseAuthenticationToken(
            String uid,
            Map<String, Object> claims,
            Collection<? extends GrantedAuthority> authorities
    ) {
        super(authorities);
        this.uid = uid;
        this.claims = claims;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return uid;
    }

    public Map<String, Object> getClaims() {
        return claims;
    }
}
