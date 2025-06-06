/*
  # Initial Schema for Moonshine App

  1. New Tables
    - `profiles` - User profiles with username, avatar, and bio
    - `recipes` - Moonshine recipes with title, description, ingredients, etc.
    - `favorites` - User favorite recipes
    - `comments` - User comments on recipes

  2. Security
    - Enable RLS on all tables
    - Create policies for authenticated users
*/

-- Create profiles table to store user profile information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  ingredients TEXT[] NOT NULL,
  instructions TEXT[] NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  prep_time INTEGER NOT NULL, -- in minutes
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  rating DECIMAL(3,1),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create favorites table to store user favorite recipes
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  recipe_id UUID REFERENCES recipes(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, recipe_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id) NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
-- Anyone can read profiles
CREATE POLICY "Profiles are viewable by everyone" 
  ON profiles 
  FOR SELECT 
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
  ON profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create RLS policies for recipes
-- Anyone can read recipes
CREATE POLICY "Recipes are viewable by everyone" 
  ON recipes 
  FOR SELECT 
  USING (true);

-- Authenticated users can create recipes
CREATE POLICY "Authenticated users can create recipes" 
  ON recipes 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own recipes
CREATE POLICY "Users can update their own recipes" 
  ON recipes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own recipes
CREATE POLICY "Users can delete their own recipes" 
  ON recipes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for favorites
-- Users can see their own favorites
CREATE POLICY "Users can view their own favorites" 
  ON favorites 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can add favorites
CREATE POLICY "Users can add favorites" 
  ON favorites 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Users can remove their own favorites
CREATE POLICY "Users can remove their own favorites" 
  ON favorites 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for comments
-- Anyone can view comments
CREATE POLICY "Comments are viewable by everyone" 
  ON comments 
  FOR SELECT 
  USING (true);

-- Authenticated users can add comments
CREATE POLICY "Authenticated users can add comments" 
  ON comments 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update their own comments" 
  ON comments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete their own comments" 
  ON comments 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create a function to create a profile for a new user
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create a profile when a new user is created
CREATE OR REPLACE TRIGGER create_profile_after_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_profile_for_user();