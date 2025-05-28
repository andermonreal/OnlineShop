package psc.pscShop.dao;

import psc.pscShop.entity.User;
import jakarta.ejb.Stateless;
import java.util.List;
import java.util.Optional;

/**
 *
 * @author monre
 */
@Stateless
public class UserDAO extends AbstractGenericDAO<User>
{
    public UserDAO()
    {
        super(User.class);
    }
    
    public Optional<User> findByEmail(String email) {
        String jpql = "SELECT u FROM User u WHERE u.email = :email";
        List<User> users = entityManager.createQuery(jpql, User.class)
                                        .setParameter("email", email)
                                        .getResultList();
        if (users.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(users.get(0));
    }
}