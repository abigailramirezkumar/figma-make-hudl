import React from 'react';
import { Button } from './ui/button';
import { SearchBarWithSuggestions } from './SearchBarWithSuggestions';
import { MenuIcon, FilterIcon } from './icons';
import { useTheme } from './ThemeContext';

interface ConsistentHeaderProps {
  title: string;
  subtitle?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchSuggestions?: Array<{ label: string; category?: string }>;
  rightContent?: React.ReactNode;
  showSearch?: boolean;
}

export const ConsistentHeader: React.FC<ConsistentHeaderProps> = ({
  title,
  subtitle,
  searchValue = '',
  onSearchChange,
  searchSuggestions = [],
  rightContent,
  showSearch = true,
}) => {
  const { theme } = useTheme();
  
  const bgSecondary = theme === 'dark' ? 'bg-[#1e2129]' : 'bg-white';
  const border = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';
  const textPrimary = theme === 'dark' ? 'text-gray-200' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`${bgSecondary} border-b ${border} h-12 flex items-center px-4`}>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="p-1">
          <MenuIcon />
        </Button>
        <div className={`h-4 w-px ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
        <div className="flex items-center gap-1 text-sm">
          <span className={`font-bold ${textPrimary}`}>{title}</span>
          {subtitle && <span className={textSecondary}>{subtitle}</span>}
        </div>
      </div>

      {showSearch && (
        <div className="flex-1 flex items-center gap-2 px-4">
          <Button variant="ghost" size="sm" className="p-1">
            <FilterIcon />
          </Button>
          {onSearchChange ? (
            <SearchBarWithSuggestions
              placeholder="Search or filter…"
              value={searchValue}
              onChange={onSearchChange}
              suggestions={searchSuggestions}
            />
          ) : null}
        </div>
      )}

      {rightContent && (
        <div className="flex items-center gap-2">
          {rightContent}
        </div>
      )}
    </div>
  );
};
