package com.guoaili.zackback.config;

import java.util.Date;
import java.util.List;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.guoaili.zackback.entity.Role;
import com.guoaili.zackback.model.TokenValidationResult;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenService {

    @Value("${jwt.secret-key}")
    private String secretKey;
    
    private static final long ACCESS_TOKEN_VALIDITY_SECONDS = 2*60*60;

    public String generateToken(String username, List<Role> authorities) {
        return Jwts.builder().subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_VALIDITY_SECONDS * 1000))
                .signWith(getSecretKey())
                .compact();
    }

    public TokenValidationResult validateToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSecretKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            
            String username = claims.getSubject();
            Date expiration = claims.getExpiration();
            
            if (expiration.before(new Date())) {
                return TokenValidationResult.expired();
            }
            
            return TokenValidationResult.valid(username);
        } catch (ExpiredJwtException e) {
            return TokenValidationResult.expired();
        } catch (JwtException e) {
            return TokenValidationResult.invalid("电子签名无效: " + e.getMessage());
        } catch (Exception e) {
            return TokenValidationResult.invalid("电子签名验证错误: " + e.getMessage());
        }
    }

    // public String extractUsernameFromToken(String token) {
    //     TokenValidationResult result = validateToken(token);
    //     return result.isValid() ? result.getUsername() : null;
    // }

    // public <T> T getClaims(String token, Function<Claims, T> resolver) {
    //     try {
    //         return resolver.apply(Jwts.parser().verifyWith(getSecretKey()).build().parseSignedClaims(token).getPayload());
    //     } catch (ExpiredJwtException e) {
    //         // 返回过期的Claims，但标记为过期
    //         return resolver.apply(e.getClaims());
    //     }
    // }

    // public boolean isTokenExpired(String token) {
    //     try {
    //         Date expiration = getClaims(token, Claims::getExpiration);
    //         return expiration.before(new Date());
    //     } catch (ExpiredJwtException e) {
    //         return true;
    //     }
    // }

    private SecretKey getSecretKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // SecretKey getSigningKey() {
    //     return Jwts.SIG.HS256.key().build();
    // }
}
