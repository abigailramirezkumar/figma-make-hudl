import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { useTheme } from './ThemeContext';
import { Playlist, playlistColors } from './playlistData';
import { CloseIcon } from './icons';

interface SaveToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClipIds: number[];
  existingPlaylists: Playlist[];
  onSaveToExisting: (playlistId: string) => void;
  onCreateNew: (name: string, description: string, isPublic: boolean) => void;
}

export const SaveToPlaylistModal: React.FC<SaveToPlaylistModalProps> = ({
  isOpen,
  onClose,
  selectedClipIds,
  existingPlaylists,
  onSaveToExisting,
  onCreateNew,
}) => {
  const { theme } = useTheme();
  const [mode, setMode] = useState<'select' | 'create'>('select');
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('');

  const bg = theme === 'dark' ? 'bg-[#1e2129]' : 'bg-white';
  const textPrimary = theme === 'dark' ? 'text-gray-200' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const border = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  if (!isOpen) return null;

  const handleSave = () => {
    if (mode === 'select' && selectedPlaylistId) {
      onSaveToExisting(selectedPlaylistId);
    } else if (mode === 'create' && newPlaylistName.trim()) {
      onCreateNew(newPlaylistName.trim(), newPlaylistDescription.trim(), isPublic);
    }
    handleClose();
  };

  const handleClose = () => {
    setMode('select');
    setNewPlaylistName('');
    setNewPlaylistDescription('');
    setIsPublic(true);
    setSelectedPlaylistId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`${bg} rounded-lg shadow-xl w-full max-w-md`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${border}`}>
          <h2 className={`text-lg font-semibold ${textPrimary}`}>
            Save {selectedClipIds.length} Clip{selectedClipIds.length !== 1 ? 's' : ''} to Playlist
          </h2>
          <button
            onClick={handleClose}
            className={`${textSecondary} hover:${textPrimary} transition-colors`}
          >
            <div className="w-5 h-5">
              <CloseIcon />
            </div>
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="p-4">
          <div className={`flex gap-2 p-1 ${theme === 'dark' ? 'bg-[#1a1d24]' : 'bg-gray-100'} rounded-lg`}>
            <button
              onClick={() => setMode('select')}
              className={`flex-1 py-2 px-4 rounded transition-colors ${
                mode === 'select'
                  ? theme === 'dark'
                    ? 'bg-[#2a2d35] text-white'
                    : 'bg-white text-gray-900 shadow-sm'
                  : textSecondary
              }`}
            >
              Add to Existing
            </button>
            <button
              onClick={() => setMode('create')}
              className={`flex-1 py-2 px-4 rounded transition-colors ${
                mode === 'create'
                  ? theme === 'dark'
                    ? 'bg-[#2a2d35] text-white'
                    : 'bg-white text-gray-900 shadow-sm'
                  : textSecondary
              }`}
            >
              Create New
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 pt-0 max-h-96 overflow-y-auto">
          {mode === 'select' ? (
            <div className="space-y-2">
              {existingPlaylists.length === 0 ? (
                <p className={`text-sm ${textSecondary} text-center py-8`}>
                  No playlists available. Create a new one to get started.
                </p>
              ) : (
                existingPlaylists.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => setSelectedPlaylistId(playlist.id)}
                    className={`w-full text-left p-3 rounded-lg border ${border} transition-all ${
                      selectedPlaylistId === playlist.id
                        ? 'ring-2 ring-blue-500'
                        : theme === 'dark'
                        ? 'hover:bg-[#252830]'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: playlist.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium ${textPrimary} truncate`}>
                          {playlist.name}
                        </div>
                        {playlist.description && (
                          <div className={`text-sm ${textSecondary} truncate`}>
                            {playlist.description}
                          </div>
                        )}
                        <div className={`text-xs ${textSecondary} mt-1`}>
                          {playlist.clipIds.length} clip{playlist.clipIds.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
                  Playlist Name *
                </label>
                <Input
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="e.g., Red Zone Plays"
                  className="w-full"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
                  Description (Optional)
                </label>
                <textarea
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  placeholder="Add a description for this playlist..."
                  rows={3}
                  className={`w-full px-3 py-2 rounded-md border ${border} ${
                    theme === 'dark'
                      ? 'bg-[#1a1d24] text-gray-200'
                      : 'bg-white text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isPublic"
                  checked={isPublic}
                  onCheckedChange={(checked) => setIsPublic(checked === true)}
                />
                <label htmlFor="isPublic" className={`text-sm ${textPrimary} cursor-pointer`}>
                  Make this playlist public
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end gap-2 p-4 border-t ${border}`}>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              (mode === 'select' && !selectedPlaylistId) ||
              (mode === 'create' && !newPlaylistName.trim())
            }
          >
            {mode === 'select' ? 'Add to Playlist' : 'Create Playlist'}
          </Button>
        </div>
      </div>
    </div>
  );
};
