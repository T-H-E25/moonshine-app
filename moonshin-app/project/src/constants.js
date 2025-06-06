// Supabase configuration
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// App constants
export const APP_NAME = "Shinny";
export const APP_DESCRIPTION = "Discover and share moonshine recipes";

// Recipe categories
export const RECIPE_CATEGORIES = [
  { id: "traditional", name: "Traditional", icon: "flask" },
  { id: "fruit", name: "Fruit Infused", icon: "apple" },
  { id: "herbal", name: "Herbal", icon: "leaf" },
  { id: "spiced", name: "Spiced", icon: "flame" },
  { id: "exotic", name: "Exotic Blends", icon: "star" },
];

// API endpoints
export const API_ROUTES = {
  RECIPES: "/recipes",
  USERS: "/users",
  FAVORITES: "/favorites",
  COMMENTS: "/comments",
};