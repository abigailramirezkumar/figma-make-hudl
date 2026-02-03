import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockPlays } from './footballData';

interface VideoPlaybackState {
  isActive: boolean;
  sourceType: 'search' | 'library-game' | 'library-practice';
  sourceTitle?: string;
  sourceDate?: string;
  sourceDuration?: string;
  selectedPlayId?: number;
  playlistIndex?: number;
}

interface VideoPlaybackContextType {
  playbackState: VideoPlaybackState;
  startPlayback: (params: Omit<VideoPlaybackState, 'isActive'>) => void;
  stopPlayback: () => void;
  selectPlay: (playId: number, index: number) => void;
}

const VideoPlaybackContext = createContext<VideoPlaybackContextType | undefined>(undefined);

export const VideoPlaybackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playbackState, setPlaybackState] = useState<VideoPlaybackState>({
    isActive: false,
    sourceType: 'search',
  });

  const startPlayback = (params: Omit<VideoPlaybackState, 'isActive'>) => {
    setPlaybackState({
      ...params,
      isActive: true,
      selectedPlayId: params.selectedPlayId || mockPlays[0]?.id,
      playlistIndex: params.playlistIndex || 0,
    });
  };

  const stopPlayback = () => {
    setPlaybackState({
      isActive: false,
      sourceType: 'search',
    });
  };

  const selectPlay = (playId: number, index: number) => {
    setPlaybackState(prev => ({
      ...prev,
      selectedPlayId: playId,
      playlistIndex: index,
    }));
  };

  return (
    <VideoPlaybackContext.Provider value={{ playbackState, startPlayback, stopPlayback, selectPlay }}>
      {children}
    </VideoPlaybackContext.Provider>
  );
};

export const useVideoPlayback = () => {
  const context = useContext(VideoPlaybackContext);
  if (!context) {
    throw new Error('useVideoPlayback must be used within VideoPlaybackProvider');
  }
  return context;
};
