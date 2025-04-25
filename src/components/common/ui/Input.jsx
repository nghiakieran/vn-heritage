import React from 'react';

const inputVariants = {
    variant: {
        default: 'border-input bg-background text-foreground focus:ring-2 focus:ring-heritage focus:border-heritage',
        outline: 'border-input bg-transparent focus:ring-2 focus:ring-accent focus:border-accent',
        ghost: 'border-none bg-transparent focus:ring-0 hover:bg-accent/10',
        destructive: 'border-destructive bg-background text-foreground focus:ring-2 focus:ring-destructive focus:border-destructive',
    },
    size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 py-2 text-sm',
        lg: 'h-11 px-6 py-3 text-base',
        icon: 'h-10 w-10 p-2',
    },
};

const Input = ({ className, variant = 'default', size = 'default', ...props }) => {
    const variantClasses = inputVariants.variant[variant] || inputVariants.variant.default;
    const sizeClasses = inputVariants.size[size] || inputVariants.size.default;

    return (
        <input
            className={`${variantClasses} ${sizeClasses} w-full rounded-md text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            {...props}
        />
    );
};

Input.displayName = 'Input';

export { Input };