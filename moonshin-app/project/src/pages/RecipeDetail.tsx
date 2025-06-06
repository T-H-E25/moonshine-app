import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

interface Recipe {
  id: string;
  user_id: string;
  name: string;
  ingredients: string;
  distillation_method: string;
  spirit_type: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!id) {
          throw new Error('Recipe ID is required');
        }
        
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (!data) {
          throw new Error('Recipe not found');
        }
        
        setRecipe(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load recipe');
        toast.error('Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipe();
  }, [id]);
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Recipe deleted successfully');
      navigate('/recipes');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete recipe');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = () => {
    // Navigate to edit page (to be implemented)
    toast('Edit functionality coming soon');
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse flex flex-col space-y-4 max-w-3xl mx-auto">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !recipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            {error || 'Recipe not found'}
          </h2>
          <button
            onClick={() => navigate('/recipes')}
            className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Recipes
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => navigate('/recipes')}
            className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Recipes
          </button>
          
          {user && user.id === recipe.user_id && (
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                aria-label="Edit recipe"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                aria-label="Delete recipe"
                disabled={loading}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">{recipe.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              {recipe.spirit_type && (
                <span className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-2 py-1 rounded-full text-xs mr-2">
                  {recipe.spirit_type}
                </span>
              )}
              {recipe.distillation_method && (
                <span className="bg-secondary-100 dark:bg-secondary-900 text-secondary-800 dark:text-secondary-200 px-2 py-1 rounded-full text-xs">
                  {recipe.distillation_method}
                </span>
              )}
            </p>
            
            <div className="space-y-6">
              {recipe.ingredients && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <pre className="whitespace-pre-wrap">{recipe.ingredients}</pre>
                  </div>
                </div>
              )}
              
              {recipe.notes && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Notes</h2>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <pre className="whitespace-pre-wrap">{recipe.notes}</pre>
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {new Date(recipe.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;