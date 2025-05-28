package psc.pscShop.dao;

import psc.pscShop.entity.Product;

/**
 *
 * @author monre
 */
public class ProductDAO extends AbstractGenericDAO<Product>
{
    public ProductDAO()
    {
        super(Product.class);
    }
}
