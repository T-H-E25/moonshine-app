import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, User } from '../services/supabase';
import toast from 'react-hot-toast';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, username?: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
            
          setUser({
            id: data.session.user.id,
            username: profileData?.username || data.session.user.email?.split('@')[0] || 'User',
            avatar_url: profileData?.avatar_url || data.session.user.user_metadata?.avatar_url,
            bio: profileData?.bio,
          });
        }
      } catch (error) {
        console.error('Error getting current user:', error);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Check if profile exists, create if it doesn't
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!existingProfile) {
            // Create profile for new user
            const username = session.user.user_metadata?.full_name?.replace(/\s+/g, '') ||
                            session.user.user_metadata?.name?.replace(/\s+/g, '') ||
                            session.user.email?.split('@')[0] ||
                            'User';

            await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                username: username,
                avatar_url: session.user.user_metadata?.avatar_url,
                bio: null
              });
          }

          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          setUser({
            id: session.user.id,
            username: profileData?.username || session.user.email?.split('@')[0] || 'User',
            avatar_url: profileData?.avatar_url || session.user.user_metadata?.avatar_url,
            bio: profileData?.bio,
          });

          if (event === 'SIGNED_IN') {
            toast.success('Welcome back!');
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { error };
    }
  };

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0],
          }
        }
      });
      
      if (error) {
        toast.error(error.message);
        return { error };
      }
      
      toast.success('Check your email to confirm your account!');
      return { error: null };
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });
      
      if (error) {
        toast.error(error.message);
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      toast.error('Failed to sign in with Google');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        return { error };
      }
      
      toast.success('Signed out successfully');
      return { error: null };
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { error };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};