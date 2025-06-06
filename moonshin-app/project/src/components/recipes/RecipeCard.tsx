import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Star, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Recipe } from '../../services/supabase';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const navigate = useNavigate();
  
  const defaultImage = 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=600';
  
  // Format the date

  // Show appropriate difficulty badge
  const difficultyColor = {
    Easy: 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300',
    Medium: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300',
    Hard: 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-300',
  }[recipe.difficulty];

  // Format prep time to show in hours and minutes if needed
  const formatPrepTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        interactive
        className="h-full overflow-hidden"
        onClick={() => navigate(`/recipes/${recipe.id}`)}
      >
        <div className="relative aspect-video overflow-hidden">
          <img
            src={recipe.image_url || defaultImage}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <span className={`text-xs px-2 py-1 rounded-full ${difficultyColor}`}>
              {recipe.difficulty}
            </span>
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="text-xl font-semibold mb-2 line-clamp-1">{recipe.title}</h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-2">
            {recipe.description}
          </p>
          
          <div className="flex flex-wrap justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center mr-4 mb-2">
              <User size={14} className="mr-1" />
              <span>{recipe.user_name || 'Anonymous'}</span>
            </div>
            
            <div className="flex items-center mr-4 mb-2">
              <Clock size={14} className="mr-1" />
              <span>{formatPrepTime(recipe.prep_time)}</span>
            </div>
            
            {recipe.rating && (
              <div className="flex items-center mb-2">
                <Star size={14} className="mr-1 text-primary-500" />
                <span>{recipe.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};