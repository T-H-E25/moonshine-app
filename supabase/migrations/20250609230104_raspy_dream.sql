/*
  # Create profiles table

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique, required)
      - `avatar_url` (text, optional)
      - `bio` (text, optional)
      - `created_at` (timestamp with timezone, default now)

  2. Security
    - Enable RLS on `profiles` table
    - Add policies for reading profiles (public)
    - Add policies for users to update their own profiles

  3. Functions
    - Create function to automatically create profile when user signs up
    - Create trigger to call this function on new user creation
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  avatar_url text,
  bio text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
  ON profiles 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create function to automatically create profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();