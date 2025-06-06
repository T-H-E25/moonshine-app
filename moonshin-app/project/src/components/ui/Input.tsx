import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, fullWidth = false, leftIcon, rightIcon, className = '', ...props }: InputProps,
    ref
  ) => {
    const baseInputClasses = 'rounded-md border border-gray-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:bg-gray-700 dark:border-gray-600 dark:focus:border-primary-500 dark:text-white transition-colors duration-200';
    const widthClasses = fullWidth ? 'w-full' : '';
    const iconClasses = (leftIcon || rightIcon) ? (leftIcon ? 'pl-10' : 'pr-10') : 'px-4';
    const errorClasses = error ? 'border-error-500 focus:border-error-500 focus:ring-error-200' : '';
    
    const inputClasses = `h-10 py-2 ${iconClasses} ${baseInputClasses} ${widthClasses} ${errorClasses} ${className}`;

    return (
      <div className={`${fullWidth ? 'w-full' : ''} relative`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={inputClasses}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-error-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';