package psc.pscShop.dao;

import psc.pscShop.entity.OrderItem;

/**
 *
 * @author monre
 */
public class OrderItemDAO extends AbstractGenericDAO<OrderItem>
{
    public OrderItemDAO()
    {
        super(OrderItem.class);
    }
}
