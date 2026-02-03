import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface DeleteClipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  clipCount?: number;
  title?: string;
  description?: string;
}

export const DeleteClipModal: React.FC<DeleteClipModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  clipCount = 1,
  title,
  description,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title || `Remove ${clipCount} clip${clipCount > 1 ? 's' : ''}?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description || `This will remove ${clipCount > 1 ? 'these clips' : 'this clip'} from the playlist. You can undo this action immediately after.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Remove</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
