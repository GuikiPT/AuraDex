import React from 'react';
import { Gamepad2 } from 'lucide-react';
import { Tab, TabId } from '../types';

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
  encountersLoading?: boolean;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  encountersLoading = false 
}) => {
  return (
    <div className="glass border-b border-white/20 dark:border-gray-700/30 sticky top-0 z-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <nav className="flex space-x-2 md:space-x-8 overflow-x-auto tab-navigation pb-2 md:pb-0 flex-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-1 md:space-x-2 py-3 md:py-4 px-3 md:px-2 border-b-2 transition-all duration-200 whitespace-nowrap min-w-fit ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-t-lg'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-t-lg'
                  }`}
                >
                  <Icon size={16} className="md:w-[18px] md:h-[18px]" />
                  <span className="font-medium text-sm md:text-base">{tab.label}</span>
                  {tab.id === 'locations' && encountersLoading && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </nav>
          
          {/* Quick Moves Tab Button for Mobile */}
          <div className="md:hidden ml-2">
            <button
              onClick={() => onTabChange('moves')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg border transition-all duration-200 ${
                activeTab === 'moves'
                  ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                  : 'bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30 text-gray-600 dark:text-gray-400'
              }`}
              title="View Moves"
            >
              <Gamepad2 size={16} />
              <span className="text-xs font-medium">Moves</span>
            </button>
          </div>
        </div>
        
        {/* Scroll hint for mobile */}
        <div className="md:hidden text-center py-1">
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-1">
            <span>←</span>
            <span>Scroll for all tabs or use quick button</span>
            <span>→</span>
          </div>
        </div>
      </div>
    </div>
  );
};
