package psc.pscShop.dto;

import java.io.Serializable;
import java.time.LocalDateTime;
import psc.pscShop.entity.User;
/**
 *
 * @author monre
 */
public class UserDTO implements Serializable
{
    private static final long serialVersionUID = 1L;
    
    private Integer id;
    private String name;
    private String email;
    private String password;
    private String role;
    private LocalDateTime createdAt;
    private OrderDTO order;
    public enum Role {
        admin, customer
    }
    
    public UserDTO() { }
    
    public UserDTO(Integer id, String name, String email, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public UserDTO(Integer id, String name, String email, String role, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
    }
    
    
    
    public UserDTO(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.role = user.getRole().name();
        this.createdAt = user.getCreatedAt();
    }

    public UserDTO(String name) {
        this.name = name;
    }
    
    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public OrderDTO getOrder() {
        return order;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setOrder(OrderDTO order) {
        this.order = order;
    }
}