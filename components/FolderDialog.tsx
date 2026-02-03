import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { Button } from './ui/button';

interface FolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  title: string;
  initialValue?: string;
  confirmLabel?: string;
}

export const FolderDialog: React.FC<FolderDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  initialValue = '',
  confirmLabel = 'Create',
}) => {
  const { theme } = useTheme();
  const [folderName, setFolderName] = useState(initialValue);

  const bg = theme === 'dark' ? 'bg-[#1e2129]' : 'bg-white';
  const border = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';
  const textPrimary = theme === 'dark' ? 'text-gray-200' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const inputBg = theme === 'dark' ? 'bg-[#2D333A]' : 'bg-gray-50';

  useEffect(() => {
    if (isOpen) {
      setFolderName(initialValue);
    }
  }, [isOpen, initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      onConfirm(folderName.trim());
      setFolderName('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`${bg} border ${border} rounded-lg shadow-xl w-[400px]`}>
        <form onSubmit={handleSubmit}>
          <div className={`p-4 border-b ${border}`}>
            <h2 className={`text-lg font-semibold ${textPrimary}`}>{title}</h2>
          </div>
          
          <div className="p-4">
            <label className={`block text-sm mb-2 ${textSecondary}`}>
              Folder Name
            </label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className={`w-full px-3 py-2 ${inputBg} border ${border} rounded text-sm ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter folder name"
              autoFocus
            />
          </div>

          <div className={`p-4 border-t ${border} flex justify-end gap-2`}>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setFolderName('');
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={!folderName.trim()}
            >
              {confirmLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
