// You can set these from environment variables or import from a constants file
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Recipe = {
  id: string;
  created_at: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category: string;
  image_url?: string;
  prep_time: number;
  user_id: string;
  user_name?: string;
  rating?: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
};

export type User = {
  id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
};

// Auth functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};

// Recipe functions
export const getRecipes = async () => {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const getRecipeById = async (id: string) => {
  const { data, error } = await supabase
    .from('recipes')
    .select('*, profiles(username, avatar_url)')
    .eq('id', id)
    .single();
  
  return { data, error };
};

export const createRecipe = async (recipe: Omit<Recipe, 'id' | 'created_at' | 'user_name'>) => {
  const { data, error } = await supabase
    .from('recipes')
    .insert([recipe])
    .select();
  
  return { data, error };
};

export const updateRecipe = async (id: string, recipe: Partial<Recipe>) => {
  const { data, error } = await supabase
    .from('recipes')
    .update(recipe)
    .eq('id', id)
    .select();
  
  return { data, error };
};

export const deleteRecipe = async (id: string) => {
  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id);
  
  return { error };
};

// User profile functions
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
};

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select();
  
  return { data, error };
};

// Favorite functions
export const getFavorites = async (userId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .select('recipe_id')
    .eq('user_id', userId);
  
  return { data, error };
};

export const toggleFavorite = async (userId: string, recipeId: string, isFavorite: boolean) => {
  if (isFavorite) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('recipe_id', recipeId);
    
    return { error };
  } else {
    const { error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, recipe_id: recipeId }]);
    
    return { error };
  }
};