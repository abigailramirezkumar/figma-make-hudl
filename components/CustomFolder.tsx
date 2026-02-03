import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { useTheme } from './ThemeContext';

interface CustomFolderProps {
  folderId: string;
  folderName: string;
  itemCount: number;
  paddingLeft: string;
  dropTarget: string | null;
  onContextMenu: (e: React.MouseEvent, folderName: string, folderType: 'season' | 'team' | 'fixture', folderId?: string) => void;
  onDragStart: (e: React.DragEvent, type: 'item' | 'folder', id: string) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent, folderId: string) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetFolderId: string) => void;
}

export const CustomFolder: React.FC<CustomFolderProps> = ({
  folderId,
  folderName,
  itemCount,
  paddingLeft,
  dropTarget,
  onContextMenu,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const border = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';
  const bgHover = theme === 'dark' ? 'hover:bg-[#252830]' : 'hover:bg-gray-100';
  const textPrimary = theme === 'dark' ? 'text-gray-200' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  function FolderIcon() {
    return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" aria-label="Folder">
        <path d="M2 3.5C2 2.67157 2.67157 2 3.5 2H6L7 4H12.5C13.3284 4 14 4.67157 14 5.5V12.5C14 13.3284 13.3284 14 12.5 14H3.5C2.67157 14 2 13.3284 2 12.5V3.5Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <div
      className={`h-[40px] flex items-center cursor-pointer transition-colors border-b ${border} ${bgHover} ${
        dropTarget === folderId ? 'ring-2 ring-blue-500' : ''
      }`}
      style={{ paddingLeft }}
      onClick={() => setIsExpanded(!isExpanded)}
      onContextMenu={(e) => onContextMenu(e, folderName, 'fixture', folderId)}
      draggable
      onDragStart={(e) => onDragStart(e, 'folder', folderId)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => onDragOver(e, folderId)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, folderId)}
    >
      <div className="w-8 shrink-0" aria-label="Select subfolder" onClick={(e) => e.stopPropagation()}>
        <Checkbox />
      </div>
      <div className={`w-8 shrink-0 flex items-center justify-center ${textSecondary}`}>
        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </div>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <FolderIcon />
        <span className={`text-sm font-medium ${textPrimary}`}>{folderName}</span>
        <span className={`text-xs ${textSecondary}`}>· {itemCount} Items</span>
      </div>
      <div className="w-32"></div>
      <div className="w-24"></div>
      <div className="w-20"></div>
      <div className="w-20"></div>
      <div className="w-20"></div>
      <div className="w-24"></div>
    </div>
  );
};
