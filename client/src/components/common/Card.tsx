import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  actions?: ReactNode;
}

export default function Card({ children, className = '', title, actions }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className={title ? 'p-6' : 'p-0'}>
        {children}
      </div>
    </div>
  );
}
