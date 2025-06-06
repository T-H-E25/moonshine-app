import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
  glassmorphism?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  interactive = false,
  glassmorphism = false,
}) => {
  const baseClasses = 'rounded-lg shadow-md overflow-hidden';
  const interactiveClasses = interactive ? 'cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-lg' : '';
  const glassmorphismClasses = glassmorphism ? 
    'bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/20 dark:border-gray-800/30' : 
    'bg-white dark:bg-gray-800';
  
  const classes = `${baseClasses} ${interactiveClasses} ${glassmorphismClasses} ${className}`;

  if (interactive) {
    return (
      <motion.div
        className={classes}
        onClick={onClick}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={classes}>{children}</div>;
};

export const CardHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = '',
  children,
}) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

export const CardTitle: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = '',
  children,
}) => {
  return <h3 className={`text-xl font-semibold mb-1 text-gray-900 dark:text-white ${className}`}>{children}</h3>;
};

export const CardDescription: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = '',
  children,
}) => {
  return <p className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>{children}</p>;
};

export const CardContent: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = '',
  children,
}) => {
  return <div className={`p-4 pt-0 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = '',
  children,
}) => {
  return <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>{children}</div>;
};