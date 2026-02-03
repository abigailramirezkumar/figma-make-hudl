import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { useTheme } from './ThemeContext';
import { mockUsers, User } from './playDetailsData';
import { CloseIcon } from './icons';

interface SharePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlistName: string;
  onShare: (userIds: string[], message: string) => void;
}

export const SharePlaylistModal: React.FC<SharePlaylistModalProps> = ({
  isOpen,
  onClose,
  playlistName,
  onShare,
}) => {
  const { theme } = useTheme();
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const bg = theme === 'dark' ? 'bg-[#1e2129]' : 'bg-white';
  const textPrimary = theme === 'dark' ? 'text-gray-200' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const border = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  if (!isOpen) return null;

  const filteredUsers = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUser = (userId: string) => {
    const newSelected = new Set(selectedUserIds);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUserIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedUserIds.size === filteredUsers.length) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(filteredUsers.map((u) => u.id)));
    }
  };

  const handleShare = () => {
    if (selectedUserIds.size > 0) {
      onShare(Array.from(selectedUserIds), message);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedUserIds(new Set());
    setMessage('');
    setSearchTerm('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`${bg} rounded-lg shadow-xl w-full max-w-lg`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${border}`}>
          <h2 className={`text-lg font-semibold ${textPrimary}`}>
            Share Playlist: {playlistName}
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

        {/* Search */}
        <div className="p-4 pb-0">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search team members..."
            className="w-full"
          />
        </div>

        {/* Select All */}
        <div className={`px-4 py-3 border-b ${border}`}>
          <button
            onClick={toggleAll}
            className={`flex items-center gap-2 text-sm ${
              theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            <Checkbox
              checked={selectedUserIds.size === filteredUsers.length && filteredUsers.length > 0}
              onCheckedChange={toggleAll}
            />
            <span>
              {selectedUserIds.size === filteredUsers.length && filteredUsers.length > 0
                ? 'Deselect All'
                : 'Select All'}
            </span>
          </button>
        </div>

        {/* User List */}
        <div className="p-4 max-h-64 overflow-y-auto">
          <div className="space-y-2">
            {filteredUsers.length === 0 ? (
              <p className={`text-sm ${textSecondary} text-center py-8`}>
                No team members found
              </p>
            ) : (
              filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => toggleUser(user.id)}
                  className={`w-full text-left p-3 rounded-lg border ${border} transition-all ${
                    selectedUserIds.has(user.id)
                      ? 'ring-2 ring-blue-500'
                      : theme === 'dark'
                      ? 'hover:bg-[#252830]'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedUserIds.has(user.id)}
                      onCheckedChange={() => toggleUser(user.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium ${textPrimary}`}>{user.name}</div>
                      <div className={`text-sm ${textSecondary}`}>{user.role}</div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message */}
        <div className={`p-4 border-t ${border}`}>
          <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
            Message (Optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a message for the recipients..."
            rows={3}
            className={`w-full px-3 py-2 rounded-md border ${border} ${
              theme === 'dark'
                ? 'bg-[#1a1d24] text-gray-200'
                : 'bg-white text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between p-4 border-t ${border}`}>
          <span className={`text-sm ${textSecondary}`}>
            {selectedUserIds.size} member{selectedUserIds.size !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleShare} disabled={selectedUserIds.size === 0}>
              Share Playlist
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
