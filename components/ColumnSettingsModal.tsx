import React from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { CloseIcon } from './icons';
import { useTheme } from './ThemeContext';

export interface ColumnVisibility {
  playNumber: boolean;
  team: boolean;
  opponent: boolean;
  clipSource: boolean;
  date: boolean;
  time: boolean;
  qtr: boolean;
  odk: boolean;
  dn: boolean;
  dist: boolean;
  yardLn: boolean;
  gnLs: boolean;
  eff: boolean;
  offStr: boolean;
  offForm: boolean;
  offPlay: boolean;
  playFamily: boolean;
  playDir: boolean;
  hash: boolean;
  playType: boolean;
  result: boolean;
}

export const defaultColumnVisibility: ColumnVisibility = {
  playNumber: true,
  team: true,
  opponent: true,
  clipSource: true,
  date: true,
  time: false,
  qtr: true,
  odk: true,
  dn: true,
  dist: true,
  yardLn: true,
  gnLs: true,
  eff: true,
  offStr: true,
  offForm: true,
  offPlay: true,
  playFamily: true,
  playDir: false,
  hash: false,
  playType: true,
  result: true,
};

interface ColumnSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  columnVisibility: ColumnVisibility;
  onColumnVisibilityChange: (columnVisibility: ColumnVisibility) => void;
}

export const ColumnSettingsModal: React.FC<ColumnSettingsModalProps> = ({
  isOpen,
  onClose,
  columnVisibility,
  onColumnVisibilityChange,
}) => {
  const { theme } = useTheme();
  const bg = theme === 'dark' ? 'bg-[#1a1d24]' : 'bg-white';
  const bgSecondary = theme === 'dark' ? 'bg-[#1e2129]' : 'bg-gray-50';
  const border = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';
  const textPrimary = theme === 'dark' ? 'text-gray-200' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  if (!isOpen) return null;

  const columns = [
    { key: 'playNumber' as keyof ColumnVisibility, label: 'Play #' },
    { key: 'team' as keyof ColumnVisibility, label: 'Team' },
    { key: 'opponent' as keyof ColumnVisibility, label: 'Player' },
    { key: 'clipSource' as keyof ColumnVisibility, label: 'Clip Source' },
    { key: 'date' as keyof ColumnVisibility, label: 'Date' },
    { key: 'time' as keyof ColumnVisibility, label: 'Time' },
    { key: 'qtr' as keyof ColumnVisibility, label: 'QTR' },
    { key: 'odk' as keyof ColumnVisibility, label: 'ODK' },
    { key: 'dn' as keyof ColumnVisibility, label: 'DN' },
    { key: 'dist' as keyof ColumnVisibility, label: 'DIST' },
    { key: 'yardLn' as keyof ColumnVisibility, label: 'YARD LN' },
    { key: 'gnLs' as keyof ColumnVisibility, label: 'GN/LS' },
    { key: 'eff' as keyof ColumnVisibility, label: 'EFF' },
    { key: 'offStr' as keyof ColumnVisibility, label: 'OFF STR' },
    { key: 'offForm' as keyof ColumnVisibility, label: 'OFF FORM' },
    { key: 'offPlay' as keyof ColumnVisibility, label: 'OFF PLAY' },
    { key: 'playFamily' as keyof ColumnVisibility, label: 'PLAY FAMILY' },
    { key: 'playDir' as keyof ColumnVisibility, label: 'PLAY DIR' },
    { key: 'hash' as keyof ColumnVisibility, label: 'HASH' },
    { key: 'playType' as keyof ColumnVisibility, label: 'PLAY TYPE' },
    { key: 'result' as keyof ColumnVisibility, label: 'RESULT' },
  ];

  const handleToggle = (key: keyof ColumnVisibility) => {
    onColumnVisibilityChange({
      ...columnVisibility,
      [key]: !columnVisibility[key],
    });
  };

  const handleSelectAll = () => {
    const allVisible = Object.keys(columnVisibility).reduce((acc, key) => ({
      ...acc,
      [key]: true,
    }), {} as ColumnVisibility);
    onColumnVisibilityChange(allVisible);
  };

  const handleDeselectAll = () => {
    const allHidden = Object.keys(columnVisibility).reduce((acc, key) => ({
      ...acc,
      [key]: false,
    }), {} as ColumnVisibility);
    onColumnVisibilityChange(allHidden);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`${bg} rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${border}`}>
          <h2 className={`text-lg font-bold ${textPrimary}`}>Column Settings</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
            <CloseIcon />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex gap-2 mb-4">
            <Button size="sm" variant="outline" onClick={handleSelectAll}>
              Select All
            </Button>
            <Button size="sm" variant="outline" onClick={handleDeselectAll}>
              Deselect All
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {columns.map((column) => (
              <div key={column.key} className="flex items-center gap-2">
                <Checkbox
                  id={column.key}
                  checked={columnVisibility[column.key]}
                  onCheckedChange={() => handleToggle(column.key)}
                />
                <label
                  htmlFor={column.key}
                  className={`text-sm cursor-pointer ${textPrimary}`}
                >
                  {column.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={`flex justify-end gap-2 p-4 border-t ${border}`}>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};