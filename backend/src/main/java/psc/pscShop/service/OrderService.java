package psc.pscShop.service;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import psc.pscShop.dao.OrderDAO;
import psc.pscShop.dao.ProductDAO;
import psc.pscShop.dto.OrderDTO;
import psc.pscShop.dto.OrderItemDTO;
import psc.pscShop.dto.ProductDTO;
import psc.pscShop.entity.Order;
import psc.pscShop.entity.OrderItem;
import psc.pscShop.entity.Product;
import psc.pscShop.entity.User;

/**
 *
 * @author monre
 */
@Stateless
public class OrderService 
{
    @Inject
    private OrderDAO orderDAO;
    
    @Inject
    private ProductDAO productDAO; 

    public OrderDTO getOrderByUser(int userId) 
    {
        Optional<Order> optionalOrder = orderDAO.findOrderByUser(userId);

        if (optionalOrder.isEmpty()) {
            return new OrderDTO(0, List.of(), BigDecimal.ZERO);
        }

        Order order = optionalOrder.get();

        List<OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                .map(item -> new OrderItemDTO(
                        item.getId(),
                        item.getQuantity(),
                        new ProductDTO(
                                item.getProduct().getId(),
                                item.getProduct().getName(),
                                item.getProduct().getPrice(),
                                item.getProduct().getQuantity(),
                                item.getProduct().getImageUrl()
                        ),
                        item.getCreatedAt()
                )).toList();

        BigDecimal total = itemDTOs.stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new OrderDTO(order.getId(), itemDTOs, total);
    }
    
    public void addProductToOrder(int userId, int productId, int quantity) 
    {
        Order order = orderDAO.findOrderByUser(userId).orElseGet(() -> {
            Order newOrder = new Order();
            newOrder.setUser(new User(userId));
            newOrder.setStatus(Order.Status.active);
            newOrder.setCreatedAt(LocalDateTime.now());
            orderDAO.create(newOrder);
            return newOrder;
        });
        
        Product product = productDAO.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product with ID " + productId + " not found"));

        if (quantity > product.getQuantity()) {
            throw new RuntimeException("Requested quantity exceeds available stock");
        }

        Optional<OrderItem> existingItem = order.getOrderItems().stream()
            .filter(item -> item.getProduct().getId() == productId)
            .findFirst();

        if (existingItem.isPresent()) {
            OrderItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            OrderItem newItem = new OrderItem();
            newItem.setOrder(order);
            newItem.setProduct(new Product(productId));
            newItem.setQuantity(quantity);
            newItem.setCreatedAt(LocalDateTime.now());
            order.getOrderItems().add(newItem);
        }

        orderDAO.update(order);
    }
    
    public void removeProductFromOrder(int userId, int productId) 
    {
        Order order = orderDAO.findOrderByUser(userId)
                .orElseThrow(() -> new RuntimeException("No active order found for user id: " + userId));

        Optional<OrderItem> existingItem = order.getOrderItems().stream()
            .filter(item -> item.getProduct().getId() == productId)
            .findFirst();

        if (existingItem.isPresent()) {
            OrderItem item = existingItem.get();
            order.getOrderItems().remove(item);
            orderDAO.deleteOrderItem(item);
            orderDAO.update(order);
        } else {
            throw new RuntimeException("Product not found in the order.");
        }
    }
    
    public void clearOrder(int userId) 
    {
        Optional<Order> optionalOrder = orderDAO.findOrderByUser(userId);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            order.getOrderItems().clear(); 
            orderDAO.update(order);
        }
    }
    
    public void removeProductQuantityFromOrder(int userId, int productId, int quantityToRemove) 
    {
        Order order = orderDAO.findOrderByUser(userId)
                .orElseThrow(() -> new RuntimeException("No active order found for user id: " + userId));

        Optional<OrderItem> optionalItem = order.getOrderItems().stream()
                .filter(item -> item.getProduct().getId() == productId)
                .findFirst();

        if (optionalItem.isEmpty()) {
            throw new RuntimeException("Product not found in order");
        }

        OrderItem item = optionalItem.get();

        if (quantityToRemove >= item.getQuantity()) {
            // Si quita igual o más cantidad que tiene, elimina el producto entero
            order.getOrderItems().remove(item);
        } else {
            // Sino, reduce la cantidad
            item.setQuantity(item.getQuantity() - quantityToRemove);
        }

        orderDAO.update(order);
    }

}
