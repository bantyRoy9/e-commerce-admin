// Compatibility shim — delegates to the IAM context
export { useIAM as useAuth, useIAM } from "@/lib/iamContext";
export type { IAMUser, PermMap } from "@/lib/iamContext";
