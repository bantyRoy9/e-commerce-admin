# IAM Quick Reference Guide

Quick code snippets for common IAM operations.

## Table of Contents
- [Authentication](#authentication)
- [Permission Checks](#permission-checks)
- [API Calls](#api-calls)
- [User Information](#user-information)
- [Helper Functions](#helper-functions)
- [Components](#components)

---

## Authentication

### Get Auth State
```tsx
import { useIAM } from "@/lib/iamContext";

const { user, loading, login, logout } = useIAM();
```

### Login
```tsx
const { login } = useIAM();

await login("user@example.com", "password", "org-slug");
```

### Logout
```tsx
const { logout } = useIAM();

await logout();
```

### Check if Logged In
```tsx
const { user, loading } = useIAM();

if (!loading && !user) {
  // User is not logged in
}
```

---

## Permission Checks

### Single Permission
```tsx
const { can } = useIAM();

if (can("products:write")) {
  // User has permission
}
```

### Multiple Permissions (ANY)
```tsx
const { canAny } = useIAM();

if (canAny("products:write", "products:delete")) {
  // User has at least one permission
}
```

### Multiple Permissions (ALL)
```tsx
import { hasAllPermissions } from "@/lib/iamHelpers";

const { perms } = useIAM();

if (hasAllPermissions(perms, "products:read", "products:write")) {
  // User has all permissions
}
```

### Conditional Rendering
```tsx
{can("products:write") && <EditButton />}
{can("products:delete") && <DeleteButton />}
{canAny("orders:write", "orders:update_status") && <OrderActions />}
```

### Using Permission Constants
```tsx
import { PERMISSIONS } from "@/types/iam";

{can(PERMISSIONS.PRODUCTS_WRITE) && <AddProductButton />}
{can(PERMISSIONS.ORDERS_READ) && <OrdersList />}
```

---

## API Calls

### Using Typed API Methods
```tsx
import { api } from "@/lib/apiClient";

// Products
const products = await api.products.getAll();
const product = await api.products.getById("123");
await api.products.create({ name: "Product", price: 99 });
await api.products.update("123", { price: 79 });
await api.products.delete("123");

// Categories
const categories = await api.categories.getAll();
await api.categories.create({ name: "Electronics" });

// Orders
const orders = await api.orders.getAll();
await api.orders.updateStatus("order-123", "shipped");

// Dashboard
const stats = await api.dashboard.getStats();
const revenue = await api.dashboard.getRevenue();
```

### Using Raw API Client
```tsx
import { apiClient } from "@/lib/apiClient";

const response = await apiClient.get("/custom-endpoint");
await apiClient.post("/endpoint", { data: "value" });
await apiClient.put("/endpoint/123", { updated: true });
await apiClient.delete("/endpoint/123");
```

### With Error Handling
```tsx
import { api } from "@/lib/apiClient";

try {
  const products = await api.products.getAll();
  console.log(products.data);
} catch (error) {
  if (error.response?.status === 401) {
    // Session expired
  } else if (error.response?.status === 403) {
    // Permission denied
  } else {
    // Other error
  }
}
```

---

## User Information

### Get User Details
```tsx
const { user } = useIAM();

console.log(user.id);
console.log(user.email);
console.log(user.firstName);
console.log(user.lastName);
console.log(user.org.name);
console.log(user.org.slug);
```

### Display User Name
```tsx
import { getUserFullName, getUserInitials } from "@/lib/iamHelpers";

const { user } = useIAM();

const fullName = getUserFullName(user); // "John Doe"
const initials = getUserInitials(user); // "JD"
```

### Check Organization
```tsx
import { isFromOrganization } from "@/lib/iamHelpers";

const { user } = useIAM();

if (isFromOrganization(user, "acme-corp")) {
  // User is from acme-corp organization
}
```

---

## Helper Functions

### Check Admin Status
```tsx
import { isAdmin } from "@/lib/iamHelpers";

const { perms } = useIAM();

if (isAdmin(perms)) {
  // User is an administrator
}
```

### Check Resource Permissions
```tsx
import { getResourcePermissions } from "@/lib/iamHelpers";

const { perms } = useIAM();

const productPerms = getResourcePermissions(perms, "products");
console.log(productPerms.canRead);   // true/false
console.log(productPerms.canWrite);  // true/false
console.log(productPerms.canDelete); // true/false
```

### Group Permissions
```tsx
import { groupPermissionsByResource } from "@/lib/iamHelpers";

const { perms } = useIAM();

const grouped = groupPermissionsByResource(perms);
// {
//   products: ["products:read", "products:write"],
//   orders: ["orders:read"],
//   ...
// }
```

### Format Permission Name
```tsx
import { formatPermissionName } from "@/lib/iamHelpers";

const formatted = formatPermissionName("products:write");
// "Products - Write"
```

---

## Components

### Protect a Page
```tsx
import { IAMGuard } from "@/lib/iamGuard";

export default function ProtectedPage() {
  return (
    <IAMGuard>
      <div>This content requires authentication</div>
    </IAMGuard>
  );
}
```

### Permission-Based Component
```tsx
import { useIAM } from "@/lib/iamContext";

export default function ProductActions() {
  const { can } = useIAM();

  if (!can("products:write")) {
    return <div>You don't have permission to edit products</div>;
  }

  return <EditProductForm />;
}
```

### Higher-Order Component
```tsx
import { withPermissions } from "@/lib/iamHelpers";

function AdminPanel() {
  return <div>Admin Content</div>;
}

export default withPermissions(AdminPanel, ["users:write", "roles:manage"]);
```

### Custom Hook for Permission Gate
```tsx
import { usePermissionGate } from "@/lib/iamHelpers";

export default function MyComponent() {
  const { hasPermission, isLoading } = usePermissionGate("products:write");

  if (isLoading) return <div>Loading...</div>;
  if (!hasPermission) return <div>Access denied</div>;

  return <div>Authorized content</div>;
}
```

---

## Common Patterns

### Loading State
```tsx
const { user, loading } = useIAM();

if (loading) {
  return <LoadingSpinner />;
}

return <div>Content for {user.firstName}</div>;
```

### Protected Action
```tsx
async function handleDelete() {
  if (!can("products:delete")) {
    alert("You don't have permission to delete products");
    return;
  }

  try {
    await api.products.delete(productId);
    toast.success("Product deleted");
  } catch (error) {
    toast.error("Failed to delete product");
  }
}
```

### Refresh Session Manually
```tsx
const { refresh } = useIAM();

await refresh(); // Fetches latest user data and permissions
```

### Listen for Session Expiry
```tsx
useEffect(() => {
  const handleExpiry = () => {
    toast.error("Your session has expired. Please log in again.");
    router.push("/login");
  };

  window.addEventListener("iam:session-expired", handleExpiry);

  return () => {
    window.removeEventListener("iam:session-expired", handleExpiry);
  };
}, []);
```

---

## Environment Variables

```env
# IAM Service URL
NEXT_PUBLIC_IAM_URL=https://your-iam-service.com

# Client ID from IAM admin console
NEXT_PUBLIC_IAM_CLIENT_ID=your-client-id

# Organization slug
NEXT_PUBLIC_IAM_ORG_SLUG=your-org-slug

# Backend API URL
NEXT_PUBLIC_API_URL=https://your-api.com/api
```

---

## Common Permissions

```typescript
import { PERMISSIONS } from "@/types/iam";

// Products
PERMISSIONS.PRODUCTS_READ
PERMISSIONS.PRODUCTS_WRITE
PERMISSIONS.PRODUCTS_DELETE

// Categories
PERMISSIONS.CATEGORIES_READ
PERMISSIONS.CATEGORIES_WRITE
PERMISSIONS.CATEGORIES_DELETE

// Orders
PERMISSIONS.ORDERS_READ
PERMISSIONS.ORDERS_WRITE
PERMISSIONS.ORDERS_UPDATE_STATUS
PERMISSIONS.ORDERS_DELETE

// Customers
PERMISSIONS.CUSTOMERS_READ
PERMISSIONS.CUSTOMERS_WRITE
PERMISSIONS.CUSTOMERS_DELETE

// Dashboard
PERMISSIONS.DASHBOARD_VIEW
PERMISSIONS.DASHBOARD_ANALYTICS

// Users & Roles
PERMISSIONS.USERS_READ
PERMISSIONS.USERS_WRITE
PERMISSIONS.ROLES_MANAGE

// Settings
PERMISSIONS.SETTINGS_READ
PERMISSIONS.SETTINGS_WRITE
```

---

## Troubleshooting

### Check Current Permissions
```tsx
const { perms } = useIAM();
console.log("Current permissions:", perms);
```

### Debug Auth State
```tsx
const { user, perms, loading } = useIAM();
console.log("User:", user);
console.log("Permissions:", perms);
console.log("Loading:", loading);
```

### Check Session Proof
```tsx
import { getProof } from "@/lib/iamClient";

const proof = getProof();
console.log("Session proof:", proof);
```

---

## Best Practices

1. **Always check permissions** before showing UI elements
2. **Validate on backend too** - never trust frontend checks alone
3. **Use permission constants** instead of hardcoded strings
4. **Handle loading states** to avoid flashing content
5. **Show meaningful errors** when permissions are denied
6. **Refresh permissions** after role changes
7. **Test with different roles** during development

---

## Additional Resources

- Full documentation: `docs/IAM-INTEGRATION.md`
- Example component: `examples/PermissionExample.tsx`
- Type definitions: `types/iam.ts`
- Helper functions: `lib/iamHelpers.ts`
