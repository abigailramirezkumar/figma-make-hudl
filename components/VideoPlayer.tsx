import React from 'react';
import { Button } from "./ui/button";
import { 
  PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon, 
  RewindIcon, FastForwardIcon, VolumeIcon, FullscreenIcon, ExitFullscreenIcon, CloseIcon 
} from './icons';

interface VideoPlayerProps {
  className?: string;
  isPlaying: boolean;
  isFullscreen: boolean;
  isPlayingAll: boolean;
  currentPlaylistIndex: number;
  filteredPlaysLength: number;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onFullscreen: () => void;
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  onRewind: () => void;
  onFastForward: () => void;
  onPreviousClip: () => void;
  onNextClip: () => void;
  formatTime: (seconds: number) => string;
  onClose?: () => void;
  showSkipButtons?: boolean; // New prop to control skip button visibility
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  className = "",
  isPlaying,
  isFullscreen,
  isPlayingAll,
  currentPlaylistIndex,
  filteredPlaysLength,
  currentTime,
  duration,
  onPlayPause,
  onFullscreen,
  onSeek,
  onRewind,
  onFastForward,
  onPreviousClip,
  onNextClip,
  formatTime,
  onClose,
  showSkipButtons = true // Default to true if not provided
}) => {
  const [isMuted, setIsMuted] = React.useState(true);
  const [isHovering, setIsHovering] = React.useState(false);
  const [videoTimestamp, setVideoTimestamp] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Generate random timestamp when clip changes
  React.useEffect(() => {
    // Random timestamp between 0 and 300 seconds (5 minutes)
    const randomTime = Math.floor(Math.random() * 300);
    setVideoTimestamp(randomTime);
  }, [currentPlaylistIndex]);

  // Handle fullscreen functionality with this specific container
  const handleFullscreenClick = () => {
    if (!isFullscreen && containerRef.current) {
      containerRef.current.requestFullscreen().catch(err => {
        console.log('Error entering fullscreen:', err);
      });
    } else if (isFullscreen) {
      document.exitFullscreen().catch(err => {
        console.log('Error exiting fullscreen:', err);
      });
    }
    // Call parent's onFullscreen for state management
    onFullscreen();
  };

  return (
    <div 
      ref={containerRef}
      className={`relative bg-gray-900 ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* YouTube Video Background */}
      <div className="absolute inset-0">
        <iframe
          className="w-full h-full object-cover"
          src={`https://www.youtube.com/embed/E_WRnFI1JWE?autoplay=${isPlaying ? '1' : '0'}&controls=0&mute=${isMuted ? '1' : '0'}&loop=1&playlist=E_WRnFI1JWE&playsinline=1&disablekb=1&modestbranding=1&rel=0&showinfo=0&start=${videoTimestamp}`}
          title="Football Game Video"
          allow="autoplay; encrypted-media"
          style={{ 
            pointerEvents: 'none',
            border: 'none'
          }}
        />
      </div>
      
      {/* Close button - top right */}
      {onClose && !isFullscreen && (
        <div className="absolute top-4 right-4 z-10">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onClose}
            className="bg-black/60 hover:bg-black/80 text-white border border-white/30"
          >
            <CloseIcon />
          </Button>
        </div>
      )}

      {/* Playlist indicator */}
      {isPlayingAll && (
        <div className="absolute top-4 right-4 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
          PLAYLIST: {currentPlaylistIndex + 1}/{filteredPlaysLength}
        </div>
      )}

      {/* Fullscreen exit button */}
      {isFullscreen && (
        <div className="absolute top-4 right-4 z-10">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleFullscreenClick}
            className="bg-black/60 hover:bg-black/80 text-white border border-white/30"
          >
            <ExitFullscreenIcon />
          </Button>
        </div>
      )}
      
      {/* Play/Pause Button */}
      {isHovering && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <Button 
            size="lg" 
            onClick={onPlayPause}
            className="rounded-full w-16 h-16 bg-black/60 hover:bg-black/80 border-2 border-white/30 transition-opacity"
          >
            <div className="w-8 h-8 text-white">
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </div>
          </Button>
        </div>
      )}
      
      {/* Video Controls Overlay */}
      <div className="absolute bottom-3 left-3 right-3 z-20">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 space-y-2">
          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            <div 
              className="flex-1 bg-white/30 h-1 rounded-full cursor-pointer"
              onClick={onSeek}
            >
              <div 
                className="bg-orange-500 h-1 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-3">
              {showSkipButtons && filteredPlaysLength > 1 && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={onPreviousClip}
                  disabled={currentPlaylistIndex === 0}
                  className="p-1 text-white hover:text-white hover:bg-white/20"
                >
                  <div className="w-4 h-4">
                    <SkipBackIcon />
                  </div>
                </Button>
              )}
              <Button 
                size="sm" 
                variant="ghost"
                onClick={onRewind}
                className="p-1 text-white hover:text-white hover:bg-white/20"
              >
                <div className="w-4 h-4">
                  <RewindIcon />
                </div>
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={onPlayPause}
                className="p-1 text-white hover:text-white hover:bg-white/20"
              >
                <div className="w-4 h-4">
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </div>
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={onFastForward}
                className="p-1 text-white hover:text-white hover:bg-white/20"
              >
                <div className="w-4 h-4">
                  <FastForwardIcon />
                </div>
              </Button>
              {showSkipButtons && filteredPlaysLength > 1 && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={onNextClip}
                  disabled={currentPlaylistIndex >= filteredPlaysLength - 1}
                  className="p-1 text-white hover:text-white hover:bg-white/20"
                >
                  <div className="w-4 h-4">
                    <SkipForwardIcon />
                  </div>
                </Button>
              )}
            </div>
            <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 text-white hover:text-white hover:bg-white/20"
                title={isMuted ? "Unmute" : "Mute"}
              >
                <div className="w-4 h-4">
                  <VolumeIcon />
                </div>
                {isMuted && (
                  <div className="absolute w-0.5 h-5 bg-white rotate-45 transform"></div>
                )}
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleFullscreenClick}
                className="p-1 text-white hover:text-white hover:bg-white/20"
              >
                <div className="w-4 h-4">
                  {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};