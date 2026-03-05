# OnlineShop — Frontend React

Aplicación de tienda online construida con React + Bootstrap siguiendo arquitectura hexagonal.

## Puesta en marcha

```bash
npm install
npm run dev
```

> El backend debe estar corriendo en `http://localhost:8080`  
> El proxy Vite redirige `/onlineShop/api/` → `http://localhost:8080/onlineShop/api/`

---

## Arquitectura Hexagonal

```
src/
├── domain/entities/          # Lógica de negocio pura (sin dependencias)
│   ├── User.js               # Role: admin | customer
│   ├── Product.js            # Campos: id, name, price, quantity, description, imageUrl
│   └── Order.js              # Status: active | completed | cancelled
│
├── application/usecases/     # Casos de uso (orquestan dominio + puertos)
│   ├── AuthUseCases.js
│   ├── ProductUseCases.js
│   ├── OrderUseCases.js
│   └── AdminUseCases.js
│
├── infrastructure/api/       # Adaptadores de salida (HTTP → backend Java)
│   ├── ApiClient.js
│   ├── UserApiAdapter.js
│   ├── ProductApiAdapter.js
│   ├── OrderApiAdapter.js
│   └── AdminApiAdapter.js
│
└── presentation/             # Adaptadores de entrada (React)
    ├── context/              # AuthContext, CartContext
    ├── components/           # Navbar, ProductCard, ProtectedRoute
    └── pages/                # Login, Register, Home, Product, Cart, Profile, Admin
```

## Endpoints API cubiertos

### Usuarios (`/users`)
| Método | Endpoint | Uso |
|--------|----------|-----|
| POST | `/users/login` | Inicio de sesión |
| POST | `/users/register` | Registro |
| POST | `/users/logout` | Cerrar sesión |
| GET | `/users/role` | Obtener rol del token |
| POST | `/users/{id}/change-password` | Cambiar contraseña propia |

### Productos (`/products`)
| Método | Endpoint | Uso |
|--------|----------|-----|
| GET | `/products/` | Catálogo completo |
| GET | `/products/{id}` | Detalle de producto |

### Pedido / Carrito (`/order`)
| Método | Endpoint | Uso |
|--------|----------|-----|
| GET | `/order/{userId}` | Ver carrito |
| POST | `/order/{userId}/add` | Añadir producto |
| DELETE | `/order/{userId}/remove/{productId}` | Eliminar producto completo |
| DELETE | `/order/{userId}/remove/{productId}?quantity=X` | Reducir cantidad |
| DELETE | `/order/{userId}/clear` | Vaciar carrito |

### Administración (`/admin`)
| Método | Endpoint | Uso |
|--------|----------|-----|
| GET | `/admin/users` | Listar todos los usuarios |
| DELETE | `/admin/{userId}/delUser` | Eliminar usuario |
| GET | `/admin/{userId}/changeRol` | Cambiar rol (admin ↔ customer) |
| POST | `/admin/{userId}/changePassword` | Cambiar contraseña de usuario |
| POST | `/admin/addProduct` | Añadir producto |
| DELETE | `/admin/{productId}/delProduct` | Eliminar producto |

## Navegación

- `/login` → Inicio de sesión (requerido para todo)
- `/register` → Registro
- `/` → Catálogo de productos (requiere login)
- `/product/:id` → Detalle de producto
- `/cart` → Carrito de compra
- `/profile` → Mi cuenta + cambio de contraseña
- `/admin` → Panel de administración (solo rol `admin`)
