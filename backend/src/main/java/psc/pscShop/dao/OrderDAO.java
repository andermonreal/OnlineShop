package psc.pscShop.dao;

import java.util.Optional;
import psc.pscShop.entity.Order;
import psc.pscShop.entity.OrderItem;

/**
 *
 * @author monre
 */
public class OrderDAO extends AbstractGenericDAO<Order>
{
    public OrderDAO()
    {
        super(Order.class);
    }
    
    public Optional<Order> findOrderByUser(int userId) {
        String jpql = "SELECT o FROM Order o WHERE o.user.id = :userId AND o.status = :status";
        return entityManager.createQuery(jpql, Order.class)
                .setParameter("userId", userId)
                .setParameter("status", Order.Status.active)
                .getResultStream()
                .findFirst();
    }
    
    public void deleteOrderItem(OrderItem item) {
        entityManager.remove(entityManager.contains(item) ? item : entityManager.merge(item));
    }
}
