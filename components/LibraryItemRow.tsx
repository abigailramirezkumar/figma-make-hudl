import React from 'react';
import { Checkbox } from './ui/checkbox';
import { useTheme } from './ThemeContext';
import imgThumbnail from 'figma:asset/5a94901d6a32a5e41b6b7cf9483ebf2bf8454ebd.png';

interface LibraryItemRowProps {
  itemId: string;
  itemName: string;
  displayName: string;
  clipCount: number;
  itemType: string;
  paddingLeft: string;
  isSelected: boolean;
  modifiedText?: string;
  extraInfo?: string;
  onItemClick: () => void;
  onToggleSelection: () => void;
  onRightClick: (e: React.MouseEvent, itemId: string, itemName: string) => void;
  onDragStart: (e: React.DragEvent, type: 'item' | 'folder', id: string) => void;
  onDragEnd: () => void;
  isInFolder?: boolean;
}

const typeLabels: Record<string, string> = {
  'game-footage': 'Game',
  'scout-report': 'Scout',
  'practice': 'Practice',
  'playlist': 'Playlist',
};

function VideoIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" aria-label="Video">
      <path d="M2 4C2 2.89543 2.89543 2 4 2H10C11.1046 2 12 2.89543 12 4V12C12 13.1046 11.1046 14 10 14H4C2.89543 14 2 13.1046 2 12V4Z" fill="currentColor" />
      <path d="M12 6L14 4V12L12 10V6Z" fill="currentColor" />
    </svg>
  );
}

function DataIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
      <path fillRule="evenodd" clipRule="evenodd" d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2ZM7 5C7 4.44772 7.44772 4 8 4C8.55228 4 9 4.44772 9 5V8C9 8.55228 8.55228 9 8 9C7.44772 9 7 8.55228 7 8V5ZM8 12C8.55228 12 9 11.5523 9 11C9 10.4477 8.55228 10 8 10C7.44772 10 7 10.4477 7 11C7 11.5523 7.44772 12 8 12Z" fill="currentColor" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
      <path d="M2 4C2 2.89543 2.89543 2 4 2H12C13.1046 2 14 2.89543 14 4V10C14 11.1046 13.1046 12 12 12H8L4 14V12H4C2.89543 12 2 11.1046 2 10V4Z" fill="currentColor" />
    </svg>
  );
}

export const LibraryItemRow: React.FC<LibraryItemRowProps> = React.memo(({
  itemId,
  itemName,
  displayName,
  clipCount,
  itemType,
  paddingLeft,
  isSelected,
  modifiedText,
  extraInfo,
  onItemClick,
  onToggleSelection,
  onRightClick,
  onDragStart,
  onDragEnd,
  isInFolder = false
}) => {
  const { theme } = useTheme();
  
  const border = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';
  const bgHover = theme === 'dark' ? 'hover:bg-[#252830]' : 'hover:bg-gray-100';
  const textPrimary = theme === 'dark' ? 'text-gray-200' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  const handleDragStartLocal = (e: React.DragEvent) => {
    e.stopPropagation();
    onDragStart(e, 'item', itemId);
  };

  const handleRightClickLocal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRightClick(e, itemId, itemName);
  };

  return (
    <div
      className={`h-[48px] flex items-center cursor-pointer transition-colors border-b ${border} ${bgHover}`}
      style={{ paddingLeft }}
      draggable
      onDragStart={handleDragStartLocal}
      onDragEnd={onDragEnd}
      onContextMenu={handleRightClickLocal}
    >
      <div className="w-8 shrink-0" aria-label="Select item" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelection}
        />
      </div>
      <div className="w-8 shrink-0"></div>
      <div 
        className="flex items-center gap-2 flex-1 min-w-0"
        onClick={onItemClick}
      >
        <div className="w-12 h-8 rounded overflow-hidden shrink-0" style={{ backgroundColor: '#4CAF50' }}>
          <img src={imgThumbnail} alt={displayName} className="w-full h-full object-cover" />
        </div>
        <span className={`text-sm truncate ${textPrimary}`}>{displayName}</span>
        {extraInfo && <span className={`text-xs ${textSecondary}`}>{extraInfo}</span>}
      </div>
      <div className={`w-32 min-w-[60px] text-right text-xs ${textSecondary} truncate`}>
        {modifiedText || `${Math.floor(Math.random() * 30)} days ago`}
      </div>
      <div className={`w-24 min-w-[50px] text-center text-xs ${textSecondary} truncate`}>
        {typeLabels[itemType] || itemType}
      </div>
      <div className={`w-20 min-w-[40px] flex items-center justify-center text-xs ${textPrimary}`}>
        {clipCount}
      </div>
      <div className="w-20 min-w-[40px] flex items-center justify-center" aria-label="Data available">
        <DataIcon />
      </div>
      <div className={`w-20 min-w-[40px] flex items-center justify-center gap-1 text-xs ${textSecondary}`}>
        <VideoIcon />
        <span>2</span>
      </div>
      <div className={`w-24 min-w-[50px] flex items-center justify-center gap-1 text-xs ${textSecondary}`}>
        <CommentIcon />
        <span>{Math.floor(Math.random() * 10)}</span>
      </div>
    </div>
  );
});

LibraryItemRow.displayName = 'LibraryItemRow';
