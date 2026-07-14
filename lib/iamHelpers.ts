/**
 * Helper utilities for IAM operations
 */
import { PERMISSIONS } from "@/types/iam";
import type { IAMUser, PermissionMap } from "@/types/iam";

/**
 * Check if user has all specified permissions
 */
export function hasAllPermissions(
  perms: PermissionMap,
  ...requiredPerms: string[]
): boolean {
  return requiredPerms.every((perm) => perms[perm] === true);
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(
  perms: PermissionMap,
  ...requiredPerms: string[]
): boolean {
  return requiredPerms.some((perm) => perms[perm] === true);
}

/**
 * Get user's full name
 */
export function getUserFullName(user: IAMUser | null): string {
  if (!user) return "Guest";
  return `${user.firstName} ${user.lastName}`.trim();
}

/**
 * Get user initials for avatar
 */
export function getUserInitials(user: IAMUser | null): string {
  if (!user) return "?";
  const first = user.firstName?.charAt(0) || "";
  const last = user.lastName?.charAt(0) || "";
  return (first + last).toUpperCase();
}

/**
 * Check if user is admin (has all admin permissions)
 */
export function isAdmin(perms: PermissionMap): boolean {
  const adminPerms = [
    PERMISSIONS.USERS_WRITE,
    PERMISSIONS.ROLES_MANAGE,
    PERMISSIONS.SETTINGS_WRITE,
  ];
  return hasAllPermissions(perms, ...adminPerms);
}

/**
 * Check if user can manage products (read, write, delete)
 */
export function canManageProducts(perms: PermissionMap): boolean {
  return hasAllPermissions(
    perms,
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.PRODUCTS_WRITE,
    PERMISSIONS.PRODUCTS_DELETE
  );
}

/**
 * Check if user can manage orders
 */
export function canManageOrders(perms: PermissionMap): boolean {
  return hasAllPermissions(
    perms,
    PERMISSIONS.ORDERS_READ,
    PERMISSIONS.ORDERS_WRITE
  );
}

/**
 * Check if user can view analytics
 */
export function canViewAnalytics(perms: PermissionMap): boolean {
  return hasAnyPermission(
    perms,
    PERMISSIONS.DASHBOARD_ANALYTICS,
    PERMISSIONS.DASHBOARD_VIEW
  );
}

/**
 * Get permissions for a specific resource type
 */
export function getResourcePermissions(
  perms: PermissionMap,
  resourceType: "products" | "orders" | "customers" | "categories"
): {
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
} {
  return {
    canRead: perms[`${resourceType}:read`] === true,
    canWrite: perms[`${resourceType}:write`] === true,
    canDelete: perms[`${resourceType}:delete`] === true,
  };
}

/**
 * Format permission name for display
 * Example: "products:write" → "Products - Write"
 */
export function formatPermissionName(permission: string): string {
  const [resource, action] = permission.split(":");
  if (!resource || !action) return permission;

  const resourceFormatted =
    resource.charAt(0).toUpperCase() + resource.slice(1);
  const actionFormatted = action.charAt(0).toUpperCase() + action.slice(1);

  return `${resourceFormatted} - ${actionFormatted}`;
}

/**
 * Group permissions by resource type
 */
export function groupPermissionsByResource(
  perms: PermissionMap
): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};

  Object.keys(perms).forEach((perm) => {
    if (perms[perm] !== true) return;

    const [resource] = perm.split(":");
    if (!resource) return;

    if (!grouped[resource]) {
      grouped[resource] = [];
    }
    grouped[resource].push(perm);
  });

  return grouped;
}

/**
 * Check if session is about to expire (within 2 minutes)
 * Note: This requires your IAM service to return session expiry time
 */
export function isSessionExpiringSoon(expiresAt?: string): boolean {
  if (!expiresAt) return false;

  const expiryTime = new Date(expiresAt).getTime();
  const currentTime = Date.now();
  const twoMinutes = 2 * 60 * 1000;

  return expiryTime - currentTime < twoMinutes;
}

/**
 * Get time until session expires in human-readable format
 */
export function getTimeUntilExpiry(expiresAt?: string): string {
  if (!expiresAt) return "Unknown";

  const expiryTime = new Date(expiresAt).getTime();
  const currentTime = Date.now();
  const diff = expiryTime - currentTime;

  if (diff <= 0) return "Expired";

  const minutes = Math.floor(diff / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

/**
 * Validate if permission string is in correct format
 */
export function isValidPermissionFormat(permission: string): boolean {
  const regex = /^[a-z_]+:[a-z_]+$/;
  return regex.test(permission);
}

/**
 * Create a permission string from resource and action
 */
export function createPermission(
  resource: string,
  action: string
): string {
  return `${resource.toLowerCase()}:${action.toLowerCase()}`;
}

/**
 * Check if user belongs to a specific organization
 */
export function isFromOrganization(user: IAMUser | null, orgSlug: string): boolean {
  return user?.org.slug === orgSlug;
}

/**
 * Higher-order component helper to check permissions
 */
export function withPermissions<T extends object>(
  Component: React.ComponentType<T>,
  requiredPermissions: string[]
) {
  return function PermissionWrappedComponent(props: T) {
    const { default: React } = require("react");
    const { useIAM } = require("./iamContext");
    const { perms } = useIAM();

    const hasPermission = hasAllPermissions(perms, ...requiredPermissions);

    if (!hasPermission) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          You don't have permission to access this feature.
        </div>
      );
    }

    return <Component {...props} />;
  };
}

/**
 * Custom hook for permission-based conditional rendering
 */
export function usePermissionGate(requiredPermission: string) {
  const { default: React } = require("react");
  const { useIAM } = require("./iamContext");
  const { perms, loading } = useIAM();

  return {
    hasPermission: perms[requiredPermission] === true,
    isLoading: loading,
  };
}
