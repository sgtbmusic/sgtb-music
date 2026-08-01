import { useAuth } from "@/_core/hooks/useAuth";

/**
 * Owner/admin gate for the management affordances (upload panel, settings icons,
 * profile editor). Visitors and signed-in non-admins never see these controls.
 */
export function useOwner() {
  const { user, loading, isAuthenticated } = useAuth();
  return {
    isOwner: user?.role === "admin",
    isAuthenticated,
    loading,
    user,
  };
}
