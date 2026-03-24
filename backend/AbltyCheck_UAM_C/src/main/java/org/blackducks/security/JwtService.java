package org.blackducks.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    // Esta es una clave secreta de ejemplo (Debe tener al menos 256 bits).
    // Para producción, esto debería venir del application.yml
    private static final String SECRET_KEY = "QWJsdHlDaGVja1VBTVNlY3JldEtleUZvckpXVFRva2VuR2VuZXJhdGlvbg==";

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String generateToken(String matricula) {
        return generateToken(new HashMap<>(), matricula);
    }

    public String generateToken(Map<String, Object> extraClaims, String matricula) {
        return Jwts.builder()
                .setClaims(extraClaims) // Adaptado a v0.11.x
                .setSubject(matricula)  // Adaptado a v0.11.x
                .setIssuedAt(new Date(System.currentTimeMillis())) // Adaptado a v0.11.x
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24 horas
                .signWith(getSignInKey(), SignatureAlgorithm.HS256) // Adaptado a v0.11.x
                .compact();
    }

    public boolean isTokenValid(String token, String matricula) {
        final String username = extractUsername(token);
        return (username.equals(matricula)) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder() // Adaptado a v0.11.x
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token) // Adaptado a v0.11.x
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}