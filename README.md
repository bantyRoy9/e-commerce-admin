# E-Commerce Admin Dashboard

Modern admin dashboard for managing e-commerce operations with microservices architecture.

## 🏗️ Architecture

This application follows a **microservices architecture**:

```
┌──────────────────────────────────────────────────────────────┐
│                     Next.js Admin Frontend                   │
│                    (This Application)                        │
└───────────────┬──────────────────────┬───────────────────────┘
                │                      │
                v                      v
    ┌───────────────────┐    ┌───────────────────┐
    │   IAM Service     │    │   Backend API     │
    │   (Auth & Perms)  │    │ (Business Logic)  │
    └───────────────────┘    └───────────────────┘
```

### Microservices

- **IAM Service**: Handles user authentication, authorization, permissions, and session management
- **Backend API**: Your e-commerce business logic (products, orders, inventory, etc.)
- **Admin Frontend**: This Next.js application

## ✨ Features

- 🔐 **Microservices Authentication** via IAM system
- 🛡️ **Fine-grained Permissions** with role-based access control
- 📦 **Product Management** with categories and inventory
- 📋 **Order Management** with status tracking
- 👥 **Customer Management**
- 📊 **Dashboard Analytics** with charts and metrics
- 🔔 **Real-time Notifications**
- 🌐 **Multi-organization Support**
- 🔄 **Automatic Token Refresh**
- 🚀 **Server-Side Rendering** with Next.js

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Running IAM service instance
- Backend API service (optional, for full functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd e-commerce-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your values:
   ```env
   NEXT_PUBLIC_IAM_URL=https://your-iam-service.com
   NEXT_PUBLIC_IAM_CLIENT_ID=your-client-id
   NEXT_PUBLIC_IAM_ORG_SLUG=your-org-slug
   NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 IAM Integration

This application uses a dedicated IAM (Identity & Access Management) microservice for all authentication and authorization.

### Quick Start

```tsx
import { useIAM } from "@/lib/iamContext";

function MyComponent() {
  const { user, can, loading } = useIAM();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      {can("products:write") && <button>Add Product</button>}
    </div>
  );
}
```

### Key Components

- **`useIAM()`** - Hook for accessing user, permissions, and auth methods
- **`IAMGuard`** - Component wrapper for protected routes
- **`apiClient`** - Pre-configured axios instance with auth headers
- **`api`** - Typed API methods for backend calls

### Documentation

See [docs/IAM-INTEGRATION.md](docs/IAM-INTEGRATION.md) for complete documentation including:
- Setup instructions
- Authentication flow
- Permission management
- API usage examples
- Security features
- Troubleshooting

## 📁 Project Structure

```
e-commerce-admin/
├── app/                      # Next.js app directory
│   ├── api/                  # API route handlers
│   │   └── proxy/            # Backend API proxy
│   ├── dashboard/            # Dashboard pages
│   ├── products/             # Product management
│   ├── categories/           # Category management
│   ├── orders/               # Order management
│   ├── login/                # Login page
│   └── layout.tsx            # Root layout
│
├── components/               # React components
│   ├── common/               # Shared components
│   ├── dashboard/            # Dashboard components
│   ├── products/             # Product components
│   ├── orders/               # Order components
│   ├── layout/               # Layout components
│   └── ui/                   # UI components
│
├── lib/                      # Utilities and helpers
│   ├── iamClient.ts          # IAM HTTP client
│   ├── iamContext.tsx        # IAM React context
│   ├── iamGuard.tsx          # Route guard component
│   └── apiClient.ts          # Backend API client
│
├── store/                    # Redux store (if used)
│   └── slices/               # Redux slices
│
├── hooks/                    # Custom React hooks
├── docs/                     # Documentation
│   └── IAM-INTEGRATION.md    # IAM integration guide
│
├── examples/                 # Example components
│   └── PermissionExample.tsx # Permission usage example
│
├── middleware.ts             # Next.js middleware (route protection)
├── .env.local                # Environment variables (not committed)
├── .env.example              # Environment template
└── README.md                 # This file
```

## 🔒 Security

### Authentication Flow

1. User logs in with email/password/org
2. IAM service validates credentials
3. Returns httpOnly refresh token (cookie) + session proof
4. Session proof rotated with each request
5. Automatic token refresh every 14 minutes

### Security Features

- ✅ Single-use session proofs (prevents replay attacks)
- ✅ httpOnly refresh tokens (prevents XSS)
- ✅ Automatic session expiry
- ✅ CORS protection
- ✅ Edge-level route protection
- ✅ Permission-based access control

## 🎨 Customization

### Adding New Permissions

1. Define permission in IAM admin console (e.g., `inventory:manage`)
2. Assign to appropriate roles
3. Use in frontend:
   ```tsx
   {can("inventory:manage") && <InventoryPanel />}
   ```

### Adding New API Endpoints

Add to `lib/apiClient.ts`:

```typescript
export const api = {
  // ... existing endpoints
  
  inventory: {
    getAll: () => apiClient.get("/inventory"),
    updateStock: (id: string, quantity: number) => 
      apiClient.patch(`/inventory/${id}`, { quantity }),
  },
};
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

## 📦 Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🐛 Troubleshooting

### "Session expired" errors
- Verify IAM service is running and accessible
- Check CLIENT_ID matches registered app in IAM
- Look for CORS errors in browser console

### Permission denied
- Verify user has correct role in IAM admin
- Ensure permission names match exactly
- Check org slug is correct

### Cannot login
- Verify IAM_URL is correct and accessible
- Check organization exists in IAM
- Review network tab for failed requests

See [docs/IAM-INTEGRATION.md](docs/IAM-INTEGRATION.md) for more troubleshooting tips.

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [IAM Service Documentation](link-to-your-iam-docs)
- [API Documentation](link-to-your-api-docs)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

[Your License Here]

## 👥 Support

For issues related to:
- **IAM Service**: Contact DevOps or see IAM documentation
- **Backend API**: Contact backend team
- **This Application**: Create an issue in this repository
