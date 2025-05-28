package psc.pscShop.dto;

import java.math.BigDecimal;

/**
 *
 * @author monre
 */
public class ProductCreateRequest {
    private String name;
    private BigDecimal price;
    private int quantity;
    private String description;
    private String imageUrl;

    public ProductCreateRequest() {}


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
}
