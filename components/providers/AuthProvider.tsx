"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { api, ApiError } from "@/lib/api";
import { firebaseAuth } from "@/lib/firebase/client";
import type { AppUser } from "@/lib/types";

type AuthContextValue = {
  firebaseUser: User | null;
  user: AppUser | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<AppUser>;
  register: (name: string, email: string, password: string) => Promise<AppUser>;
  signInWithGoogle: () => Promise<AppUser>;
  registerAdmin: (name: string, email: string, password: string, signupCode: string) => Promise<AppUser>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<AppUser | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function messageFor(error: unknown) {
  return error instanceof Error ? error.message : "Authentication failed";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    const current = firebaseAuth().currentUser;
    if (!current) {
      setUser(null);
      return null;
    }
    const profile = await api.get<AppUser>("/api/auth/me");
    if (firebaseAuth().currentUser?.uid === current.uid) setUser(profile);
    return profile;
  }, []);

  useEffect(() => {
    return onIdTokenChanged(firebaseAuth(), async (nextUser) => {
      setFirebaseUser(nextUser);
      setError(null);
      if (!nextUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        await refreshProfile();
      } catch (nextError) {
        if (firebaseAuth().currentUser?.uid === nextUser.uid) {
          setUser((previous) => previous?.uid === nextUser.uid ? previous : null);
          setError(messageFor(nextError));
        }
      } finally {
        setLoading(false);
      }
    });
  }, [refreshProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    const credential = await signInWithEmailAndPassword(firebaseAuth(), email, password);
    let profile: AppUser | null;
    try { profile = await refreshProfile(); }
    catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) throw error;
      profile = await api.post<AppUser>("/api/auth/register", { name: credential.user.displayName || credential.user.email?.split("@")[0] || "Customer" });
      setUser(profile);
    }
    if (!profile) throw new Error("User profile not found");
    return profile;
  }, [refreshProfile]);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    const credential = await signInWithPopup(firebaseAuth(), new GoogleAuthProvider());
    const profile = await api.post<AppUser>("/api/auth/register", { name: credential.user.displayName || credential.user.email?.split("@")[0] || "Customer" });
    setUser(profile);
    return profile;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setError(null);
    await createUserWithEmailAndPassword(firebaseAuth(), email, password);
    const profile = await api.post<AppUser>("/api/auth/register", { name });
    setUser(profile);
    return profile;
  }, []);

  const registerAdmin = useCallback(async (name: string, email: string, password: string, signupCode: string) => {
    setError(null);
    const credential = await createUserWithEmailAndPassword(firebaseAuth(), email, password);
    try {
      const profile = await api.post<AppUser>("/api/auth/register", { name, signupCode });
      if (profile.role !== "admin") throw new Error("Admin account could not be created");
      setUser(profile);
      return profile;
    } catch (registrationError) {
      try {
        await deleteUser(credential.user);
      } catch {
        // Preserve the registration error if Firebase cleanup also fails.
      }
      throw registrationError;
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(firebaseAuth());
    setUser(null);
  }, []);

  const value = useMemo(() => ({ firebaseUser, user, loading, error, signIn, signInWithGoogle, register, registerAdmin, logout, refreshProfile }), [firebaseUser, user, loading, error, signIn, signInWithGoogle, register, registerAdmin, logout, refreshProfile]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
