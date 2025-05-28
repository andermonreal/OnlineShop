package psc.pscShop.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.Map;
import psc.pscShop.dto.AddProductRequest;
import psc.pscShop.dto.OrderDTO;
import psc.pscShop.service.OrderService;

/**
 *
 * @author monre
 */
@Path("order")
public class OrderResource 
{
    @Inject
    private OrderService orderService;

    @GET
    @Path("/{userId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOrderByUserId(@PathParam("userId") Integer userId) 
    {
        try {
            OrderDTO orderDTO = orderService.getOrderByUser(userId);
            return Response.ok(orderDTO).build();
        } catch (Exception e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("error", e.getMessage()))
                    .build();
        }
    }
    
    @POST
    @Path("/{userId}/add")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addProductToOrder(@PathParam("userId") int userId, AddProductRequest request) 
    {
        try {
            orderService.addProductToOrder(userId, request.getProductId(), request.getQuantity());
            return Response.ok(Map.of("message", "Product added to order successfully")).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                           .entity(Map.of("error", e.getMessage()))
                           .build();
        }
    }
    
    @DELETE
    @Path("/{userId}/remove/{productId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeProductFromOrder(@PathParam("userId") int userId, @PathParam("productId") int productId) 
    {
        try {
            orderService.removeProductFromOrder(userId, productId);
            return Response.ok(Map.of("message", "Product removed from order successfully")).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                           .entity(Map.of("error", e.getMessage()))
                           .build();
        }
    }
    
    @DELETE
    @Path("/{userId}/clear")
    @Produces(MediaType.APPLICATION_JSON)
    public Response clearOrder(@PathParam("userId") int userId) 
    {
        try {
            orderService.clearOrder(userId);
            return Response.ok(Map.of("message", "Order cleared successfully")).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of("error", e.getMessage()))
                    .build();
        }
    }
    
    @DELETE
    @Path("/{userId}/remove/{productId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeProductQuantityFromOrder(@PathParam("userId") int userId,
                                                   @PathParam("productId") int productId,
                                                   @QueryParam("quantity") int quantity) 
    {
        try {
            orderService.removeProductQuantityFromOrder(userId, productId, quantity);
            return Response.ok(Map.of("message", "Product quantity updated in order successfully")).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                           .entity(Map.of("error", e.getMessage()))
                           .build();
        }
    }
}
