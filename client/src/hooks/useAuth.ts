import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export function useAuth() {
  // Use a side effect to log when the hook runs
  // and to see if the queryFn is being called
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["supabase-auth-user"],
    queryFn: async () => {
      // Only call getUser if a session exists
      const session = supabase.auth.getSession ? (await supabase.auth.getSession()).data.session : null;
      if (!session) return null;
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Log the result for debugging
  console.log("useAuth result:", { user, isLoading, error });

  return {
    user,
    isLoading: false, // Never block on loader, always allow UI to show
    isAuthenticated: !!user && !error,
  };
}