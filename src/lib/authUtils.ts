// lib/authUtils.ts

// Define the User type3
export interface User {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  studentId?: string;
  department?: string;
}

/**
 * Check if an error is an unauthorized error
 */
export function isUnauthorizedError(error: Error): boolean {
  return error.message.includes('401') || 
         error.message.includes('Unauthorized') ||
         error.message.includes('unauthorized');
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) as User : null;
  } catch {
    return null;
  }
}

/**
 * Set current user in localStorage and cookie
 */
export function setCurrentUser(user: User): void {
  if (typeof window === 'undefined') return;
  
  const userStr = JSON.stringify(user);
  localStorage.setItem('currentUser', userStr);
  
  // Also set cookie
  document.cookie = `currentUser=${encodeURIComponent(userStr)}; path=/; max-age=86400; SameSite=Lax`;
}

/**
 * Clear current user from localStorage and cookie
 */
export function clearCurrentUser(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('currentUser');
  document.cookie = 'currentUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}