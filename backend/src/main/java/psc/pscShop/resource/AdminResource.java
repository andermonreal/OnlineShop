package psc.pscShop.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.Map;
import psc.pscShop.config.JwtUtil;
import psc.pscShop.dto.ChangePasswordRequest;
import psc.pscShop.dto.ProductCreateRequest;
import psc.pscShop.dto.ProductDTO;
import psc.pscShop.dto.ProductUpdateRequest;
import psc.pscShop.dto.UserDTO;
import psc.pscShop.entity.Product;
import psc.pscShop.service.AdminService;
import psc.pscShop.service.ProductService;

/**
 *
 * @author monre
 */
@Path("admin")
public class AdminResource
{
    @Inject
    private AdminService adminService;
    @Inject
    private ProductService productService;
    
    @GET
    @Path("/users")
    public Response getAllUsers(@HeaderParam("Authorization") String authHeader) 
    {
        Response authResponse = validateAdmin(authHeader);
        if (authResponse != null) return authResponse;
        
        List<UserDTO> users = adminService.getAllUsers();
        return Response.ok(users).build();
    }
    
    @DELETE
    @Path("/{userId}/delUser")
    public Response deleteUser(@HeaderParam("Authorization") String authHeader,
                               @PathParam("userId") int userId) 
    {
        Response authResponse = validateAdmin(authHeader);
        if (authResponse != null) return authResponse;

        try {
            boolean deleted = adminService.deleteUserById(userId);
            if (deleted) {
                return Response.noContent().build();
            } else {
                return Response.status(Response.Status.NOT_FOUND).entity("User not found").build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Failed to delete user").build();
        }
    }
    
    @GET
    @Path("/{userId}/changeRol")
    public Response changeUserRole(@HeaderParam("Authorization") String authHeader, 
                                   @PathParam("userId") int userId) 
    {
        Response authResponse = validateAdmin(authHeader);
        if (authResponse != null) return authResponse;
        
        try {
            adminService.changeRol(userId);
            return Response.ok(Map.of("message", "Rol changed successfully")).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Failed to change user rol").build();
        }
    }

    @POST
    @Path("/{userId}/changePassword")
    public Response changePassword(@HeaderParam("Authorization") String authHeader,
                               @PathParam("userId") int userId,
                               ChangePasswordRequest request) 
    {
        Response authResponse = validateAdmin(authHeader);
        if (authResponse != null) return authResponse;
        
        try {
            adminService.changePassword(userId, request);
            return Response.ok(Map.of("message", "Password changed successfully")).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Failed to change user pasword").build();
        }
    }
    
    
    @POST
    @Path("/addProduct")
    public Response addProduct(@HeaderParam("Authorization") String authHeader, ProductCreateRequest request) 
    {
        Response authResponse = validateAdmin(authHeader);
        if (authResponse != null) return authResponse;
        
        try {
            Product product = productService.addProduct(request);
            return Response.status(Response.Status.CREATED).entity(product).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity("{\"error\":\"" + e.getMessage() + "\"}").build();
        }
    }
    
    @DELETE
    @Path("/{productId}/delProduct")
    public Response deleteProduct(@HeaderParam("Authorization") String authHeader, @PathParam("productId") int productId) 
    {
        Response authResponse = validateAdmin(authHeader);
        if (authResponse != null) return authResponse;
        
        try {
            boolean deleted = productService.deleteProductById(productId);
            if (deleted) {
                return Response.noContent().build();
            } else {
                return Response.status(Response.Status.NOT_FOUND).entity("Product not found").build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Failed to delete product").build();
        }
    }
    
    @PUT
    @Path("/{productId}/updateProduct")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateProduct(
            @HeaderParam("Authorization") String authHeader,
            @PathParam("productId") int productId,
            ProductUpdateRequest request)
    {
        Response authResponse = validateAdmin(authHeader);
        if (authResponse != null) return authResponse;

        try {
            // ✔ devuelve ProductDTO, no Product entity
            ProductDTO updated = productService.updateProduct(productId, request);
            if (updated == null) {
                return Response.status(Response.Status.NOT_FOUND)
                               .entity("{\"error\":\"Product not found\"}")
                               .build();
            }
            return Response.ok(updated).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                           .entity("{\"error\":\"" + e.getMessage() + "\"}")
                           .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                           .entity("{\"error\":\"" + e.getMessage() + "\"}")
                           .build();
        }
    }
    
    
    public static Response validateAdmin(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return Response.status(Response.Status.UNAUTHORIZED)
                           .entity("Token missing or malformed").build();
        }

        String token = authHeader.substring(7);
        if (!JwtUtil.isAdmin(token)) {
            return Response.status(Response.Status.FORBIDDEN)
                           .entity("Not authorized").build();
        }

        return null;
    }
}

