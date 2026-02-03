import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { ChevronDownIcon, ChevronUpIcon } from './icons';
import { useTheme } from './ThemeContext';

interface FilterSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const FilterSection: React.FC<FilterSectionProps> = ({ title, isExpanded, onToggle, children }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-2 py-1 ${theme === 'dark' ? 'hover:bg-[#252830]' : 'hover:bg-gray-50'}`}
      >
        <span className={`font-bold text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-700'}`}>{title}</span>
        <div className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </div>
      </button>
      {isExpanded && (
        <div className="p-2 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  onSelect: (option: string) => void;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ 
  value, onChange, options, placeholder, onSelect 
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);

  useEffect(() => {
    if (value.length > 0) {
      const filtered = options.filter(option => 
        option.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      setFilteredOptions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredOptions([]);
      setIsOpen(false);
    }
  }, [value, options]);

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="text-sm"
        onFocus={() => {
          if (value.length > 0 && filteredOptions.length > 0) {
            setIsOpen(true);
          }
        }}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      />
      {isOpen && filteredOptions.length > 0 && (
        <div className={`absolute top-full left-0 right-0 z-50 ${theme === 'dark' ? 'bg-[#2a2d35] border-gray-600' : 'bg-white border-gray-300'} border rounded-md shadow-lg max-h-40 overflow-y-auto`}>
          {filteredOptions.map((option, index) => (
            <button
              key={index}
              className={`w-full px-3 py-2 text-left text-sm ${theme === 'dark' ? 'hover:bg-[#34373f] text-gray-200 border-gray-700' : 'hover:bg-gray-50 border-gray-100'} border-b last:border-b-0`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  disabled?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({ 
  value, onChange, options, placeholder, disabled = false 
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = options.filter(option => 
        option.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options]);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    onChange('');
    setSearchTerm('');
  };

  const bgColor = theme === 'dark' ? 'bg-[#2a2d35]' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const textColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-900';
  const placeholderColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const hoverBorder = theme === 'dark' ? 'hover:border-gray-500' : 'hover:border-gray-400';
  const hoverBg = theme === 'dark' ? 'hover:bg-[#34373f]' : 'hover:bg-gray-50';
  const disabledBg = theme === 'dark' ? 'bg-[#1e2129]' : 'bg-gray-100';

  return (
    <div className="relative">
      <div
        className={`w-full ${bgColor} border ${borderColor} rounded px-2 py-1 text-sm cursor-pointer flex items-center justify-between ${
          disabled ? `${disabledBg} cursor-not-allowed opacity-60` : hoverBorder
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={value ? textColor : placeholderColor}>
          {value || placeholder}
        </span>
        <div className="flex items-center gap-1">
          {value && !disabled && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className={theme === 'dark' ? 'text-gray-400 hover:text-gray-200 text-sm' : 'text-gray-400 hover:text-gray-600 text-sm'}
            >
              ×
            </button>
          )}
          <div className={`w-3 h-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>
            <ChevronDownIcon />
          </div>
        </div>
      </div>
      
      {isOpen && !disabled && (
        <div className={`absolute top-full left-0 right-0 z-50 ${bgColor} border ${borderColor} rounded-md shadow-lg mt-1`}>
          <div className={`p-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search teams..."
              className="text-sm"
              autoFocus
            />
          </div>
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className={`px-3 py-2 text-sm ${placeholderColor}`}>No teams found</div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={index}
                  className={`w-full px-3 py-2 text-left text-sm ${hoverBg} ${textColor} border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'} last:border-b-0`}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface RangeSliderProps {
  label: string;
  value: [number, number];
  min: number;
  max: number;
  step?: number;
  onChange: (value: [number, number]) => void;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({ label, value, min, max, step = 1, onChange }) => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{label}</label>
        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{value[0]} - {value[1]}</span>
      </div>
      <Slider
        value={value}
        onValueChange={(newValue) => onChange([newValue[0], newValue[1]])}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
};