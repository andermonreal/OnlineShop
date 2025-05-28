package psc.pscShop.config;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import java.io.IOException;

/**
 *
 * @author monre
 */
@Provider
public class JwtAuthFilter implements ContainerRequestFilter {

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        String path = requestContext.getUriInfo().getPath();

        if (path.startsWith("users/login") || path.startsWith("users/register")) {
            return;
        }

        String authHeader = requestContext.getHeaderString("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            abortWithUnauthorized(requestContext);
            return;
        }

        String token = authHeader.substring("Bearer ".length());

        if (!JwtUtil.validateToken(token)) {
            abortWithUnauthorized(requestContext);
        }
    }

    private void abortWithUnauthorized(ContainerRequestContext requestContext) {
        requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED)
            .entity("Token inválido o faltante")
            .build());
    }
}
