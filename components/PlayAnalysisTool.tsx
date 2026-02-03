import React, { useState, useEffect, useMemo } from 'react';
import imgEllipse29 from "figma:asset/50c97dfdb270535a62ef7aa9580f23e12a5ecf74.png";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./ui/resizable";
import { mockPlays } from "./footballData";
import { 
  seasons, weeks, championships, getTeamsByChampionship, sideOfBallOptions, playTypes, results, 
  downOptions, distanceOptions, quarterbacks, players, FilterState, defaultFilters
} from './filterData';
import { mockTags, mockNotes, currentUser, Tag, Note } from './playDetailsData';
import {
  mockShareActivities,
  createPlaylist, addClipToPlaylist, shareClip, Playlist, PlaylistMembership, ShareActivity
} from './playlistData';
import { usePlaylistContext } from './PlaylistContext';
import { 
  MenuIcon, FilterIcon, SearchIcon, ChevronDownIcon, PlayIcon, StopIcon, 
  SkipBackIcon, SkipForwardIcon, StarIcon, ChevronLeft, ChevronRight, PanelLeft, ListVideo, CloseIcon
} from './icons';
import { FilterSection, AutocompleteInput, SearchableSelect, RangeSlider } from './ui-components';
import { VideoPlayer } from './VideoPlayer';
import { TagsTab, NotesTab } from './tabs';
import { PlaylistDropdown } from './PlaylistDropdown';
import { PlayerProfileView } from './PlayerProfileView';
import Frame15216 from '../imports/Frame15216';
import { InteractiveFilterPanel } from './InteractiveFilterPanel';
import { ContextMenu } from './ContextMenu';
import { AddMetricModal } from './AddMetricModal';
import { SearchBarWithSuggestions } from './SearchBarWithSuggestions';
import { useTheme } from './ThemeContext';
import { Settings } from './icons';
import { ColumnSettingsModal, ColumnVisibility, defaultColumnVisibility } from './ColumnSettingsModal';
import { EditableCell } from './EditableCell';

interface PlayAnalysisToolProps {}

export const PlayAnalysisTool: React.FC<PlayAnalysisToolProps> = () => {
  const { theme } = useTheme();
  const { playlists, setPlaylists, playlistMemberships, setPlaylistMemberships } = usePlaylistContext();
  
  // Theme variables
  const bg = theme === 'dark' ? 'bg-[#1a1d24]' : 'bg-gray-50';
  const bgSecondary = theme === 'dark' ? 'bg-[#1e2129]' : 'bg-white';
  const bgTertiary = theme === 'dark' ? 'bg-[#252830]' : 'bg-gray-100';
  const bgHover = theme === 'dark' ? 'hover:bg-[#252830]' : 'hover:bg-gray-100';
  const border = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';
  const borderLight = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const textPrimary = theme === 'dark' ? 'text-gray-200' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const textLight = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  
  const [selectedPlayIds, setSelectedPlayIds] = useState<number[]>([]);
  const [playlistToPlay, setPlaylistToPlay] = useState<number[]>([]); // IDs of plays to play in sequence
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(45);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');
  const [rightPanelTab, setRightPanelTab] = useState<'playlist' | 'play-info' | 'tags' | 'notes' | 'player-profile'>('play-info');
  const [isFilterPanelCollapsed, setIsFilterPanelCollapsed] = useState(true);
  const [isRightPanelClosed, setIsRightPanelClosed] = useState(false);
  const [viewMode, setViewMode] = useState<'find' | 'play-all'>('find');
  const [tags, setTags] = useState<Tag[]>(mockTags);
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [shareActivities, setShareActivities] = useState<ShareActivity[]>(mockShareActivities);
  const [selectedPlayerForProfile, setSelectedPlayerForProfile] = useState<string | null>(null);
  const [previousRightPanelTab, setPreviousRightPanelTab] = useState<'playlist' | 'play-info' | 'tags' | 'notes'>('play-info');
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    column: string;
    value: any;
  } | null>(null);
  const [editingCell, setEditingCell] = useState<{
    playId: number;
    column: string;
  } | null>(null);
  const [isAddMetricModalOpen, setIsAddMetricModalOpen] = useState(false);
  const [metricFilters, setMetricFilters] = useState<Record<string, string[]>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Game Range': true, 'Play Type': true, 'Situation': true, 'Player Involvement': true, 'Media & Tag': true,
    'Field Related': true, 'Formation': true, 'Personnel Grouping': true,
    'Coverage': true, 'Performance': true, 'Play Result & Analysis': true, 'Pass Specific': true, 'Run Specific': true, 'Special Teams': true,
  });
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(defaultColumnVisibility);
  const [isColumnSettingsOpen, setIsColumnSettingsOpen] = useState(false);
  const [isSavePlaylistDialogOpen, setIsSavePlaylistDialogOpen] = useState(false);
  const [savePlaylistName, setSavePlaylistName] = useState('');
  const [savePlaylistDescription, setSavePlaylistDescription] = useState('');
  const [isPlaylistView, setIsPlaylistView] = useState(false);
  const [currentPlaylistId, setCurrentPlaylistId] = useState<string | null>(null);
  
  // Filter set management
  const [savedFilterSets, setSavedFilterSets] = useState<Array<{
    id: string;
    name: string;
    filters: FilterState;
    metricFilters: Record<string, string[]>;
    createdAt: string;
  }>>([]);
  const [isSaveFilterDialogOpen, setIsSaveFilterDialogOpen] = useState(false);
  const [isLoadFilterDialogOpen, setIsLoadFilterDialogOpen] = useState(false);
  const [filterSetName, setFilterSetName] = useState('');

  const availableTeams = useMemo(() => getTeamsByChampionship(filters.championship), [filters.championship]);

  useEffect(() => {
    if (filters.team && !availableTeams.includes(filters.team)) {
      setFilters(prev => ({ ...prev, team: '' }));
    }
  }, [filters.championship, filters.team, availableTeams]);

  const filteredPlays = useMemo(() => {
    let filtered = [...mockPlays];

    if (searchTerm) {
      filtered = filtered.filter(play => 
        play.offPlay.toLowerCase().includes(searchTerm.toLowerCase()) ||
        play.playFamily.toLowerCase().includes(searchTerm.toLowerCase()) ||
        play.player?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        play.qbName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        play.team.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.team) {
      filtered = filtered.filter(play => 
        play.team.toLowerCase().includes(filters.team.toLowerCase())
      );
    }

    // Filter by multiple players - show clips for ANY selected player (OR logic)
    if (filters.player.length > 0) {
      filtered = filtered.filter(play => 
        filters.player.some(selectedPlayer => 
          play.opponent.toLowerCase().includes(selectedPlayer.toLowerCase()) ||
          play.player?.toLowerCase().includes(selectedPlayer.toLowerCase())
        )
      );
    }

    if (filters.sideOfBall) {
      filtered = filtered.filter(play => play.odk === filters.sideOfBall);
    }

    if (filters.clipSource !== 'All') {
      filtered = filtered.filter(play => play.clipSource === filters.clipSource);
    }

    if (filters.playType !== 'All') {
      filtered = filtered.filter(play => play.playType === filters.playType);
    }

    if (filters.result !== 'All') {
      filtered = filtered.filter(play => play.result === filters.result);
    }

    if (filters.selectedDowns.length > 0) {
      filtered = filtered.filter(play => {
        const downString = `${play.dn}${play.dn === 1 ? 'st' : play.dn === 2 ? 'nd' : play.dn === 3 ? 'rd' : 'th'}`;
        return filters.selectedDowns.includes(downString);
      });
    }

    if (filters.selectedDistances.length > 0) {
      filtered = filtered.filter(play => {
        return filters.selectedDistances.some(distanceRange => {
          if (distanceRange === 'Short (<3)') return play.dist < 3;
          if (distanceRange === 'Medium (4-6)') return play.dist >= 4 && play.dist <= 6;
          if (distanceRange === 'Long (7-10)') return play.dist >= 7 && play.dist <= 10;
          if (distanceRange === 'Very Long (11+)') return play.dist > 10;
          return false;
        });
      });
    }

    if (filters.playerInvolved) {
      filtered = filtered.filter(play => 
        play.player?.toLowerCase().includes(filters.playerInvolved.toLowerCase())
      );
    }

    if (filters.qbName) {
      filtered = filtered.filter(play => 
        play.qbName?.toLowerCase().includes(filters.qbName.toLowerCase())
      );
    }

    // Apply column filters
    Object.entries(columnFilters).forEach(([column, values]) => {
      if (values && values.length > 0) {
        filtered = filtered.filter(play => {
          switch (column) {
            case 'Play #': return values.includes(String(play.id));
            case 'Team': return values.includes(play.team);
            case 'Date': return values.includes(play.date);
            case 'Time': return values.includes(play.time);
            case 'QTR': return values.includes(String(play.qtr));
            case 'ODK': return values.includes(play.odk);
            case 'DN': return values.includes(String(play.dn));
            case 'DIST': return values.includes(String(play.dist));
            case 'YARD LN': return values.includes(String(play.yardLn));
            case 'GN/LS': return values.includes(String(play.gnLs));
            case 'EFF': return values.includes(play.eff);
            case 'OFF STR': return values.includes(play.offStr);
            case 'OFF FORM': return values.includes(play.offForm);
            case 'OFF PLAY': return values.includes(play.offPlay);
            case 'PLAY FAMILY': return values.includes(play.playFamily);
            case 'PLAY DIR': return values.includes(play.playDir);
            case 'HASH': return values.includes(play.hash);
            case 'PLAY TYPE': return values.includes(play.playType);
            default: return true;
          }
        });
      }
    });

    filtered = filtered.filter(play => {
      return play.qtr >= filters.gameRelated.quarter[0] && play.qtr <= filters.gameRelated.quarter[1] &&
             play.yardLn >= filters.fieldRelated.yardLine[0] && play.yardLn <= filters.fieldRelated.yardLine[1] &&
             play.gnLs >= filters.performance.yardsGained[0] && play.gnLs <= filters.performance.yardsGained[1];
    });

    return filtered;
  }, [mockPlays, searchTerm, filters, columnFilters]);

  useEffect(() => {
    if (selectedPlayIds.length > 0) {
      setIsPlaying(true);
      setCurrentTime(0);
    }
  }, [selectedPlayIds]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && selectedPlayIds.length > 0) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            if (isPlayingAll && currentPlaylistIndex < filteredPlays.length - 1) {
              setCurrentPlaylistIndex(prev => prev + 1);
              setSelectedPlayIds([filteredPlays[currentPlaylistIndex + 1].id]);
              return 0;
            } else if (isPlayingAll) {
              setIsPlayingAll(false);
              setCurrentPlaylistIndex(0);
            }
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedPlayIds, duration, isPlayingAll, currentPlaylistIndex, filteredPlays]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle Escape key to exit fullscreen
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen().catch(err => {
          console.log('Error exiting fullscreen:', err);
        });
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);

  // Close context menu when clicking anywhere
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const activeFilterChips = useMemo(() => {
    const chips: string[] = [];
    
    if (filters.season !== 'All') chips.push(`Season: ${filters.season}`);
    if (filters.week !== 'All') chips.push(filters.week);
    if (filters.championship !== 'All') chips.push(`Championship: ${filters.championship}`);
    if (filters.team) chips.push(`Team: ${filters.team}`);
    if (filters.player.length > 0) {
      filters.player.forEach(player => chips.push(`Player: ${player}`));
    }
    if (filters.sideOfBall) chips.push(`Side: ${filters.sideOfBall}`);
    if (filters.playType !== 'All') chips.push(`Type: ${filters.playType}`);
    if (filters.result !== 'All') chips.push(`Result: ${filters.result}`);
    if (filters.selectedDowns.length > 0) chips.push(`Down: ${filters.selectedDowns.join(', ')}`);
    if (filters.selectedDistances.length > 0) chips.push(`Distance: ${filters.selectedDistances.join(', ')}`);
    if (filters.playerInvolved) chips.push(`Player Involved: ${filters.playerInvolved}`);
    if (filters.qbName) chips.push(`QB: ${filters.qbName}`);
    
    // Add all column filters
    Object.entries(columnFilters).forEach(([column, values]) => {
      if (values && values.length > 0) {
        chips.push(`${column}: ${values.join(', ')}`);
      }
    });
    if (filters.hasNotes) chips.push('Has Notes');
    if (filters.hasComments) chips.push('Has Comments');

    if (filters.formation.offensiveFormation !== 'All') chips.push(`Formation: ${filters.formation.offensiveFormation}`);
    if (filters.coverage.coverageType !== 'All') chips.push(`Coverage: ${filters.coverage.coverageType}`);
    if (filters.fieldRelated.redZone) chips.push('Red Zone');
    if (filters.fieldRelated.goalLine) chips.push('Goal Line');
    if (filters.formation.motionUsed) chips.push('Motion');
    if (filters.coverage.blitzPresent) chips.push('Blitz');

    return chips;
  }, [filters, columnFilters]);

  const activeFilterCount = activeFilterChips.length;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const removeFilterChip = (chip: string) => {
    // Check if it's a column filter (contains a colon and comma/multiple values)
    const columnFilterMatch = chip.match(/^([^:]+):/);
    if (columnFilterMatch) {
      const columnName = columnFilterMatch[1];
      // List of all possible column filters
      const columnFiltersKeys = ['Play #', 'Team', 'Date', 'Time', 'QTR', 'ODK', 'DN', 'DIST', 'YARD LN', 'GN/LS', 'EFF', 'OFF STR', 'OFF FORM', 'OFF PLAY', 'PLAY FAMILY', 'PLAY DIR', 'HASH', 'PLAY TYPE'];
      
      if (columnFiltersKeys.includes(columnName)) {
        const { [columnName]: _, ...rest } = columnFilters;
        setColumnFilters(rest);
        return;
      }
    }
    
    // Handle regular filters
    if (chip.startsWith('Season:')) setFilters(prev => ({ ...prev, season: 'All' }));
    else if (chip.startsWith('Week')) setFilters(prev => ({ ...prev, week: 'All' }));
    else if (chip.startsWith('Championship:')) setFilters(prev => ({ ...prev, championship: 'All' }));
    else if (chip.startsWith('Team:')) setFilters(prev => ({ ...prev, team: '' }));
    else if (chip.startsWith('Side:')) setFilters(prev => ({ ...prev, sideOfBall: null }));
    else if (chip.startsWith('Type:')) setFilters(prev => ({ ...prev, playType: 'All' }));
    else if (chip.startsWith('Result:')) setFilters(prev => ({ ...prev, result: 'All' }));
    else if (chip.startsWith('Down:')) setFilters(prev => ({ ...prev, selectedDowns: [] }));
    else if (chip.startsWith('Distance:')) setFilters(prev => ({ ...prev, selectedDistances: [] }));
    else if (chip.startsWith('Player Involved:')) setFilters(prev => ({ ...prev, playerInvolved: '' }));
    else if (chip.startsWith('Player:')) {
      // Extract player name from chip and remove just that player
      const playerName = chip.replace('Player: ', '');
      setFilters(prev => ({ ...prev, player: prev.player.filter(p => p !== playerName) }));
    }
    else if (chip.startsWith('QB:')) setFilters(prev => ({ ...prev, qbName: '' }));
    else if (chip === 'Has Notes') setFilters(prev => ({ ...prev, hasNotes: false }));
    else if (chip === 'Has Comments') setFilters(prev => ({ ...prev, hasComments: false }));
    else if (chip.startsWith('Formation:')) setFilters(prev => ({ ...prev, formation: { ...prev.formation, offensiveFormation: 'All' } }));
    else if (chip.startsWith('Coverage:')) setFilters(prev => ({ ...prev, coverage: { ...prev.coverage, coverageType: 'All' } }));
    else if (chip === 'Red Zone') setFilters(prev => ({ ...prev, fieldRelated: { ...prev.fieldRelated, redZone: false } }));
    else if (chip === 'Goal Line') setFilters(prev => ({ ...prev, fieldRelated: { ...prev.fieldRelated, goalLine: false } }));
    else if (chip === 'Motion') setFilters(prev => ({ ...prev, formation: { ...prev.formation, motionUsed: false } }));
    else if (chip === 'Blitz') setFilters(prev => ({ ...prev, coverage: { ...prev.coverage, blitzPresent: false } }));
  };

  const clearAllFilters = () => {
    setFilters(defaultFilters);
    setSearchTerm('');
    setColumnFilters({});
    setMetricFilters({});
  };

  // Check if there are any active filters
  const hasActiveFilters = useMemo(() => {
    return JSON.stringify(filters) !== JSON.stringify(defaultFilters) || 
           Object.keys(metricFilters).some(key => metricFilters[key].length > 0);
  }, [filters, metricFilters]);

  // Save current filter set
  const handleSaveFilterSet = () => {
    if (!filterSetName.trim()) return;
    
    const newFilterSet = {
      id: `filter-${Date.now()}`,
      name: filterSetName.trim(),
      filters: { ...filters },
      metricFilters: { ...metricFilters },
      createdAt: new Date().toISOString(),
    };
    
    setSavedFilterSets(prev => [...prev, newFilterSet]);
    setFilterSetName('');
    setIsSaveFilterDialogOpen(false);
  };

  // Load a saved filter set
  const handleLoadFilterSet = (filterSet: typeof savedFilterSets[0]) => {
    setFilters(filterSet.filters);
    setMetricFilters(filterSet.metricFilters);
    setIsLoadFilterDialogOpen(false);
  };

  // Delete a saved filter set
  const handleDeleteFilterSet = (id: string) => {
    setSavedFilterSets(prev => prev.filter(fs => fs.id !== id));
  };

  const selectedPlay = filteredPlays.find(play => play.id === selectedPlayIds[0]);
  
  const handleTogglePlaySelection = (playId: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setSelectedPlayIds(prev => {
      if (prev.includes(playId)) {
        return prev.filter(id => id !== playId);
      } else {
        return [...prev, playId];
      }
    });
  };

  const handleRowClick = (playId: number) => {
    // Clicking a row selects only that play (replaces selection)
    setSelectedPlayIds([playId]);
    // Collapse left panel when selecting a play
    setIsFilterPanelCollapsed(true);
    // Re-open right panel when clicking a new row
    setIsRightPanelClosed(false);
  };

  const handleSelectAllToggle = () => {
    if (selectedPlayIds.length === filteredPlays.length && filteredPlays.length > 0) {
      // Deselect all
      setSelectedPlayIds([]);
    } else {
      // Select all filtered plays
      setSelectedPlayIds(filteredPlays.map(play => play.id));
    }
  };

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handlePlayAll = () => {
    if (filteredPlays.length === 0) return;
    setPlaylistToPlay(filteredPlays.map(p => p.id));
    setIsPlayingAll(true);
    setViewMode('play-all');
    setIsFilterPanelCollapsed(true);
    setCurrentPlaylistIndex(0);
    setSelectedPlayIds([filteredPlays[0].id]);
    setCurrentTime(0);
  };

  const handlePlaySelected = () => {
    if (selectedPlayIds.length === 0) return;
    // Sort selected IDs by their order in filteredPlays
    const orderedIds = filteredPlays
      .filter(play => selectedPlayIds.includes(play.id))
      .map(play => play.id);
    setPlaylistToPlay(orderedIds);
    setIsPlayingAll(true);
    setViewMode('play-all');
    setIsFilterPanelCollapsed(true);
    setCurrentPlaylistIndex(0);
    setSelectedPlayIds([orderedIds[0]]);
    setCurrentTime(0);
  };

  const handleStopAll = () => {
    setIsPlayingAll(false);
    setIsPlaying(false);
    setViewMode('find');
    setCurrentPlaylistIndex(0);
    setCurrentTime(0);
    setPlaylistToPlay([]);
  };

  // Get the current playlist (either all filtered plays or selected plays)
  const currentPlaylist = useMemo(() => {
    if (playlistToPlay.length > 0) {
      return filteredPlays.filter(play => playlistToPlay.includes(play.id))
        .sort((a, b) => playlistToPlay.indexOf(a.id) - playlistToPlay.indexOf(b.id));
    }
    return filteredPlays;
  }, [filteredPlays, playlistToPlay]);

  const handleNextClip = () => {
    // When in find mode with multiple selected clips, navigate through selected clips
    if (viewMode === 'find' && selectedPlayIds.length > 1) {
      const orderedSelectedIds = filteredPlays
        .filter(play => selectedPlayIds.includes(play.id))
        .map(play => play.id);
      const currentIndex = orderedSelectedIds.indexOf(selectedPlayIds[0]);
      if (currentIndex < orderedSelectedIds.length - 1) {
        setSelectedPlayIds([orderedSelectedIds[currentIndex + 1]]);
        setCurrentTime(0);
      }
    } else if (currentPlaylistIndex < currentPlaylist.length - 1) {
      setCurrentPlaylistIndex(prev => prev + 1);
      setSelectedPlayIds([currentPlaylist[currentPlaylistIndex + 1].id]);
      setCurrentTime(0);
    }
  };

  const handlePreviousClip = () => {
    // When in find mode with multiple selected clips, navigate through selected clips
    if (viewMode === 'find' && selectedPlayIds.length > 1) {
      const orderedSelectedIds = filteredPlays
        .filter(play => selectedPlayIds.includes(play.id))
        .map(play => play.id);
      const currentIndex = orderedSelectedIds.indexOf(selectedPlayIds[0]);
      if (currentIndex > 0) {
        setSelectedPlayIds([orderedSelectedIds[currentIndex - 1]]);
        setCurrentTime(0);
      }
    } else if (currentPlaylistIndex > 0) {
      setCurrentPlaylistIndex(prev => prev - 1);
      setSelectedPlayIds([currentPlaylist[currentPlaylistIndex - 1].id]);
      setCurrentTime(0);
    }
  };

  const handleFullscreen = () => {
    // VideoPlayer now handles the actual fullscreen API calls
    // This just toggles the state for UI purposes
    // The fullscreenchange event will sync the actual state
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = Math.floor(percent * duration);
    setCurrentTime(Math.max(0, Math.min(duration, newTime)));
  };

  const handleRewind = () => {
    setCurrentTime(prev => Math.max(0, prev - 10));
  };

  const handleFastForward = () => {
    setCurrentTime(prev => Math.min(duration, prev + 10));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const updateNestedFilter = <T extends keyof FilterState, K extends keyof FilterState[T]>(
    section: T,
    key: K,
    value: FilterState[T][K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const toggleArrayFilter = (key: 'selectedDowns' | 'selectedDistances', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const handleAddTag = (text: string) => {
    if (!selectedPlayIds[0]) return;
    
    const newTag: Tag = {
      id: `tag_${selectedPlayIds[0]}_${Date.now()}`,
      text,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      playId: selectedPlayIds[0]
    };
    
    setTags(prev => [...prev, newTag]);
  };

  const handleRemoveTag = (tagId: string) => {
    setTags(prev => prev.filter(tag => tag.id !== tagId));
  };

  const handleAddNote = (content: string) => {
    if (!selectedPlayIds[0]) return;
    
    const newNote: Note = {
      id: `note_${selectedPlayIds[0]}_${Date.now()}`,
      content,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      playId: selectedPlayIds[0],
      isLocked: false,
      editHistory: []
    };
    
    setNotes(prev => [...prev, newNote]);
  };

  const handleUpdateNote = (noteId: string, content: string) => {
    setNotes(prev => prev.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          editHistory: [
            ...note.editHistory,
            {
              editedBy: currentUser.id,
              editedAt: new Date().toISOString(),
              previousContent: note.content
            }
          ],
          content
        };
      }
      return note;
    }));
  };

  const handleAddToPlaylist = (playlistId: string, clipId: number) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId) {
        return {
          ...playlist,
          clipIds: [...playlist.clipIds, clipId]
        };
      }
      return playlist;
    }));

    const newMembership = addClipToPlaylist(playlistId, clipId, currentUser.id);
    setPlaylistMemberships(prev => [...prev, newMembership]);
  };

  const handleCreatePlaylist = (name: string, description: string, isPublic: boolean, clipId: number) => {
    const newPlaylist = createPlaylist(name, description, currentUser.id, isPublic, clipId);
    setPlaylists(prev => [...prev, newPlaylist]);

    const newMembership = addClipToPlaylist(newPlaylist.id, clipId, currentUser.id);
    setPlaylistMemberships(prev => [...prev, newMembership]);
  };

  const handleShareClip = (clipId: number, userId: string, message?: string) => {
    const newShare = shareClip(clipId, currentUser.id, userId, message);
    setShareActivities(prev => [...prev, newShare]);
  };

  const handleSaveAsPlaylist = () => {
    if (savePlaylistName.trim() && playlistToPlay.length > 0) {
      const newPlaylist = createPlaylist(
        savePlaylistName.trim(),
        savePlaylistDescription.trim(),
        currentUser.id,
        true,
        undefined
      );
      
      // Add all clips from the current playback queue and mark as saved playlist
      newPlaylist.clipIds = [...playlistToPlay];
      newPlaylist.type = 'saved';
      
      setPlaylists(prev => [...prev, newPlaylist]);
      
      // Add memberships for all clips
      const newMemberships = playlistToPlay.map(clipId => 
        addClipToPlaylist(newPlaylist.id, clipId, currentUser.id)
      );
      setPlaylistMemberships(prev => [...prev, ...newMemberships]);
      
      // Reset dialog state
      setSavePlaylistName('');
      setSavePlaylistDescription('');
      setIsSavePlaylistDialogOpen(false);
    }
  };

  const handleRemoveFromPlaylist = (clipId: number) => {
    if (currentPlaylistId) {
      // Remove from playlist
      setPlaylists(prev => prev.map(playlist => {
        if (playlist.id === currentPlaylistId) {
          return {
            ...playlist,
            clipIds: playlist.clipIds.filter(id => id !== clipId)
          };
        }
        return playlist;
      }));
      
      // Remove membership
      setPlaylistMemberships(prev => 
        prev.filter(m => !(m.playlistId === currentPlaylistId && m.clipId === clipId))
      );
      
      // Update current playlist to play
      setPlaylistToPlay(prev => prev.filter(id => id !== clipId));
      
      // Deselect the clip if it was selected
      setSelectedPlayIds(prev => prev.filter(id => id !== clipId));
    }
  };

  const handleRemoveSelectedFromPlaylist = () => {
    if (currentPlaylistId && selectedPlayIds.length > 0) {
      // Remove all selected clips from playlist
      setPlaylists(prev => prev.map(playlist => {
        if (playlist.id === currentPlaylistId) {
          return {
            ...playlist,
            clipIds: playlist.clipIds.filter(id => !selectedPlayIds.includes(id))
          };
        }
        return playlist;
      }));
      
      // Remove memberships
      setPlaylistMemberships(prev => 
        prev.filter(m => !(m.playlistId === currentPlaylistId && selectedPlayIds.includes(m.clipId)))
      );
      
      // Update current playlist to play
      setPlaylistToPlay(prev => prev.filter(id => !selectedPlayIds.includes(id)));
      
      // Clear selection
      setSelectedPlayIds([]);
    }
  };

  const handleLoadPlaylist = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist) {
      setCurrentPlaylistId(playlistId);
      setIsPlaylistView(true);
      setPlaylistToPlay(playlist.clipIds);
      setViewMode('play-all');
      setIsFilterPanelCollapsed(true);
      setCurrentPlaylistIndex(0);
      if (playlist.clipIds.length > 0) {
        setSelectedPlayIds([playlist.clipIds[0]]);
      }
      setCurrentTime(0);
    }
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

  const handlePlayerClick = (playerName: string) => {
    // Just show player profile in right panel without changing grid/filters
    setSelectedPlayerForProfile(playerName);
    setPreviousRightPanelTab(rightPanelTab as 'playlist' | 'play-info' | 'tags' | 'notes');
    setRightPanelTab('player-profile');
    setIsRightPanelClosed(false);
  };

  const handleBackFromPlayerProfile = () => {
    // Restore the previous right panel tab
    setRightPanelTab(previousRightPanelTab);
    setSelectedPlayerForProfile(null);
    // Keep the previous play selection intact
  };

  const handleStatClick = (statName: string) => {
    // Switch to play-all mode to show video with grid in main area
    // Player profile stays in right panel
    setViewMode('play-all');
    setIsFilterPanelCollapsed(true);
    
    // Load at least 50 plays for video playback without selecting checkboxes
    // In a real app, you would filter plays based on the stat and player
    const minClips = 50;
    const relatedPlays = filteredPlays.slice(0, Math.max(minClips, filteredPlays.length)).map(p => p.id);
    setPlaylistToPlay(relatedPlays);
    setCurrentPlaylistIndex(0);
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
        case 'YARD LN': val = String(play.yardLn); break;
        case 'GN/LS': val = String(play.gnLs); break;
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

  const getColumnValueCounts = (column: string): Map<string, number> => {
    const counts = new Map<string, number>();
    filteredPlays.forEach(play => {
      let val = '';
      switch (column) {
        case 'Play #': val = String(play.id); break;
        case 'Team': val = play.team; break;
        case 'Player': val = play.opponent; break;
        case 'Clip Source': val = play.clipSource; break;
        case 'Date': val = play.date; break;
        case 'Time': val = play.time; break;
        case 'QTR': val = String(play.qtr); break;
        case 'ODK': val = play.odk; break;
        case 'DN': val = String(play.dn); break;
        case 'DIST': val = String(play.dist); break;
        case 'YARD LN': val = String(play.yardLn); break;
        case 'GN/LS': val = String(play.gnLs); break;
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
      counts.set(val, (counts.get(val) || 0) + 1);
    });
    return counts;
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

  const handleCellDoubleClick = (playId: number, column: string) => {
    setEditingCell({ playId, column });
    setContextMenu(null); // Close context menu if open
  };

  const handleCellSave = (playId: number, column: string, newValue: string) => {
    // Update the play data
    const playIndex = mockPlays.findIndex(p => p.id === playId);
    if (playIndex !== -1) {
      const play = mockPlays[playIndex];
      
      // Update the appropriate field
      switch (column) {
        case 'Team':
          play.team = newValue;
          break;
        case 'Player':
          play.opponent = newValue;
          break;
        case 'Clip Source':
          play.clipSource = newValue as 'Scout' | 'Game' | 'Practice';
          break;
        case 'Date':
          play.date = newValue;
          break;
        case 'ODK':
          play.odk = newValue as 'Offense' | 'Defense';
          break;
        case 'EFF':
          play.eff = newValue as 'Y' | 'N';
          break;
        case 'OFF STR':
          play.offStr = newValue;
          break;
        case 'OFF FORM':
          play.offForm = newValue;
          break;
        case 'OFF PLAY':
          play.offPlay = newValue;
          break;
        case 'PLAY FAMILY':
          play.playFamily = newValue;
          break;
        case 'PLAY DIR':
          play.playDir = newValue;
          break;
        case 'HASH':
          play.hash = newValue;
          break;
        case 'PLAY TYPE':
          play.playType = newValue;
          break;
      }
    }
    
    setEditingCell(null);
  };

  const handleCellCancel = () => {
    setEditingCell(null);
  };

  const handleApplyMetricFilter = (category: string, values: string[]) => {
    setMetricFilters(prev => {
      if (values.length > 0) {
        return { ...prev, [category]: values };
      } else {
        const { [category]: _, ...rest } = prev;
        return rest;
      }
    });
    
    // Also update column filters for the data grid
    if (values.length > 0) {
      setColumnFilters(prev => ({
        ...prev,
        [category]: values
      }));
    } else {
      setColumnFilters(prev => {
        const { [category]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleRemoveMetricFilter = (category: string) => {
    setMetricFilters(prev => {
      const { [category]: _, ...rest } = prev;
      return rest;
    });
    setColumnFilters(prev => {
      const { [category]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleContextMenuFilter = (column: string, value: any) => {
    // Map column names to filter properties
    switch (column) {
      case 'Team':
        setFilters(prev => ({ ...prev, team: value }));
        break;
      case 'ODK':
        setFilters(prev => ({ ...prev, sideOfBall: value }));
        break;
      case 'Play Type':
        setFilters(prev => ({ ...prev, playType: value }));
        break;
      case 'Hash':
        setColumnFilters(prev => ({ ...prev, 'Hash': [...prev['Hash'] || [], value] }));
        break;
      case 'QTR':
        setFilters(prev => ({ 
          ...prev, 
          gameRelated: { 
            ...prev.gameRelated, 
            quarter: [value, value] 
          } 
        }));
        break;
      case 'Eff':
        // Could add effectiveness filter
        break;
      default:
        break;
    }
    setContextMenu(null);
  };

  const currentTags = selectedPlayIds[0] ? tags.filter(tag => tag.playId === selectedPlayIds[0]) : [];
  const currentNotes = selectedPlayIds[0] ? notes.filter(note => note.playId === selectedPlayIds[0]) : [];

  return (
    <div className={`h-screen ${bg} flex flex-col`}>
      {/* Header */}
      <div className={`${bgSecondary} border-b ${border} h-12 flex items-center px-4`}>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="p-1">
            <MenuIcon />
          </Button>
          <div className={`h-4 w-px ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          <div className="flex items-center gap-1 text-sm">
            <span className={`font-bold ${textPrimary}`}>Clip Search</span>
          </div>
        </div>

        <div className="flex-1 flex items-center gap-2 px-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1"
            onClick={() => setIsFilterPanelCollapsed(!isFilterPanelCollapsed)}
          >
            <FilterIcon />
          </Button>
          <div className="flex-1 relative">
            <Input
              placeholder="Search or filter…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-8"
            />
            <div className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 ${textSecondary}`}>
              <SearchIcon />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" disabled className="opacity-20 text-xs">
            Share
          </Button>
          <Button variant="ghost" size="sm" disabled className="opacity-20 text-xs">
            Download
          </Button>
        </div>
      </div>

      {/* Active Filters Bar */}
      {activeFilterChips.length > 0 && (
        <div className={`${bgSecondary} border-b ${border} p-2`}>
          <div className="flex flex-wrap gap-1 items-center">
            {activeFilterChips.map((chip, index) => (
              <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                {chip}
                <button
                  onClick={() => removeFilterChip(chip)}
                  className="ml-1 hover:text-blue-600"
                >
                  ×
                </button>
              </Badge>
            ))}
            {activeFilterChips.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-xs text-gray-500 hover:text-gray-700 ml-2"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Video */}
      {isFullscreen && selectedPlayIds[0] && (
        <div className="fixed inset-0 z-50 bg-black">
          <VideoPlayer 
            className="w-full h-full"
            isPlaying={isPlaying}
            isFullscreen={isFullscreen}
            isPlayingAll={isPlayingAll}
            currentPlaylistIndex={currentPlaylistIndex}
            filteredPlaysLength={filteredPlays.length}
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
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden p-3 relative">
        {/* Filter Panel Toggle Button - Always visible */}
        {isFilterPanelCollapsed && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterPanelCollapsed(false)}
            className={`absolute top-2 left-2 z-10 ${bgSecondary} shadow-md ${bgHover} ${textPrimary}`}
          >
            <PanelLeft className="w-4 h-4" />
          </Button>
        )}

        {/* View Mode Toggle Button - Show in play-all mode */}
        {viewMode === 'play-all' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setViewMode('find');
              setIsPlayingAll(false);
              setIsPlaying(false);
              // Ensure right panel stays open if a play is selected
              if (selectedPlayIds[0]) {
                setIsRightPanelClosed(false);
              }
            }}
            className={`absolute top-2 left-16 z-10 ${bgSecondary} shadow-md ${bgHover} ${textPrimary} flex items-center gap-2`}
          >
            <ListVideo className="w-4 h-4" />
            <span className="text-xs">Back to Find View</span>
          </Button>
        )}

        <ResizablePanelGroup direction="horizontal" className="h-full gap-3">
          {/* Left Filter Panel */}
          {!isFilterPanelCollapsed && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <div className={`h-full ${bgSecondary} rounded-lg shadow-sm flex flex-col overflow-hidden`}>
              <div className={`p-2 border-b ${border}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFilterPanelCollapsed(true)}
                      className={`p-1 h-6 w-6 ${textPrimary}`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <h3 className={`font-bold text-sm ${textPrimary}`}>
                      Clip Search {activeFilterCount > 0 && <span className="text-blue-600">({activeFilterCount})</span>}
                    </h3>
                  </div>
                  {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
                      Clear All
                    </Button>
                  )}
                </div>
                <div className={`text-xs ${textSecondary} mt-1`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab('basic')}
                        className={`${activeTab === 'basic' ? `${textPrimary} font-medium` : `${textSecondary} hover:${textPrimary}`}`}
                      >
                        General
                      </button>
                      <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}>|</span>
                      <button
                        onClick={() => setActiveTab('advanced')}
                        className={`${activeTab === 'advanced' ? `${textPrimary} font-medium` : `${textSecondary} hover:${textPrimary}`}`}
                      >
                        Attributes
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsSaveFilterDialogOpen(true)}
                        disabled={!hasActiveFilters}
                        className="h-6 px-2 text-xs"
                      >
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsLoadFilterDialogOpen(true)}
                        disabled={savedFilterSets.length === 0}
                        className="h-6 px-2 text-xs"
                      >
                        Load
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {activeTab === 'basic' ? (
                  <InteractiveFilterPanel filters={filters} onFilterChange={setFilters} />
                ) : (
                  <div className="p-4">
                    <Button 
                      onClick={() => setIsAddMetricModalOpen(true)}
                      className="w-full mb-4"
                      variant="outline"
                    >
                      + Add Attribute
                    </Button>
                    
                    {/* Display active metric filters */}
                    {Object.entries(metricFilters).map(([category, values]) => (
                      values.length > 0 && (
                        <div key={category} className={`mb-4 p-3 rounded border ${theme === 'dark' ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-gray-700'}`}>{category}</div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveMetricFilter(category)}
                              className="text-xs h-6 px-2"
                            >
                              Clear
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {values.map(value => (
                              <Badge key={value} variant="secondary" className={`text-xs flex items-center gap-1 ${theme === 'dark' ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                                {value}
                                <button
                                  onClick={() => {
                                    setMetricFilters(prev => ({
                                      ...prev,
                                      [category]: prev[category].filter(v => v !== value)
                                    }));
                                  }}
                                  className="hover:opacity-70 ml-0.5"
                                >
                                  <span className="text-sm leading-none">×</span>
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />
            </>
          )}

          {/* Main Data Table */}
          <ResizablePanel defaultSize={selectedPlayIds[0] ? 60 : 75} minSize={50}>
            {viewMode === 'play-all' && selectedPlayIds[0] ? (
              <ResizablePanelGroup direction="vertical" className="h-full">
                <ResizablePanel defaultSize={40} minSize={30} maxSize={60}>
                  <div className={`h-full ${bgSecondary} rounded-lg shadow-sm overflow-hidden mb-3`}>
                    <div className={`p-2 border-b ${border}`}>
                      <div className="flex items-center justify-between">
                        <h3 className={`font-bold text-sm ${textPrimary}`}>
                          Play #{selectedPlayIds[0]} - Q{selectedPlay?.qtr}
                        </h3>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          Playing {currentPlaylistIndex + 1} of {currentPlaylist.length}
                        </Badge>
                      </div>
                    </div>
                    <VideoPlayer 
                      className="h-[calc(100%-40px)]"
                      isPlaying={isPlaying}
                      isFullscreen={isFullscreen}
                      isPlayingAll={isPlayingAll}
                      currentPlaylistIndex={currentPlaylistIndex}
                      filteredPlaysLength={currentPlaylist.length}
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
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={60} minSize={40}>
                  <div className={`h-full ${bgSecondary} rounded-lg shadow-sm overflow-hidden flex flex-col`}>
                    <div className={`p-2 border-b ${border} flex justify-between items-center`}>
                      <span className={`text-sm ${textSecondary}`}>{currentPlaylist.length} plays in playlist</span>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setIsColumnSettingsOpen(true)} title="Column Settings">
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handlePreviousClip} disabled={currentPlaylistIndex === 0}>
                          <div className="w-4 h-4">
                            <SkipBackIcon />
                          </div>
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleNextClip} disabled={currentPlaylistIndex >= currentPlaylist.length - 1}>
                          <div className="w-4 h-4">
                            <SkipForwardIcon />
                          </div>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setIsRightPanelClosed(false)}
                          className={textPrimary}
                          title="Show Play Details"
                        >
                          <ChevronLeft className="w-4 h-4 rotate-180" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleStopAll}>
                          <div className="w-4 h-4">
                            <StopIcon />
                          </div>
                          Stop All
                        </Button>
                        {!isPlaylistView && (
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => setIsSavePlaylistDialogOpen(true)}
                            className="flex items-center gap-2"
                          >
                            <ListVideo className="w-4 h-4" />
                            Save as Playlist
                          </Button>
                        )}
                        {isPlaylistView && selectedPlayIds.length > 0 && (
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={handleRemoveSelectedFromPlaylist}
                            className="flex items-center gap-2"
                          >
                            Remove from Playlist ({selectedPlayIds.length})
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="overflow-x-auto flex-1">
                <table className="w-full">
                  <thead className={`${theme === 'dark' ? 'bg-[#1e2129]' : 'bg-gray-50'} border-b ${border} sticky top-0`}>
                    <tr>
                      <th className="w-8 p-2">
                        <Checkbox 
                          checked={selectedPlayIds.length === filteredPlays.length && filteredPlays.length > 0}
                          onCheckedChange={handleSelectAllToggle}
                        />
                      </th>
                      {columnVisibility.playNumber && <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>Play #</th>}
                      {columnVisibility.team && <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>Team</th>}
                      {columnVisibility.opponent && <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>Player</th>}
                      {columnVisibility.clipSource && <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>Clip Source</th>}
                      {columnVisibility.date && <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>Date</th>}
                      {columnVisibility.time && <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>Time</th>}
                      {columnVisibility.qtr && <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>QTR</th>}
                      {columnVisibility.odk && <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>ODK</th>}
                      {columnVisibility.dn && <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>DN</th>}
                      {columnVisibility.dist && <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>DIST</th>}
                      {columnVisibility.yardLn && <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>YARD LN</th>}
                      {columnVisibility.gnLs && <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>GN/LS</th>}
                      {columnVisibility.eff && <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>EFF</th>}
                      {columnVisibility.offStr && <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>OFF STR</th>}
                      {columnVisibility.offForm && <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>OFF FORM</th>}
                      {columnVisibility.offPlay && <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>OFF PLAY</th>}
                      {columnVisibility.playFamily && <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>PLAY FAMILY</th>}
                      {columnVisibility.playDir && <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>PLAY DIR</th>}
                      {columnVisibility.hash && <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>HASH</th>}
                      {columnVisibility.playType && <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>PLAY TYPE</th>}
                      {columnVisibility.result && <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>RESULT</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {currentPlaylist.map((play, index) => (
                      <tr
                        key={play.id}
                        className={`border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'} ${theme === 'dark' ? 'hover:bg-[#1e2129]' : 'hover:bg-gray-50'} cursor-pointer transition-colors ${
                          selectedPlayIds.includes(play.id) ? (theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50') : 
                          isPlayingAll && index === currentPlaylistIndex ? (theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50') : 
                          index % 2 === 0 ? (theme === 'dark' ? 'bg-[#1a1d24]' : 'bg-white') : (theme === 'dark' ? 'bg-[#181b21]' : 'bg-gray-25')
                        }`}
                        onClick={() => handleRowClick(play.id)}
                      >
                        <td className="p-2">
                          <Checkbox 
                            checked={selectedPlayIds.includes(play.id)} 
                            onClick={(e) => handleTogglePlaySelection(play.id, e as any)} 
                          />
                        </td>
                        {columnVisibility.playNumber && <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'Play #', play.id)}>{play.id}</td>}
                        {columnVisibility.team && <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'Team', play.team)}>{play.team}</td>}
                        {columnVisibility.opponent && <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'Player', play.opponent)}>{play.opponent}</td>}
                        {columnVisibility.clipSource && <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'Clip Source', play.clipSource)}>{play.clipSource}</td>}
                        {columnVisibility.date && <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'Date', play.date)}>{play.date}</td>}
                        {columnVisibility.time && <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'Time', play.time)}>{play.time}</td>}
                        {columnVisibility.qtr && <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'QTR', play.qtr)}>{play.qtr}</td>}
                        {columnVisibility.odk && <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'ODK', play.odk)}>{play.odk}</td>}
                        {columnVisibility.dn && <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'DN', play.dn)}>{play.dn}</td>}
                        {columnVisibility.dist && <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'DIST', play.dist)}>{play.dist}</td>}
                        {columnVisibility.yardLn && <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'YARD LN', play.yardLn)}>{play.yardLn}</td>}
                        {columnVisibility.gnLs && <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'GN/LS', play.gnLs)}>{play.gnLs}</td>}
                        {columnVisibility.eff && <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'EFF', play.eff)}>{play.eff}</td>}
                        {columnVisibility.offStr && <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'OFF STR', play.offStr)}>{play.offStr}</td>}
                        {columnVisibility.offForm && (
                          <td 
                            className={`px-3 py-2 text-xs ${textPrimary}`} 
                            onContextMenu={(e) => handleCellRightClick(e, 'OFF FORM', play.offForm)}
                            onDoubleClick={() => handleCellDoubleClick(play.id, 'OFF FORM')}
                          >
                            {editingCell?.playId === play.id && editingCell?.column === 'OFF FORM' ? (
                              <EditableCell
                                value={play.offForm}
                                suggestions={getUniqueColumnValues('OFF FORM')}
                                onSave={(newValue) => handleCellSave(play.id, 'OFF FORM', newValue)}
                                onCancel={handleCellCancel}
                              />
                            ) : (
                              play.offForm
                            )}
                          </td>
                        )}
                        {columnVisibility.offPlay && (
                          <td 
                            className={`px-3 py-2 text-xs ${textPrimary}`} 
                            onContextMenu={(e) => handleCellRightClick(e, 'OFF PLAY', play.offPlay)}
                            onDoubleClick={() => handleCellDoubleClick(play.id, 'OFF PLAY')}
                          >
                            {editingCell?.playId === play.id && editingCell?.column === 'OFF PLAY' ? (
                              <EditableCell
                                value={play.offPlay}
                                suggestions={getUniqueColumnValues('OFF PLAY')}
                                onSave={(newValue) => handleCellSave(play.id, 'OFF PLAY', newValue)}
                                onCancel={handleCellCancel}
                              />
                            ) : (
                              play.offPlay
                            )}
                          </td>
                        )}
                        {columnVisibility.playFamily && (
                          <td 
                            className={`px-3 py-2 text-xs ${textPrimary}`} 
                            onContextMenu={(e) => handleCellRightClick(e, 'PLAY FAMILY', play.playFamily)}
                            onDoubleClick={() => handleCellDoubleClick(play.id, 'PLAY FAMILY')}
                          >
                            {editingCell?.playId === play.id && editingCell?.column === 'PLAY FAMILY' ? (
                              <EditableCell
                                value={play.playFamily}
                                suggestions={getUniqueColumnValues('PLAY FAMILY')}
                                onSave={(newValue) => handleCellSave(play.id, 'PLAY FAMILY', newValue)}
                                onCancel={handleCellCancel}
                              />
                            ) : (
                              play.playFamily
                            )}
                          </td>
                        )}
                        {columnVisibility.playDir && (
                          <td 
                            className={`px-3 py-2 text-xs ${textPrimary}`} 
                            onContextMenu={(e) => handleCellRightClick(e, 'PLAY DIR', play.playDir)}
                            onDoubleClick={() => handleCellDoubleClick(play.id, 'PLAY DIR')}
                          >
                            {editingCell?.playId === play.id && editingCell?.column === 'PLAY DIR' ? (
                              <EditableCell
                                value={play.playDir}
                                suggestions={getUniqueColumnValues('PLAY DIR')}
                                onSave={(newValue) => handleCellSave(play.id, 'PLAY DIR', newValue)}
                                onCancel={handleCellCancel}
                              />
                            ) : (
                              play.playDir
                            )}
                          </td>
                        )}
                        {columnVisibility.hash && (
                          <td 
                            className={`px-3 py-2 text-xs ${textPrimary}`} 
                            onContextMenu={(e) => handleCellRightClick(e, 'HASH', play.hash)}
                            onDoubleClick={() => handleCellDoubleClick(play.id, 'HASH')}
                          >
                            {editingCell?.playId === play.id && editingCell?.column === 'HASH' ? (
                              <EditableCell
                                value={play.hash}
                                suggestions={getUniqueColumnValues('HASH')}
                                onSave={(newValue) => handleCellSave(play.id, 'HASH', newValue)}
                                onCancel={handleCellCancel}
                              />
                            ) : (
                              play.hash
                            )}
                          </td>
                        )}
                        {columnVisibility.playType && (
                          <td 
                            className={`px-3 py-2 text-xs ${textPrimary}`} 
                            onContextMenu={(e) => handleCellRightClick(e, 'PLAY TYPE', play.playType)}
                            onDoubleClick={() => handleCellDoubleClick(play.id, 'PLAY TYPE')}
                          >
                            {editingCell?.playId === play.id && editingCell?.column === 'PLAY TYPE' ? (
                              <EditableCell
                                value={play.playType}
                                suggestions={getUniqueColumnValues('PLAY TYPE')}
                                onSave={(newValue) => handleCellSave(play.id, 'PLAY TYPE', newValue)}
                                onCancel={handleCellCancel}
                              />
                            ) : (
                              play.playType
                            )}
                          </td>
                        )}
                        {columnVisibility.result && <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'RESULT', play.result)}>{play.result}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            ) : (
              <div className={`h-full ${bgSecondary} rounded-lg shadow-sm overflow-hidden flex flex-col`}>
                <div className={`p-2 border-b ${border} flex justify-between items-center`}>
                  <span className={`text-sm ${textSecondary}`}>{filteredPlays.length} plays found</span>
                  <div className="flex items-center gap-2">
                    {selectedPlayIds.length > 1 && !isPlayingAll && !isPlaylistView && (
                      <Button 
                        size="sm" 
                        onClick={handlePlaySelected}
                        variant="default"
                        className="flex items-center gap-2"
                      >
                        <div className="w-4 h-4">
                          <PlayIcon />
                        </div>
                        Play Selected ({selectedPlayIds.length})
                      </Button>
                    )}
                    {isPlaylistView && selectedPlayIds.length > 0 && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={handleRemoveSelectedFromPlaylist}
                        className="flex items-center gap-2"
                      >
                        Remove from Playlist ({selectedPlayIds.length})
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      onClick={isPlayingAll ? handleStopAll : handlePlayAll}
                      disabled={filteredPlays.length === 0}
                      variant={isPlayingAll ? "outline" : "default"}
                      className="flex items-center gap-2"
                    >
                      <div className="w-4 h-4">
                        {isPlayingAll ? <StopIcon /> : <PlayIcon />}
                      </div>
                      {isPlayingAll ? 'Stop All' : 'Play All Clips'}
                    </Button>
                  </div>
                </div>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full">
                    <thead className={`${theme === 'dark' ? 'bg-[#1e2129]' : 'bg-gray-50'} border-b ${border} sticky top-0`}>
                      <tr>
                        <th className="w-8 p-2">
                          <Checkbox 
                            checked={selectedPlayIds.length === filteredPlays.length && filteredPlays.length > 0}
                            onCheckedChange={handleSelectAllToggle}
                          />
                        </th>
                        <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>Play #</th>
                        <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>Team</th>
                        <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>Player</th>
                        <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>Date</th>
                        <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>Time</th>
                        <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>QTR</th>
                        <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>ODK</th>
                        <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>DN</th>
                        <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>DIST</th>
                        <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>YARD LN</th>
                        <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>GN/LS</th>
                        <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>EFF</th>
                        <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>OFF STR</th>
                        <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>OFF FORM</th>
                        <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>OFF PLAY</th>
                        <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>PLAY FAMILY</th>
                        <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>PLAY DIR</th>
                        <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>HASH</th>
                        <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>PLAY TYPE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPlays.map((play, index) => (
                        <tr
                          key={play.id}
                          className={`border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'} ${theme === 'dark' ? 'hover:bg-[#1e2129]' : 'hover:bg-gray-50'} cursor-pointer transition-colors ${
                            selectedPlayIds.includes(play.id) ? (theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50') : 
                            index % 2 === 0 ? (theme === 'dark' ? 'bg-[#1a1d24]' : 'bg-white') : (theme === 'dark' ? 'bg-[#181b21]' : 'bg-gray-25')
                          }`}
                          onClick={() => handleRowClick(play.id)}
                        >
                          <td className="p-2">
                            <Checkbox 
                              checked={selectedPlayIds.includes(play.id)} 
                              onClick={(e) => handleTogglePlaySelection(play.id, e as any)} 
                            />
                          </td>
                          <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'Play #', play.id)}>{play.id}</td>
                          <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'Team', play.team)}>{play.team}</td>
                          <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'Player', play.opponent)}>{play.opponent}</td>
                          <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'Date', play.date)}>{play.date}</td>
                          <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'Time', play.time)}>{play.time}</td>
                          <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'QTR', play.qtr)}>{play.qtr}</td>
                          <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'ODK', play.odk)}>{play.odk}</td>
                          <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'DN', play.dn)}>{play.dn}</td>
                          <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'DIST', play.dist)}>{play.dist}</td>
                          <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'YARD LN', play.yardLn)}>{play.yardLn}</td>
                          <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'GN/LS', play.gnLs)}>{play.gnLs}</td>
                          <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'EFF', play.eff)}>{play.eff}</td>
                          <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'OFF STR', play.offStr)}>{play.offStr}</td>
                          <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'OFF FORM', play.offForm)}>{play.offForm}</td>
                          <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'OFF PLAY', play.offPlay)}>{play.offPlay}</td>
                          <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'PLAY FAMILY', play.playFamily)}>{play.playFamily}</td>
                          <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'PLAY DIR', play.playDir)}>{play.playDir}</td>
                          <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'HASH', play.hash)}>{play.hash}</td>
                          <td className={`px-3 py-2 text-xs ${textPrimary}`} onContextMenu={(e) => handleCellRightClick(e, 'PLAY TYPE', play.playType)}>{play.playType}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </ResizablePanel>

          {/* Right Details Panel */}
          {(selectedPlayIds[0] || selectedPlayerForProfile) && !isRightPanelClosed && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
                <div className={`h-full ${bgSecondary} rounded-lg shadow-sm flex flex-col overflow-hidden`}>
                  <div className={`p-2 border-b ${border}`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`font-bold text-sm ${textPrimary}`}>
                        Play #{selectedPlayIds[0]} - Q{selectedPlay?.qtr}
                        {isPlayingAll && (
                          <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 text-xs">
                            {currentPlaylistIndex + 1} / {filteredPlays.length}
                          </Badge>
                        )}
                        {!isPlayingAll && selectedPlayIds.length > 1 && (
                          <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 text-xs">
                            {filteredPlays.filter(p => selectedPlayIds.includes(p.id)).findIndex(p => p.id === selectedPlayIds[0]) + 1} / {selectedPlayIds.length}
                          </Badge>
                        )}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewMode('play-all')}
                          className={`text-xs ${textPrimary}`}
                          title="Expand to Video Playback"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                        </Button>
                        <PlaylistDropdown
                          clipId={selectedPlayIds[0]}
                          onAddToPlaylist={handleAddToPlaylist}
                          onCreatePlaylist={handleCreatePlaylist}
                          onShareClip={handleShareClip}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsRightPanelClosed(true)}
                          className={`p-1 h-6 w-6 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${textPrimary}`}
                        >
                          <CloseIcon />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Video Player - Only show in find mode, not in play-all mode */}
                  {viewMode === 'find' && (
                    <VideoPlayer 
                      className="aspect-video"
                      isPlaying={isPlaying}
                      isFullscreen={isFullscreen}
                      isPlayingAll={isPlayingAll}
                      currentPlaylistIndex={currentPlaylistIndex}
                      filteredPlaysLength={playlistToPlay.length > 0 ? playlistToPlay.length : selectedPlayIds.length}
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
                      showSkipButtons={selectedPlayIds.length > 1 || playlistToPlay.length > 1}
                    />
                  )}

                  {/* Interactive Tabs - Hide when showing player profile */}
                  {rightPanelTab !== 'player-profile' && (
                    <div className={`border-b ${borderLight}`}>
                      <div className="flex">
                        <button 
                          onClick={() => setRightPanelTab('play-info')}
                          className={`px-4 py-2 text-sm font-medium ${
                            rightPanelTab === 'play-info' 
                              ? `${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} border-b-2 ${theme === 'dark' ? 'border-blue-400' : 'border-blue-600'}` 
                              : `${textSecondary} ${theme === 'dark' ? 'hover:text-gray-200' : 'hover:text-gray-700'}`
                          }`}
                        >
                          Play Info
                        </button>
                        <button 
                          onClick={() => setRightPanelTab('tags')}
                          className={`px-4 py-2 text-sm font-medium ${
                            rightPanelTab === 'tags' 
                              ? `${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} border-b-2 ${theme === 'dark' ? 'border-blue-400' : 'border-blue-600'}` 
                              : `${textSecondary} ${theme === 'dark' ? 'hover:text-gray-200' : 'hover:text-gray-700'}`
                          }`}
                        >
                          Tags
                          {currentTags.length > 0 && (
                            <Badge variant="secondary" className={`ml-2 text-xs ${theme === 'dark' ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-800'}`}>
                              {currentTags.length}
                            </Badge>
                          )}
                        </button>
                        <button 
                          onClick={() => setRightPanelTab('notes')}
                          className={`px-4 py-2 text-sm font-medium ${
                            rightPanelTab === 'notes' 
                              ? `${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} border-b-2 ${theme === 'dark' ? 'border-blue-400' : 'border-blue-600'}` 
                              : `${textSecondary} ${theme === 'dark' ? 'hover:text-gray-200' : 'hover:text-gray-700'}`
                            }`}
                        >
                          Notes
                          {currentNotes.length > 0 && (
                            <Badge variant="secondary" className={`ml-2 text-xs ${theme === 'dark' ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-800'}`}>
                              {currentNotes.length}
                            </Badge>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tab Content */}
                  <div className="flex-1 overflow-hidden">
                    {rightPanelTab === 'play-info' && selectedPlay && (
                      <div className="p-4 space-y-4 overflow-y-auto h-full">
                        <div>
                          <label className={`text-sm ${textSecondary} mb-1 block`}>Play Summary</label>
                          <div className={`${theme === 'dark' ? 'bg-[#2a2d35] border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded px-3 py-2 text-sm`}>
                            <div className={`font-medium ${textPrimary}`}>
                              {selectedPlay.offPlay} - {selectedPlay.playType}
                            </div>
                            <div className={`${textSecondary} mt-1`}>
                              {selectedPlay.gnLs > 0 ? `+${selectedPlay.gnLs}` : selectedPlay.gnLs} yards • {selectedPlay.result}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className={`text-sm ${textSecondary} mb-1 block`}>Down & Distance</label>
                          <div className={`text-sm ${textLight} font-medium`}>
                            {selectedPlay.dn}{selectedPlay.dn === 1 ? 'st' : selectedPlay.dn === 2 ? 'nd' : selectedPlay.dn === 3 ? 'rd' : 'th'} & {selectedPlay.dist}
                          </div>
                        </div>

                        <div>
                          <label className={`text-sm ${textSecondary} mb-1 block`}>Field Position</label>
                          <div className={`text-sm ${textLight}`}>
                            {selectedPlay.yardLn} yard line • {selectedPlay.hash} hash
                          </div>
                        </div>

                        <div>
                          <label className={`text-sm ${textSecondary} mb-1 block`}>Formation</label>
                          <div className={`text-sm ${textLight}`}>
                            {selectedPlay.playFamily} • Direction: {selectedPlay.playDir}
                          </div>
                        </div>

                        <div>
                          <label className={`text-sm ${textSecondary} mb-1 block`}>Player</label>
                          <button
                            onClick={() => handlePlayerClick(selectedPlay.player || selectedPlay.opponent)}
                            className={`w-full ${theme === 'dark' ? 'bg-[#2a2d35] border-gray-600 hover:bg-gray-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'} border rounded px-2 py-1 flex items-center gap-2 transition-colors cursor-pointer`}
                          >
                            <img src={imgEllipse29} alt="Player" className="w-4 h-4 rounded-full" />
                            <span className={`text-sm ${textLight}`}>{selectedPlay.player || selectedPlay.opponent}</span>
                          </button>
                        </div>

                        <div>
                          <label className={`text-sm ${textSecondary} mb-1 block`}>Effective Play</label>
                          <div className="flex gap-1">
                            <Badge variant={selectedPlay.eff === 'Y' ? 'default' : 'secondary'} className="text-xs">
                              {selectedPlay.eff === 'Y' ? 'Yes' : 'No'}
                            </Badge>
                          </div>
                        </div>

                        <div>
                          <label className={`text-sm ${textSecondary} mb-1 block`}>Coverage Shell</label>
                          <div className="grid grid-cols-2 gap-2">
                            {['Cover 1', 'Cover 2', 'Cover 3', 'Cover 4', 'Cover 6', 'Man', 'Match', 'Zone'].map((coverage) => (
                              <div key={coverage} className="flex items-center gap-2">
                                <Checkbox id={coverage} />
                                <label htmlFor={coverage} className={`text-sm ${textLight}`}>{coverage}</label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <label className={`text-sm ${textSecondary}`}>Pre/Post-Snap Rotation</label>
                          <Switch />
                        </div>

                        <div>
                          <label className={`text-sm ${textSecondary} mb-1 block`}>Blitz Presence</label>
                          <div className="flex items-center gap-2">
                            <Checkbox id="blitz" />
                            <label htmlFor="blitz" className={`text-sm ${textLight}`}>Blitz Occurred</label>
                          </div>
                        </div>

                        <div>
                          <label className={`text-sm ${textSecondary} mb-1 block`}>Play Rating</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <div key={star} className="w-4 h-4 text-yellow-400">
                                <StarIcon />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {rightPanelTab === 'tags' && (
                      <TagsTab
                        playId={selectedPlayIds[0]}
                        tags={currentTags}
                        onAddTag={handleAddTag}
                        onRemoveTag={handleRemoveTag}
                      />
                    )}

                    {rightPanelTab === 'notes' && (
                      <NotesTab
                        playId={selectedPlayIds[0]}
                        notes={currentNotes}
                        onAddNote={handleAddNote}
                        onUpdateNote={handleUpdateNote}
                        currentUser={currentUser}
                      />
                    )}

                    {rightPanelTab === 'player-profile' && selectedPlayerForProfile && (
                      <PlayerProfileView
                        playerName={selectedPlayerForProfile}
                        onBack={handleBackFromPlayerProfile}
                        onStatClick={handleStatClick}
                      />
                    )}
                  </div>
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>

        {/* Reopen Right Panel Button - Show when panel is closed and a play/player is selected */}
        {(selectedPlayIds[0] || selectedPlayerForProfile) && isRightPanelClosed && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRightPanelClosed(false)}
            className={`absolute top-2 right-2 z-10 ${bgSecondary} shadow-md ${bgHover} ${textPrimary}`}
          >
            <ChevronLeft className="w-4 h-4 rotate-180" />
          </Button>
        )}
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
          valueCounts={getColumnValueCounts(contextMenu.column)}
          totalCount={filteredPlays.length}
        />
      )}

      {/* Column Settings Modal */}
      <ColumnSettingsModal
        isOpen={isColumnSettingsOpen}
        onClose={() => setIsColumnSettingsOpen(false)}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
      />

      {/* Add Metric Modal */}
      <AddMetricModal
        isOpen={isAddMetricModalOpen}
        onClose={() => setIsAddMetricModalOpen(false)}
        onApply={handleApplyMetricFilter}
      />

      {/* Save as Playlist Dialog */}
      <Dialog open={isSavePlaylistDialogOpen} onOpenChange={setIsSavePlaylistDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save as Playlist</DialogTitle>
            <DialogDescription>
              Save the current {playlistToPlay.length} clip{playlistToPlay.length !== 1 ? 's' : ''} as a playlist.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Playlist Name</label>
              <Input
                value={savePlaylistName}
                onChange={(e) => setSavePlaylistName(e.target.value)}
                placeholder="Enter playlist name..."
                className="text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Description (optional)</label>
              <Textarea
                value={savePlaylistDescription}
                onChange={(e) => setSavePlaylistDescription(e.target.value)}
                placeholder="Describe this playlist..."
                className="text-sm min-h-[60px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSavePlaylistDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveAsPlaylist}
              disabled={!savePlaylistName.trim()}
            >
              Save Playlist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Filter Set Dialog */}
      <Dialog open={isSaveFilterDialogOpen} onOpenChange={setIsSaveFilterDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Filter Set</DialogTitle>
            <DialogDescription>
              Save the current filter configuration to reuse later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Filter Set Name</label>
              <Input
                value={filterSetName}
                onChange={(e) => setFilterSetName(e.target.value)}
                placeholder="Enter filter set name..."
                className="text-sm"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsSaveFilterDialogOpen(false);
              setFilterSetName('');
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveFilterSet}
              disabled={!filterSetName.trim()}
            >
              Save Filter Set
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Load Filter Set Dialog */}
      <Dialog open={isLoadFilterDialogOpen} onOpenChange={setIsLoadFilterDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Load Filter Set</DialogTitle>
            <DialogDescription>
              Select a saved filter set to apply.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {savedFilterSets.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No saved filter sets yet.</p>
            ) : (
              savedFilterSets.map((filterSet) => (
                <div
                  key={filterSet.id}
                  className={`p-3 rounded border cursor-pointer transition-colors ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`}
                  onClick={() => handleLoadFilterSet(filterSet)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${textPrimary}`}>{filterSet.name}</div>
                      <div className={`text-xs ${textSecondary}`}>
                        {new Date(filterSet.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFilterSet(filterSet.id);
                      }}
                      className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLoadFilterDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};