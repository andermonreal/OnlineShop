package psc.pscShop.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 *
 * @author monre
 */
@Entity
@Table(name = "orders")
public class Order 
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.active;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems;

    public enum Status {
        active, completed, cancelled
    }

    public Order() { }

    public Order(int id, User user, Status status, List<OrderItem> orderItems, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.status = status;
        this.orderItems = orderItems;
        this.createdAt = createdAt;
    }
    
    

    public int getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Status getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }
}
