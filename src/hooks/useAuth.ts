// hooks/useAuth.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "../../shared/schema";

export function useAuth() {
  const queryClient = useQueryClient();
  
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      // Check localStorage for logged in user
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          return JSON.parse(storedUser) as User;
        } catch {
          localStorage.removeItem('currentUser');
          return null;
        }
      }
      return null;
    },
    retry: false,
    staleTime: 1000, // 1 second - check frequently for changes
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true, // Always refetch on mount
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    refetch: () => queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] }),
  };
}