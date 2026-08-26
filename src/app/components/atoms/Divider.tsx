interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

/**
 * Divider Component - Visual separator
 * Responsive: Adjusts based on orientation
 */
export function Divider({ orientation = 'horizontal', className = '' }: DividerProps) {
  return (
    <div
      className={`
        ${orientation === 'horizontal' ? 'w-full h-px' : 'w-px h-full'}
        bg-gray-200
        ${className}
      `}
    />
  );
}
