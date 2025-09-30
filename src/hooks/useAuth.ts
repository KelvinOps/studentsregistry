// hooks/useAuth.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { User } from "../../shared/schema";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      // Check localStorage for logged in user
      if (typeof window === 'undefined') return null;
      
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

  const logout = () => {
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
    }
    
    // Invalidate queries to update UI
    queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    queryClient.clear(); // Clear all cached queries
    
    // Redirect to home page
    router.push('/');
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
    refetch: () => queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] }),
  };
}