import { useState } from 'react';
import { PlayAnalysisTool } from './components/PlayAnalysisTool';
import { LeftNavigation } from './components/LeftNavigation';
import { PlaybackView } from './components/PlaybackView';
import { LibraryView } from './components/LibraryView';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import { PlaylistProvider } from './components/PlaylistContext';
import { PlaybackProvider } from './components/PlaybackContext';
import { ThemeToggle } from './components/ThemeToggle';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const [activeView, setActiveView] = useState<'playback' | 'library' | 'search'>('library');
  const { theme } = useTheme();

  return (
    <>
      <div className={`flex h-screen ${theme === 'dark' ? 'bg-[#1a1d24]' : 'bg-gray-50'}`}>
        <LeftNavigation activeView={activeView} onViewChange={setActiveView} />
        <div className="flex-1 ml-[56px]">
          {activeView === 'playback' && <PlaybackView />}
          {activeView === 'library' && <LibraryView />}
          {activeView === 'search' && <PlayAnalysisTool />}
        </div>
        <ThemeToggle />
      </div>
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PlaylistProvider>
        <PlaybackProvider>
          <AppContent />
        </PlaybackProvider>
      </PlaylistProvider>
    </ThemeProvider>
  );
}