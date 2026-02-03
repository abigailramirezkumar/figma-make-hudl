import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Playlist, PlaylistMembership, mockPlaylists, mockPlaylistMemberships } from './playlistData';

interface PlaylistContextType {
  playlists: Playlist[];
  setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>;
  playlistMemberships: PlaylistMembership[];
  setPlaylistMemberships: React.Dispatch<React.SetStateAction<PlaylistMembership[]>>;
  removeClipFromPlaylist: (playlistId: string, clipId: number) => void;
  addClipToPlaylist: (playlistId: string, clipId: number) => void;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists);
  const [playlistMemberships, setPlaylistMemberships] = useState<PlaylistMembership[]>(mockPlaylistMemberships);

  const removeClipFromPlaylist = (playlistId: string, clipId: number) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId) {
        return {
          ...playlist,
          clipIds: playlist.clipIds.filter(id => id !== clipId)
        };
      }
      return playlist;
    }));
  };

  const addClipToPlaylist = (playlistId: string, clipId: number) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId && !playlist.clipIds.includes(clipId)) {
        return {
          ...playlist,
          clipIds: [...playlist.clipIds, clipId]
        };
      }
      return playlist;
    }));
  };

  return (
    <PlaylistContext.Provider value={{ 
      playlists, 
      setPlaylists, 
      playlistMemberships, 
      setPlaylistMemberships,
      removeClipFromPlaylist,
      addClipToPlaylist
    }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylistContext = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylistContext must be used within a PlaylistProvider');
  }
  return context;
};