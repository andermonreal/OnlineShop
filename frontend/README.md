enes listo para copiar directamente como archivo .md:

# OnlineShop — Frontend React

Online store application built with React + Bootstrap following a hexagonal architecture.

## Getting Started


npm install
npm run dev


The backend must be running at http://localhost:8080
The Vite proxy redirects /onlineShop/api/ → http://localhost:8080/onlineShop/api/

## Hexagonal Architecture
```bash
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
```