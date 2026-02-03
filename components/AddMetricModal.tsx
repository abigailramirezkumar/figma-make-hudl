import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { SearchIcon, CloseIcon, ChevronDownIcon, ChevronRight } from './icons';
import { playDirOptions, hashOptions, offPlayOptions, offFormOptions, offStrOptions, MetricOption } from './filterData';
import { useTheme } from './ThemeContext';

interface AddMetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (category: string, selectedValues: string[]) => void;
}

interface MetricCategory {
  label: string;
  key: string;
  options: string[] | MetricOption[];
  isHierarchical: boolean;
}

const metricCategories: MetricCategory[] = [
  { label: 'PLAY DIR', key: 'PLAY DIR', options: playDirOptions, isHierarchical: false },
  { label: 'HASH', key: 'HASH', options: hashOptions, isHierarchical: false },
  { label: 'OFF PLAY', key: 'OFF PLAY', options: offPlayOptions, isHierarchical: false },
  { label: 'OFF FORM', key: 'OFF FORM', options: offFormOptions, isHierarchical: true },
  { label: 'OFF STR', key: 'OFF STR', options: offStrOptions, isHierarchical: true },
];

export const AddMetricModal: React.FC<AddMetricModalProps> = ({ isOpen, onClose, onApply }) => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('PLAY DIR');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const currentCategory = metricCategories.find(c => c.key === selectedCategory);
  if (!currentCategory) return null;

  const flattenOptions = (options: MetricOption[]): string[] => {
    const result: string[] = [];
    options.forEach(option => {
      result.push(option.value);
      if (option.children) {
        option.children.forEach(child => result.push(child.value));
      }
    });
    return result;
  };

  const searchInOptions = (options: string[] | MetricOption[], term: string): (string | MetricOption)[] => {
    if (!term) return options;
    
    const lowerTerm = term.toLowerCase();
    
    if (currentCategory.isHierarchical) {
      const hierarchicalOptions = options as MetricOption[];
      const filtered: MetricOption[] = [];
      
      hierarchicalOptions.forEach(option => {
        const parentMatches = option.value.toLowerCase().includes(lowerTerm);
        const matchingChildren = option.children?.filter(child => 
          child.value.toLowerCase().includes(lowerTerm)
        );
        
        if (parentMatches || (matchingChildren && matchingChildren.length > 0)) {
          filtered.push({
            value: option.value,
            children: matchingChildren && matchingChildren.length > 0 ? matchingChildren : option.children
          });
        }
      });
      
      return filtered;
    } else {
      return (options as string[]).filter(opt => opt.toLowerCase().includes(lowerTerm));
    }
  };

  const filteredOptions = searchInOptions(currentCategory.options, searchTerm);

  const handleToggle = (value: string) => {
    setSelectedValues(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const toggleParent = (parentValue: string) => {
    setExpandedParents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(parentValue)) {
        newSet.delete(parentValue);
      } else {
        newSet.add(parentValue);
      }
      return newSet;
    });
  };

  const handleApply = () => {
    if (selectedValues.length > 0) {
      onApply(selectedCategory, selectedValues);
    }
    setSelectedValues([]);
    setSearchTerm('');
    setExpandedParents(new Set());
    onClose();
  };

  const handleCancel = () => {
    setSelectedValues([]);
    setSearchTerm('');
    setExpandedParents(new Set());
    onClose();
  };

  const handleCategoryChange = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
    setSelectedValues([]);
    setSearchTerm('');
    setExpandedParents(new Set());
  };

  const bgColor = theme === 'dark' ? 'bg-[#2a2d35]' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const textPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const textTertiary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const hoverBg = theme === 'dark' ? 'hover:bg-[#34373f]' : 'hover:bg-gray-50';
  const hoverBgSecondary = theme === 'dark' ? 'hover:bg-[#3a3d47]' : 'hover:bg-gray-100';
  const activeBg = theme === 'dark' ? 'bg-blue-900/40' : 'bg-blue-50';
  const activeBorder = theme === 'dark' ? 'border-blue-500' : 'border-blue-600';
  const activeText = theme === 'dark' ? 'text-blue-400' : 'text-blue-600';
  const overlayBg = theme === 'dark' ? 'bg-black/70' : 'bg-black/50';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${overlayBg}`}>
      <div className={`${bgColor} rounded-lg shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col`}>
        {/* Header */}
        <div className={`p-4 border-b ${borderColor} flex items-center justify-between`}>
          <h2 className={`font-bold ${textPrimary}`}>Add Attribute</h2>
          <button
            onClick={handleCancel}
            className={`p-1 ${hoverBg} rounded transition-colors w-5 h-5 flex items-center justify-center`}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Category Tabs */}
        <div className={`border-b ${borderColor} flex overflow-x-auto`}>
          {metricCategories.map(category => (
            <button
              key={category.key}
              onClick={() => handleCategoryChange(category.key)}
              className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === category.key
                  ? `${activeText} border-b-2 ${activeBorder} ${activeBg}`
                  : `${textSecondary} ${hoverBg} ${theme === 'dark' ? 'hover:text-gray-100' : 'hover:text-gray-800'}`
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className={`p-4 border-b ${borderColor}`}>
          <div className="relative">
            <Input
              type="text"
              placeholder={`Search ${currentCategory.label}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-8"
            />
            <div className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 ${textTertiary}`}>
              <SearchIcon />
            </div>
          </div>
          {selectedValues.length > 0 && (
            <div className={`mt-2 text-sm ${textSecondary}`}>
              {selectedValues.length} option{selectedValues.length !== 1 ? 's' : ''} selected
            </div>
          )}
        </div>

        {/* Options List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {currentCategory.isHierarchical ? (
              // Hierarchical options with expand/collapse
              <>
                {(filteredOptions as MetricOption[]).map((option, parentIndex) => (
                  <div key={`parent-${parentIndex}-${option.value}`}>
                    {option.children && option.children.length > 0 ? (
                      // Parent with children
                      <div>
                        <div className={`flex items-center gap-2 p-2 ${hoverBg} rounded`}>
                          <button
                            onClick={() => toggleParent(option.value)}
                            className={`p-0.5 ${hoverBgSecondary} rounded`}
                          >
                            {expandedParents.has(option.value) ? (
                              <ChevronDownIcon />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                          <div
                            className="flex items-center gap-3 flex-1 cursor-pointer"
                            onClick={() => handleToggle(option.value)}
                          >
                            <Checkbox
                              checked={selectedValues.includes(option.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className={`text-sm font-medium ${textPrimary}`}>{option.value}</span>
                          </div>
                        </div>
                        
                        {/* Children */}
                        {expandedParents.has(option.value) && (
                          <div className="ml-8 space-y-1 mt-1">
                            {option.children.map((child, childIndex) => (
                              <div
                                key={`child-${parentIndex}-${childIndex}-${child.value}`}
                                className={`flex items-center gap-3 p-2 ${hoverBg} rounded cursor-pointer`}
                                onClick={() => handleToggle(child.value)}
                              >
                                <Checkbox
                                  checked={selectedValues.includes(child.value)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <span className={`text-sm ${textSecondary}`}>{child.value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Parent without children (standalone option)
                      <div
                        className={`flex items-center gap-3 p-2 ${hoverBg} rounded cursor-pointer ml-6`}
                        onClick={() => handleToggle(option.value)}
                      >
                        <Checkbox
                          checked={selectedValues.includes(option.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className={`text-sm ${textSecondary}`}>{option.value}</span>
                      </div>
                    )}
                  </div>
                ))}
              </>
            ) : (
              // Flat options
              <>
                {(filteredOptions as string[]).map((value, index) => (
                  <div
                    key={`flat-${index}-${value}`}
                    className={`flex items-center gap-3 p-2 ${hoverBg} rounded cursor-pointer`}
                    onClick={() => handleToggle(value)}
                  >
                    <Checkbox
                      checked={selectedValues.includes(value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className={`text-sm ${textSecondary}`}>{value}</span>
                  </div>
                ))}
              </>
            )}
          </div>
          {filteredOptions.length === 0 && (
            <div className={`text-center py-8 ${textTertiary} text-sm`}>
              No options found matching "{searchTerm}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${borderColor} flex items-center justify-end gap-2`}>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={selectedValues.length === 0}>
            Apply Filter
          </Button>
        </div>
      </div>
    </div>
  );
};