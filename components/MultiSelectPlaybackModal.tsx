import React from 'react';
import { Button } from './ui/button';
import { useTheme } from './ThemeContext';
import { X } from 'lucide-react';

interface MultiSelectPlaybackModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemCount: number;
  onCombined: () => void;
  onMultipleTabs: () => void;
}

export const MultiSelectPlaybackModal: React.FC<MultiSelectPlaybackModalProps> = ({
  isOpen,
  onClose,
  itemCount,
  onCombined,
  onMultipleTabs,
}) => {
  const { theme } = useTheme();
  const modalRef = React.useRef<HTMLDivElement>(null);
  const previousActiveElement = React.useRef<HTMLElement | null>(null);

  const bg = theme === 'dark' ? 'bg-[#1e2129]' : 'bg-white';
  const border = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';
  const textPrimary = theme === 'dark' ? 'text-gray-200' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  // Handle Escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Focus management
  React.useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Focus the modal container
      setTimeout(() => {
        modalRef.current?.focus();
      }, 0);
    } else {
      // Return focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen]);

  // Focus trap
  React.useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        // Shift + Tab: moving backwards
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: moving forwards
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        tabIndex={-1}
        className={`relative ${bg} border ${border} rounded-lg shadow-xl w-full max-w-md mx-4`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${border}`}>
          <h2 id="modal-title" className={`text-lg font-semibold ${textPrimary}`}>
            Open {itemCount} Items
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p id="modal-description" className={`text-sm ${textSecondary} mb-6`}>
            You have selected {itemCount} items. How would you like to open them?
          </p>

          <div className="space-y-3">
            <Button
              onClick={onCombined}
              className="w-full justify-start h-auto py-4"
              variant="outline"
              aria-label={`Combined Playback: Play all ${itemCount} items in sequence as one continuous playlist`}
            >
              <div className="text-left">
                <div className={`text-sm font-medium ${textPrimary}`}>
                  Combined Playback
                </div>
                <div className={`text-xs ${textSecondary} mt-1`}>
                  Play all {itemCount} items in sequence as one continuous playlist
                </div>
              </div>
            </Button>

            <Button
              onClick={onMultipleTabs}
              className="w-full justify-start h-auto py-4"
              variant="outline"
              aria-label={`Multiple Tabs: Open ${itemCount} separate tabs, one for each item`}
            >
              <div className="text-left">
                <div className={`text-sm font-medium ${textPrimary}`}>
                  Multiple Tabs
                </div>
                <div className={`text-xs ${textSecondary} mt-1`}>
                  Open {itemCount} separate tabs, one for each item
                </div>
              </div>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end gap-2 p-4 border-t ${border}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};