package psc.pscShop.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.Optional;
import psc.pscShop.service.ProductService;
import psc.pscShop.dto.ProductDTO;
/**
 *
 * @author monre
 */
@Path("products")
public class ProductResource 
{
    @Inject
    private ProductService productService;

    @GET
    @Path("/")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProducts()
    {
        List<ProductDTO> products = productService.getProducts();
        
        if (products != null && !products.isEmpty())
            return Response.ok(products).build();
        else 
            return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    @GET
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProductById(@PathParam("id") Integer id)
    {
        Optional<ProductDTO> optionalProduct = productService.getProductById(id);

        if (optionalProduct.isPresent())
            return Response.ok(optionalProduct.get()).build();
        else
            return Response.status(Response.Status.NOT_FOUND).build();
    }
}
