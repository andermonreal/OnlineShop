package psc.pscShop.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

/**
 *
 * @author monre
 */

public class JwtUtil {

    private static final Key KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public static String generateToken(String username, String role) {
        long nowMillis = System.currentTimeMillis();
        long expMillis = nowMillis + 3600000; // 1 hora

        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date(nowMillis))
                .setExpiration(new Date(expMillis))
                .signWith(KEY)
                .compact();
    }

    public static boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(KEY)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static String getUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public static String getRole(String token) {
        return (String) Jwts.parserBuilder()
                .setSigningKey(KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role");
    }
    
    public static boolean isAdmin(String token) {
        try {
            String role = getRole(token);
            return role != null && role.equalsIgnoreCase("admin");
        } catch (Exception e) {
            return false;
        }
    }
}