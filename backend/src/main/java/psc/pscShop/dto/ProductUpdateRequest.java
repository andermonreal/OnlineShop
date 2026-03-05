package psc.pscShop.dto;

/**
 *
 * @author monre
 */

import java.math.BigDecimal;

public class ProductUpdateRequest {

    private BigDecimal price;
    private Integer quantity;
    private String description;

    public BigDecimal getPrice()              { return price; }
    public void setPrice(BigDecimal price)    { this.price = price; }

    public Integer getQuantity()              { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getDescription()               { return description; }
    public void setDescription(String description) { this.description = description; }
}
