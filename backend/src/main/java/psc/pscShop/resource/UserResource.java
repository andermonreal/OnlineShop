package psc.pscShop.resource;

import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.Map;
import psc.pscShop.config.JwtUtil;
import psc.pscShop.dto.ChangePasswordRequest;
import psc.pscShop.dto.LoginRequest;
import psc.pscShop.service.UserService;
import psc.pscShop.dto.UserDTO;
import psc.pscShop.dto.UserRegisterRequest;
import psc.pscShop.entity.User;

/**
 *
 * @author monre
 */
@Path("users")
public class UserResource
{
    @Inject
    private UserService userService;
    
    @Context
    private HttpHeaders httpHeaders;
    
    @GET
    @Path("/role")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserRole() {
        String authHeader = httpHeaders.getHeaderString(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        String token = authHeader.substring("Bearer ".length());
        if (!JwtUtil.validateToken(token)) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        String username = JwtUtil.getUsername(token);
        String role = JwtUtil.getRole(token);


        return Response.ok(
            Map.of(
                "username", username,
                "roles", java.util.List.of(role) 
            )
        ).build();
    }

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(LoginRequest request) {
        try {
            UserDTO userDTO = userService.login(request.getEmail(), request.getPassword());

            String token = JwtUtil.generateToken(userDTO.getEmail(), userDTO.getRole());

            return Response.ok(Map.of(
                "token", token,
                "user", userDTO
            )).build();

        } catch (RuntimeException e) {
            return Response.status(Response.Status.UNAUTHORIZED)
                           .entity(Map.of("error", e.getMessage()))
                           .build();
        }
    }

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response registerUser(UserRegisterRequest request) {
        try {
            User user = userService.registerUser(request);
            UserDTO userDTO = new UserDTO(user); 

            String token = JwtUtil.generateToken(userDTO.getEmail(), userDTO.getRole());

            return Response.status(Response.Status.CREATED).entity(Map.of(
                "token", token,
                "user", userDTO
            )).build();

        } catch (RuntimeException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                           .entity(Map.of("error", e.getMessage()))
                           .build();
        }
    }
    
    @POST
    @Path("/logout")
    public Response logout(@Context HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return Response.noContent().build();
    }
    
    @POST
    @Path("/{userId}/change-password")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response changePassword(@PathParam("userId") int userId, ChangePasswordRequest request) {
        try {
            userService.changePassword(userId, request);
            return Response.ok(Map.of("message", "Password changed successfully")).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", e.getMessage()))
                    .build();
        }
    }
}
