import { signInAnonymously, User } from "firebase/auth";
import { auth } from "../../firebase.config";

/**
 * Authenticate user with Firebase using Telegram user ID
 * Uses anonymous authentication for simplicity
 */
export async function authenticateWithFirebase(): Promise<User | null> {
  try {
    // Check if already authenticated
    if (auth.currentUser) {
      return auth.currentUser;
    }

    // Sign in anonymously
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error("Firebase authentication error:", error);
    return null;
  }
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return auth.currentUser !== null;
}
