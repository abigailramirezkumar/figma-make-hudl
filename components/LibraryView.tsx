import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronRight, ChevronDown, FolderPlus, Edit2, Trash2, PanelRightOpen } from 'lucide-react';
import { seasons, getFixturesBySeason, getLibraryItemsByFixture, LibraryItem, Fixture, allFixtures, libraryItems } from './libraryData';
import { mockPlaylists, Playlist } from './playlistData';
import { mockPlays } from './footballData';
import { usePlaylistContext } from './PlaylistContext';
import { usePlaybackContext } from './PlaybackContext';
import { VideoPlaybackView } from './VideoPlaybackView';
import { VideoPlayer } from './VideoPlayer';
import { Badge } from './ui/badge';
import { PlaysGrid } from './PlaysGrid';
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
import { DeleteClipModal } from './DeleteClipModal';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './ui/resizable';
import { SimpleCustomFolder } from './SimpleCustomFolder';
import { LibraryItemRow } from './LibraryItemRow';
import imgThumbnail from 'figma:asset/2efc0e0afc822097bdd71a42329fb3cf8a4e5293.png';
import svgPaths from '../imports/svg-ga5ghoelz';
import { toast } from 'sonner@2.0.3';

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

function SortIcon({ direction }: { direction: 'asc' | 'desc' | null }) {
  if (!direction) {
    return (
      <svg className="w-3 h-3 opacity-30" fill="none" viewBox="0 0 12 12">
        <path d="M6 3L8 5H4L6 3Z" fill="currentColor" />
        <path d="M6 9L8 7H4L6 9Z" fill="currentColor" />
      </svg>
    );
  }
  
  if (direction === 'asc') {
    return (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
        <path d="M6 3L8 5H4L6 3Z" fill="currentColor" />
      </svg>
    );
  }
  
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
      <path d="M6 9L8 7H4L6 9Z" fill="currentColor" />
    </svg>
  );
}

export const LibraryView: React.FC = () => {
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
  const [isLibraryOpen, setIsLibraryOpen] = useState(true);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [sortColumn, setSortColumn] = useState<'name' | 'modified' | 'type' | 'clips' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { theme } = useTheme();
  const { playlists, removeClipFromPlaylist, addClipToPlaylist } = usePlaylistContext();
  const { openPlaylist, setOpenPlaylist } = usePlaybackContext();

  // Context menu and folder management state
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; folderName: string; folderType: 'season' | 'team' | 'fixture'; folderId?: string } | null>(null);
  const [folderDialog, setFolderDialog] = useState<{ isOpen: boolean; mode: 'create' | 'rename'; parentFolder?: string; currentName?: string; folderId?: string }>({ isOpen: false, mode: 'create' });
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; folderName?: string; folderId?: string }>({ isOpen: false });
  const [customFolders, setCustomFolders] = useState<Record<string, { name: string; parentId: string | null; items: string[] }>>({});

  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(45);
  const [selectedGridPlayId, setSelectedGridPlayId] = useState<number | undefined>(undefined);
  const [videoKey, setVideoKey] = useState(0); // Key to force video re-render with new random timestamp

  // Item rename state
  const [itemContextMenu, setItemContextMenu] = useState<{ x: number; y: number; itemId: string; itemName: string } | null>(null);
  const [renamedItems, setRenamedItems] = useState<Record<string, string>>({});

  // Delete clip modal state
  const [deleteClipModal, setDeleteClipModal] = useState<{ isOpen: boolean; clipId?: number; itemId?: string }>({ isOpen: false });

  // Track deleted library items (for undo)
  const [deletedItems, setDeletedItems] = useState<Set<string>>(new Set());

  // Get saved playlists from context
  const savedPlaylists = useMemo(() => {
    return playlists.filter(p => p.type === 'saved').sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [playlists]);

  // Debug: Log when customFolders changes
  useEffect(() => {
    console.log('CustomFolders updated:', customFolders);
    console.log('Number of custom folders:', Object.keys(customFolders).length);
  }, [customFolders]);

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

  // Sort seasons - MUST BE BEFORE filteredContent
  const sortedSeasons = useMemo(() => {
    const seasonsList = [...seasons];
    return seasonsList.sort((a, b) => parseInt(b) - parseInt(a));
  }, []);

  // Get all unique teams sorted alphabetically
  const allTeams = useMemo(() => {
    const teams = new Set<string>();
    allFixtures.forEach(fixture => teams.add(fixture.opponent));
    return Array.from(teams).sort();
  }, []);

  // Group items by team for team view
  const itemsByTeam = useMemo(() => {
    const grouped: Record<string, { item: LibraryItem; fixture: Fixture }[]> = {};
    
    allFixtures.forEach(fixture => {
      const items = getLibraryItemsByFixture(fixture.id);
      items.forEach(item => {
        if (!grouped[fixture.opponent]) {
          grouped[fixture.opponent] = [];
        }
        grouped[fixture.opponent].push({ item, fixture });
      });
    });
    
    // Sort items within each team based on teamSortOrder
    Object.keys(grouped).forEach(team => {
      if (teamSortOrder === 'date') {
        // Sort by random date (simulated)
        grouped[team].sort((a, b) => a.item.id.localeCompare(b.item.id));
      } else {
        // Sort by season (descending)
        grouped[team].sort((a, b) => parseInt(b.fixture.season) - parseInt(a.fixture.season));
      }
    });
    
    return grouped;
  }, [teamSortOrder]);

  // Generate search suggestions
  const searchSuggestions = useMemo(() => {
    const suggestions: Array<{ label: string; category?: string }> = [];
    
    // Add team/fixture suggestions
    allFixtures.forEach(fixture => {
      suggestions.push({ label: fixture.opponent, category: 'Team' });
      
      // Add specific content types for this team
      suggestions.push({ label: `${fixture.opponent} - Game`, category: 'Game Footage' });
      suggestions.push({ label: `${fixture.opponent} - Practice`, category: 'Practice' });
      suggestions.push({ label: `${fixture.opponent} - Self Scout`, category: 'Scout Report' });
      suggestions.push({ label: `${fixture.opponent} - Opponent Scout`, category: 'Scout Report' });
    });
    
    // Add season suggestions
    sortedSeasons.forEach(season => {
      suggestions.push({ label: `${season} Season`, category: 'Season' });
    });
    
    // Remove duplicates
    const uniqueSuggestions = Array.from(
      new Map(suggestions.map(s => [s.label, s])).values()
    );
    
    return uniqueSuggestions;
  }, [sortedSeasons, allFixtures]);

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

  // Filtered content based on search
  const filteredContent = useMemo(() => {
    if (!searchTerm.trim()) {
      return { seasons: sortedSeasons, showAll: true };
    }

    const search = searchTerm.toLowerCase();
    const matchingSeasons = new Set<string>();
    const matchingFixtures = new Set<string>();
    const matchingItems = new Set<string>();

    // Check seasons
    sortedSeasons.forEach(season => {
      if (season.toLowerCase().includes(search) || `${season} season`.toLowerCase().includes(search)) {
        matchingSeasons.add(season);
      }
    });

    // Check fixtures and items
    allFixtures.forEach(fixture => {
      const fixtureMatches = fixture.opponent.toLowerCase().includes(search);
      const items = getLibraryItemsByFixture(fixture.id);
      
      items.forEach(item => {
        const itemName = getItemName(item, fixture);
        if (itemName.toLowerCase().includes(search) || fixtureMatches) {
          matchingItems.add(item.id);
          matchingFixtures.add(fixture.id);
          matchingSeasons.add(fixture.season);
        }
      });
    });

    return {
      seasons: Array.from(matchingSeasons),
      fixtures: matchingFixtures,
      items: matchingItems,
      showAll: false
    };
  }, [searchTerm, allFixtures]);

  // Auto-expand when searching
  useEffect(() => {
    if (searchTerm.trim()) {
      setExpandedSeasons(new Set(filteredContent.seasons));
      setExpandedFixtures(filteredContent.fixtures || new Set());
    }
  }, [searchTerm, filteredContent]);

  const toggleSeason = (season: string) => {
    const newExpanded = new Set(expandedSeasons);
    if (newExpanded.has(season)) {
      newExpanded.delete(season);
    } else {
      newExpanded.add(season);
    }
    setExpandedSeasons(newExpanded);
  };

  const toggleFixture = (fixtureId: string) => {
    const newExpanded = new Set(expandedFixtures);
    if (newExpanded.has(fixtureId)) {
      newExpanded.delete(fixtureId);
    } else {
      newExpanded.add(fixtureId);
    }
    setExpandedFixtures(newExpanded);
  };

  const toggleTeam = (team: string) => {
    const newExpanded = new Set(expandedTeams);
    if (newExpanded.has(team)) {
      newExpanded.delete(team);
    } else {
      newExpanded.add(team);
    }
    setExpandedTeams(newExpanded);
  };

  const handleSort = (column: 'name' | 'modified' | 'type' | 'clips') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortItems = <T extends { id: string; type: string }>(items: T[], getName: (item: T) => string): T[] => {
    if (!sortColumn) return items;

    return [...items].sort((a, b) => {
      let compareA: string | number;
      let compareB: string | number;

      switch (sortColumn) {
        case 'name':
          compareA = getName(a).toLowerCase();
          compareB = getName(b).toLowerCase();
          break;
        case 'type':
          compareA = typeLabels[a.type] || '';
          compareB = typeLabels[b.type] || '';
          break;
        case 'clips':
          compareA = getClipCount(a.id);
          compareB = getClipCount(b.id);
          break;
        case 'modified':
          // Mock modified dates - in real app would come from data
          compareA = 0;
          compareB = 0;
          break;
        default:
          return 0;
      }

      if (compareA < compareB) return sortDirection === 'asc' ? -1 : 1;
      if (compareA > compareB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleItemClick = (item: LibraryItem, fixture: Fixture) => {
    setPlaybackTabs([{ item, fixture }]);
    setActiveTabIndex(0);
    setCurrentTime(0);
    // Open video player and grid when an item is clicked
    setIsVideoPlayerOpen(true);
    setIsGridOpen(true);
    setVideoKey(prev => prev + 1); // Force video re-render with new random timestamp
  };

  // Video player handlers
  const handlePlayPause = () => setIsPlaying(!isPlaying);
  
  const handleFullscreen = () => setIsFullscreen(!isFullscreen);
  
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    setCurrentTime(Math.max(0, Math.min(duration, newTime)));
  };
  
  const handleRewind = () => setCurrentTime(Math.max(0, currentTime - 5));
  
  const handleFastForward = () => setCurrentTime(Math.min(duration, currentTime + 5));
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGridRowClick = (playId: number) => {
    setSelectedGridPlayId(playId);
    setCurrentTime(0);
    setIsPlaying(true);
    // Increment videoKey to force VideoPlayer to re-render with new random timestamp
    setVideoKey(prev => prev + 1);
  };

  const toggleItemSelection = (itemId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  // Get full item+fixture data from selected IDs
  const getSelectedItemsData = (): Array<{ item: LibraryItem; fixture: Fixture }> => {
    const result: Array<{ item: LibraryItem; fixture: Fixture }> = [];
    
    allFixtures.forEach(fixture => {
      const items = getLibraryItemsByFixture(fixture.id);
      items.forEach(item => {
        if (selectedItems.has(item.id)) {
          result.push({ item, fixture });
        }
      });
    });
    
    return result;
  };

  // Handle opening selected items
  const handleOpenSelected = () => {
    if (selectedItems.size === 0) return;
    
    if (selectedItems.size === 1) {
      // Single item - open directly
      const itemData = getSelectedItemsData()[0];
      setPlaybackTabs([itemData]);
      setActiveTabIndex(0);
      setSelectedItems(new Set());
    } else {
      // Multiple items - show modal
      setIsMultiSelectModalOpen(true);
    }
  };

  // Handle combined playback
  const handleCombinedPlayback = () => {
    const itemsData = getSelectedItemsData();
    setPlaybackTabs([itemsData[0]]); // For now, just open first item (would be combined playlist in real app)
    setActiveTabIndex(0);
    setSelectedItems(new Set());
    setIsMultiSelectModalOpen(false);
  };

  // Handle multiple tabs
  const handleMultipleTabs = () => {
    const itemsData = getSelectedItemsData();
    setPlaybackTabs(itemsData);
    setActiveTabIndex(0);
    setSelectedItems(new Set());
    setIsMultiSelectModalOpen(false);
  };

  const handlePlaylistClick = (playlist: Playlist) => {
    // Set the playlist in playback context
    setOpenPlaylist(playlist);
    
    // Find a library item to open with the playlist
    if (playlist.clipIds.length > 0) {
      // Find the item and fixture for the first clip
      let foundItem: { item: LibraryItem; fixture: Fixture } | null = null;
      
      allFixtures.forEach(fixture => {
        if (foundItem) return;
        const items = getLibraryItemsByFixture(fixture.id);
        items.forEach(item => {
          if (foundItem) return;
          // For demo purposes, just use the first item from the first fixture
          // In a real app, clipIds would map to actual clip IDs
          if (!foundItem) {
            foundItem = { item, fixture };
          }
        });
      });
      
      if (foundItem) {
        handleItemClick(foundItem.item, foundItem.fixture);
      }
    }
    
    console.log('Opening playlist:', playlist.name, 'with', playlist.clipIds.length, 'clips');
  };

  const shouldShowItem = (itemId: string) => {
    if (filteredContent.showAll) return true;
    return filteredContent.items?.has(itemId);
  };

  const shouldShowFixture = (fixtureId: string) => {
    if (filteredContent.showAll) return true;
    return filteredContent.fixtures?.has(fixtureId);
  };

  // Check if an item is already in a custom folder
  const isItemInCustomFolder = (itemId: string): boolean => {
    return Object.values(customFolders).some(folder => folder.items.includes(itemId));
  };

  // Folder management handlers
  const handleFolderRightClick = (e: React.MouseEvent, folderName: string, folderType: 'season' | 'team' | 'fixture', folderId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Right-click on folder:', folderName, 'type:', folderType, 'id:', folderId);
    setContextMenu({ x: e.clientX, y: e.clientY, folderName, folderType, folderId: folderId || folderName });
  };

  const handleCreateSubfolder = () => {
    console.log('Create subfolder clicked, contextMenu:', contextMenu);
    if (!contextMenu) return;
    setFolderDialog({ isOpen: true, mode: 'create', parentFolder: contextMenu.folderId });
    console.log('Setting folderDialog isOpen to true');
    setContextMenu(null);
  };

  const handleRenameFolder = () => {
    console.log('Rename folder clicked, contextMenu:', contextMenu);
    if (!contextMenu) return;
    setFolderDialog({ isOpen: true, mode: 'rename', currentName: contextMenu.folderName, folderId: contextMenu.folderId });
    setContextMenu(null);
  };

  const handleDeleteFolder = () => {
    console.log('Delete folder clicked, contextMenu:', contextMenu);
    if (!contextMenu) return;
    setDeleteDialog({ isOpen: true, folderName: contextMenu.folderName, folderId: contextMenu.folderId });
    setContextMenu(null);
  };

  const handleConfirmCreateFolder = (name: string) => {
    console.log('Confirming create folder:', name, 'parent:', folderDialog.parentFolder);
    if (!folderDialog.parentFolder) return;
    const folderId = `custom-${Date.now()}`;
    setCustomFolders(prev => ({
      ...prev,
      [folderId]: {
        name,
        parentId: folderDialog.parentFolder || null,
        items: []
      }
    }));
    console.log('Created subfolder:', name, 'under', folderDialog.parentFolder, 'with id:', folderId);
    console.log('Custom folders after create:', customFolders);
  };

  const handleConfirmRenameFolder = (newName: string) => {
    console.log('Confirming rename folder to:', newName);
    if (!folderDialog.folderId) return;
    setCustomFolders(prev => {
      const updated = { ...prev };
      if (updated[folderDialog.folderId!]) {
        updated[folderDialog.folderId!].name = newName;
      }
      return updated;
    });
    console.log('Renamed folder to:', newName);
  };

  const handleConfirmDeleteFolder = () => {
    console.log('Confirming delete folder:', deleteDialog.folderId);
    if (!deleteDialog.folderId) return;
    setCustomFolders(prev => {
      const updated = { ...prev };
      delete updated[deleteDialog.folderId!];
      return updated;
    });
    console.log('Deleted folder:', deleteDialog.folderName);
  };

  // Item rename handlers
  const handleItemRightClick = (e: React.MouseEvent, itemId: string, itemName: string) => {
    e.preventDefault();
    e.stopPropagation();
    setItemContextMenu({ x: e.clientX, y: e.clientY, itemId, itemName });
  };

  const handleRenameItem = () => {
    if (!itemContextMenu) return;
    setFolderDialog({ isOpen: true, mode: 'rename', currentName: itemContextMenu.itemName, folderId: itemContextMenu.itemId });
    setItemContextMenu(null);
  };

  const handleConfirmRenameItem = (newName: string) => {
    if (!folderDialog.folderId) return;
    setRenamedItems(prev => ({
      ...prev,
      [folderDialog.folderId!]: newName
    }));
    console.log('Renamed item to:', newName);
  };

  const handleDeleteItem = () => {
    if (!itemContextMenu) return;
    setDeleteClipModal({ isOpen: true, itemId: itemContextMenu.itemId });
    setItemContextMenu(null);
  };

  const handleConfirmDeleteItem = () => {
    if (!deleteClipModal.itemId) return;

    const itemId = deleteClipModal.itemId;
    
    // Add to deleted items
    setDeletedItems(prev => new Set([...prev, itemId]));
    
    // Show toast with undo option
    toast.success('Item removed', {
      action: {
        label: 'Undo',
        onClick: () => {
          setDeletedItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(itemId);
            return newSet;
          });
        },
      },
      duration: 5000,
      position: 'bottom-right',
    });
  };

  // Drag and drop handlers
  const [draggedItem, setDraggedItem] = useState<{ type: 'item' | 'folder'; id: string } | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, type: 'item' | 'folder', id: string) => {
    setDraggedItem({ type, id });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDropTarget(folderId);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      setDropTarget(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedItem) return;

    if (draggedItem.type === 'item') {
      // Move item to folder
      setCustomFolders(prev => {
        const updated = { ...prev };
        // Remove from old folders
        Object.keys(updated).forEach(key => {
          updated[key].items = updated[key].items.filter(id => id !== draggedItem.id);
        });
        // Add to new folder
        if (updated[targetFolderId]) {
          updated[targetFolderId].items.push(draggedItem.id);
        }
        return updated;
      });
    } else if (draggedItem.type === 'folder') {
      // Move folder into another folder
      setCustomFolders(prev => {
        const updated = { ...prev };
        if (updated[draggedItem.id]) {
          updated[draggedItem.id].parentId = targetFolderId;
        }
        return updated;
      });
    }

    setDraggedItem(null);
    setDropTarget(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDropTarget(null);
  };

  // Clip delete handlers
  const handleDeleteClipClick = (clipId: number) => {
    setDeleteClipModal({ isOpen: true, clipId });
  };

  const handleConfirmDeleteClip = () => {
    if (!deleteClipModal.clipId || !openPlaylist) return;
    
    const clipId = deleteClipModal.clipId;
    const playlistId = openPlaylist.id;
    
    // Remove clip from playlist
    removeClipFromPlaylist(playlistId, clipId);
    
    // Show toast with undo option
    toast.success('Clip removed from playlist', {
      action: {
        label: 'Undo',
        onClick: () => {
          addClipToPlaylist(playlistId, clipId);
        },
      },
      duration: 5000,
      position: 'bottom-right',
    });
  };

  const renderScheduleView = () => (
    <>
      {/* Saved Playlists Section */}
      {savedPlaylists.length > 0 && (
        <div>
          {/* Saved Playlists Header */}
          <div
            className={`h-[40px] flex items-center px-4 cursor-pointer transition-colors border-b ${border} ${bgHover}`}
            onClick={() => setExpandedPlaylists(!expandedPlaylists)}
          >
            <div className="w-8 shrink-0" aria-label="Select playlists">
              <Checkbox />
            </div>
            <div className={`w-8 shrink-0 flex items-center justify-center ${textSecondary}`}>
              {expandedPlaylists ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <ListViewIcon />
              <span className={`text-sm font-medium ${textPrimary}`}>Saved Playlists</span>
              <span className={`text-xs ${textSecondary}`}>· {savedPlaylists.length} Items</span>
            </div>
            <div className="w-32 min-w-[60px]"></div>
            <div className="w-24 min-w-[50px]"></div>
            <div className="w-20 min-w-[40px]"></div>
            <div className="w-20 min-w-[40px]"></div>
            <div className="w-20 min-w-[40px]"></div>
            <div className="w-24 min-w-[50px]"></div>
          </div>

          {/* Playlist Items */}
          {expandedPlaylists && savedPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              className={`h-[40px] flex items-center px-4 cursor-pointer transition-colors border-b ${border} ${bgHover}`}
              onClick={() => handlePlaylistClick(playlist)}
            >
              <div className="w-8 shrink-0" onClick={(e) => e.stopPropagation()}>
                <Checkbox />
              </div>
              <div className="w-8 shrink-0"></div>
              <div className="flex items-center gap-2 flex-1 min-w-0 pl-8">
                <VideoIcon />
                <div className="flex items-center gap-2 min-w-0">
                  <div 
                    className="w-2 h-2 rounded-full shrink-0" 
                    style={{ backgroundColor: playlist.color }}
                  ></div>
                  <span className={`text-sm ${textPrimary} truncate`}>{playlist.name}</span>
                </div>
              </div>
              <div className={`w-32 min-w-[60px] text-right text-xs ${textSecondary} truncate`}>
                {new Date(playlist.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div className="w-24 min-w-[50px] text-center">
                <span className={`inline-block px-2 py-0.5 rounded text-xs ${theme === 'dark' ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-800'} truncate`}>
                  Playlist
                </span>
              </div>
              <div className={`w-20 min-w-[40px] text-center text-xs ${textPrimary}`}>{playlist.clipIds.length}</div>
              <div className="w-20 min-w-[40px] text-center">
                <DataIcon />
              </div>
              <div className={`w-20 min-w-[40px] text-center text-xs ${textSecondary}`}>-</div>
              <div className="w-24 min-w-[50px] text-center">
                <CommentIcon />
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredContent.seasons.map((season) => {
        const fixtures = getFixturesBySeason(season);
        const isSeasonExpanded = expandedSeasons.has(season);
        const visibleFixtures = fixtures.filter(f => shouldShowFixture(f.id));

        if (visibleFixtures.length === 0 && !filteredContent.showAll) return null;

        // Get custom subfolders for this season (moved outside fixture loop)
        const seasonSubfolders = Object.entries(customFolders).filter(([id, folder]) => 
          folder.parentId === season
        );

        return (
          <div key={season}>
            {/* Season Row */}
            <div
              className={`h-[40px] flex items-center px-4 cursor-pointer transition-colors border-b ${border} ${bgHover} ${
                dropTarget === season ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => toggleSeason(season)}
              onContextMenu={(e) => handleFolderRightClick(e, `${season} Season`, 'season', season)}
              onDragOver={(e) => handleDragOver(e, season)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, season)}
            >
              <div className="w-8 shrink-0" aria-label="Select season" onClick={(e) => e.stopPropagation()}>
                <Checkbox />
              </div>
              <div className={`w-8 shrink-0 flex items-center justify-center ${textSecondary}`}>
                {isSeasonExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FolderIcon />
                <span className={`text-sm font-medium ${textPrimary}`}>{season} Season</span>
                <span className={`text-xs ${textSecondary}`}>· {visibleFixtures.length} Items</span>
              </div>
              <div className="w-32 min-w-[60px]"></div>
              <div className="w-24 min-w-[50px]"></div>
              <div className="w-20 min-w-[40px]"></div>
              <div className="w-20 min-w-[40px]"></div>
              <div className="w-20 min-w-[40px]"></div>
              <div className="w-24 min-w-[50px]"></div>
            </div>

            {/* Custom Subfolders for this season */}
            {isSeasonExpanded && seasonSubfolders.map(([folderId, folder]) => {
              const folderItems = folder.items.map(itemId => {
                // Find the library item and its fixture
                for (const fixture of allFixtures) {
                  const items = getLibraryItemsByFixture(fixture.id);
                  const foundItem = items.find(i => i.id === itemId);
                  if (foundItem) {
                    return { item: foundItem, fixture };
                  }
                }
                return null;
              }).filter((item): item is { item: LibraryItem; fixture: Fixture } => item !== null && !deletedItems.has(item.item.id));

              return (
                <SimpleCustomFolder
                  key={folderId}
                  folderId={folderId}
                  folderName={folder.name}
                  itemCount={folder.items.length}
                  paddingLeft="48px"
                  isDropTarget={dropTarget === folderId}
                  onContextMenu={handleFolderRightClick}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {/* Render items inside this custom folder */}
                  {folderItems.map(({ item, fixture }) => {
                    const displayName = renamedItems[item.id] || getItemName(item, fixture);
                    const clipCount = getClipCount(item.id);
                    
                    return (
                      <LibraryItemRow
                        key={item.id}
                        itemId={item.id}
                        itemName={getItemName(item, fixture)}
                        displayName={displayName}
                        clipCount={clipCount}
                        itemType={item.type}
                        paddingLeft="96px"
                        isSelected={selectedItems.has(item.id)}
                        onItemClick={() => handleItemClick(item, fixture)}
                        onToggleSelection={() => toggleItemSelection(item.id)}
                        onRightClick={handleItemRightClick}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        isInFolder={true}
                      />
                    );
                  })}
                </SimpleCustomFolder>
              );
            })}

            {/* Fixtures */}
            {isSeasonExpanded && visibleFixtures.map((fixture) => {
              const fixtureItems = getLibraryItemsByFixture(fixture.id);
              // Filter out items that are in custom folders AND items based on search AND deleted items
              let visibleItems = fixtureItems.filter(item => 
                shouldShowItem(item.id) && !isItemInCustomFolder(item.id) && !deletedItems.has(item.id)
              );
              // Apply sorting
              visibleItems = sortItems(visibleItems, (item) => getItemName(item, fixture));
              const isFixtureExpanded = expandedFixtures.has(fixture.id);

              if (visibleItems.length === 0 && !filteredContent.showAll) return null;

              return (
                <div key={fixture.id}>
                  {/* Fixture Row */}
                  <div
                    className={`h-[40px] flex items-center cursor-pointer transition-colors border-b ${border} ${bgHover} ${
                      dropTarget === fixture.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    style={{ paddingLeft: '48px' }}
                    onClick={() => toggleFixture(fixture.id)}
                    onContextMenu={(e) => handleFolderRightClick(e, fixture.opponent, 'fixture', fixture.id)}
                    onDragOver={(e) => handleDragOver(e, fixture.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, fixture.id)}
                  >
                    <div className="w-8 shrink-0" aria-label="Select fixture">
                      <Checkbox />
                    </div>
                    <div className={`w-8 shrink-0 flex items-center justify-center ${textSecondary}`}>
                      {isFixtureExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FolderIcon />
                      <span className={`text-sm font-medium ${textPrimary}`}>{fixture.opponent}</span>
                      <span className={`text-xs ${textSecondary}`}>· {visibleItems.length} Items</span>
                    </div>
                    <div className="w-32 min-w-[60px]"></div>
                    <div className="w-24 min-w-[50px]"></div>
                    <div className="w-20 min-w-[40px]"></div>
                    <div className="w-20 min-w-[40px]"></div>
                    <div className="w-20 min-w-[40px]"></div>
                    <div className="w-24 min-w-[50px]"></div>
                  </div>

                  {/* Library Items */}
                  {isFixtureExpanded && visibleItems.map((item) => {
                    const displayName = renamedItems[item.id] || getItemName(item, fixture);
                    const clipCount = getClipCount(item.id);
                    
                    return (
                      <LibraryItemRow
                        key={item.id}
                        itemId={item.id}
                        itemName={getItemName(item, fixture)}
                        displayName={displayName}
                        clipCount={clipCount}
                        itemType={item.type}
                        paddingLeft="96px"
                        isSelected={selectedItems.has(item.id)}
                        onItemClick={() => handleItemClick(item, fixture)}
                        onToggleSelection={() => toggleItemSelection(item.id)}
                        onRightClick={handleItemRightClick}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );

  const renderTeamView = () => (
    <>
      {allTeams.map((team) => {
        let teamItems = itemsByTeam[team] || [];
        const isTeamExpanded = expandedTeams.has(team);
        
        // Apply sorting to team items
        teamItems = sortItems(
          teamItems.map(ti => ti.item), 
          (item) => {
            const matchingTeamItem = teamItems.find(ti => ti.item.id === item.id);
            return matchingTeamItem ? getItemName(item, matchingTeamItem.fixture) : '';
          }
        ).map(sortedItem => {
          return teamItems.find(ti => ti.item.id === sortedItem.id)!;
        });
        
        // Get custom subfolders for this team
        const teamSubfolders = Object.entries(customFolders).filter(([id, folder]) => 
          folder.parentId === team
        );

        return (
          <div key={team}>
            {/* Team Row */}
            <div
              className={`h-[40px] flex items-center px-4 cursor-pointer transition-colors border-b ${border} ${bgHover} ${
                dropTarget === team ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => toggleTeam(team)}
              onContextMenu={(e) => handleFolderRightClick(e, team, 'team', team)}
              onDragOver={(e) => handleDragOver(e, team)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, team)}
            >
              <div className="w-8 shrink-0" aria-label="Select team" onClick={(e) => e.stopPropagation()}>
                <Checkbox />
              </div>
              <div className={`w-8 shrink-0 flex items-center justify-center ${textSecondary}`}>
                {isTeamExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FolderIcon />
                <span className={`text-sm font-medium ${textPrimary}`}>{team}</span>
                <span className={`text-xs ${textSecondary}`}>· {teamItems.length} Items</span>
              </div>
              <div className="w-32 min-w-[60px]"></div>
              <div className="w-24 min-w-[50px]"></div>
              <div className="w-20 min-w-[40px]"></div>
              <div className="w-20 min-w-[40px]"></div>
              <div className="w-20 min-w-[40px]"></div>
              <div className="w-24 min-w-[50px]"></div>
            </div>

            {/* Custom Subfolders for this team */}
            {isTeamExpanded && teamSubfolders.map(([folderId, folder]) => {
              const folderItems = folder.items.map(itemId => {
                // Find the library item and its fixture
                for (const fixture of allFixtures) {
                  const items = getLibraryItemsByFixture(fixture.id);
                  const foundItem = items.find(i => i.id === itemId);
                  if (foundItem) {
                    return { item: foundItem, fixture };
                  }
                }
                return null;
              }).filter((item): item is { item: LibraryItem; fixture: Fixture } => item !== null && !deletedItems.has(item.item.id));

              return (
                <SimpleCustomFolder
                  key={folderId}
                  folderId={folderId}
                  folderName={folder.name}
                  itemCount={folder.items.length}
                  paddingLeft="48px"
                  isDropTarget={dropTarget === folderId}
                  onContextMenu={handleFolderRightClick}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {/* Render items inside this custom folder */}
                  {folderItems.map(({ item, fixture }) => {
                    const displayName = renamedItems[item.id] || getItemName(item, fixture);
                    const clipCount = getClipCount(item.id);
                    
                    return (
                      <LibraryItemRow
                        key={item.id}
                        itemId={item.id}
                        itemName={getItemName(item, fixture)}
                        displayName={displayName}
                        clipCount={clipCount}
                        itemType={item.type}
                        paddingLeft="96px"
                        isSelected={selectedItems.has(item.id)}
                        extraInfo={`(${fixture.season})`}
                        onItemClick={() => handleItemClick(item, fixture)}
                        onToggleSelection={() => toggleItemSelection(item.id)}
                        onRightClick={handleItemRightClick}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        isInFolder={true}
                      />
                    );
                  })}
                </SimpleCustomFolder>
              );
            })}

            {/* Team Items */}
            {isTeamExpanded && teamItems
              .filter(({ item }) => !isItemInCustomFolder(item.id) && !deletedItems.has(item.id))
              .map(({ item, fixture }) => {
              const displayName = renamedItems[item.id] || getItemName(item, fixture);
              const clipCount = getClipCount(item.id);
              
              return (
                <LibraryItemRow
                  key={`${fixture.id}-${item.id}`}
                  itemId={item.id}
                  itemName={getItemName(item, fixture)}
                  displayName={displayName}
                  clipCount={clipCount}
                  itemType={item.type}
                  paddingLeft="48px"
                  isSelected={selectedItems.has(item.id)}
                  extraInfo={`(${fixture.season})`}
                  onItemClick={() => handleItemClick(item, fixture)}
                  onToggleSelection={() => toggleItemSelection(item.id)}
                  onRightClick={handleItemRightClick}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );

  const renderRecentView = () => {
    // Get all items with their fixtures and sort by modified date
    const allItemsWithFixture: Array<{ item: LibraryItem; fixture: Fixture }> = [];
    
    allFixtures.forEach(fixture => {
      const items = getLibraryItemsByFixture(fixture.id);
      items.forEach(item => {
        allItemsWithFixture.push({ item, fixture });
      });
    });
    
    // Sort by modifiedDate (most recent first) or by column sort
    if (!sortColumn) {
      allItemsWithFixture.sort((a, b) => {
        const dateA = new Date(a.item.modifiedDate || a.item.date).getTime();
        const dateB = new Date(b.item.modifiedDate || b.item.date).getTime();
        return dateB - dateA;
      });
    } else {
      // Apply column sorting
      const sortedItems = sortItems(
        allItemsWithFixture.map(iwf => iwf.item),
        (item) => {
          const matchingItem = allItemsWithFixture.find(iwf => iwf.item.id === item.id);
          return matchingItem ? getItemName(item, matchingItem.fixture) : '';
        }
      );
      
      // Reorder allItemsWithFixture based on sortedItems
      const sortedWithFixture = sortedItems.map(sortedItem => {
        return allItemsWithFixture.find(iwf => iwf.item.id === sortedItem.id)!;
      });
      
      allItemsWithFixture.length = 0;
      allItemsWithFixture.push(...sortedWithFixture);
    }

    // Add saved playlists at the top
    return (
      <>
        {/* Saved Playlists Section */}
        {savedPlaylists.length > 0 && (
          <>
            {savedPlaylists.map((playlist) => (
              <div
                key={playlist.id}
                className={`h-[48px] flex items-center px-4 cursor-pointer transition-colors border-b ${border} ${bgHover}`}
                onClick={() => handlePlaylistClick(playlist)}
              >
                <div className="w-8 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <Checkbox />
                </div>
                <div className="w-8 shrink-0"></div>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <VideoIcon />
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: playlist.color }}
                    ></div>
                    <span className={`text-sm ${textPrimary}`}>{playlist.name}</span>
                  </div>
                </div>
                <div className={`w-32 text-right text-xs ${textSecondary}`}>
                  {new Date(playlist.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="w-24 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs ${theme === 'dark' ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-800'}`}>
                    Playlist
                  </span>
                </div>
                <div className={`w-20 text-center text-xs ${textPrimary}`}>{playlist.clipIds.length}</div>
                <div className="w-20 text-center">
                  <DataIcon />
                </div>
                <div className={`w-20 text-center text-xs ${textSecondary}`}>-</div>
                <div className="w-24 text-center">
                  <CommentIcon />
                </div>
              </div>
            ))}
          </>
        )}

        {/* All Items Sorted by Modified Date */}
        {allItemsWithFixture.filter(({ item }) => !deletedItems.has(item.id)).map(({ item, fixture }) => {
          const itemName = getItemName(item, fixture);
          const clipCount = getClipCount(item.id);
          const modifiedDate = new Date(item.modifiedDate || item.date);
          const now = new Date();
          const daysAgo = Math.floor((now.getTime() - modifiedDate.getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <div
              key={item.id}
              className={`h-[48px] flex items-center px-4 cursor-pointer transition-colors border-b ${border} ${bgHover}`}
            >
              <div className="w-8 shrink-0" aria-label="Select item">
                <Checkbox
                  checked={selectedItems.has(item.id)}
                  onCheckedChange={() => toggleItemSelection(item.id)}
                />
              </div>
              <div className="w-8 shrink-0"></div>
              <div 
                className="flex items-center gap-2 flex-1 min-w-0"
                onClick={() => handleItemClick(item, fixture)}
              >
                <div className="w-12 h-8 rounded overflow-hidden shrink-0" style={{ backgroundColor: '#4CAF50' }}>
                  <img src={imgThumbnail} alt={itemName} className="w-full h-full object-cover" />
                </div>
                <span className={`text-sm truncate ${textPrimary}`}>{itemName}</span>
              </div>
              <div className={`w-32 text-right text-xs ${textSecondary}`}>
                {daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`}
              </div>
              <div className={`w-24 text-center text-xs ${textSecondary}`}>
                {typeLabels[item.type]}
              </div>
              <div className={`w-20 flex items-center justify-center text-xs ${textPrimary}`}>
                {clipCount}
              </div>
              <div className="w-20 flex items-center justify-center" aria-label="Data available">
                <DataIcon />
              </div>
              <div className={`w-20 flex items-center justify-center gap-1 text-xs ${textSecondary}`}>
                <VideoIcon />
                <span>2</span>
              </div>
              <div className={`w-24 flex items-center justify-center gap-1 text-xs ${textSecondary}`}>
                <CommentIcon />
                <span>{Math.floor(Math.random() * 10)}</span>
              </div>
            </div>
          );
        })}
      </>
    );
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
                <span className={textSecondary}>
                  {viewMode === 'team' ? 'By Team' : viewMode === 'date' ? 'Recent' : 'By Schedule'}
                </span>
              </div>
            </div>

            <div className="flex-1 flex items-center gap-2 px-4">
              <Button variant="ghost" size="sm" className="p-1">
                <FilterIcon />
              </Button>
              <SearchBarWithSuggestions
                placeholder="Search or filter…"
                value={searchTerm}
                onChange={setSearchTerm}
                suggestions={searchSuggestions}
              />
            </div>

            <div className="flex items-center gap-2">
              {selectedItems.size > 0 && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleOpenSelected}
                  className="text-xs"
                >
                  Open ({selectedItems.size})
                </Button>
              )}
              {/* Panel Toggle Controls */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsLibraryOpen(!isLibraryOpen)}
                className={`text-xs p-1.5 ${!isLibraryOpen ? 'opacity-50' : ''}`}
                title={isLibraryOpen ? "Close Library" : "Open Library"}
              >
                <LibraryIcon />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsVideoPlayerOpen(!isVideoPlayerOpen)}
                className={`text-xs p-1.5 ${!isVideoPlayerOpen ? 'opacity-50' : ''}`}
                title={isVideoPlayerOpen ? "Close Video Player" : "Open Video Player"}
              >
                <VideoIcon />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsGridOpen(!isGridOpen)}
                className={`text-xs p-1.5 ${!isGridOpen ? 'opacity-50' : ''}`}
                title={isGridOpen ? "Close Grid" : "Open Grid"}
              >
                <GridViewIcon />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                className={`text-xs p-1.5 ${!isFilterPanelOpen ? 'opacity-50' : ''}`}
                title={isFilterPanelOpen ? "Close Filters" : "Open Filters"}
              >
                <FilterIcon />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                className={`text-xs p-1.5 ${!isRightPanelOpen ? 'opacity-50' : ''}`}
                title={isRightPanelOpen ? "Close Details" : "Open Details"}
              >
                <PanelRightOpen className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setPlaybackTabs([]);
                  setActiveTabIndex(0);
                }}
                className="text-xs p-1"
              >
                <CloseIcon />
              </Button>
              <Button variant="ghost" size="sm" className={`p-1.5 ${listGridView === 'list' ? bgHover : ''}`} onClick={() => setListGridView('list')}>
                <ListViewIcon />
              </Button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Section: Library (Left) and Video Player (Right) */}
            {(isLibraryOpen || isVideoPlayerOpen || playbackTabs.length > 0) && (
              <div className={`${isGridOpen ? 'h-1/2' : 'flex-1'} flex`}>
                {/* Both panels open - use resizable */}
                {isLibraryOpen && isVideoPlayerOpen && (
                  <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={50} minSize={30} maxSize={70}>
                      <div className={`h-full flex flex-col ${bgSecondary}`}>
                        {/* Filter Chips */}
                        <div className={`${bgSecondary} border-b ${border} h-12 flex items-center gap-2 px-4`}>
                          <button
                            onClick={() => setViewMode('date')}
                            className={`px-3 py-1 text-xs rounded-full border ${border} transition-colors ${
                              viewMode === 'date' ? (theme === 'dark' ? 'bg-[#2D333A]' : 'bg-gray-200') : ''
                            }`}
                          >
                            Recent
                          </button>
                          <button
                            onClick={() => setViewMode('schedule')}
                            className={`px-3 py-1 text-xs rounded-full border ${border} transition-colors ${
                              viewMode === 'schedule' ? (theme === 'dark' ? 'bg-[#2D333A]' : 'bg-gray-200') : ''
                            }`}
                          >
                            By Schedule
                          </button>
                          <button
                            onClick={() => setViewMode('team')}
                            className={`px-3 py-1 text-xs rounded-full border ${border} transition-colors ${
                              viewMode === 'team' ? (theme === 'dark' ? 'bg-[#2D333A]' : 'bg-gray-200') : ''
                            }`}
                          >
                            By Team
                          </button>
                        </div>

                        {/* Table Header */}
                        <div className={`h-[32px] flex items-center px-4 text-xs border-b ${border} ${textSecondary}`}>
                          <div className="w-8 shrink-0" aria-label="Select all">
                            <Checkbox />
                          </div>
                          <div className="w-8 shrink-0"></div>
                          <div className="flex-1 min-w-0">Name</div>
                          <div className="w-32 min-w-[60px] text-right truncate">Modified</div>
                          <div className="w-24 min-w-[50px] text-center truncate">Type</div>
                          <div className="w-20 min-w-[40px] text-center truncate">Clips</div>
                          <div className="w-20 min-w-[40px] text-center truncate" aria-label="Data available">Data</div>
                          <div className="w-20 min-w-[40px] text-center truncate">Angles</div>
                          <div className="w-24 min-w-[50px] text-center truncate">Comments</div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto">
                          {viewMode === 'team' ? renderTeamView() : viewMode === 'date' ? renderRecentView() : renderScheduleView()}
                        </div>
                      </div>
                    </ResizablePanel>
                    
                    <ResizableHandle withHandle />
                    
                    <ResizablePanel defaultSize={50} minSize={30} maxSize={70}>
                      <div className={`h-full ${bgSecondary} m-3 ml-0 rounded-lg shadow-sm overflow-hidden flex flex-col`}>
                        {playbackTabs.length > 0 && (() => {
                          const selectedPlay = null;
                          const isGridPlay = false;
                          
                          return (
                            <>
                              <div className={`p-2 border-b ${border} shrink-0`}>
                                <div className="flex items-center justify-between">
                                  <h3 className={`font-bold text-sm ${textPrimary}`}>
                                    {isGridPlay && selectedPlay 
                                      ? `Play #${selectedPlay.id} - ${selectedPlay.team} - Q${selectedPlay.qtr}`
                                      : playbackTabs.length > 0 
                                        ? getItemName(playbackTabs[activeTabIndex].item, playbackTabs[activeTabIndex].fixture)
                                        : ''}
                                  </h3>
                                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                    {isGridPlay && selectedPlay
                                      ? selectedPlay.playType
                                      : playbackTabs.length > 0
                                        ? typeLabels[playbackTabs[activeTabIndex].item.type] || playbackTabs[activeTabIndex].item.type
                                        : ''}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex-1 relative">
                                <VideoPlayer 
                                  key={videoKey}
                                  className="absolute inset-0 w-full h-full"
                                  isPlaying={isPlaying}
                                  isFullscreen={isFullscreen}
                                  isPlayingAll={false}
                                  currentPlaylistIndex={0}
                                  filteredPlaysLength={1}
                                  currentTime={currentTime}
                                  duration={duration}
                                  onPlayPause={handlePlayPause}
                                  onFullscreen={handleFullscreen}
                                  onSeek={handleSeek}
                                  onRewind={handleRewind}
                                  onFastForward={handleFastForward}
                                  onPreviousClip={() => {}}
                                  onNextClip={() => {}}
                                  formatTime={formatTime}
                                  onClose={() => {
                                    setPlaybackTabs([]);
                                    setActiveTabIndex(0);
                                    setSelectedGridPlayId(undefined);
                                  }}
                                />
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                )}

                {/* Only library open */}
                {isLibraryOpen && !isVideoPlayerOpen && (
                  <div className={`w-full h-full flex flex-col ${bgSecondary}`}>
                    {/* Filter Chips */}
                    <div className={`${bgSecondary} border-b ${border} h-12 flex items-center gap-2 px-4`}>
                      <button
                        onClick={() => setViewMode('date')}
                        className={`px-3 py-1 text-xs rounded-full border ${border} transition-colors ${
                          viewMode === 'date' ? (theme === 'dark' ? 'bg-[#2D333A]' : 'bg-gray-200') : ''
                        }`}
                      >
                        Recent
                      </button>
                      <button
                        onClick={() => setViewMode('schedule')}
                        className={`px-3 py-1 text-xs rounded-full border ${border} transition-colors ${
                          viewMode === 'schedule' ? (theme === 'dark' ? 'bg-[#2D333A]' : 'bg-gray-200') : ''
                        }`}
                      >
                        By Schedule
                      </button>
                      <button
                        onClick={() => setViewMode('team')}
                        className={`px-3 py-1 text-xs rounded-full border ${border} transition-colors ${
                          viewMode === 'team' ? (theme === 'dark' ? 'bg-[#2D333A]' : 'bg-gray-200') : ''
                        }`}
                      >
                        By Team
                      </button>
                    </div>

                    {/* Table Header */}
                    <div className={`h-[32px] flex items-center px-4 text-xs border-b ${border} ${textSecondary}`}>
                      <div className="w-8 shrink-0" aria-label="Select all">
                        <Checkbox />
                      </div>
                      <div className="w-8 shrink-0"></div>
                      <div className="flex-1 min-w-0">Name</div>
                      <div className="w-32 min-w-[60px] text-right truncate">Modified</div>
                      <div className="w-24 min-w-[50px] text-center truncate">Type</div>
                      <div className="w-20 min-w-[40px] text-center truncate">Clips</div>
                      <div className="w-20 min-w-[40px] text-center truncate" aria-label="Data available">Data</div>
                      <div className="w-20 min-w-[40px] text-center truncate">Angles</div>
                      <div className="w-24 min-w-[50px] text-center truncate">Comments</div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto">
                      {viewMode === 'team' ? renderTeamView() : viewMode === 'date' ? renderRecentView() : renderScheduleView()}
                    </div>
                  </div>
                )}

                {/* Only video player open */}
                {!isLibraryOpen && isVideoPlayerOpen && (
                  <div className={`w-full h-full ${bgSecondary}`}>
                    <VideoPlaybackView
                      tabs={playbackTabs.map(({ item, fixture }) => ({
                        id: item.id,
                        title: getItemName(item, fixture),
                        type: item.type,
                      }))}
                      activeTabIndex={activeTabIndex}
                      onTabChange={setActiveTabIndex}
                      onClose={() => {
                        setPlaybackTabs([]);
                        setActiveTabIndex(0);
                      }}
                    />
                  </div>
                )}

                {/* Both panels collapsed but video content exists */}
                {!isLibraryOpen && !isVideoPlayerOpen && playbackTabs.length > 0 && (
                  <div className={`w-full h-full ${bgSecondary}`}>
                    <VideoPlaybackView
                      tabs={playbackTabs.map(({ item, fixture }) => ({
                        id: item.id,
                        title: getItemName(item, fixture),
                        type: item.type,
                      }))}
                      activeTabIndex={activeTabIndex}
                      onTabChange={setActiveTabIndex}
                      onClose={() => {
                        setPlaybackTabs([]);
                        setActiveTabIndex(0);
                        setSelectedGridPlayId(undefined);
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Bottom Section: Grid (Full Width) */}
            {isGridOpen && (
              <div className={`${(isLibraryOpen || isVideoPlayerOpen || playbackTabs.length > 0) ? 'h-1/2' : 'flex-1'} ${bgSecondary} border-t ${border}`}>
                <PlaysGrid 
                  onRowClick={handleGridRowClick}
                  selectedPlayId={selectedGridPlayId}
                  activePlaylist={openPlaylist}
                  onDeleteClip={handleDeleteClipClick}
                  filteredPlays={openPlaylist ? mockPlays.filter(play => openPlaylist.clipIds.includes(play.id)) : mockPlays.slice(0, 100)}
                />
              </div>
            )}
          </div>

          {/* Multi-Select Playback Modal */}
          <MultiSelectPlaybackModal
            isOpen={isMultiSelectModalOpen}
            onClose={() => setIsMultiSelectModalOpen(false)}
            itemCount={selectedItems.size}
            onCombined={handleCombinedPlayback}
            onMultipleTabs={handleMultipleTabs}
          />

          {/* Context Menu for Folders */}
          {contextMenu && (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              items={[
                {
                  label: 'Create Subfolder',
                  onClick: handleCreateSubfolder,
                  icon: <FolderPlus className="w-4 h-4" />
                },
                {
                  label: 'Rename',
                  onClick: handleRenameFolder,
                  icon: <Edit2 className="w-4 h-4" />
                },
                {
                  label: 'Delete',
                  onClick: handleDeleteFolder,
                  icon: <Trash2 className="w-4 h-4" />,
                  danger: true
                }
              ]}
              onClose={() => setContextMenu(null)}
            />
          )}

          {/* Context Menu for Items */}
          {itemContextMenu && (
            <ContextMenu
              x={itemContextMenu.x}
              y={itemContextMenu.y}
              items={[
                {
                  label: 'Rename',
                  onClick: handleRenameItem,
                  icon: <Edit2 className="w-4 h-4" />
                },
                {
                  label: 'Delete',
                  onClick: handleDeleteItem,
                  icon: <Trash2 className="w-4 h-4" />,
                  danger: true
                }
              ]}
              onClose={() => setItemContextMenu(null)}
            />
          )}

          {/* Folder Create/Rename Dialog */}
          <FolderDialog
            isOpen={folderDialog.isOpen}
            onClose={() => setFolderDialog({ isOpen: false, mode: 'create' })}
            onConfirm={(name) => {
              if (folderDialog.mode === 'create') {
                handleConfirmCreateFolder(name);
              } else if (folderDialog.folderId && folderDialog.folderId.startsWith('custom-')) {
                handleConfirmRenameFolder(name);
              } else {
                handleConfirmRenameItem(name);
              }
            }}
            title={folderDialog.mode === 'create' ? 'Create Subfolder' : `Rename ${folderDialog.folderId?.startsWith('custom-') ? 'Folder' : 'Item'}`}
            initialValue={folderDialog.currentName || ''}
            confirmLabel={folderDialog.mode === 'create' ? 'Create' : 'Rename'}
          />

          {/* Delete Confirmation Dialog */}
          <DeleteConfirmDialog
            isOpen={deleteDialog.isOpen}
            onClose={() => setDeleteDialog({ isOpen: false })}
            onConfirm={handleConfirmDeleteFolder}
            title="Delete Folder"
            message={`Are you sure you want to delete "${deleteDialog.folderName}"? This action cannot be undone.`}
          />

          {/* Delete Clip Modal */}
          <DeleteClipModal
            isOpen={deleteClipModal.isOpen}
            onClose={() => setDeleteClipModal({ isOpen: false })}
            onConfirm={deleteClipModal.itemId ? handleConfirmDeleteItem : handleConfirmDeleteClip}
            clipCount={1}
          />
        </>
      ) : (
        <>
          {/* Header - Match Clip Search */}
          <div className={`${bgSecondary} border-b ${border} h-12 flex items-center px-4`}>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="p-1">
                <MenuIcon />
              </Button>
              <div className={`h-4 w-px ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              <div className="flex items-center gap-1 text-sm">
                <span className={`font-bold ${textPrimary}`}>Library</span>
                <span className={textSecondary}>
                  {viewMode === 'team' ? 'By Team' : viewMode === 'date' ? 'Recent' : 'By Schedule'}
                </span>
              </div>
            </div>

            <div className="flex-1 flex items-center gap-2 px-4">
              <Button variant="ghost" size="sm" className="p-1">
                <FilterIcon />
              </Button>
              <SearchBarWithSuggestions
                placeholder="Search or filter…"
                value={searchTerm}
                onChange={setSearchTerm}
                suggestions={searchSuggestions}
              />
            </div>

            <div className="flex items-center gap-2">
              {selectedItems.size > 0 && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleOpenSelected}
                  className="text-xs"
                >
                  Open ({selectedItems.size})
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                className={`text-xs p-1.5 ${!isFilterPanelOpen ? 'opacity-50' : ''}`}
                title={isFilterPanelOpen ? "Close Filters" : "Open Filters"}
              >
                <FilterIcon />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                className={`text-xs p-1.5 ${!isRightPanelOpen ? 'opacity-50' : ''}`}
                title={isRightPanelOpen ? "Close Details" : "Open Details"}
              >
                <PanelRightOpen className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className={`p-1.5 ${listGridView === 'grid' ? bgHover : ''}`} onClick={() => setListGridView('grid')}>
                <GridViewIcon />
              </Button>
              <Button variant="ghost" size="sm" className={`p-1.5 ${listGridView === 'list' ? bgHover : ''}`} onClick={() => setListGridView('list')}>
                <ListViewIcon />
              </Button>
            </div>
          </div>

          {/* Filter Chips */}
          <div className={`${bgSecondary} border-b ${border} h-12 flex items-center gap-2 px-4`}>
            <button
              onClick={() => setViewMode('date')}
              className={`px-3 py-1 text-xs rounded-full border ${border} transition-colors ${
                viewMode === 'date' ? (theme === 'dark' ? 'bg-[#2D333A]' : 'bg-gray-200') : ''
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setViewMode('schedule')}
              className={`px-3 py-1 text-xs rounded-full border ${border} transition-colors ${
                viewMode === 'schedule' ? (theme === 'dark' ? 'bg-[#2D333A]' : 'bg-gray-200') : ''
              }`}
            >
              By Schedule
            </button>
            <button
              onClick={() => setViewMode('team')}
              className={`px-3 py-1 text-xs rounded-full border ${border} transition-colors ${
                viewMode === 'team' ? (theme === 'dark' ? 'bg-[#2D333A]' : 'bg-gray-200') : ''
              }`}
            >
              By Team
            </button>
          </div>

          {/* Main Content Area - Flex Column for Library and Grid */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Library Section */}
            {isLibraryOpen && (
              <div className={`${isGridOpen ? 'h-1/2' : 'flex-1'} flex flex-col ${bgSecondary}`}>
                {/* Table Header */}
                <div className={`h-[32px] flex items-center px-4 text-xs border-b ${border} ${textSecondary}`}>
                  <div className="w-8 shrink-0" aria-label="Select all">
                    <Checkbox />
                  </div>
                  <div className="w-8 shrink-0"></div>
                  <button 
                    className="flex-1 min-w-0 flex items-center gap-1 hover:text-current cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <span>Name</span>
                    <SortIcon direction={sortColumn === 'name' ? sortDirection : null} />
                  </button>
                  <button 
                    className="w-32 text-right flex items-center justify-end gap-1 hover:text-current cursor-pointer"
                    onClick={() => handleSort('modified')}
                  >
                    <span>Modified</span>
                    <SortIcon direction={sortColumn === 'modified' ? sortDirection : null} />
                  </button>
                  <button 
                    className="w-24 text-center flex items-center justify-center gap-1 hover:text-current cursor-pointer"
                    onClick={() => handleSort('type')}
                  >
                    <span>Type</span>
                    <SortIcon direction={sortColumn === 'type' ? sortDirection : null} />
                  </button>
                  <button 
                    className="w-20 text-center flex items-center justify-center gap-1 hover:text-current cursor-pointer"
                    onClick={() => handleSort('clips')}
                  >
                    <span>Clips</span>
                    <SortIcon direction={sortColumn === 'clips' ? sortDirection : null} />
                  </button>
                  <div className="w-20 text-center" aria-label="Data available">Data</div>
                  <div className="w-20 text-center">Angles</div>
                  <div className="w-24 text-center">Comments</div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto">
                  {viewMode === 'team' ? renderTeamView() : viewMode === 'date' ? renderRecentView() : renderScheduleView()}
                </div>
              </div>
            )}

            {/* Grid Section */}
            {isGridOpen && (
              <div className={`${isLibraryOpen ? 'h-1/2' : 'flex-1'} ${bgSecondary} border-t ${border}`}>
                <ResizablePanelGroup direction="horizontal" className="h-full">
                  {/* Filter Panel */}
                  {isFilterPanelOpen && (
                    <>
                      <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                        <div className={`h-full ${bgSecondary} border-r ${border} p-4 overflow-y-auto`}>
                          <h3 className={`text-sm font-bold ${textPrimary} mb-4`}>Filters</h3>
                          <div className="space-y-4">
                            <div>
                              <label className={`text-xs ${textSecondary} mb-2 block`}>Play Type</label>
                              <div className="space-y-2">
                                {['Pass', 'Run', 'Special'].map(type => (
                                  <label key={type} className="flex items-center gap-2">
                                    <Checkbox />
                                    <span className={`text-xs ${textPrimary}`}>{type}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className={`text-xs ${textSecondary} mb-2 block`}>Quarter</label>
                              <div className="space-y-2">
                                {['Q1', 'Q2', 'Q3', 'Q4'].map(qtr => (
                                  <label key={qtr} className="flex items-center gap-2">
                                    <Checkbox />
                                    <span className={`text-xs ${textPrimary}`}>{qtr}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </ResizablePanel>
                      <ResizableHandle withHandle />
                    </>
                  )}

                  {/* Main Grid */}
                  <ResizablePanel defaultSize={isFilterPanelOpen && isRightPanelOpen ? 60 : isFilterPanelOpen || isRightPanelOpen ? 80 : 100}>
                    <PlaysGrid 
                      onRowClick={handleGridRowClick}
                      selectedPlayId={selectedGridPlayId}
                      activePlaylist={openPlaylist}
                      onDeleteClip={handleDeleteClipClick}
                      filteredPlays={openPlaylist ? mockPlays.filter(play => openPlaylist.clipIds.includes(play.id)) : undefined}
                    />
                  </ResizablePanel>

                  {/* Right Details Panel */}
                  {isRightPanelOpen && selectedGridPlayId && (
                    <>
                      <ResizableHandle withHandle />
                      <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                        <div className={`h-full ${bgSecondary} border-l ${border} p-4 overflow-y-auto`}>
                          <h3 className={`text-sm font-bold ${textPrimary} mb-4`}>Play Details</h3>
                          <div className="space-y-3">
                            <div>
                              <span className={`text-xs ${textSecondary}`}>Play #:</span>
                              <p className={`text-sm ${textPrimary}`}>{selectedGridPlayId}</p>
                            </div>
                            <div>
                              <span className={`text-xs ${textSecondary}`}>Team:</span>
                              <p className={`text-sm ${textPrimary}`}>{mockPlays.find(p => p.id === selectedGridPlayId)?.team}</p>
                            </div>
                            <div>
                              <span className={`text-xs ${textSecondary}`}>Quarter:</span>
                              <p className={`text-sm ${textPrimary}`}>Q{mockPlays.find(p => p.id === selectedGridPlayId)?.qtr}</p>
                            </div>
                            <div>
                              <span className={`text-xs ${textSecondary}`}>Play Type:</span>
                              <p className={`text-sm ${textPrimary}`}>{mockPlays.find(p => p.id === selectedGridPlayId)?.playType}</p>
                            </div>
                            <div className="pt-4">
                              <Button size="sm" className="w-full">Add to Playlist</Button>
                            </div>
                            <div>
                              <Button size="sm" variant="outline" className="w-full">View Tags</Button>
                            </div>
                            <div>
                              <Button size="sm" variant="outline" className="w-full">Add Note</Button>
                            </div>
                          </div>
                        </div>
                      </ResizablePanel>
                    </>
                  )}
                </ResizablePanelGroup>
              </div>
            )}
          </div>

          {/* Multi-Select Playback Modal */}
          <MultiSelectPlaybackModal
            isOpen={isMultiSelectModalOpen}
            onClose={() => setIsMultiSelectModalOpen(false)}
            itemCount={selectedItems.size}
            onCombined={handleCombinedPlayback}
            onMultipleTabs={handleMultipleTabs}
          />

          {/* Context Menu for Folders */}
          {contextMenu && (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              items={[
                {
                  label: 'Create Subfolder',
                  onClick: handleCreateSubfolder,
                  icon: <FolderPlus className="w-4 h-4" />
                },
                {
                  label: 'Rename',
                  onClick: handleRenameFolder,
                  icon: <Edit2 className="w-4 h-4" />
                },
                {
                  label: 'Delete',
                  onClick: handleDeleteFolder,
                  icon: <Trash2 className="w-4 h-4" />,
                  danger: true
                }
              ]}
              onClose={() => setContextMenu(null)}
            />
          )}

          {/* Context Menu for Items */}
          {itemContextMenu && (
            <ContextMenu
              x={itemContextMenu.x}
              y={itemContextMenu.y}
              items={[
                {
                  label: 'Rename',
                  onClick: handleRenameItem,
                  icon: <Edit2 className="w-4 h-4" />
                },
                {
                  label: 'Delete',
                  onClick: handleDeleteItem,
                  icon: <Trash2 className="w-4 h-4" />,
                  danger: true
                }
              ]}
              onClose={() => setItemContextMenu(null)}
            />
          )}

          {/* Folder Create/Rename Dialog */}
          <FolderDialog
            isOpen={folderDialog.isOpen}
            onClose={() => setFolderDialog({ isOpen: false, mode: 'create' })}
            onConfirm={(name) => {
              if (folderDialog.mode === 'create') {
                handleConfirmCreateFolder(name);
              } else if (folderDialog.folderId && folderDialog.folderId.startsWith('custom-')) {
                handleConfirmRenameFolder(name);
              } else {
                handleConfirmRenameItem(name);
              }
            }}
            title={folderDialog.mode === 'create' ? 'Create Subfolder' : `Rename ${folderDialog.folderId?.startsWith('custom-') ? 'Folder' : 'Item'}`}
            initialValue={folderDialog.currentName || ''}
            confirmLabel={folderDialog.mode === 'create' ? 'Create' : 'Rename'}
          />

          {/* Delete Confirmation Dialog */}
          <DeleteConfirmDialog
            isOpen={deleteDialog.isOpen}
            onClose={() => setDeleteDialog({ isOpen: false })}
            onConfirm={handleConfirmDeleteFolder}
            title="Delete Folder"
            message={`Are you sure you want to delete "${deleteDialog.folderName}"? This action cannot be undone.`}
          />
        </>
      )}
    </div>
  );
};