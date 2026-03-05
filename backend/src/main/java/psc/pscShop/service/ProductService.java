package psc.pscShop.service;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import psc.pscShop.dao.ProductDAO;
import psc.pscShop.dto.ProductCreateRequest;
import psc.pscShop.dto.ProductUpdateRequest;
import psc.pscShop.dto.ProductDTO;
import psc.pscShop.entity.Product;

/**
 *
 * @author monre
 */
@Stateless
public class ProductService 
{
    @Inject
    private ProductDAO productDAO;

    public List<ProductDTO> getProducts()
    {
        List<Product> products = productDAO.findAll();
        
        List<ProductDTO> productDTOs = products.stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());

        return productDTOs;
    }
    
    public Optional<ProductDTO> getProductById(Integer id)
    {
        Optional<Product> optionalProduct = productDAO.findById(id);
        if (optionalProduct.isPresent())
        {
            Product product = optionalProduct.get();
            ProductDTO productDTO = convertToDTO(product);
            return Optional.of(productDTO);
        }
        else
            return Optional.empty();
    }
    
    public Product addProduct(ProductCreateRequest request) {
        Product product = new Product();

        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setDescription(request.getDescription());
        product.setImageUrl(request.getImageUrl());
        product.setCreatedAt(LocalDateTime.now());

        productDAO.create(product);

        return product;
    }
    
    public boolean deleteProductById(int productId) 
    {
        try {
            productDAO.delete(productId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    public ProductDTO updateProduct(int productId, ProductUpdateRequest request) {
        Optional<Product> optional = productDAO.findById(productId);
        if (optional.isEmpty()) {
            return null;
        }
        Product product = optional.get();

        if (request.getPrice() != null) {
            if (request.getPrice().compareTo(BigDecimal.ZERO) <= 0)
                throw new IllegalArgumentException("Price must be greater than 0");
            product.setPrice(request.getPrice());
        }
        if (request.getQuantity() != null) {
            if (request.getQuantity() < 0)
                throw new IllegalArgumentException("Stock cannot be negative");
            product.setQuantity(request.getQuantity());
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }

        Product saved = productDAO.update(product);
        return convertToDTO(saved);
    }
    

    private ProductDTO convertToDTO(Product product)
    {
        return new ProductDTO(product.getId(), product.getName(), product.getPrice(), product.getQuantity(), product.getDescription(), product.getImageUrl(), product.getCreatedAt());
    }
}
