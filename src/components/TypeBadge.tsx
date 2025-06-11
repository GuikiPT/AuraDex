'use client';

import { TYPE_COLORS } from '@/constants/pokemon';
import { formatPokemonName } from '@/utils/pokemon-api';
import TypeIcon from './TypeIcon';

interface TypeBadgeProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'default' | 'outline' | 'glass';
  showIcon?: boolean;
}

const TypeBadge = ({ type, size = 'md', className = '', variant = 'default', showIcon = true }: TypeBadgeProps) => {
  const color = TYPE_COLORS[type] || '#6B7280';
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  const variantClasses = {
    default: 'text-white font-semibold shadow-lg',
    outline: 'border-2 font-medium bg-transparent',
    glass: 'backdrop-blur-sm border font-medium shadow-lg',
  };

  const getStyles = () => {
    switch (variant) {
      case 'outline':
        return {
          borderColor: color,
          color: color,
        };
      case 'glass':
        return {
          backgroundColor: `${color}20`,
          borderColor: `${color}40`,
          color: color,
        };
      default:
        return {
          backgroundColor: color,
          boxShadow: `0 4px 12px ${color}40`,
        };
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-xl transition-all duration-200 hover:scale-105 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      style={getStyles()}
    >
      {showIcon && <TypeIcon type={type} size={iconSizes[size]} />}
      {formatPokemonName(type)}
    </span>
  );
};

export default TypeBadge;
