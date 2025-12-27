import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  actions?: ReactNode;
  hover?: boolean;
  gradient?: boolean;
}

export default function Card({ 
  children, 
  className = '', 
  title, 
  actions,
  hover = false,
  gradient = false 
}: CardProps) {
  const baseStyles = 'bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-300';
  const hoverStyles = hover ? 'hover:shadow-xl hover:-translate-y-1 hover:border-blue-200' : '';
  const gradientStyles = gradient ? 'bg-gradient-to-br from-white to-blue-50/30' : '';
  
  return (
    <div className={`${baseStyles} ${hoverStyles} ${gradientStyles} ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-transparent to-blue-50/20">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={title ? 'p-6' : 'p-0'}>
        {children}
      </div>
    </div>
  );
}
