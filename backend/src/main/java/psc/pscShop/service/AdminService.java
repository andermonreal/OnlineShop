package psc.pscShop.service;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import java.util.List;
import java.util.stream.Collectors;
import static psc.pscShop.config.HashSHA256.hashPasswordSHA256;
import psc.pscShop.dao.UserDAO;
import psc.pscShop.dto.ChangePasswordRequest;
import psc.pscShop.dto.UserDTO;
import psc.pscShop.entity.User;

/**
 *
 * @author monre
 */
@Stateless
public class AdminService 
{
    @Inject
    private UserDAO userDAO;
    
    public List<UserDTO> getAllUsers()
    {
        List<User> users = userDAO.findAll();
        return users.stream()
                .map(user -> new UserDTO(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole().name(),
                        user.getCreatedAt()
                )).collect(Collectors.toList());
    }
    
    public boolean deleteUserById(int userId) 
    {
        try {
            userDAO.delete(userId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    public void changeRol(int userId)
    {
        User user = userDAO.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        
        if (user.getRole() == User.Role.admin)
            user.setRole(User.Role.customer);
        else
            user.setRole(User.Role.admin);
        
        userDAO.update(user);
    }
    
    public void changePassword(int userId, ChangePasswordRequest request)
    {
        User user = userDAO.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newHashed = hashPasswordSHA256(request.getNewPassword());
        user.setPassword(newHashed);

        userDAO.update(user);
    }
}
