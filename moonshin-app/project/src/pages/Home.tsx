import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, FlaskRound as Flask, Star, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export interface RecipeCategory {
  id: string;
  name: string;
  icon: string;
}

export const RECIPE_CATEGORIES: RecipeCategory[] = [];

const HomePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-800/90 to-primary-700/80 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center" />
        
        <div className="relative z-20 container mx-auto px-4 py-24 md:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl text-center mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Discover <span className="text-primary-300">Moonshine</span> Recipes Worth Sharing
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Find and share authentic moonshine recipes from around the world, crafted by enthusiasts just like you.
            </p>
            
            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
              <div className="flex">
                <Input
                  type="text"
                  placeholder="Search for recipes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                  leftIcon={<Search size={18} />}
                  className="rounded-r-none"
                />
                <Button type="submit" className="rounded-l-none">
                  Search
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Explore Categories
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Browse through our collection of moonshine recipes organized by category
            </p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            {RECIPE_CATEGORIES.map((category) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  interactive
                  onClick={() => navigate(`/recipes?category=${category.id}`)}
                  className="text-center p-6 h-full"
                  glassmorphism
                >
                  <div className="flex flex-col items-center">
                    {/* Use dynamic icon based on category */}
                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-500 mb-4">
                      {category.icon === 'flask' && <Flask size={24} />}
                      {category.icon === 'apple' && <div className="text-2xl">🍎</div>}
                      {category.icon === 'leaf' && <div className="text-2xl">🌿</div>}
                      {category.icon === 'flame' && <div className="text-2xl">🔥</div>}
                      {category.icon === 'star' && <Star size={24} />}
                    </div>
                    <h3 className="font-medium">{category.name}</h3>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="text-center mt-10">
            <Button 
              variant="outline" 
              rightIcon={<ChevronRight size={18} />}
              onClick={() => navigate('/recipes')}
            >
              View All Recipes
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Shinny
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The ultimate platform for moonshine enthusiasts to discover, share, and perfect their craft
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-500 mb-4">
                    <Star size={28} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Curated Recipes</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Discover traditional and innovative moonshine recipes, carefully curated and tested by our community.
                  </p>
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-500 mb-4">
                    <Clock size={28} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Step-by-Step Instructions</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Easy-to-follow instructions with detailed preparation times, making the process accessible to everyone.
                  </p>
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="h-full p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-500 mb-4">
                    <Users size={28} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Join a passionate community of enthusiasts who share tips, variations, and improvements on classic recipes.
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-display font-bold mb-6">Ready to Share Your Recipe?</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
              Join our community of moonshine enthusiasts and contribute your unique recipes to our growing collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
                onClick={() => navigate('/about')}
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;