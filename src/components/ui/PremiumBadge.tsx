import React from 'react';
import { Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PremiumBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'secondary';
  className?: string;
}

const PremiumBadge: React.FC<PremiumBadgeProps> = ({ 
  size = 'sm', 
  variant = 'default',
  className 
}) => {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4'
  };

  return (
    <Badge 
      variant={variant}
      className={cn(
        'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold border-0 gap-1',
        sizeClasses[size],
        className
      )}
    >
      <Crown className={iconSizes[size]} />
      PRO
    </Badge>
  );
};

export default PremiumBadge;