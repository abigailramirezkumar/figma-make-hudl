import React, { useState, useEffect, useMemo } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './ui/resizable';
import { VideoPlayer } from './VideoPlayer';
import { mockPlays } from './footballData';
import { mockTags, mockNotes, currentUser, Tag, Note } from './playDetailsData';
import { SkipBackIcon, SkipForwardIcon, StopIcon, CloseIcon, MenuIcon, FilterIcon, SearchIcon, PanelLeft } from './icons';
import { Input } from './ui/input';
import { TagsTab, NotesTab } from './tabs';
import { PlaylistDropdown } from './PlaylistDropdown';
import { ContextMenu } from './ContextMenu';
import { useTheme } from './ThemeContext';
import { usePlaylistContext } from './PlaylistContext';
import { usePlaybackContext } from './PlaybackContext';
import { toast } from 'sonner@2.0.3';
import { Trash2, PanelRightOpen } from 'lucide-react';
import { SaveToPlaylistModal } from './SaveToPlaylistModal';
import { SharePlaylistModal } from './SharePlaylistModal';
import {
  mockPlaylists, mockPlaylistMemberships, mockShareActivities,
  Playlist, PlaylistMembership, ShareActivity, createPlaylist
} from './playlistData';

interface VideoPlaybackViewProps {
  sourceTitle?: string;
  sourceDate?: string;
  sourceDuration?: string;
  tabs?: Array<{ id: string; title: string; type: string }>;
  activeTabIndex?: number;
  onTabChange?: (index: number) => void;
  onClose: () => void;
}

export const VideoPlaybackView: React.FC<VideoPlaybackViewProps> = ({
  sourceTitle,
  sourceDate,
  sourceDuration,
  tabs,
  activeTabIndex,
  onTabChange,
  onClose,
}) => {
  const { theme } = useTheme();
  const { removeClipFromPlaylist, addClipToPlaylist, playlists: contextPlaylists } = usePlaylistContext();
  const { openPlaylist } = usePlaybackContext();
  
  const [selectedPlayId, setSelectedPlayId] = useState<number>(mockPlays[0]?.id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingAll, setIsPlayingAll] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(45);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState<'play-info' | 'tags' | 'notes'>('play-info');
  const [tags, setTags] = useState<Tag[]>(mockTags);
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [playlists] = useState<Playlist[]>(mockPlaylists);
  const [playlistMemberships] = useState<PlaylistMembership[]>(mockPlaylistMemberships);
  const [shareActivities] = useState<ShareActivity[]>(mockShareActivities);
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    column: string;
    value: any;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Checkbox selection state
  const [selectedClipIds, setSelectedClipIds] = useState<Set<number>>(new Set());
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [createdPlaylistForSharing, setCreatedPlaylistForSharing] = useState<Playlist | null>(null);

  // Get the active playlist from context
  const activePlaylist = openPlaylist ? contextPlaylists.find(p => p.id === openPlaylist.id) : null;

  // Filter plays based on active playlist
  const playlistFilteredPlays = useMemo(() => {
    if (activePlaylist) {
      // Only show plays that are in the playlist
      return mockPlays.filter(play => activePlaylist.clipIds.includes(play.id));
    }
    return mockPlays;
  }, [activePlaylist]);

  // Close context menu when clicking anywhere
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Filter plays based on column filters and search term
  const filteredPlays = useMemo(() => {
    let filtered = [...playlistFilteredPlays];

    // Apply search term filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(play => 
        play.team.toLowerCase().includes(term) ||
        play.odk.toLowerCase().includes(term) ||
        play.playType.toLowerCase().includes(term) ||
        play.offPlay.toLowerCase().includes(term) ||
        play.playFamily.toLowerCase().includes(term) ||
        play.hash.toLowerCase().includes(term) ||
        play.date.toLowerCase().includes(term) ||
        String(play.id).includes(term)
      );
    }

    // Apply column filters
    Object.entries(columnFilters).forEach(([column, values]) => {
      if (values && values.length > 0) {
        filtered = filtered.filter(play => {
          let playValue = '';
          switch (column) {
            case 'Play #': playValue = String(play.id); break;
            case 'Team': playValue = play.team; break;
            case 'Date': playValue = play.date; break;
            case 'Time': playValue = play.time; break;
            case 'QTR': playValue = String(play.qtr); break;
            case 'ODK': playValue = play.odk; break;
            case 'DN': playValue = String(play.dn); break;
            case 'DIST': playValue = String(play.dist); break;
            case 'YARD LN': playValue = String(play.yardLine); break;
            case 'GN/LS': playValue = String(play.gnls); break;
            case 'EFF': playValue = play.eff; break;
            case 'OFF STR': playValue = play.offStr; break;
            case 'OFF FORM': playValue = play.offForm; break;
            case 'OFF PLAY': playValue = play.offPlay; break;
            case 'PLAY FAMILY': playValue = play.playFamily; break;
            case 'PLAY DIR': playValue = play.playDir; break;
            case 'HASH': playValue = play.hash; break;
            case 'PLAY TYPE': playValue = play.playType; break;
            default: playValue = '';
          }
          return values.includes(playValue);
        });
      }
    });

    return filtered;
  }, [playlistFilteredPlays, columnFilters, searchTerm]);

  const selectedPlay = filteredPlays.find(p => p.id === selectedPlayId);

  // Active filter chips
  const activeFilterChips = useMemo(() => {
    const chips: string[] = [];
    Object.entries(columnFilters).forEach(([column, values]) => {
      if (values && values.length > 0) {
        chips.push(`${column}: ${values.join(', ')}`);
      }
    });
    return chips;
  }, [columnFilters]);

  const removeFilterChip = (chip: string) => {
    const columnFilterMatch = chip.match(/^([^:]+):/);
    if (columnFilterMatch) {
      const columnName = columnFilterMatch[1];
      const { [columnName]: _, ...rest } = columnFilters;
      setColumnFilters(rest);
    }
  };

  const clearAllFilters = () => {
    setColumnFilters({});
  };

  const handleCellRightClick = (e: React.MouseEvent, column: string, value: any) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      column,
      value
    });
  };

  const getUniqueColumnValues = (column: string): string[] => {
    const values = new Set<string>();
    mockPlays.forEach(play => {
      let val = '';
      switch (column) {
        case 'Play #': val = String(play.id); break;
        case 'Team': val = play.team; break;
        case 'Date': val = play.date; break;
        case 'Time': val = play.time; break;
        case 'QTR': val = String(play.qtr); break;
        case 'ODK': val = play.odk; break;
        case 'DN': val = String(play.dn); break;
        case 'DIST': val = String(play.dist); break;
        case 'YARD LN': val = String(play.yardLine); break;
        case 'GN/LS': val = String(play.gnls); break;
        case 'EFF': val = play.eff; break;
        case 'OFF STR': val = play.offStr; break;
        case 'OFF FORM': val = play.offForm; break;
        case 'OFF PLAY': val = play.offPlay; break;
        case 'PLAY FAMILY': val = play.playFamily; break;
        case 'PLAY DIR': val = play.playDir; break;
        case 'HASH': val = play.hash; break;
        case 'PLAY TYPE': val = play.playType; break;
        default: val = '';
      }
      values.add(val);
    });
    return Array.from(values).sort((a, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b);
    });
  };

  const handleToggleColumnValue = (column: string, value: string) => {
    setColumnFilters(prev => {
      const currentValues = prev[column] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      // If all values are unchecked, remove the filter entirely
      if (newValues.length === 0) {
        const { [column]: _, ...rest } = prev;
        return rest;
      }
      
      return {
        ...prev,
        [column]: newValues
      };
    });
  };

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
  
  const handlePreviousClip = () => {
    if (currentPlaylistIndex > 0) {
      const newIndex = currentPlaylistIndex - 1;
      setCurrentPlaylistIndex(newIndex);
      setSelectedPlayId(mockPlays[newIndex].id);
      setCurrentTime(0);
    }
  };
  
  const handleNextClip = () => {
    if (currentPlaylistIndex < mockPlays.length - 1) {
      const newIndex = currentPlaylistIndex + 1;
      setCurrentPlaylistIndex(newIndex);
      setSelectedPlayId(mockPlays[newIndex].id);
      setCurrentTime(0);
    }
  };

  const handleRowClick = (playId: number) => {
    setSelectedPlayId(playId);
    const newIndex = mockPlays.findIndex(p => p.id === playId);
    if (newIndex !== -1) {
      setCurrentPlaylistIndex(newIndex);
    }
    setIsRightPanelOpen(true);
    setCurrentTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddTag = (text: string, color: string) => {
    const newTag: Tag = {
      id: tags.length + 1,
      text,
      color,
      addedBy: currentUser.name,
      addedAt: new Date().toISOString(),
    };
    setTags([...tags, newTag]);
  };

  const handleRemoveTag = (tagId: number) => {
    setTags(tags.filter(tag => tag.id !== tagId));
  };

  const handleAddNote = (text: string, isLocked: boolean) => {
    const newNote: Note = {
      id: notes.length + 1,
      text,
      author: currentUser.name,
      role: currentUser.role,
      timestamp: new Date().toISOString(),
      isLocked,
    };
    setNotes([...notes, newNote]);
  };

  // Handle deleting a clip from the playlist
  const handleDeleteClipFromPlaylist = (clipId: number) => {
    if (!activePlaylist) return;

    // Store the removed clip for undo
    removeClipFromPlaylist(activePlaylist.id, clipId);

    // Show toast with undo option
    toast.success('Clip removed from playlist', {
      action: {
        label: 'Undo',
        onClick: () => {
          addClipToPlaylist(activePlaylist.id, clipId);
        },
      },
      duration: 5000,
      position: 'bottom-right',
    });
  };

  // Checkbox selection handlers
  const toggleClipSelection = (clipId: number) => {
    const newSelected = new Set(selectedClipIds);
    if (newSelected.has(clipId)) {
      newSelected.delete(clipId);
    } else {
      newSelected.add(clipId);
    }
    setSelectedClipIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedClipIds.size === filteredPlays.length) {
      setSelectedClipIds(new Set());
    } else {
      setSelectedClipIds(new Set(filteredPlays.map(p => p.id)));
    }
  };

  const handleSaveToExistingPlaylist = (playlistId: string) => {
    const playlist = contextPlaylists.find(p => p.id === playlistId);
    if (!playlist) return;

    selectedClipIds.forEach(clipId => {
      addClipToPlaylist(playlistId, clipId);
    });

    toast.success(`${selectedClipIds.size} clip${selectedClipIds.size !== 1 ? 's' : ''} added to "${playlist.name}"`, {
      position: 'bottom-right',
    });

    setSelectedClipIds(new Set());
  };

  const handleCreateAndSavePlaylist = (name: string, description: string, isPublic: boolean) => {
    const newPlaylist = createPlaylist(name, description, currentUser.id, isPublic);
    
    selectedClipIds.forEach(clipId => {
      addClipToPlaylist(newPlaylist.id, clipId);
    });

    toast.success(`Playlist "${name}" created with ${selectedClipIds.size} clip${selectedClipIds.size !== 1 ? 's' : ''}`, {
      action: {
        label: 'Share',
        onClick: () => {
          setCreatedPlaylistForSharing(newPlaylist);
          setIsShareModalOpen(true);
        },
      },
      duration: 5000,
      position: 'bottom-right',
    });

    setSelectedClipIds(new Set());
  };

  const handleSharePlaylist = (userIds: string[], message: string) => {
    // Simulate sharing the playlist
    toast.success(`Playlist shared with ${userIds.length} member${userIds.length !== 1 ? 's' : ''}`, {
      position: 'bottom-right',
    });

    setCreatedPlaylistForSharing(null);
  };

  useEffect(() => {
    if (isPlaying && currentTime >= duration) {
      handleNextClip();
    }
  }, [currentTime, duration, isPlaying]);

  const bg = theme === 'dark' ? 'bg-[#1a1d24]' : 'bg-gray-50';
  const bgSecondary = theme === 'dark' ? 'bg-[#1e2129]' : 'bg-white';
  const border = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const textPrimary = theme === 'dark' ? 'text-gray-200' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`h-full ${bg} flex flex-col`}>
      {/* Top Navigation Bar */}
      <div className={`${bgSecondary} border-b ${border} h-12 flex items-center px-4 gap-3`}>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-1"
          onClick={onClose}
          title="Back to Library"
        >
          <MenuIcon />
        </Button>
        <div className={`h-4 w-px ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-1"
          onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
          title="Toggle Filters"
        >
          <FilterIcon />
        </Button>
        <Input
          type="text"
          placeholder="Search clips..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`flex-1 h-8 ${theme === 'dark' ? 'bg-[#252830]' : 'bg-gray-100'}`}
        />
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-1"
          onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
          title="Toggle Right Panel"
        >
          <PanelRightOpen className="w-4 h-4" />
        </Button>
      </div>

      {/* Active Filters Bar */}
      {activeFilterChips.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-blue-900 font-medium">
              Active Filters ({activeFilterChips.length}):
            </span>
            {activeFilterChips.map((chip, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer flex items-center gap-1"
                onClick={() => removeFilterChip(chip)}
              >
                {chip}
                <span className="ml-1 text-blue-600">×</span>
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-800 text-sm h-6"
              onClick={clearAllFilters}
            >
              Clear All
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Video and Grid Area */}
          <ResizablePanel defaultSize={isRightPanelOpen ? 70 : 100} minSize={50}>
            <ResizablePanelGroup direction="vertical" className="h-full">
              {/* Video Player */}
              <ResizablePanel defaultSize={60} minSize={30}>
                <div className={`h-full flex flex-col ${bgSecondary} m-3 rounded-lg shadow-sm overflow-hidden`}>
                  <div className={`p-2 border-b ${border} shrink-0`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`font-bold text-sm ${textPrimary}`}>
                        Play #{selectedPlayId} - Q{selectedPlay?.qtr}
                      </h3>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        Playing {currentPlaylistIndex + 1} of {mockPlays.length}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-1 relative">
                    <VideoPlayer 
                      className="absolute inset-0 w-full h-full"
                      isPlaying={isPlaying}
                      isFullscreen={isFullscreen}
                      isPlayingAll={isPlayingAll}
                      currentPlaylistIndex={currentPlaylistIndex}
                      filteredPlaysLength={mockPlays.length}
                      currentTime={currentTime}
                      duration={duration}
                      onPlayPause={handlePlayPause}
                      onFullscreen={handleFullscreen}
                      onSeek={handleSeek}
                      onRewind={handleRewind}
                      onFastForward={handleFastForward}
                      onPreviousClip={handlePreviousClip}
                      onNextClip={handleNextClip}
                      formatTime={formatTime}
                    />
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              {/* Clips Grid */}
              <ResizablePanel defaultSize={40} minSize={20}>
                <div className={`h-full flex flex-col ${bgSecondary} m-3 mt-0 rounded-lg shadow-sm overflow-hidden`}>
                  {/* Toolbar with bulk actions */}
                  {selectedClipIds.size > 0 && (
                    <div className={`px-4 py-2 border-b ${border} flex items-center justify-between ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>
                        {selectedClipIds.size} clip{selectedClipIds.size !== 1 ? 's' : ''} selected
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsSaveModalOpen(true)}
                        >
                          Save to Playlist
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setSelectedClipIds(new Set())}
                          variant="ghost"
                        >
                          Clear Selection
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Grid Header */}
                  <div className={`overflow-auto flex-1`}>
                    <table className="w-full">
                      <thead className={`${theme === 'dark' ? 'bg-[#1e2129]' : 'bg-gray-50'} border-b ${border} sticky top-0 z-10`}>
                        <tr>
                          <th className="w-8 p-2">
                            <Checkbox 
                              checked={selectedClipIds.size === filteredPlays.length && filteredPlays.length > 0}
                              onCheckedChange={toggleSelectAll}
                            />
                          </th>
                          <th className={`px-2 py-2 text-left text-xs font-medium ${textSecondary}`}>Play #</th>
                          <th className={`px-2 py-2 text-left text-xs font-medium ${textSecondary}`}>Team</th>
                          <th className={`px-2 py-2 text-left text-xs font-medium ${textSecondary}`}>Date</th>
                          <th className={`px-2 py-2 text-left text-xs font-medium ${textSecondary}`}>QTR</th>
                          <th className={`px-2 py-2 text-left text-xs font-medium ${textSecondary}`}>ODK</th>
                          <th className={`px-2 py-2 text-left text-xs font-medium ${textSecondary}`}>DN</th>
                          <th className={`px-2 py-2 text-left text-xs font-medium ${textSecondary}`}>DIST</th>
                          <th className={`px-2 py-2 text-left text-xs font-medium ${textSecondary}`}>Play Type</th>
                          <th className={`px-2 py-2 text-left text-xs font-medium ${textSecondary}`}>Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPlays.map((play) => (
                          <tr
                            key={play.id}
                            className={`border-b ${border} cursor-pointer transition-colors ${
                              selectedPlayId === play.id
                                ? theme === 'dark'
                                  ? 'bg-blue-900/30'
                                  : 'bg-blue-50'
                                : theme === 'dark'
                                ? 'hover:bg-[#252830]'
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => handleRowClick(play.id)}
                          >
                            <td className="p-2" onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={selectedClipIds.has(play.id)}
                                onCheckedChange={() => toggleClipSelection(play.id)}
                              />
                            </td>
                            <td className={`px-2 py-2 text-xs ${textPrimary}`}>{play.id}</td>
                            <td className={`px-2 py-2 text-xs ${textPrimary}`}>{play.team}</td>
                            <td className={`px-2 py-2 text-xs ${textSecondary}`}>{play.date}</td>
                            <td className={`px-2 py-2 text-xs ${textSecondary}`}>Q{play.qtr}</td>
                            <td className={`px-2 py-2 text-xs ${textSecondary}`}>{play.odk}</td>
                            <td className={`px-2 py-2 text-xs ${textSecondary}`}>{play.dn}</td>
                            <td className={`px-2 py-2 text-xs ${textSecondary}`}>{play.dist}</td>
                            <td className={`px-2 py-2 text-xs ${textSecondary}`}>{play.playType}</td>
                            <td className={`px-2 py-2 text-xs ${textSecondary}`}>{play.gnls}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          {/* Right Panel - Details */}
          {isRightPanelOpen && selectedPlay && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
                <div className={`h-full ${bgSecondary} m-3 ml-0 rounded-lg shadow-sm flex flex-col`}>
                  {/* Tabs */}
                  <div className={`flex border-b ${border}`}>
                    <button
                      className={`flex-1 px-4 py-3 text-sm transition-colors ${
                        rightPanelTab === 'play-info'
                          ? theme === 'dark' 
                            ? 'border-b-2 border-blue-400 text-blue-400' 
                            : 'border-b-2 border-blue-600 text-blue-600'
                          : theme === 'dark'
                            ? 'text-gray-400 hover:text-gray-200'
                            : 'text-gray-600 hover:text-gray-800'
                      }`}
                      onClick={() => setRightPanelTab('play-info')}
                    >
                      Play Info
                    </button>
                    <button
                      className={`flex-1 px-4 py-3 text-sm transition-colors ${
                        rightPanelTab === 'tags'
                          ? theme === 'dark' 
                            ? 'border-b-2 border-blue-400 text-blue-400' 
                            : 'border-b-2 border-blue-600 text-blue-600'
                          : theme === 'dark'
                            ? 'text-gray-400 hover:text-gray-200'
                            : 'text-gray-600 hover:text-gray-800'
                      }`}
                      onClick={() => setRightPanelTab('tags')}
                    >
                      Tags
                    </button>
                    <button
                      className={`flex-1 px-4 py-3 text-sm transition-colors ${
                        rightPanelTab === 'notes'
                          ? theme === 'dark' 
                            ? 'border-b-2 border-blue-400 text-blue-400' 
                            : 'border-b-2 border-blue-600 text-blue-600'
                          : theme === 'dark'
                            ? 'text-gray-400 hover:text-gray-200'
                            : 'text-gray-600 hover:text-gray-800'
                      }`}
                      onClick={() => setRightPanelTab('notes')}
                    >
                      Notes
                    </button>
                    <button
                      className={`px-3 py-3 ${textSecondary} ${theme === 'dark' ? 'hover:text-gray-200' : 'hover:text-gray-600'}`}
                      onClick={() => setIsRightPanelOpen(false)}
                    >
                      <div className="w-4 h-4">
                        <CloseIcon />
                      </div>
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="flex-1 overflow-y-auto p-4">
                    {rightPanelTab === 'play-info' && (
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className={`text-sm ${textSecondary}`}>Add to Playlist</h4>
                          </div>
                          <PlaylistDropdown 
                            playId={selectedPlay.id}
                            playlists={playlists}
                            playlistMemberships={playlistMemberships}
                            shareActivities={shareActivities}
                          />
                        </div>
                        <div className={`border-t ${border} pt-4`}>
                          <h4 className={`text-sm ${textSecondary} mb-3`}>Play Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className={textSecondary}>Team:</span>
                              <span className={textPrimary}>{selectedPlay.team}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className={textSecondary}>Date:</span>
                              <span className={textPrimary}>{selectedPlay.date}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className={textSecondary}>Quarter:</span>
                              <span className={textPrimary}>Q{selectedPlay.qtr}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className={textSecondary}>Down:</span>
                              <span className={textPrimary}>{selectedPlay.dn}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className={textSecondary}>Distance:</span>
                              <span className={textPrimary}>{selectedPlay.dist}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className={textSecondary}>Play Type:</span>
                              <span className={textPrimary}>{selectedPlay.playType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className={textSecondary}>Result:</span>
                              <span className={textPrimary}>{selectedPlay.gnls} yards</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {rightPanelTab === 'tags' && (
                      <TagsTab
                        tags={tags}
                        onAddTag={handleAddTag}
                        onRemoveTag={handleRemoveTag}
                      />
                    )}
                    {rightPanelTab === 'notes' && (
                      <NotesTab
                        notes={notes}
                        currentUser={currentUser}
                        onAddNote={handleAddNote}
                      />
                    )}
                  </div>
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          column={contextMenu.column}
          availableValues={getUniqueColumnValues(contextMenu.column)}
          selectedValues={columnFilters[contextMenu.column] || []}
          onToggleValue={handleToggleColumnValue}
        />
      )}

      {/* Save to Playlist Modal */}
      <SaveToPlaylistModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        selectedClipIds={Array.from(selectedClipIds)}
        existingPlaylists={contextPlaylists}
        onSaveToExisting={handleSaveToExistingPlaylist}
        onCreateNew={handleCreateAndSavePlaylist}
      />

      {/* Share Playlist Modal */}
      <SharePlaylistModal
        isOpen={isShareModalOpen}
        onClose={() => {
          setIsShareModalOpen(false);
          setCreatedPlaylistForSharing(null);
        }}
        playlistName={createdPlaylistForSharing?.name || ''}
        onShare={handleSharePlaylist}
      />
    </div>
  );
};