package psc.pscShop.dao;

import java.util.List;
import java.util.Optional;

/**
 *
 * @author monre
 */
public interface GenericDAO<T>
{
    public Optional<T> findById(Integer id);
    
    public List<T> findByField(String fieldName, Object value);

    public List<T> findAll();

    public void create(T entity);

    public T update(T entity);

    public void delete(Integer id);
}