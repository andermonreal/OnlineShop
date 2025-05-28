package psc.pscShop.service;

import psc.pscShop.dto.UserDTO;
import psc.pscShop.dao.UserDAO;
import psc.pscShop.entity.User;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.Optional;
import psc.pscShop.dto.ChangePasswordRequest;
import psc.pscShop.dto.UserRegisterRequest;

/**
 *
 * @author monre
 */
@Stateless
public class UserService
{
    @Inject
    private UserDAO userDAO;
    
    public UserDTO login(String email, String password) 
    {
        User user = userDAO.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        String hashedInput = hashPasswordSHA256(password);

        if (!hashedInput.equals(user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }
    
    public User registerUser(UserRegisterRequest request) 
    {
        if (userDAO.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        
        String hashedPassword = hashPasswordSHA256(request.getPassword());
        user.setPassword(hashedPassword);

        user.setRole(User.Role.customer);
        user.setCreatedAt(LocalDateTime.now());

        userDAO.create(user);

        return user;
    }
    
    public void changePassword(int userId, ChangePasswordRequest request) 
    {
        User user = userDAO.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!hashPasswordSHA256(request.getOldPassword()).equals(user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        String newHashed = hashPasswordSHA256(request.getNewPassword());
        user.setPassword(newHashed);

        userDAO.update(user);
    }
    
    
    
    
    
    public static String hashPasswordSHA256(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            // Convertir bytes a hex
            return HexFormat.of().formatHex(encodedHash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }
    
    

    public Optional<UserDTO> findById(Integer id)
    {
        Optional<User> optionalUser = userDAO.findById(id);

        if (optionalUser.isPresent())
        {
            User user = optionalUser.get();
            UserDTO userDTO = convertToDTO(user);

            return Optional.of(userDTO);
        }
        else
            return Optional.empty();
    }

    public void create(UserDTO userDTO)
    {
        User user = convertToEntity(userDTO);

        userDAO.create(user);
    }

    public void update(UserDTO userDTO)
    {
        User user = convertToEntity(userDTO);

        userDAO.update(user);
    }

    public void delete(Integer id)
    {
        userDAO.delete(id);
    }

    // Method that converts from Entity to DTO
    private UserDTO convertToDTO(User user)
    {
        return new UserDTO(user.getName());
    }

    // Method that converts from DTO to Entity
    private User convertToEntity(UserDTO userDTO)
    {
        return new User(userDTO.getName());
    }
}
