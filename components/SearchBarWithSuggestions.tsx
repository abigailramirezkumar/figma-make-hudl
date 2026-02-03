import React, { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { SearchIcon } from './icons';
import { useTheme } from './ThemeContext';

interface SearchSuggestion {
  label: string;
  category?: string;
}

interface SearchBarWithSuggestionsProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions: SearchSuggestion[];
}

export const SearchBarWithSuggestions: React.FC<SearchBarWithSuggestionsProps> = ({
  value,
  onChange,
  placeholder = 'Search or filter…',
  suggestions,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const bgSuggestion = theme === 'dark' ? 'bg-[#1e2129]' : 'bg-white';
  const bgHover = theme === 'dark' ? 'bg-[#252830]' : 'bg-gray-100';
  const border = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';
  const textPrimary = theme === 'dark' ? 'text-gray-200' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  // Filter suggestions based on input
  const filteredSuggestions = value.trim()
    ? suggestions.filter(s => 
        s.label.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8)
    : [];

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      onChange(filteredSuggestions[selectedIndex].label);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    onChange(suggestion.label);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  return (
    <div ref={containerRef} className="flex-1 relative">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
          setSelectedIndex(-1);
        }}
        onFocus={() => {
          if (value.trim()) {
            setShowSuggestions(true);
          }
        }}
        onKeyDown={handleKeyDown}
        className="pr-8"
      />
      <div className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 ${textSecondary}`}>
        <SearchIcon />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div 
          className={`absolute top-full left-0 right-0 mt-1 ${bgSuggestion} border ${border} rounded-md shadow-lg z-50 overflow-hidden`}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`px-3 py-2 cursor-pointer transition-colors ${
                index === selectedIndex ? bgHover : ''
              }`}
              style={index === selectedIndex ? { backgroundColor: theme === 'dark' ? '#252830' : '#f3f4f6' } : {}}
              onClick={() => handleSelectSuggestion(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className={`text-sm ${textPrimary}`}>
                {suggestion.label}
              </div>
              {suggestion.category && (
                <div className={`text-xs ${textSecondary} mt-0.5`}>
                  {suggestion.category}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
