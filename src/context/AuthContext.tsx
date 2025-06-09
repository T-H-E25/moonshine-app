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
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Try to fetch profile, but don't fail if it doesn't exist
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profileError && profileError.code !== 'PGRST116') {
              // PGRST116 is "not found" error, which is acceptable
              console.warn('Profile fetch error:', profileError);
            }
              
            setUser({
              id: session.user.id,
              username: profileData?.username || session.user.email?.split('@')[0] || 'User',
              avatar_url: profileData?.avatar_url || session.user.user_metadata?.avatar_url,
              bio: profileData?.bio,
            });
          } catch (profileError) {
            console.warn('Profile fetch failed, using basic user data:', profileError);
            // Still set user with basic info if profile fetch fails
            setUser({
              id: session.user.id,
              username: session.user.email?.split('@')[0] || 'User',
              avatar_url: session.user.user_metadata?.avatar_url,
              bio: undefined,
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error getting current user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            // Try to get existing profile first
            const { data: existingProfile, error: fetchError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (fetchError && fetchError.code === 'PGRST116') {
              // Profile doesn't exist, create it
              const username = session.user.user_metadata?.full_name?.replace(/\s+/g, '') ||
                              session.user.user_metadata?.name?.replace(/\s+/g, '') ||
                              session.user.email?.split('@')[0] ||
                              'User';

              const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                  id: session.user.id,
                  username: username,
                  avatar_url: session.user.user_metadata?.avatar_url,
                  bio: null
                });

              if (insertError) {
                console.warn('Failed to create profile:', insertError);
              }

              // Set user data regardless of profile creation success
              setUser({
                id: session.user.id,
                username: username,
                avatar_url: session.user.user_metadata?.avatar_url,
                bio: null,
              });
            } else if (!fetchError && existingProfile) {
              // Profile exists, use it
              setUser({
                id: session.user.id,
                username: existingProfile.username,
                avatar_url: existingProfile.avatar_url || session.user.user_metadata?.avatar_url,
                bio: existingProfile.bio,
              });
            } else {
              // Other error, use basic user data
              console.warn('Profile fetch error:', fetchError);
              setUser({
                id: session.user.id,
                username: session.user.email?.split('@')[0] || 'User',
                avatar_url: session.user.user_metadata?.avatar_url,
                bio: null,
              });
            }

            if (event === 'SIGNED_IN') {
              toast.success('Welcome back!');
            }
          } catch (error) {
            console.error('Error handling auth state change:', error);
            // Still set basic user data on error
            setUser({
              id: session.user.id,
              username: session.user.email?.split('@')[0] || 'User',
              avatar_url: session.user.user_metadata?.avatar_url,
              bio: null,
            });
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
        // Check for specific email confirmation error
        if (error.message === 'Email not confirmed') {
          toast.error('Please check your email to confirm your account before logging in.');
        } else {
          toast.error(error.message);
        }
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
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
      console.error('Sign up error:', error);
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
      console.error('Google sign in error:', error);
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
      console.error('Sign out error:', error);
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