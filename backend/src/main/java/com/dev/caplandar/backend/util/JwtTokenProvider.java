package com.dev.caplandar.backend.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.dev.caplandar.backend.entity.User;

import java.util.Date;

public class JwtTokenProvider {

    private String secret;

    private long expirationInMillis;

    public JwtTokenProvider() {
        secret = new String("my-very-very-very-secure-and-very-very-very-long-secret1-secret2-secret3-secret4");
        expirationInMillis = 7776000000L;
    }

    public String generateToken(User user) {

        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + expirationInMillis);

        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            String token = JWT.create()
                    .withSubject(user.getEmail())
                    .withIssuedAt(now)
                    .withExpiresAt(expirationDate)
                    .withIssuer("auth0")
                    .sign(algorithm);

            return token;
        } catch (JWTCreationException exception){
            // Invalid Signing configuration / Couldn't convert Claims.
            System.out.println(exception.getMessage());
        };

        return null;
    }

//    public String getUsernameFromJWT(String token) {
//
//        Claims claims = Jwts.parser()
//                .setSigningKey(secret)
//                .parseClaimsJws(token)
//                .getBody();
//
//        return claims.getSubject();
//    }

    public boolean verifyToken(String token) {
        DecodedJWT decodedJWT;

        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            JWTVerifier verifier = JWT.require(algorithm)
                    // specify any specific claim validations
                    .withIssuer("auth0")
                    // reusable verifier instance
                    .build();

            decodedJWT = verifier.verify(token);

            return true;
        } catch (JWTVerificationException exception){
            // Invalid signature/claims
            System.out.println(exception.getMessage());
        }

        return false;
    }
}

