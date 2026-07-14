# IAM System Integration Guide

## Overview

This application uses a **microservices architecture** with a dedicated **IAM (Identity & Access Management) service** for authentication and authorization.

## Architecture

```
┌─────────────────────┐
│   Next.js Admin     │
│   (Frontend)        │
└──────────┬──────────┘
           │
           ├─────────────────────────────────┐
           │                                 │
           v                                 v
┌──────────────────────┐          ┌──────────────────────┐
│   IAM Service        │          │   Backend API        │
│   (Auth & Perms)     │          │   (Business Logic)   │
└──────────────────────┘          └──────────────────────┘
```

## Components

### 1. **IAM Client** (`lib/iamClient.ts`)
- Manages communication with IAM service
- Handles session proofs (single-use tokens)
- Automatic token refresh
- Request serialization to prevent race conditions

### 2. **IAM Context** (`lib/iamContext.tsx`)
- React context provider for authentication state
- User information and permissions
- Login/logout methods
- Permission checking utilities

### 3. **IAM Guard** (`lib/iamGuard.tsx`)
- Component wrapper for protected routes
- Redirects unauthenticated users
- Loading states

### 4. **API Client** (`lib/apiClient.ts`)
- Axios instance for backend API calls
- Automatically adds IAM authentication headers
- Routes through Next.js proxy

### 5. **Middleware** (`middleware.ts`)
- Edge-level route protection
- Checks for authentication cookies
- Redirects to login if not authenticated

## Setup Instructions

### 1. Register Your Application

1. Log into your IAM admin console
2. Navigate to **Applications** → **Register New App**
3. Fill in:
   - **App Name**: E-commerce Admin
   - **Redirect URLs**: `https://your-domain.com/dashboard`
   - **Allowed Origins**: `https://your-domain.com`
4. Save and copy the **Client ID**

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_IAM_URL=https://your-iam-service.com
NEXT_PUBLIC_IAM_CLIENT_ID=your-client-id-from-step-1
NEXT_PUBLIC_IAM_ORG_SLUG=your-organization-slug
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
```

### 3. Set Up Permissions in IAM

In your IAM admin console, define permissions for this application:

```
products:read
products:write
products:delete

categories:read
categories:write
categories:delete

orders:read
orders:write
orders:update_status

dashboard:view
```

Assign these permissions to roles (e.g., Admin, Editor, Viewer) and assign roles to users.

## Usage

### Protecting Pages

Wrap pages that require authentication:

```tsx
import { IAMGuard } from "@/lib/iamGuard";

export default function DashboardPage() {
  return (
    <IAMGuard>
      {/* Your protected content */}
    </IAMGuard>
  );
}
```

### Accessing User Information

```tsx
import { useIAM } from "@/lib/iamContext";

export default function MyComponent() {
  const { user, can, loading } = useIAM();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      {can("products:write") && (
        <button>Add Product</button>
      )}
    </div>
  );
}
```

### Permission-Based Rendering

```tsx
import { useIAM } from "@/lib/iamContext";

export default function ProductActions() {
  const { can, canAny } = useIAM();

  return (
    <div>
      {can("products:read") && <ViewButton />}
      {can("products:write") && <EditButton />}
      {can("products:delete") && <DeleteButton />}
      {canAny("products:write", "products:delete") && <AdminPanel />}
    </div>
  );
}
```

### Making API Calls

Use the typed API client:

```tsx
import { api } from "@/lib/apiClient";

async function fetchProducts() {
  try {
    const response = await api.products.getAll();
    console.log(response.data);
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
}
```

Or use the raw client:

```tsx
import { apiClient } from "@/lib/apiClient";

const response = await apiClient.get("/custom-endpoint");
```

## Authentication Flow

### Login Flow

1. User enters credentials on `/login`
2. Client sends credentials to IAM service
3. IAM validates and returns:
   - **httpOnly refresh token** (cookie)
   - **Session proof** (short-lived token)
4. Session proof stored in sessionStorage
5. Subsequent requests include session proof
6. IAM rotates session proof with each response

### Session Management

- **Session proof**: Short-lived, rotated with each request
- **Refresh token**: Long-lived, httpOnly cookie
- **Auto-refresh**: Token refreshed every 14 minutes
- **Silent refresh**: On page reload, automatically refreshes session

### Logout Flow

1. User clicks logout
2. Client calls IAM logout endpoint
3. IAM invalidates refresh token
4. Client clears session proof
5. User redirected to login

## Security Features

### 1. **Single-Use Session Proofs**
- Each request uses a unique session proof
- Prevents replay attacks
- Request serialization prevents race conditions

### 2. **httpOnly Refresh Tokens**
- Stored in httpOnly cookies
- Not accessible via JavaScript
- Prevents XSS attacks

### 3. **CORS Protection**
- IAM service validates origins
- Only registered apps can authenticate

### 4. **Automatic Session Expiry**
- Sessions expire after inactivity
- Users automatically logged out
- Custom event: `iam:session-expired`

### 5. **Permission-Based Access Control**
- Fine-grained permissions
- Role-based access
- Frontend and backend validation

## Troubleshooting

### "Session expired" errors
- Check if IAM service is running
- Verify CLIENT_ID is correct
- Check browser console for CORS errors

### Permission denied
- Verify user has correct role in IAM
- Check permission names match exactly
- Ensure org slug is correct

### Cannot login
- Verify IAM_URL is correct and accessible
- Check network tab for failed requests
- Ensure org exists in IAM system

## Advanced: Custom Permissions

To add new permissions:

1. **Define in IAM Admin Console**
   - Go to Permissions → Create New
   - Example: `inventory:manage`

2. **Assign to Roles**
   - Edit role and add permission

3. **Use in Frontend**
   ```tsx
   {can("inventory:manage") && <InventoryPanel />}
   ```

4. **Validate in Backend**
   - Your backend should also validate permissions
   - Never trust frontend checks alone

## API Reference

### `useIAM()` Hook

```tsx
const {
  user,      // IAMUser | null - Current user object
  perms,     // PermMap - Permission map
  loading,   // boolean - Loading state
  login,     // (email, password, orgSlug?) => Promise<void>
  logout,    // () => Promise<void>
  can,       // (action: string) => boolean
  canAny,    // (...actions: string[]) => boolean
  refresh,   // () => Promise<void>
} = useIAM();
```

### `api` Object

```tsx
api.products.getAll()
api.products.getById(id)
api.products.create(data)
api.products.update(id, data)
api.products.delete(id)

api.categories.getAll()
// ... similar methods

api.orders.getAll()
api.orders.updateStatus(id, status)

api.dashboard.getStats()
```

## Migration from Local Auth

If migrating from local authentication:

1. **Remove old auth files** (if any exist)
2. **Update login component** to use `useIAM()`
3. **Replace auth checks** with `can()` method
4. **Update API calls** to use `apiClient`
5. **Configure IAM service** with your users
6. **Test thoroughly** with different roles

## Support

For IAM service issues, contact your DevOps team or refer to the IAM service documentation.
