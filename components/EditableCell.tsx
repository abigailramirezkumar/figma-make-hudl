import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeContext';

interface EditableCellProps {
  value: string;
  suggestions: string[];
  onSave: (newValue: string) => void;
  onCancel: () => void;
}

// Abbreviation mappings for common formations and play types
const abbreviationMap: Record<string, string> = {
  // Formations
  'sg': 'Shotgun',
  'shot': 'Shotgun',
  'shotgun': 'Shotgun',
  'if': 'I-Formation',
  'iform': 'I-Formation',
  'i-form': 'I-Formation',
  'sb': 'Singleback',
  'single': 'Singleback',
  'singleback': 'Singleback',
  'pst': 'Pistol',
  'pistol': 'Pistol',
  'spd': 'Spread',
  'spread': 'Spread',
  'ps': 'Pro Set',
  'proset': 'Pro Set',
  'pro': 'Pro Set',
  'wc': 'Wildcat',
  'wct': 'Wildcat',
  'wildcat': 'Wildcat',
  
  // Play types
  'pa': 'Pass',
  'pass': 'Pass',
  'run': 'Run',
  
  // Play directions
  'l': 'Left',
  'left': 'Left',
  'r': 'Right',
  'right': 'Right',
  'm': 'Middle',
  'mid': 'Middle',
  'middle': 'Middle',
};

// Calculate Levenshtein distance for fuzzy matching
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

// Find best match from suggestions
function findBestMatch(input: string, suggestions: string[]): string | null {
  const inputLower = input.toLowerCase().trim();
  
  // Check abbreviation map first
  if (abbreviationMap[inputLower]) {
    return abbreviationMap[inputLower];
  }
  
  // Exact match (case insensitive)
  const exactMatch = suggestions.find(s => s.toLowerCase() === inputLower);
  if (exactMatch) return exactMatch;
  
  // Fuzzy match for typos (only if distance is small)
  let bestMatch: string | null = null;
  let bestDistance = Infinity;
  
  suggestions.forEach(suggestion => {
    const distance = levenshteinDistance(inputLower, suggestion.toLowerCase());
    // Only suggest if it's a close match (1-2 character difference)
    if (distance <= 2 && distance < bestDistance) {
      bestDistance = distance;
      bestMatch = suggestion;
    }
  });
  
  return bestMatch;
}

export const EditableCell: React.FC<EditableCellProps> = ({ value, suggestions, onSave, onCancel }) => {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState(value);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [correction, setCorrection] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const bg = theme === 'dark' ? 'bg-[#1e2129]' : 'bg-white';
  const border = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const textPrimary = theme === 'dark' ? 'text-gray-200' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const hoverBg = theme === 'dark' ? 'hover:bg-[#3D434A]' : 'hover:bg-gray-100';
  const selectedBg = theme === 'dark' ? 'bg-[#3D434A]' : 'bg-gray-200';

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = suggestions.filter(s => 
        s.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setSelectedIndex(0);
      
      // Check for correction suggestion
      if (inputValue !== value && !filtered.some(s => s.toLowerCase() === inputValue.toLowerCase())) {
        const bestMatch = findBestMatch(inputValue, suggestions);
        setCorrection(bestMatch);
      } else {
        setCorrection(null);
      }
    } else {
      setFilteredSuggestions(suggestions);
      setCorrection(null);
    }
  }, [inputValue, suggestions, value]);

  const handleSave = (valueToSave: string) => {
    const trimmed = valueToSave.trim();
    if (!trimmed) {
      onCancel();
      return;
    }
    
    // Check for abbreviation or best match
    const bestMatch = findBestMatch(trimmed, suggestions);
    onSave(bestMatch || trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (correction && filteredSuggestions.length === 0) {
        // Use the correction if no exact matches
        handleSave(correction);
      } else if (filteredSuggestions.length > 0) {
        handleSave(filteredSuggestions[selectedIndex]);
      } else {
        handleSave(inputValue);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (correction) {
        setInputValue(correction);
        setCorrection(null);
      } else if (filteredSuggestions.length > 0) {
        setInputValue(filteredSuggestions[selectedIndex]);
      }
    }
  };

  return (
    <div className="relative" onBlur={(e) => {
      // Only cancel if clicking outside the component
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        onCancel();
      }
    }}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`w-full px-2 py-1 text-xs ${bg} border-2 border-blue-500 ${textPrimary} focus:outline-none`}
        style={{ minWidth: '150px' }}
      />
      
      {showSuggestions && (filteredSuggestions.length > 0 || correction) && (
        <div
          ref={dropdownRef}
          className={`absolute left-0 top-full mt-1 ${bg} border ${border} rounded shadow-lg z-50 max-h-[200px] overflow-y-auto`}
          style={{ minWidth: '200px' }}
        >
          {correction && filteredSuggestions.length === 0 && (
            <div
              className={`px-3 py-2 text-xs ${textSecondary} border-b ${border}`}
            >
              Did you mean: <span className={`font-bold ${textPrimary}`}>{correction}</span>? (Press Tab)
            </div>
          )}
          
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`px-3 py-2 text-xs cursor-pointer ${textPrimary} ${
                index === selectedIndex ? selectedBg : hoverBg
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSave(suggestion);
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {suggestion}
            </div>
          ))}
          
          {filteredSuggestions.length === 0 && !correction && (
            <div className={`px-3 py-2 text-xs ${textSecondary}`}>
              Press Enter to create "{inputValue}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};
