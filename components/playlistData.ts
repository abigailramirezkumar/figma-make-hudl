// Playlist and sharing functionality data structures

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  isPublic: boolean;
  clipIds: number[];
  color: string;
  type?: 'saved' | 'manual'; // 'saved' for playlists created from playback, 'manual' for playlists created manually
}

export interface PlaylistMembership {
  playlistId: string;
  clipId: number;
  addedBy: string;
  addedAt: string;
}

export interface ShareActivity {
  id: string;
  clipId: number;
  sharedBy: string;
  sharedWith: string;
  sharedAt: string;
  message?: string;
}

// Mock playlists
export const mockPlaylists: Playlist[] = [
  {
    id: 'playlist1',
    name: 'Red Zone Plays',
    description: 'Effective plays inside the 20-yard line',
    createdBy: 'u1', // Head Coach
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isPublic: true,
    clipIds: [4, 7, 8],
    color: '#ef4444'
  },
  {
    id: 'playlist2',
    name: 'Third Down Conversions',
    description: 'Successful third down plays for study',
    createdBy: 'u2', // Offensive Coordinator
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isPublic: true,
    clipIds: [5, 6],
    color: '#3b82f6'
  },
  {
    id: 'playlist3',
    name: 'Defensive Breakdowns',
    description: 'Plays where defensive schemes broke down',
    createdBy: 'u3', // Defensive Coordinator
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isPublic: false,
    clipIds: [4, 6],
    color: '#8b5cf6'
  },
  {
    id: 'playlist4',
    name: 'Game Film Review',
    description: 'This weeks key plays for team meeting',
    createdBy: 'u1', // Head Coach
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isPublic: true,
    clipIds: [4, 5, 7],
    color: '#10b981'
  },
  {
    id: 'playlist5',
    name: 'Player Development - QB',
    description: 'Quarterback development focus plays',
    createdBy: 'u2', // Offensive Coordinator
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    isPublic: false,
    clipIds: [5, 8],
    color: '#f59e0b'
  }
];

// Mock playlist memberships (derived from playlist clipIds but kept for flexibility)
export const mockPlaylistMemberships: PlaylistMembership[] = [
  // Red Zone Plays
  { playlistId: 'playlist1', clipId: 4, addedBy: 'u1', addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { playlistId: 'playlist1', clipId: 7, addedBy: 'u1', addedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
  { playlistId: 'playlist1', clipId: 8, addedBy: 'u2', addedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  
  // Third Down Conversions
  { playlistId: 'playlist2', clipId: 5, addedBy: 'u2', addedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { playlistId: 'playlist2', clipId: 6, addedBy: 'u2', addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  
  // Defensive Breakdowns
  { playlistId: 'playlist3', clipId: 4, addedBy: 'u3', addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { playlistId: 'playlist3', clipId: 6, addedBy: 'u3', addedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  
  // Game Film Review
  { playlistId: 'playlist4', clipId: 4, addedBy: 'u1', addedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { playlistId: 'playlist4', clipId: 5, addedBy: 'u1', addedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { playlistId: 'playlist4', clipId: 7, addedBy: 'u4', addedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
  
  // Player Development - QB
  { playlistId: 'playlist5', clipId: 5, addedBy: 'u2', addedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
  { playlistId: 'playlist5', clipId: 8, addedBy: 'u2', addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
];

// Mock share activities
export const mockShareActivities: ShareActivity[] = [
  {
    id: 'share1',
    clipId: 4,
    sharedBy: 'u1',
    sharedWith: 'u2',
    sharedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    message: 'Check out this red zone execution'
  },
  {
    id: 'share2',
    clipId: 5,
    sharedBy: 'u2',
    sharedWith: 'u3',
    sharedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    message: 'Notice the coverage adjustment here'
  },
  {
    id: 'share3',
    clipId: 7,
    sharedBy: 'u1',
    sharedWith: 'u4',
    sharedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Available playlist colors
export const playlistColors = [
  '#ef4444', // red
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#10b981', // green
  '#f59e0b', // amber
  '#ec4899', // pink
  '#6366f1', // indigo
  '#84cc16', // lime
  '#f97316', // orange
  '#06b6d4', // cyan
];

// Helper functions
export const getPlaylistsForClip = (clipId: number): Playlist[] => {
  return mockPlaylists.filter(playlist => playlist.clipIds.includes(clipId));
};

export const getAvailablePlaylistsForClip = (clipId: number): Playlist[] => {
  return mockPlaylists.filter(playlist => !playlist.clipIds.includes(clipId));
};

export const createPlaylist = (
  name: string,
  description: string,
  createdBy: string,
  isPublic: boolean,
  initialClipId?: number
): Playlist => {
  const randomColor = playlistColors[Math.floor(Math.random() * playlistColors.length)];
  
  return {
    id: `playlist_${Date.now()}`,
    name,
    description,
    createdBy,
    createdAt: new Date().toISOString(),
    isPublic,
    clipIds: initialClipId ? [initialClipId] : [],
    color: randomColor
  };
};

export const addClipToPlaylist = (playlistId: string, clipId: number, addedBy: string): PlaylistMembership => {
  return {
    playlistId,
    clipId,
    addedBy,
    addedAt: new Date().toISOString()
  };
};

export const shareClip = (
  clipId: number,
  sharedBy: string,
  sharedWith: string,
  message?: string
): ShareActivity => {
  return {
    id: `share_${Date.now()}`,
    clipId,
    sharedBy,
    sharedWith,
    sharedAt: new Date().toISOString(),
    message
  };
};