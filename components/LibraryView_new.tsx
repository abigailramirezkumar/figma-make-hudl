import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronRight, ChevronDown, FolderPlus, Edit2, Trash2 } from 'lucide-react';
import { seasons, getFixturesBySeason, getLibraryItemsByFixture, LibraryItem, Fixture, allFixtures, libraryItems } from './libraryData';
import { mockPlaylists, Playlist } from './playlistData';
import { usePlaylistContext } from './PlaylistContext';
import { usePlaybackContext } from './PlaybackContext';
import { VideoPlayer } from './VideoPlayer';
import { Checkbox } from './ui/checkbox';
import { useTheme } from './ThemeContext';
import { Button } from './ui/button';
import { ConsistentHeader } from './ConsistentHeader';
import { MultiSelectPlaybackModal } from './MultiSelectPlaybackModal';
import { SearchBarWithSuggestions } from './SearchBarWithSuggestions';
import { MenuIcon, FilterIcon, CloseIcon } from './icons';
import { ContextMenu } from './ContextMenu';
import { FolderDialog } from './FolderDialog';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './ui/resizable';
import { SimpleCustomFolder } from './SimpleCustomFolder';
import { LibraryItemRow } from './LibraryItemRow';
import imgThumbnail from 'figma:asset/2efc0e0afc822097bdd71a42329fb3cf8a4e5293.png';
import svgPaths from '../imports/svg-ga5ghoelz';

const typeLabels: Record<string, string> = {
  'game-footage': 'Game',
  'scout-report': 'Scout',
  'practice': 'Practice',
  'playlist': 'Playlist',
};

type ViewMode = 'schedule' | 'date' | 'folder' | 'team';
type ExpandedTeams = Set<string>;

// Icon components
function LibraryIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
      <path d={svgPaths.p3c5377f0} fill="currentColor" />
      <path d={svgPaths.p22178d00} fill="currentColor" />
      <path clipRule="evenodd" d={svgPaths.p397cf500} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" aria-label="Folder">
      <path d={svgPaths.p3d358780} fill="currentColor" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" aria-label="Video">
      <path d={svgPaths.p11457a80} fill="currentColor" />
    </svg>
  );
}

function GridViewIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
      <path d={svgPaths.p2399d500} fill="currentColor" />
    </svg>
  );
}

function ListViewIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
      <path d={svgPaths.p20b86700} fill="currentColor" />
      <path d={svgPaths.p30260080} fill="currentColor" />
      <path d={svgPaths.pf9c8f00} fill="currentColor" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
      <path d={svgPaths.p1dc7f500} fill="currentColor" />
    </svg>
  );
}

function DataIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
      <path clipRule="evenodd" d={svgPaths.p125e5500} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

export const LibraryViewNew: React.FC = () => {
  const [expandedSeasons, setExpandedSeasons] = useState<Set<string>>(new Set(['2025']));
  const [expandedFixtures, setExpandedFixtures] = useState<Set<string>>(new Set());
  const [expandedTeams, setExpandedTeams] = useState<ExpandedTeams>(new Set());
  const [expandedPlaylists, setExpandedPlaylists] = useState(false);
  const [playbackTabs, setPlaybackTabs] = useState<{ item: LibraryItem; fixture: Fixture }[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('schedule');
  const [teamSortOrder, setTeamSortOrder] = useState<'date' | 'schedule'>('date');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [listGridView, setListGridView] = useState<'grid' | 'list'>('list');
  const [isMultiSelectModalOpen, setIsMultiSelectModalOpen] = useState(false);
  const { theme } = useTheme();
  const { playlists } = usePlaylistContext();
  const { setOpenPlaylist } = usePlaybackContext();

  // Context menu and folder management state
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; folderName: string; folderType: 'season' | 'team' | 'fixture'; folderId?: string } | null>(null);
  const [folderDialog, setFolderDialog] = useState<{ isOpen: boolean; mode: 'create' | 'rename'; parentFolder?: string; currentName?: string; folderId?: string }>({ isOpen: false, mode: 'create' });
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; folderName?: string; folderId?: string }>({ isOpen: false });
  const [customFolders, setCustomFolders] = useState<Record<string, { name: string; parentId: string | null; items: string[] }>>({});

  // Item rename state
  const [itemContextMenu, setItemContextMenu] = useState<{ x: number; y: number; itemId: string; itemName: string } | null>(null);
  const [renamedItems, setRenamedItems] = useState<Record<string, string>>({});

  // Get saved playlists from context
  const savedPlaylists = useMemo(() => {
    return playlists.filter(p => p.type === 'saved').sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [playlists]);

  // Theme colors
  const bg = theme === 'dark' ? 'bg-[#1a1d24]' : 'bg-gray-50';
  const bgSecondary = theme === 'dark' ? 'bg-[#1e2129]' : 'bg-white';
  const bgHover = theme === 'dark' ? 'hover:bg-[#252830]' : 'hover:bg-gray-100';
  const border = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';
  const borderLight = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const textPrimary = theme === 'dark' ? 'text-gray-200' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  // Generate clip count based on item ID (consistent across renders)
  const getClipCount = (itemId: string) => {
    const hash = itemId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 150 + (hash % 71); // 150-220 range
  };

  // Helper to get item name
  const getItemName = (item: LibraryItem, fixture: Fixture) => {
    const items = getLibraryItemsByFixture(fixture.id);
    const index = items.findIndex(i => i.id === item.id);
    
    if (item.type === 'game-footage') {
      return `${fixture.opponent} - Game`;
    } else if (item.type === 'practice') {
      const practiceNum = items.filter((i, idx) => idx < index && i.type === 'practice').length + 1;
      return `${fixture.opponent} - Practice ${practiceNum}`;
    } else if (item.type === 'scout-report') {
      const isOwnTeam = index % 2 === 0;
      return `${fixture.opponent} - ${isOwnTeam ? 'Self' : 'Opponent'} Scout`;
    }
    return item.title;
  };

  const handleItemClick = (item: LibraryItem, fixture: Fixture) => {
    setPlaybackTabs([{ item, fixture }]);
    setActiveTabIndex(0);
  };

  return (
    <div className={`h-screen ${bg} ${textPrimary} flex flex-col`}>
      {playbackTabs.length > 0 ? (
        <>
          {/* Single Header for Everything */}
          <div className={`${bgSecondary} border-b ${border} h-12 flex items-center px-4`}>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="p-1">
                <MenuIcon />
              </Button>
              <div className={`h-4 w-px ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              <div className="flex items-center gap-1 text-sm">
                <span className={`font-bold ${textPrimary}`}>Library</span>
                <span className={textSecondary}> / Video Playback</span>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <span className={`text-sm ${textPrimary}`}>
                {getItemName(playbackTabs[activeTabIndex].item, playbackTabs[activeTabIndex].fixture)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setPlaybackTabs([]);
                  setActiveTabIndex(0);
                }}
                className="text-xs"
              >
                <CloseIcon />
              </Button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Section: Library (Left) and Video Player (Right) - 50% Height */}
            <div className="h-1/2 flex border-b ${border}">
              <ResizablePanelGroup direction="horizontal">
                {/* Library Panel (Left) */}
                <ResizablePanel defaultSize={50} minSize={30} maxSize={70}>
                  <div className={`h-full flex flex-col ${bgSecondary}`}>
                    {/* Library Content */}
                    <div className="p-4 flex-1 overflow-y-auto">
                      <div className={`text-xs font-medium ${textSecondary} mb-2`}>Library</div>
                      {/* Mock library items */}
                      {allFixtures.slice(0, 5).map(fixture => (
                        <div key={fixture.id} className={`p-2 mb-1 rounded hover:${bgHover} cursor-pointer text-sm ${textPrimary}`}
                          onClick={() => {
                            const items = getLibraryItemsByFixture(fixture.id);
                            if (items.length > 0) {
                              handleItemClick(items[0], fixture);
                            }
                          }}
                        >
                          {fixture.opponent}
                        </div>
                      ))}
                    </div>
                  </div>
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                {/* Video Player Panel (Right) */}
                <ResizablePanel defaultSize={50} minSize={30} maxSize={70}>
                  <div className={`h-full ${bgSecondary}`}>
                    <VideoPlayer />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>

            {/* Bottom Section: Grid (Full Width) - 50% Height */}
            <div className={`h-1/2 ${bgSecondary} p-4 overflow-y-auto`}>
              <div className={`text-xs font-medium ${textSecondary} mb-2`}>Play Grid</div>
              <div className="text-sm ${textPrimary}">Grid content will go here...</div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className={`text-center ${textSecondary}`}>
            <p>Select an item from the library to view</p>
          </div>
        </div>
      )}
    </div>
  );
};
