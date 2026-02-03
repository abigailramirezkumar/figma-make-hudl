import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from './ThemeContext';
import { Checkbox } from './ui/checkbox';

// New interface for folder/general context menus
interface ContextMenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
}

interface SimpleContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

// Old interface for column filter context menus (PlayAnalysisTool)
interface ColumnContextMenuProps {
  x: number;
  y: number;
  column: string;
  availableValues: string[];
  selectedValues: string[];
  onToggleValue: (column: string, value: string) => void;
  valueCounts?: Map<string, number>; // Count of each value
  totalCount?: number; // Total number of plays
}

type ContextMenuProps = SimpleContextMenuProps | ColumnContextMenuProps;

// Type guard to check if props are for column filtering
function isColumnContextMenu(props: ContextMenuProps): props is ColumnContextMenuProps {
  return 'column' in props && 'availableValues' in props;
}

export const ContextMenu: React.FC<ContextMenuProps> = (props) => {
  const { theme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const bg = theme === 'dark' ? 'bg-[#2D333A]' : 'bg-white';
  const border = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';
  const textPrimary = theme === 'dark' ? 'text-gray-200' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const textDanger = theme === 'dark' ? 'text-red-400' : 'text-red-600';
  const hoverBg = theme === 'dark' ? 'hover:bg-[#3D434A]' : 'hover:bg-gray-100';
  const inputBg = theme === 'dark' ? 'bg-[#1e2129]' : 'bg-gray-50';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (isColumnContextMenu(props)) {
          // For column menus, we close via the global click handler in PlayAnalysisTool
        } else {
          props.onClose();
        }
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (!isColumnContextMenu(props)) {
          props.onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [props]);

  // Adjust position if menu would go off screen
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedX = props.x;
      let adjustedY = props.y;

      if (rect.right > viewportWidth) {
        adjustedX = viewportWidth - rect.width - 10;
      }

      if (rect.bottom > viewportHeight) {
        adjustedY = viewportHeight - rect.height - 10;
      }

      menuRef.current.style.left = `${adjustedX}px`;
      menuRef.current.style.top = `${adjustedY}px`;
    }
  }, [props.x, props.y]);

  // Render column filter menu
  if (isColumnContextMenu(props)) {
    const filteredValues = props.availableValues.filter(value =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div
        ref={menuRef}
        className={`fixed z-50 ${bg} border ${border} rounded-md shadow-lg py-2 min-w-[200px] max-w-[300px]`}
        style={{ left: props.x, top: props.y }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`px-3 py-1 text-xs font-bold ${textSecondary}`}>{props.column}</div>
        
        {props.availableValues.length > 5 && (
          <div className="px-2 py-1">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-2 py-1 text-sm ${inputBg} border ${border} rounded ${textPrimary} focus:outline-none focus:ring-1 focus:ring-blue-500`}
            />
          </div>
        )}

        <div className="max-h-[300px] overflow-y-auto">
          {filteredValues.map((value, index) => {
            const isSelected = props.selectedValues.includes(value);
            const count = props.valueCounts?.get(value) || 0;
            const percentage = props.totalCount && props.totalCount > 0 
              ? Math.round((count / props.totalCount) * 100) 
              : 0;
            
            return (
              <div
                key={index}
                className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${hoverBg} cursor-pointer ${textPrimary}`}
                onClick={() => props.onToggleValue(props.column, value)}
              >
                <Checkbox checked={isSelected} />
                <span className="flex-1 truncate">{value}</span>
                {props.valueCounts && props.totalCount && (
                  <span className={`text-xs ${textSecondary} shrink-0`}>
                    {count} ({percentage}%)
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {props.selectedValues.length > 0 && (
          <div className={`px-3 py-1 border-t ${border} mt-1`}>
            <button
              className={`text-xs ${textSecondary} ${hoverBg} px-2 py-1 rounded`}
              onClick={() => {
                props.selectedValues.forEach(value => {
                  props.onToggleValue(props.column, value);
                });
              }}
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>
    );
  }

  // Render simple menu items
  return (
    <div
      ref={menuRef}
      className={`fixed z-50 ${bg} border ${border} rounded-md shadow-lg py-1 min-w-[180px]`}
      style={{ left: props.x, top: props.y }}
    >
      {props.items.map((item, index) => (
        <button
          key={index}
          className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${
            item.disabled ? 'opacity-50 cursor-not-allowed' : `${hoverBg} cursor-pointer`
          } ${item.danger ? textDanger : textPrimary}`}
          onClick={() => {
            if (!item.disabled) {
              item.onClick();
              props.onClose();
            }
          }}
          disabled={item.disabled}
        >
          {item.icon && <span className="w-4 h-4 flex items-center justify-center">{item.icon}</span>}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};