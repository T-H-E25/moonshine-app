import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  className?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, error, fullWidth = false, className = '', ...props }: TextareaProps,
    ref
  ) => {
    const baseClasses = 'rounded-md border border-gray-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:bg-gray-700 dark:border-gray-600 dark:focus:border-primary-500 dark:text-white transition-colors duration-200 resize-vertical';
    const widthClasses = fullWidth ? 'w-full' : '';
    const errorClasses = error ? 'border-error-500 focus:border-error-500 focus:ring-error-200' : '';
    
    const textareaClasses = `min-h-24 p-3 ${baseClasses} ${widthClasses} ${errorClasses} ${className}`;

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          className={textareaClasses}
          {...props}
        />
        
        {error && (
          <p className="mt-1 text-sm text-error-500">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';