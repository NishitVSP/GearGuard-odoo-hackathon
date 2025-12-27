import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

export default function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  pulse = false,
  className = ''
}: BadgeProps) {
  const variants = {
    default: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-200',
    primary: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200',
    success: 'bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 border border-green-200',
    warning: 'bg-gradient-to-r from-yellow-100 to-amber-200 text-yellow-800 border border-yellow-200',
    danger: 'bg-gradient-to-r from-red-100 to-rose-200 text-red-800 border border-red-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full shadow-sm transition-all duration-200 hover:shadow-md ${variants[variant]} ${sizes[size]} ${pulse ? 'animate-pulse' : ''} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
      {children}
    </span>
  );
}
