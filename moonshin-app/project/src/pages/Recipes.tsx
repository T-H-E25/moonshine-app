import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, Search, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RecipeCard } from '../components/recipes/RecipeCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { getRecipes, Recipe } from '../services/supabase';

export interface RecipeCategory {
  id: string;
  name: string;
}

export const RECIPE_CATEGORIES: RecipeCategory[] = [];

const RecipesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const { data, error } = await getRecipes();
        if (error) throw new Error(error.message);
        if (data) {
          setRecipes(data);
          setFilteredRecipes(data);
        }
      } catch (err) {
        setError('Failed to load recipes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();

    // Check for query params
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location.search]);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let result = [...recipes];
    
    // Apply search
    if (searchTerm) {
      result = result.filter(
        recipe => 
          recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(recipe => recipe.category === selectedCategory);
    }
    
    // Apply difficulty filter
    if (selectedDifficulty) {
      result = result.filter(recipe => recipe.difficulty === selectedDifficulty);
    }
    
    setFilteredRecipes(result);
  }, [recipes, searchTerm, selectedCategory, selectedDifficulty]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search param
    const params = new URLSearchParams(location.search);
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
    
    // Update URL with category param
    const params = new URLSearchParams(location.search);
    if (categoryId === selectedCategory) {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    navigate(`${location.pathname}?${params.toString()}`);
  };
  
  const handleDifficultyFilter = (difficulty: string) => {
    setSelectedDifficulty(difficulty === selectedDifficulty ? '' : difficulty);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedDifficulty('');
    navigate('/recipes');
  };

  const difficulties = ['Easy', 'Medium', 'Hard'];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold mb-4">Explore Recipes</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Browse through our collection of authentic moonshine recipes from around the world
        </p>
      </div>

      {/* Search and Filter UI */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <form onSubmit={handleSearch} className="w-full md:w-auto">
            <div className="flex">
              <Input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                leftIcon={<Search size={18} />}
                className="rounded-r-none md:w-80"
              />
              <Button type="submit" className="rounded-l-none">
                Search
              </Button>
            </div>
          </form>
          
          <div className="flex gap-4 w-full md:w-auto">
            <Button
              variant={showFilters ? 'primary' : 'outline'}
              leftIcon={<Filter size={18} />}
              onClick={() => setShowFilters(!showFilters)}
              className="w-full md:w-auto"
            >
              Filters
            </Button>
            
            {(searchTerm || selectedCategory || selectedDifficulty) && (
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                className="w-full md:w-auto"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
        
        {/* Expandable Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Card className="p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-medium mb-3">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {RECIPE_CATEGORIES.map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => handleCategoryFilter(category.id)}
                        >
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Difficulty</h3>
                    <div className="flex flex-wrap gap-2">
                      {difficulties.map((difficulty) => (
                        <Button
                          key={difficulty}
                          variant={selectedDifficulty === difficulty ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => handleDifficultyFilter(difficulty)}
                        >
                          {difficulty}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recipe Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader size={40} className="animate-spin text-primary-500" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-error-500 mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium mb-4">No recipes found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try adjusting your filters or search criteria
          </p>
          <Button
            variant="outline"
            onClick={handleClearFilters}
          >
            Clear All Filters
          </Button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RecipesPage;