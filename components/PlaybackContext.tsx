import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Playlist } from './playlistData';

interface PlaybackContextType {
  openPlaylist: Playlist | null;
  setOpenPlaylist: (playlist: Playlist | null) => void;
}

const PlaybackContext = createContext<PlaybackContextType | undefined>(undefined);

export const PlaybackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [openPlaylist, setOpenPlaylist] = useState<Playlist | null>(null);

  return (
    <PlaybackContext.Provider value={{ openPlaylist, setOpenPlaylist }}>
      {children}
    </PlaybackContext.Provider>
  );
};

export const usePlaybackContext = () => {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error('usePlaybackContext must be used within a PlaybackProvider');
  }
  return context;
};
