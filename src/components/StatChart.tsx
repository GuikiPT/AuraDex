'use client';

import { PokemonStat } from '@/types/pokemon';
import { STAT_NAMES } from '@/constants/pokemon';
import { Heart, Sword, Shield, Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface StatChartProps {
  stats: PokemonStat[];
  variant?: 'horizontal' | 'radial';
}

const StatChart = ({ stats, variant = 'horizontal' }: StatChartProps) => {
  // Get stat icon based on stat name
  const getStatIcon = (statName: string) => {
    const iconProps = { size: 16, className: "text-current" };
    switch (statName) {
      case 'hp': return <Heart {...iconProps} />;
      case 'attack': return <Sword {...iconProps} />;
      case 'defense': return <Shield {...iconProps} />;
      case 'special-attack': return <Sparkles {...iconProps} />;
      case 'special-defense': return <ShieldCheck {...iconProps} />;
      case 'speed': return <Zap {...iconProps} />;
      default: return <Heart {...iconProps} />;
    }
  };

  // Enhanced color scheme based on competitive viability
  const getStatColors = (value: number) => {
    if (value >= 130) return {
      bar: 'from-emerald-500 to-green-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-700',
      text: 'text-emerald-700 dark:text-emerald-300',
      label: 'Excellent'
    };
    if (value >= 100) return {
      bar: 'from-green-500 to-emerald-500',
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-700',
      text: 'text-green-700 dark:text-green-300',
      label: 'Very Good'
    };
    if (value >= 80) return {
      bar: 'from-yellow-500 to-amber-500',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-700',
      text: 'text-yellow-700 dark:text-yellow-300',
      label: 'Good'
    };
    if (value >= 60) return {
      bar: 'from-orange-500 to-yellow-500',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-700',
      text: 'text-orange-700 dark:text-orange-300',
      label: 'Average'
    };
    if (value >= 40) return {
      bar: 'from-red-500 to-orange-500',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-700',
      text: 'text-red-700 dark:text-red-300',
      label: 'Below Average'
    };
    return {
      bar: 'from-red-600 to-red-700',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-700',
      text: 'text-red-700 dark:text-red-300',
      label: 'Poor'
    };
  };

  const totalStats = stats.reduce((total, stat) => total + stat.base_stat, 0);

  if (variant === 'horizontal') {
    return (
      <div className="space-y-5">
        {stats.map((stat, index) => {
          const maxStat = 255;
          const percentage = (stat.base_stat / maxStat) * 100;
          const statName = STAT_NAMES[stat.stat.name] || stat.stat.name;
          const colors = getStatColors(stat.base_stat);
          
          return (
            <div 
              key={index} 
              className={`${colors.bg} ${colors.border} border rounded-lg p-4 transition-all duration-300 hover:shadow-md group`}
            >
              <div className="flex justify-between items-center mb-3">
                <div className={`flex items-center gap-3 ${colors.text}`}>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/50 dark:bg-gray-800/50">
                    {getStatIcon(stat.stat.name)}
                  </div>
                  <div>
                    <span className="font-semibold text-base">{statName}</span>
                    <div className="text-xs opacity-75">{colors.label}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.base_stat}
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    / {maxStat}
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
                  <div
                    className={`h-full bg-gradient-to-r ${colors.bar} transition-all duration-700 ease-out rounded-full relative group-hover:shadow-lg`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 -mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Enhanced Total Stats Display */}
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl shadow-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white">
                <Sparkles size={20} />
              </div>
              <div>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Base Stat Total</span>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {totalStats >= 600 ? 'Legendary Tier' : 
                   totalStats >= 540 ? 'Pseudo-Legendary' :
                   totalStats >= 480 ? 'Strong' :
                   totalStats >= 420 ? 'Average' : 'Below Average'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {totalStats}
              </span>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                / 1530
              </div>
            </div>
          </div>
          
          {/* Total Stats Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000 ease-out rounded-full shadow-lg"
                style={{ width: `${Math.min((totalStats / 1530) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0</span>
              <span>{((totalStats / 1530) * 100).toFixed(1)}%</span>
              <span>1530</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Radial variant implementation
  if (variant === 'radial') {
    const centerX = 120;
    const centerY = 120;
    const radius = 80;
    const angleStep = (2 * Math.PI) / stats.length;

    return (
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <svg width="240" height="240" className="transform -rotate-90">
            {/* Background circles */}
            {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, index) => (
              <circle
                key={index}
                cx={centerX}
                cy={centerY}
                r={radius * scale}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-gray-200 dark:text-gray-700"
                strokeDasharray="2,2"
              />
            ))}
            
            {/* Stat polygons */}
            <polygon
              points={stats.map((stat, index) => {
                const angle = index * angleStep;
                const value = (stat.base_stat / 255) * radius;
                const x = centerX + Math.cos(angle) * value;
                const y = centerY + Math.sin(angle) * value;
                return `${x},${y}`;
              }).join(' ')}
              fill="rgba(59, 130, 246, 0.3)"
              stroke="rgb(59, 130, 246)"
              strokeWidth="2"
              className="transition-all duration-500"
            />
            
            {/* Stat points */}
            {stats.map((stat, index) => {
              const angle = index * angleStep;
              const value = (stat.base_stat / 255) * radius;
              const x = centerX + Math.cos(angle) * value;
              const y = centerY + Math.sin(angle) * value;
              const colors = getStatColors(stat.base_stat);
              
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  className={`fill-current ${colors.text}`}
                />
              );
            })}
          </svg>
          
          {/* Center total */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-white dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center border-2 border-blue-200 dark:border-blue-700">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                <div className="font-bold text-blue-600 dark:text-blue-400">{totalStats}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stat labels for radial chart */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          {stats.map((stat, index) => {
            const statName = STAT_NAMES[stat.stat.name] || stat.stat.name;
            const colors = getStatColors(stat.base_stat);
            
            return (
              <div key={index} className={`flex items-center gap-2 ${colors.text}`}>
                {getStatIcon(stat.stat.name)}
                <span className="text-sm font-medium">{statName}</span>
                <span className="text-sm font-bold ml-auto">{stat.base_stat}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

export default StatChart;
