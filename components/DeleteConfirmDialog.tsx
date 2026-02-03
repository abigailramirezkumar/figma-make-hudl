import React from 'react';
import { useTheme } from './ThemeContext';
import { Button } from './ui/button';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  const { theme } = useTheme();

  const bg = theme === 'dark' ? 'bg-[#1e2129]' : 'bg-white';
  const border = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';
  const textPrimary = theme === 'dark' ? 'text-gray-200' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`${bg} border ${border} rounded-lg shadow-xl w-[400px]`}>
        <div className={`p-4 border-b ${border}`}>
          <h2 className={`text-lg font-semibold ${textPrimary}`}>{title}</h2>
        </div>
        
        <div className="p-4">
          <p className={`text-sm ${textSecondary}`}>{message}</p>
        </div>

        <div className={`p-4 border-t ${border} flex justify-end gap-2`}>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
