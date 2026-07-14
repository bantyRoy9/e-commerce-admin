# Architecture Documentation

## System Architecture

### High-Level Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                            End Users                                 │
│                         (Web Browsers)                               │
└────────────────────────────┬─────────────────────────────────────────┘
                             │
                             │ HTTPS
                             │
┌────────────────────────────▼─────────────────────────────────────────┐
│                                                                       │
│                    Next.js Frontend Application                      │
│                         (Port 3000)                                  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                     Client-Side Layer                        │  │
│  │                                                              │  │
│  │  ► React Components                                         │  │
│  │  ► IAM Context (useIAM hook)                                │  │
│  │  ► Permission Checks (can/canAny)                           │  │
│  │  ► UI Components                                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                             │                                        │
│  ┌──────────────────────────▼───────────────────────────────────┐  │
│  │                   Authentication Layer                       │  │
│  │                                                              │  │
│  │  ► IAM Client (iamClient.ts)                                │  │
│  │  ► Session Proof Management                                 │  │
│  │  ► Token Refresh Logic                                      │  │
│  │  ► Request Serialization                                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                             │                                        │
│  ┌──────────────────────────▼───────────────────────────────────┐  │
│  │                     API Client Layer                         │  │
│  │                                                              │  │
│  │  ► API Client (apiClient.ts)                                │  │
│  │  ► Typed API Methods                                        │  │
│  │  ► Error Handling                                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                             │                                        │
│  ┌──────────────────────────▼───────────────────────────────────┐  │
│  │                    Server-Side Layer                         │  │
│  │                                                              │  │
│  │  ► Next.js Middleware (middleware.ts)                       │  │
│  │  ► API Routes (/api/proxy/[...path])                        │  │
│  │  ► Edge Functions                                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
└────────────┬──────────────────────────┬──────────────────────────────┘
             │                          │
             │                          │
             │ Auth Requests            │ Business Logic Requests
             │ (Session Proofs)         │ (With Auth Headers)
             │                          │
┌────────────▼──────────────┐  ┌───────▼──────────────────────────────┐
│                           │  │                                      │
│      IAM Service          │  │       Backend API Services           │
│    (Port 5001)            │  │      (Port 5001/api)                │
│                           │  │                                      │
│  ► User Authentication    │  │  ► Product Service                  │
│  ► Session Management     │  │  ► Order Service                    │
│  ► Permission Validation  │  │  ► Category Service                 │
│  ► Token Issuance         │  │  ► Customer Service                 │
│  ► Role Management        │  │  ► Dashboard Service                │
│  ► Organization Mgmt      │  │  ► Inventory Service                │
│                           │  │  ► Payment Service                  │
└───────────────────────────┘  └─────────────────────────────────────┘
```

---

## Authentication Flow

### Login Process

```
┌─────────┐                ┌─────────────┐               ┌──────────┐
│ Browser │                │   Next.js   │               │   IAM    │
│         │                │   Frontend  │               │ Service  │
└────┬────┘                └──────┬──────┘               └────┬─────┘
     │                            │                           │
     │ 1. Submit credentials      │                           │
     ├───────────────────────────►│                           │
     │                            │                           │
     │                            │ 2. POST /auth/login       │
     │                            ├──────────────────────────►│
     │                            │   {email, password, org}  │
     │                            │                           │
     │                            │ 3. Validate credentials   │
     │                            │                           │
     │                            │ 4. Return tokens          │
     │                            │◄──────────────────────────┤
     │                            │   - httpOnly cookie       │
     │                            │   - session proof         │
     │                            │                           │
     │ 5. Store session proof     │                           │
     │    in sessionStorage       │                           │
     │                            │                           │
     │                            │ 6. GET /auth/me           │
     │                            ├──────────────────────────►│
     │                            │   x-session-proof: xxx    │
     │                            │                           │
     │                            │ 7. Return user data       │
     │                            │◄──────────────────────────┤
     │                            │   x-next-session-proof    │
     │                            │                           │
     │                            │ 8. GET /auth/permissions  │
     │                            ├──────────────────────────►│
     │                            │   x-session-proof: yyy    │
     │                            │                           │
     │                            │ 9. Return permissions     │
     │                            │◄──────────────────────────┤
     │                            │                           │
     │ 10. Redirect to dashboard  │                           │
     │◄───────────────────────────┤                           │
     │                            │                           │
```

### Session Proof Rotation

```
Every request to IAM rotates the session proof:

Request  → x-session-proof: ABC123
Response ← x-next-session-proof: DEF456

Next Request  → x-session-proof: DEF456
Next Response ← x-next-session-proof: GHI789

This prevents replay attacks - each proof is single-use.
```

### Auto-Refresh Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   IAM Context Timer                         │
│                   (Every 14 minutes)                        │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │
┌────────────────────────────▼────────────────────────────────┐
│  POST /auth/refresh                                         │
│  (Uses httpOnly refresh token cookie)                       │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ New session     │
                    │ proof issued    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Store in        │
                    │ sessionStorage  │
                    └─────────────────┘
```

---

## Request Flow

### API Request Journey

```
1. Component makes API call
   ↓
   import { api } from "@/lib/apiClient";
   const products = await api.products.getAll();

2. apiClient adds headers
   ↓
   x-session-proof: [from sessionStorage]
   x-client-id: [from env]

3. Request goes to Next.js API proxy
   ↓
   /api/proxy/products → app/api/proxy/[...path]/route.ts

4. Proxy forwards to backend
   ↓
   https://192.168.1.73:5001/api/products
   + All auth headers

5. Backend validates with IAM
   ↓
   Backend can call IAM to verify session proof

6. Response flows back
   ↓
   Backend → Proxy → apiClient → Component

7. New session proof stored
   ↓
   x-next-session-proof header processed automatically
```

### Middleware Protection Flow

```
User visits /dashboard
     ↓
Next.js middleware.ts runs (Edge Runtime)
     ↓
Check for iam_refresh cookie
     │
     ├─── Cookie exists ─────► Allow request, render page
     │
     └─── No cookie ─────────► Redirect to /login?redirect=/dashboard
```

---

## Component Architecture

### IAM Integration Layers

```
┌───────────────────────────────────────────────────────────────┐
│                    Application Layer                          │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Your Components (Products, Orders, Dashboard, etc.)   │ │
│  └────────────────────────┬────────────────────────────────┘ │
└───────────────────────────┼────────────────────────────────────┘
                            │
                            │ import { useIAM, api }
                            │
┌───────────────────────────▼────────────────────────────────────┐
│                    Integration Layer                           │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  useIAM Hook                                             │ │
│  │  ► user, perms, loading                                  │ │
│  │  ► can(), canAny()                                       │ │
│  │  ► login(), logout()                                     │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  API Client                                              │ │
│  │  ► api.products.getAll()                                 │ │
│  │  ► api.orders.getById()                                  │ │
│  │  ► apiClient.get/post/put/delete                         │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  IAM Helpers                                             │ │
│  │  ► isAdmin(), canManageProducts()                        │ │
│  │  ► getUserFullName(), getUserInitials()                  │ │
│  └──────────────────────────────────────────────────────────┘ │
└───────────────────────────┬────────────────────────────────────┘
                            │
                            │
┌───────────────────────────▼────────────────────────────────────┐
│                       Core Layer                               │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  IAM Context Provider                                    │ │
│  │  ► Manages auth state                                    │ │
│  │  ► Auto-refresh timer                                    │ │
│  │  ► Session expiry handler                                │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  IAM Client (axios)                                      │ │
│  │  ► Request serialization                                 │ │
│  │  ► Session proof management                              │ │
│  │  ► 401 handling & refresh                                │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### Permission Check Flow

```
Component Render
     │
     ▼
const { can } = useIAM();
     │
     ▼
Read perms from Context
     │
     ▼
perms[action] === true ?
     │
     ├─── Yes ──► Render component
     │
     └─── No ───► Hide component / Show error
```

### User State Management

```
App Start
     │
     ▼
IAMProvider mounts
     │
     ▼
loadUser(isInitialLoad=true)
     │
     ├─ No session proof? → Try refresh
     │                          │
     │                          ├─ Success → Set proof, continue
     │                          │
     │                          └─ Fail → setUser(null)
     │
     ▼
Fetch /auth/me + /auth/permissions (parallel)
     │
     ▼
setUser(data) + setPerms(data)
     │
     ▼
Start 14-min refresh timer
     │
     ▼
App ready - user authenticated
```

---

## Security Architecture

### Defense Layers

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: Edge Middleware                                   │
│  ► Checks auth cookie before page render                    │
│  ► Redirects to login if unauthenticated                    │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│  Layer 2: IAM Guard Component                               │
│  ► Client-side route protection                             │
│  ► Loading states during verification                       │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│  Layer 3: Permission Checks                                 │
│  ► UI-level access control                                  │
│  ► Hide/disable unauthorized actions                        │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│  Layer 4: API Request Authentication                        │
│  ► Session proofs on every request                          │
│  ► Auto token refresh on 401                                │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│  Layer 5: Backend Validation                                │
│  ► IAM service validates all requests                       │
│  ► Verifies session proofs                                  │
│  ► Checks permissions server-side                           │
└─────────────────────────────────────────────────────────────┘
```

### Token Security Model

```
┌──────────────────────────────────────────────────────────────┐
│                   Refresh Token                              │
│  ► Long-lived (7-30 days)                                    │
│  ► httpOnly cookie                                           │
│  ► Not accessible via JavaScript                            │
│  ► Secure flag (HTTPS only)                                 │
│  ► SameSite=Strict                                           │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                   Session Proof                              │
│  ► Short-lived (~15 minutes)                                 │
│  ► Stored in sessionStorage                                  │
│  ► Single-use (rotated after each request)                   │
│  ► Cleared on page close                                     │
│  ► Automatically refreshed                                   │
└──────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

### Production Setup

```
┌─────────────────────────────────────────────────────────────┐
│                         CDN / Edge                           │
│                    (Vercel, Cloudflare)                      │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                    Next.js Application                       │
│                   (Serverless Functions)                     │
│                                                              │
│  ► Static pages cached                                       │
│  ► Dynamic routes server-rendered                            │
│  ► API routes as serverless functions                        │
│  ► Middleware runs on edge                                   │
└──────────────┬──────────────────────┬───────────────────────┘
               │                      │
┌──────────────▼──────────┐  ┌───────▼───────────────────────┐
│     IAM Service         │  │   Backend API Services        │
│   (Microservice)        │  │   (Microservices)             │
│                         │  │                               │
│  ► Kubernetes/Docker    │  │  ► Kubernetes/Docker          │
│  ► Load balanced        │  │  ► Load balanced              │
│  ► Auto-scaled          │  │  ► Auto-scaled                │
│  ► Database backed      │  │  ► Database backed            │
└─────────────────────────┘  └───────────────────────────────┘
```

---

## File Dependencies

```
app/
├── providers.tsx ──────────► lib/iamContext.tsx
│
├── login/page.tsx ─────────► lib/iamContext.tsx
│
├── dashboard/page.tsx ─────► lib/iamGuard.tsx ──► lib/iamContext.tsx
│
└── api/proxy/[...path]/ ───► lib/iamClient.ts
    route.ts

lib/
├── iamContext.tsx ─────────► iamClient.ts
├── iamGuard.tsx ───────────► iamContext.tsx
├── apiClient.ts ───────────► iamClient.ts
└── iamHelpers.ts ──────────► types/iam.ts

middleware.ts ──────────────► (Edge Runtime - No dependencies)
```

---

## Technology Stack

```
Frontend Framework:    Next.js 15 (App Router)
UI Library:            React 19
State Management:      React Context + Redux (optional)
HTTP Client:           Axios
Language:              TypeScript
Styling:               Tailwind CSS

Authentication:        IAM Microservice
Session Management:    Session Proofs + httpOnly Cookies
Authorization:         Role-Based Access Control (RBAC)

Backend:               Your API Services (Microservices)
Deployment:            Vercel / Custom hosting
```

---

## Performance Characteristics

### Request Performance

```
Initial Page Load
├── Middleware check:           ~5ms  (Edge)
├── Page render:                ~50ms (SSR)
├── IAM session restore:        ~100ms (Network)
└── Total:                      ~155ms

Subsequent Requests
├── Session proof from storage: ~1ms
├── API call (cached):          ~50ms
└── Total:                      ~51ms

Token Refresh (every 14 min)
├── Background refresh:         ~100ms
└── No user-visible delay
```

### Scalability

- **Frontend**: Serverless, auto-scales with traffic
- **IAM Service**: Stateless, horizontally scalable
- **Backend**: Microservices, independently scalable
- **Session Storage**: In-memory (sessionStorage), no backend load

---

This architecture provides enterprise-grade security, scalability, and developer experience for your e-commerce admin application.
