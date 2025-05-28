package psc.pscShop.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

/**
 *
 * @author monre
 */
public class OrderDTO implements Serializable
{
    private static final long serialVersionUID = 1L;
    
    private int id;
    private List<OrderItemDTO> items;
    private BigDecimal totalPrice;

    public OrderDTO(int id, List<OrderItemDTO> items, BigDecimal totalPrice) {
        this.id = id;
        this.items = items;
        this.totalPrice = totalPrice;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }
}
