package psc.pscShop.dao;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;

/**
 *
 * @author monre
 */
public class AbstractGenericDAO<T> implements GenericDAO<T>
{
    @PersistenceContext(unitName = "psc_persistence_unit") 
    protected EntityManager entityManager;

    private final Class<T> entityClass;

    public AbstractGenericDAO(Class<T> entityClass)
    {
        this.entityClass = entityClass;
    }

    @Override
    public Optional<T> findById(Integer id)
    {
        return Optional.ofNullable(entityManager.find(entityClass, id));
    }
    
    @Override
    public List<T> findByField(String fieldName, Object value) {
        String jpql = "SELECT e FROM " + entityClass.getSimpleName() + " e WHERE e." + fieldName + ".id" + " = :value";
        return entityManager.createQuery(jpql, entityClass).setParameter("value", value).getResultList();
    }


    @Override
    public List<T> findAll()
    {
        String jpql = "SELECT e FROM " + entityClass.getSimpleName() + " e";
        return entityManager.createQuery(jpql, entityClass).getResultList();
    }

    @Override
    public void create(T entity)
    {
        entityManager.persist(entity);
    }

    @Override
    public T update(T entity)
    {
        return entityManager.merge(entity);
    }

    @Override
    public void delete(Integer id)
    {
        findById(id).ifPresent(entity -> entityManager.remove(entity));
    }
}
