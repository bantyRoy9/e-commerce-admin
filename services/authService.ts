/**
 * authService.ts — thin wrapper; actual IAM calls go through iamContext.
 * This file is kept for backward compatibility but the real auth state
 * lives in the IAMProvider (lib/iamContext.tsx).
 */

// Re-export the IAM hook so existing components can migrate gradually
export { useIAM as useAuth } from "@/lib/iamContext";
