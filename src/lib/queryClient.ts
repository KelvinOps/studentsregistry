// lib/queryClient.ts
import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Get current user from localStorage
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
  
  // Create headers object with proper typing
  const headers: Record<string, string> = {};
  
  // Merge existing headers
  if (options.headers) {
    const existingHeaders = new Headers(options.headers);
    existingHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  }

  // Add user data to headers if available
  if (storedUser) {
    headers['x-user-data'] = storedUser;
  }

  // Add Content-Type for requests with body
  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    method,
    ...options,
    headers,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Get current user from localStorage
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
    
    const headers: Record<string, string> = {};

    // Add user data to headers if available
    if (storedUser) {
      headers['x-user-data'] = storedUser;
    }

    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
      headers,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});