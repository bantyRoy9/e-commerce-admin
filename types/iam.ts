/**
 * TypeScript type definitions for IAM system integration
 */

// ─── User Types ───────────────────────────────────────────────────────────────

export interface IAMUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  org: IAMOrganization;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAMOrganization {
  id: string;
  name: string;
  slug: string;
}

// ─── Permission Types ─────────────────────────────────────────────────────────

export type PermissionMap = Record<string, boolean>;

export interface IAMPermission {
  id: string;
  name: string;
  description?: string;
  resourceType?: string;
  action?: string;
}

export interface IAMRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
}

// ─── Authentication Types ─────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
  orgSlug?: string;
}

export interface LoginResponse {
  message: string;
  sessionProof?: string;
  user?: IAMUser;
}

export interface RefreshResponse {
  message: string;
  sessionProof?: string;
}

// ─── Session Types ────────────────────────────────────────────────────────────

export interface SessionInfo {
  user: IAMUser;
  permissions: PermissionMap;
  expiresAt: string;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface IAMErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

export interface IAMSuccessResponse<T = any> {
  data: T;
  message?: string;
}

// ─── Context Types ────────────────────────────────────────────────────────────

export interface IAMContextValue {
  user: IAMUser | null;
  perms: PermissionMap;
  loading: boolean;
  login: (email: string, password: string, orgSlug?: string) => Promise<void>;
  logout: () => Promise<void>;
  can: (action: string) => boolean;
  canAny: (...actions: string[]) => boolean;
  refresh: () => Promise<void>;
}

// ─── Configuration Types ──────────────────────────────────────────────────────

export interface IAMConfig {
  iamUrl: string;
  clientId: string;
  orgSlug: string;
  autoRefreshInterval?: number; // in milliseconds
}

// ─── Common Permission Actions ────────────────────────────────────────────────

export const PERMISSIONS = {
  // Products
  PRODUCTS_READ: "products:read",
  PRODUCTS_WRITE: "products:write",
  PRODUCTS_DELETE: "products:delete",

  // Categories
  CATEGORIES_READ: "categories:read",
  CATEGORIES_WRITE: "categories:write",
  CATEGORIES_DELETE: "categories:delete",

  // Orders
  ORDERS_READ: "orders:read",
  ORDERS_WRITE: "orders:write",
  ORDERS_UPDATE_STATUS: "orders:update_status",
  ORDERS_DELETE: "orders:delete",

  // Customers
  CUSTOMERS_READ: "customers:read",
  CUSTOMERS_WRITE: "customers:write",
  CUSTOMERS_DELETE: "customers:delete",

  // Dashboard
  DASHBOARD_VIEW: "dashboard:view",
  DASHBOARD_ANALYTICS: "dashboard:analytics",

  // Settings
  SETTINGS_READ: "settings:read",
  SETTINGS_WRITE: "settings:write",

  // Users & Roles
  USERS_READ: "users:read",
  USERS_WRITE: "users:write",
  USERS_DELETE: "users:delete",
  ROLES_MANAGE: "roles:manage",

  // Inventory
  INVENTORY_READ: "inventory:read",
  INVENTORY_WRITE: "inventory:write",

  // Payments
  PAYMENTS_READ: "payments:read",
  PAYMENTS_PROCESS: "payments:process",
  PAYMENTS_REFUND: "payments:refund",
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;
export type PermissionValue = (typeof PERMISSIONS)[PermissionKey];
