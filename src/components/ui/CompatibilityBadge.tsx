
import { cn } from '@/lib/utils';

interface CompatibilityBadgeProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CompatibilityBadge = ({ 
  percentage, 
  size = 'md', 
  className 
}: CompatibilityBadgeProps) => {
  // Get color based on compatibility percentage
  const getColor = () => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-homi-purple';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Size classes
  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-20 h-20 text-base',
  };

  return (
    <div className={cn(
      'rounded-full flex items-center justify-center text-white font-bold relative shadow-lg',
      sizeClasses[size],
      getColor(),
      className
    )}>
      <div className="absolute inset-0.5 rounded-full bg-white/10"></div>
      <span className="relative z-10">{percentage}%</span>
    </div>
  );
};

export default CompatibilityBadge;
