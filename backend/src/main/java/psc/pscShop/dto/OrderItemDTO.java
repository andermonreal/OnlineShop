package psc.pscShop.dto;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 *
 * @author monre
 */
public class OrderItemDTO implements Serializable
{
    private static final long serialVersionUID = 1L;
    
    private int id;
    private int quantity;
    private ProductDTO product;
    private LocalDateTime createdAt;

    public OrderItemDTO() { }

    public OrderItemDTO(int id, int quantity, ProductDTO product, LocalDateTime createdAt) {
        this.id = id;
        this.quantity = quantity;
        this.product = product;
        this.createdAt = createdAt;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public ProductDTO getProduct() {
        return product;
    }

    public void setProduct(ProductDTO product) {
        this.product = product;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
