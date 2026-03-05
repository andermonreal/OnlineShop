# OnlineShop — Frontend React

Online store application built with React + Bootstrap following a hexagonal architecture.

## Getting Started

```bash
npm install
npm run dev
The backend must be running at http://localhost:8080
The Vite proxy redirects /onlineShop/api/ → http://localhost:8080/onlineShop/api/

Hexagonal Architecture
bash
Copiar código
src/
├── domain/entities/          # Pure business logic (no dependencies)
│   ├── User.js               # Role: admin | customer
│   ├── Product.js            # Fields: id, name, price, quantity, description, imageUrl
│   └── Order.js              # Status: active | completed | cancelled
│
├── application/usecases/     # Use cases (orchestrate domain + ports)
│   ├── AuthUseCases.js
│   ├── ProductUseCases.js
│   ├── OrderUseCases.js
│   └── AdminUseCases.js
│
├── infrastructure/api/       # Output adapters (HTTP → Java backend)
│   ├── ApiClient.js
│   ├── UserApiAdapter.js
│   ├── ProductApiAdapter.js
│   ├── OrderApiAdapter.js
│   └── AdminApiAdapter.js
│
└── presentation/             # Input adapters (React)
    ├── context/              # AuthContext, CartContext
    ├── components/           # Navbar, ProductCard, ProtectedRoute
    └── pages/                # Login, Register, Home, Product, Cart, Profile, Admin
Covered API Endpoints
Users (/users)
Method	Endpoint	Purpose
POST	/users/login	Login
POST	/users/register	Register new user
POST	/users/logout	Logout
GET	/users/role	Get role from token
POST	/users/{id}/change-password	Change own password

Products (/products)
Method	Endpoint	Purpose
GET	/products/	Full product catalog
GET	/products/{id}	Product details

Order / Cart (/order)
Method	Endpoint	Purpose
GET	/order/{userId}	View cart
POST	/order/{userId}/add	Add product
DELETE	/order/{userId}/remove/{productId}	Remove product completely
DELETE	/order/{userId}/remove/{productId}?quantity=X	Reduce product quantity
DELETE	/order/{userId}/clear	Clear cart

Administration (/admin)
Method	Endpoint	Purpose
GET	/admin/users	List all users
DELETE	/admin/{userId}/delUser	Delete user
GET	/admin/{userId}/changeRol	Change role (admin ↔ customer)
POST	/admin/{userId}/changePassword	Change user password
POST	/admin/addProduct	Add product
DELETE	/admin/{productId}/delProduct	Delete product

Navigation
/login → Login page (required for everything)

/register → User registration

/ → Product catalog (requires login)

/product/:id → Product detail page

/cart → Shopping cart

/profile → My account + change password

/admin → Administration panel (admin role only)