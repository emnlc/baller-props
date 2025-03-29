import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "@/supabaseClient";
import {
  Session,
  User,
  AuthError,
  AuthResponse,
  OAuthResponse,
} from "@supabase/supabase-js";

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  userSignUp: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; data?: User | null; error?: string }>;
  userSignIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; data?: Session | null; error?: string }>;

  userSignOut: () => Promise<void>;

  userGoogleSignIn: () => Promise<{
    success: boolean;
    data?: Session | null;
    error?: string;
  }>;
  userDiscordSignIn: () => Promise<{
    success: boolean;
    data?: Session | null;
    error?: string;
  }>;

  updateDisplayName: (displayName: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (mounted) {
        setSession(session);
        setIsLoading(false);
      }
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Sign up
  const userSignUp = async (email: string, password: string) => {
    const { data, error }: AuthResponse = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("There was a problem signing up: ", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data: data.user };
  };

  // Sign in
  const userSignIn = async (email: string, password: string) => {
    const { data, error }: AuthResponse =
      await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("Sign-in error occurred: ", error.message);
      return { success: false, error: error.message };
    }

    console.log("Sign-in success: ", data);
    return { success: true, data: data.session };
  };

  // Sign out
  const userSignOut = async () => {
    const { error }: { error: AuthError | null } =
      await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out: ", error.message);
    } else {
      setSession(null);
    }
  };

  // Google sign in
  const userGoogleSignIn = async () => {
    const { error }: OAuthResponse = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/nba`,
      },
    });

    if (error) {
      console.error("Google sign-in error occurred:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  // Discord sign in
  const userDiscordSignIn = async () => {
    const { error }: OAuthResponse = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/login`,
      },
    });

    if (error) {
      console.error("Google sign-in error occurred:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  // update user display name
  const updateDisplayName = async (displayName: string) => {
    const { error } = await supabase.auth.updateUser({
      data: { full_name: displayName },
    });

    if (error) {
      console.error("Error updating user display name: ", error.message);
      return { success: false, error: error.message };
    }

    const { error: sessionError } = await supabase.auth.getUser();
    if (sessionError) {
      console.error("Error refreshing user session:", sessionError.message);
    }

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        userSignUp,
        userSignOut,
        userSignIn,
        userGoogleSignIn,
        userDiscordSignIn,
        updateDisplayName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("UserAuth must be used within an AuthContextProvider");
  }
  return context;
};
