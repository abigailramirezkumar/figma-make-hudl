import React from 'react';
import { PlayIcon, MenuIcon, FilterIcon, SearchIcon } from './icons';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useTheme } from './ThemeContext';

export const PlaybackView: React.FC = () => {
  const { theme } = useTheme();
  
  const bg = theme === 'dark' ? 'bg-[#1a1d24]' : 'bg-gray-50';
  const bgSecondary = theme === 'dark' ? 'bg-[#1e2129]' : 'bg-white';
  const border = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const textPrimary = theme === 'dark' ? 'text-gray-200' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

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
            <span className={`font-bold ${textPrimary}`}>Video Playback</span>
          </div>
        </div>

        <div className="flex-1 flex items-center gap-2 px-4">
          <Button variant="ghost" size="sm" className="p-1">
            <FilterIcon />
          </Button>
          <div className="flex-1 relative">
            <Input
              placeholder="Search or filter…"
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

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className={`w-20 h-20 mx-auto mb-4 ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'} rounded-full flex items-center justify-center`}>
            <div className={`w-10 h-10 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
              <PlayIcon />
            </div>
          </div>
          <h2 className={`${textPrimary} mb-2`}>Video Playback</h2>
          <p className={`text-sm ${textSecondary}`}>
            View and manage your video playlists and recently played clips.
          </p>
        </div>
      </div>
    </div>
  );
};