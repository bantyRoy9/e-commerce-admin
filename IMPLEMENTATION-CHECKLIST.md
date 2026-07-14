# Implementation Checklist

Use this checklist to ensure your microservices IAM integration is fully implemented.

## ✅ Already Complete

- [x] IAM Client configured (`lib/iamClient.ts`)
- [x] IAM Context set up (`lib/iamContext.tsx`)
- [x] IAM Guard component created (`lib/iamGuard.tsx`)
- [x] Login page integrated (`app/login/page.tsx`)
- [x] Environment variables configured (`.env.local`)
- [x] IAMProvider added to app (`app/providers.tsx`)
- [x] Middleware created (`middleware.ts`)
- [x] API proxy route handler (`app/api/proxy/[...path]/route.ts`)
- [x] API client utility (`lib/apiClient.ts`)
- [x] Helper functions (`lib/iamHelpers.ts`)
- [x] TypeScript types (`types/iam.ts`)
- [x] Documentation created

## 🔲 Todo: Update Existing Code

### 1. Replace Direct API Calls

Go through your components and replace hardcoded API calls:

#### Products Components
- [ ] `components/products/ProductTable.tsx` - Update to use `api.products.getAll()`
- [ ] `components/products/ProductForm.tsx` - Update to use `api.products.create()/update()`
- [ ] `components/products/DeleteProductModal.tsx` - Update to use `api.products.delete()`
- [ ] `app/products/page.tsx` - Update API calls
- [ ] `app/products/add/page.tsx` - Update API calls
- [ ] `app/products/[id]/edit/page.tsx` - Update API calls

#### Categories Components
- [ ] `components/categories/CategoriesTable.tsx` - Update API calls
- [ ] `components/categories/CategoriesForm.tsx` - Update API calls
- [ ] `components/categories/DeleteCategoryModal.tsx` - Update API calls
- [ ] `app/categories/page.tsx` - Update API calls
- [ ] `app/categories/add/page.tsx` - Update API calls
- [ ] `app/categories/[id]/edit/page.tsx` - Update API calls

#### Orders Components
- [ ] `components/orders/OrderTable.tsx` - Update API calls
- [ ] `components/orders/OrderDetails.tsx` - Update API calls
- [ ] `app/orders/page.tsx` - Update API calls
- [ ] `app/orders/[id]/page.tsx` - Update API calls

#### Dashboard Components
- [ ] `components/dashboard/DashboardCard.tsx` - Update API calls
- [ ] `components/dashboard/LatestOrders.tsx` - Update API calls
- [ ] `components/dashboard/RevenueChart.tsx` - Update API calls
- [ ] `components/dashboard/SalesChart.tsx` - Update API calls
- [ ] `components/dashboard/LowStock.tsx` - Update API calls
- [ ] `app/dashboard/page.tsx` - Update API calls

#### Customer Components
- [ ] `components/customers/CustomerTable.tsx` - Update API calls
- [ ] `components/customers/CustomerProfile.tsx` - Update API calls
- [ ] `components/customers/CustomerOrder.tsx` - Update API calls

### Example Migration

**Before:**
```tsx
const response = await axios.get("https://192.168.1.73:5001/api/products");
```

**After:**
```tsx
import { api } from "@/lib/apiClient";
const response = await api.products.getAll();
```

---

### 2. Add Permission Checks

Add permission checks to components that modify data:

#### Products
- [ ] Add `can("products:write")` check before showing Add Product button
- [ ] Add `can("products:write")` check before showing Edit button
- [ ] Add `can("products:delete")` check before showing Delete button
- [ ] Add `can("products:read")` check for viewing product details

#### Categories
- [ ] Add `can("categories:write")` check before showing Add Category button
- [ ] Add `can("categories:write")` check before showing Edit button
- [ ] Add `can("categories:delete")` check before showing Delete button

#### Orders
- [ ] Add `can("orders:write")` check before allowing order edits
- [ ] Add `can("orders:update_status")` check before status changes
- [ ] Add `can("orders:read")` check for viewing order details

#### Dashboard
- [ ] Add `can("dashboard:view")` check for main dashboard
- [ ] Add `can("dashboard:analytics")` check for analytics sections

### Example Permission Check

```tsx
import { useIAM } from "@/lib/iamContext";
import { PERMISSIONS } from "@/types/iam";

export default function ProductActions() {
  const { can } = useIAM();

  return (
    <div>
      {can(PERMISSIONS.PRODUCTS_WRITE) && (
        <button>Add Product</button>
      )}
      {can(PERMISSIONS.PRODUCTS_DELETE) && (
        <button>Delete</button>
      )}
    </div>
  );
}
```

---

### 3. Protect Pages with IAMGuard

Add IAMGuard to protected pages:

- [ ] `app/dashboard/page.tsx` - Wrap with IAMGuard
- [ ] `app/products/page.tsx` - Wrap with IAMGuard
- [ ] `app/products/add/page.tsx` - Wrap with IAMGuard
- [ ] `app/products/[id]/edit/page.tsx` - Wrap with IAMGuard
- [ ] `app/categories/page.tsx` - Wrap with IAMGuard
- [ ] `app/categories/add/page.tsx` - Wrap with IAMGuard
- [ ] `app/categories/[id]/edit/page.tsx` - Wrap with IAMGuard
- [ ] `app/orders/page.tsx` - Wrap with IAMGuard
- [ ] `app/orders/[id]/page.tsx` - Wrap with IAMGuard

### Example Page Protection

```tsx
import { IAMGuard } from "@/lib/iamGuard";

export default function DashboardPage() {
  return (
    <IAMGuard>
      {/* Your page content */}
    </IAMGuard>
  );
}
```

---

### 4. Update Redux/State Management (if used)

If you're using Redux for auth state:

- [ ] Remove old auth slice (`store/slices/authSlice.ts`)
- [ ] Update components using Redux auth to use `useIAM()` instead
- [ ] Remove auth-related actions/reducers
- [ ] Clean up unused auth files

---

### 5. Add User Info Display

Add user information in the header/profile section:

- [ ] `components/layout/Header.tsx` - Display user name using `getUserFullName()`
- [ ] Add user avatar with initials using `getUserInitials()`
- [ ] Add logout button using `logout()` from useIAM

### Example User Display

```tsx
import { useIAM } from "@/lib/iamContext";
import { getUserFullName, getUserInitials } from "@/lib/iamHelpers";

export default function Header() {
  const { user, logout } = useIAM();

  return (
    <div>
      <div className="avatar">{getUserInitials(user)}</div>
      <span>{getUserFullName(user)}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## 🔧 Todo: IAM Service Configuration

### 1. Register Application

- [ ] Log into IAM admin console
- [ ] Navigate to Applications section
- [ ] Click "Register New App"
- [ ] Enter app details:
  - Name: `E-Commerce Admin`
  - Redirect URLs: Your production URLs
  - Allowed Origins: Your domains
- [ ] Save and copy the Client ID
- [ ] Update `NEXT_PUBLIC_IAM_CLIENT_ID` in `.env.local`

### 2. Define Permissions

In IAM admin console, create these permissions:

#### Products
- [ ] `products:read` - View products
- [ ] `products:write` - Create/edit products
- [ ] `products:delete` - Delete products

#### Categories
- [ ] `categories:read` - View categories
- [ ] `categories:write` - Create/edit categories
- [ ] `categories:delete` - Delete categories

#### Orders
- [ ] `orders:read` - View orders
- [ ] `orders:write` - Create/edit orders
- [ ] `orders:update_status` - Update order status
- [ ] `orders:delete` - Delete orders

#### Customers
- [ ] `customers:read` - View customer data
- [ ] `customers:write` - Edit customer data
- [ ] `customers:delete` - Delete customers

#### Dashboard
- [ ] `dashboard:view` - Access dashboard
- [ ] `dashboard:analytics` - View analytics

#### Settings
- [ ] `settings:read` - View settings
- [ ] `settings:write` - Modify settings

#### Users & Roles
- [ ] `users:read` - View users
- [ ] `users:write` - Create/edit users
- [ ] `users:delete` - Delete users
- [ ] `roles:manage` - Manage roles

#### Inventory
- [ ] `inventory:read` - View inventory
- [ ] `inventory:write` - Update inventory

#### Payments
- [ ] `payments:read` - View payments
- [ ] `payments:process` - Process payments
- [ ] `payments:refund` - Issue refunds

### 3. Create Roles

Create roles and assign permissions:

#### Admin Role
- [ ] Create "Admin" role
- [ ] Assign ALL permissions above

#### Manager Role
- [ ] Create "Manager" role
- [ ] Assign permissions:
  - All products permissions
  - All categories permissions
  - All orders permissions
  - customers:read, customers:write
  - dashboard:view, dashboard:analytics
  - inventory:read, inventory:write

#### Editor Role
- [ ] Create "Editor" role
- [ ] Assign permissions:
  - products:read, products:write
  - categories:read, categories:write
  - orders:read, orders:write
  - dashboard:view

#### Viewer Role
- [ ] Create "Viewer" role
- [ ] Assign permissions:
  - products:read
  - categories:read
  - orders:read
  - customers:read
  - dashboard:view

### 4. Assign Users to Roles

- [ ] Create test users in IAM
- [ ] Assign users to appropriate roles
- [ ] Test login with different role users

---

## 🧪 Todo: Testing

### Manual Testing

#### Authentication Flow
- [ ] Test login with valid credentials
- [ ] Test login with invalid credentials
- [ ] Test login with wrong organization
- [ ] Test logout functionality
- [ ] Test session persistence on page refresh
- [ ] Test session expiry (wait 15+ mins)
- [ ] Test auto token refresh (check network tab)

#### Permission Checks
- [ ] Log in as Admin - verify all features visible
- [ ] Log in as Manager - verify appropriate features visible
- [ ] Log in as Editor - verify limited features visible
- [ ] Log in as Viewer - verify read-only access
- [ ] Verify action buttons hidden based on permissions
- [ ] Try accessing restricted features - should see error

#### API Calls
- [ ] Test GET requests (read data)
- [ ] Test POST requests (create data)
- [ ] Test PUT/PATCH requests (update data)
- [ ] Test DELETE requests (delete data)
- [ ] Verify auth headers are sent
- [ ] Verify session proof rotation
- [ ] Test 401 handling and auto-refresh

#### Error Handling
- [ ] Test with IAM service down
- [ ] Test with backend service down
- [ ] Test with invalid session proof
- [ ] Test with expired refresh token
- [ ] Verify user sees appropriate error messages

#### Edge Cases
- [ ] Test multiple browser tabs
- [ ] Test browser back/forward buttons
- [ ] Test with disabled cookies
- [ ] Test with cleared sessionStorage
- [ ] Test with network interruption

### Automated Testing

- [ ] Write unit tests for `iamHelpers.ts` functions
- [ ] Write integration tests for `useIAM` hook
- [ ] Write E2E tests for login flow
- [ ] Write E2E tests for permission checks
- [ ] Set up CI/CD testing pipeline

---

## 📝 Todo: Documentation

### Internal Documentation
- [ ] Add architecture diagram to project wiki
- [ ] Document permission requirements for each feature
- [ ] Create onboarding guide for new developers
- [ ] Document deployment process
- [ ] Create troubleshooting runbook

### User Documentation
- [ ] Create user guide for login process
- [ ] Document what each role can do
- [ ] Create FAQ for common issues
- [ ] Add role request process documentation

---

## 🚀 Todo: Deployment

### Pre-Deployment
- [ ] Review all environment variables
- [ ] Test in staging environment
- [ ] Verify IAM service is accessible from production
- [ ] Verify backend APIs are accessible
- [ ] Set up monitoring and logging
- [ ] Configure CORS settings in IAM
- [ ] Set up SSL certificates

### Deployment Steps
- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Deploy to production
- [ ] Monitor error rates
- [ ] Test production login
- [ ] Verify all services communicate correctly

### Post-Deployment
- [ ] Monitor authentication success rate
- [ ] Check error logs for auth failures
- [ ] Verify performance metrics
- [ ] Set up alerts for auth failures
- [ ] Document any issues and resolutions

---

## 🔍 Todo: Optimization

### Performance
- [ ] Enable caching for static routes
- [ ] Optimize bundle size
- [ ] Implement code splitting
- [ ] Add loading skeletons
- [ ] Optimize images

### Security
- [ ] Set up Content Security Policy
- [ ] Enable HTTPS everywhere
- [ ] Set up rate limiting
- [ ] Add CSRF protection
- [ ] Implement audit logging

### User Experience
- [ ] Add loading states during auth
- [ ] Show friendly error messages
- [ ] Add "Remember me" functionality (if needed)
- [ ] Add session timeout warning
- [ ] Implement graceful error recovery

---

## ✅ Completion Checklist

- [ ] All existing code updated to use new API client
- [ ] All pages protected with IAMGuard
- [ ] All actions have permission checks
- [ ] IAM service fully configured
- [ ] All roles and permissions created
- [ ] Users assigned to roles
- [ ] Manual testing completed
- [ ] Automated tests written
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] Tested in staging
- [ ] Deployed to production
- [ ] Production monitoring set up

---

## 📊 Progress Tracking

```
Total Tasks: ~120
Completed: ~30 (IAM integration foundation)
Remaining: ~90 (updates to existing code + configuration)

Estimated Time:
- Code updates: 8-12 hours
- IAM configuration: 2-3 hours
- Testing: 4-6 hours
- Documentation: 2-3 hours
- Deployment: 2-4 hours

Total: 18-28 hours
```

---

## 🎯 Priority Order

1. **High Priority** (Do First)
   - Update API calls in critical components
   - Add IAMGuard to main pages
   - Configure IAM service with basic permissions
   - Test login/logout flow

2. **Medium Priority** (Do Second)
   - Add permission checks to all actions
   - Update remaining components
   - Complete IAM configuration
   - Write documentation

3. **Low Priority** (Do Last)
   - Optimization tasks
   - Nice-to-have features
   - Additional documentation
   - Automated tests

---

## 📞 Need Help?

- Stuck on a task? Check `docs/QUICK-REFERENCE.md`
- Need examples? See `examples/PermissionExample.tsx`
- Architecture questions? Read `docs/ARCHITECTURE.md`
- IAM setup? See `docs/IAM-INTEGRATION.md`

Good luck with your implementation! 🚀
