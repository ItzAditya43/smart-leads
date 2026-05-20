import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };

export const Loader: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => (
  <div
    className={`${sizeMap[size]} border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin ${className}`}
  />
);

export const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <Loader size="lg" />
  </div>
);
