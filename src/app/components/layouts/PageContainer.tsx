import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  maxWidth?: 'full' | '7xl' | '6xl' | '5xl' | '4xl';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * PageContainer Component - Inner content container for pages
 * Responsive: Adjusts padding and max-width based on screen size
 */
export function PageContainer({ 
  children, 
  maxWidth = '7xl',
  padding = 'md',
  className = '' 
}: PageContainerProps) {
  const maxWidthClasses = {
    '7xl': 'max-w-7xl',
    '6xl': 'max-w-6xl',
    '5xl': 'max-w-5xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4 py-2',
    md: 'px-4 sm:px-6 lg:px-8 py-3',
    lg: 'px-4 sm:px-6 lg:px-8 py-6',
  };

  return (
    <div className={`${maxWidthClasses[maxWidth]} mx-auto w-full ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}