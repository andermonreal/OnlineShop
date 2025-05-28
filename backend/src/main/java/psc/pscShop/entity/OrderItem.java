package psc.pscShop.entity;

import jakarta.json.bind.annotation.JsonbTransient;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 *
 * @author monre
 */
@Entity
@Table(name = "order_items")
public class OrderItem 
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id")
    @JsonbTransient
    private Order order;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP")
    private LocalDateTime createdAt;

    public OrderItem() { }

    public OrderItem(Order order, Product product, int quantity) {
        this.order = order;
        this.product = product;
        this.quantity = quantity;
    }
    
    

    public int getId() {
        return id;
    }

    public Order getOrder() {
        return order;
    }

    public Product getProduct() {
        return product;
    }

    public int getQuantity() {
        return quantity;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
