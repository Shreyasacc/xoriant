import logo from 'figma:asset/f11b2ccbc5edb6bf832b728e2ab91c617da855fb.png';

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

/**
 * Logo Component - Displays the Xoriant logo
 * Responsive: Shows icon only when collapsed, full logo otherwise
 */
export function Logo({ collapsed = false, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logo} 
        alt="Xoriant Logo" 
        className={`h-8 object-contain transition-all duration-300 ${
          collapsed ? 'w-10' : 'w-auto'
        }`}
      />
    </div>
  );
}
