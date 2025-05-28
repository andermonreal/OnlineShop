package psc.pscShop.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 *
 * @author monre
 */
public class ProductDTO implements Serializable
{
    private static final long serialVersionUID = 1L;
    
    private int id;
    private String name;
    private BigDecimal price;
    private int quantity;
    private String description;
    private String imageUrl;
    private LocalDateTime createdAt;

    public ProductDTO() { }

    public ProductDTO(int id, String name, BigDecimal price, int quantity, String description, String imageUrl, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.description = description;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
    }
    
    
    public ProductDTO(int id, String name, BigDecimal price, String imageUrl) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.imageUrl = imageUrl;
    }

    public ProductDTO(int id, String name, BigDecimal price, int quantity, String imageUrl) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
    }
    
    

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public int getQuantity() {
        return quantity;
    }

    public String getDescription() {
        return description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
