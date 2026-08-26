import awsLogo from 'figma:asset/499b6cf39d2cc683a05fdb69b4d2b206920ac09a.png';
import azureLogo from 'figma:asset/84f6fef5f441eef1665a48cc39fa13061e5cdb07.png';
import gcpLogo from 'figma:asset/13add375e3a2db3f7db7cbae5b934507fb50dc5a.png';

interface ProviderLogoProps {
  provider: 'AWS' | 'AZURE' | 'GCP' | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * ProviderLogo Component - Cloud provider logos
 * Responsive: Adapts size based on context
 */
export function ProviderLogo({ provider, size = 'md', className = '' }: ProviderLogoProps) {
  const logos = {
    AWS: awsLogo,
    AZURE: azureLogo,
    GCP: gcpLogo
  };

  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const logo = logos[provider as keyof typeof logos] || awsLogo;

  return (
    <img 
      src={logo} 
      alt={`${provider} Logo`} 
      className={`${sizeClasses[size]} object-contain ${className}`}
    />
  );
}
