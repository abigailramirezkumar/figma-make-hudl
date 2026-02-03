import React from 'react';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { useTheme } from './ThemeContext';
import { mockPlays } from './footballData';
import { Trash2 } from 'lucide-react';
import { ContextMenu } from './ContextMenu';
import { Playlist } from './playlistData';
import { EditableCell } from './EditableCell';

interface PlaysGridProps {
  className?: string;
  onRowClick?: (playId: number) => void;
  selectedPlayId?: number;
  onFilterChange?: (column: string, values: string[]) => void;
  activePlaylist?: Playlist | null;
  onDeleteClip?: (clipId: number) => void;
  filteredPlays?: typeof mockPlays;
}

export const PlaysGrid: React.FC<PlaysGridProps> = ({ 
  className = '',
  onRowClick,
  selectedPlayId: externalSelectedPlayId,
  onFilterChange,
  activePlaylist,
  onDeleteClip,
  filteredPlays: externalFilteredPlays
}) => {
  const { theme } = useTheme();
  const [internalSelectedPlayId, setInternalSelectedPlayId] = React.useState<number>(mockPlays[0]?.id);
  const [contextMenu, setContextMenu] = React.useState<{
    x: number;
    y: number;
    column: string;
    value: any;
  } | null>(null);
  const [columnFilters, setColumnFilters] = React.useState<Record<string, string[]>>({});
  const [editingCell, setEditingCell] = React.useState<{
    playId: number;
    column: string;
  } | null>(null);
  
  const selectedPlayId = externalSelectedPlayId ?? internalSelectedPlayId;

  const bg = theme === 'dark' ? 'bg-[#1a1d24]' : 'bg-gray-50';
  const bgSecondary = theme === 'dark' ? 'bg-[#1e2129]' : 'bg-white';
  const border = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const textPrimary = theme === 'dark' ? 'text-gray-200' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  const handleRowClick = (playId: number) => {
    setInternalSelectedPlayId(playId);
    onRowClick?.(playId);
  };

  const handleContextMenu = (e: React.MouseEvent, column: string, value: any) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      column,
      value
    });
  };

  const getUniqueColumnValues = (column: string): string[] => {
    const values = new Set<string>();
    mockPlays.forEach(play => {
      const val = String(play[column as keyof typeof play] || '');
      if (val) values.add(val);
    });
    return Array.from(values).sort();
  };

  const handleToggleValue = (column: string, value: string) => {
    setColumnFilters(prev => {
      const current = prev[column] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      
      return updated.length > 0
        ? { ...prev, [column]: updated }
        : { ...prev, [column]: [] };
    });
  };

  // Close context menu on click outside
  React.useEffect(() => {
    const handleClick = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [contextMenu]);

  const handleFilterChange = (column: string, values: string[]) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: values
    }));
    onFilterChange?.(column, values);
  };

  const handleCellDoubleClick = (playId: number, column: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    setEditingCell({ playId, column });
    setContextMenu(null);
  };

  const handleCellSave = (playId: number, column: string, newValue: string) => {
    const playIndex = mockPlays.findIndex(p => p.id === playId);
    if (playIndex !== -1) {
      const play = mockPlays[playIndex];
      
      switch (column) {
        case 'offForm':
          play.offForm = newValue;
          break;
        case 'offPlay':
          play.offPlay = newValue;
          break;
        case 'playFamily':
          play.playFamily = newValue;
          break;
        case 'playDir':
          play.playDir = newValue;
          break;
        case 'hash':
          play.hash = newValue;
          break;
        case 'playType':
          play.playType = newValue;
          break;
      }
    }
    
    setEditingCell(null);
  };

  const handleCellCancel = () => {
    setEditingCell(null);
  };

  const filteredPlays = externalFilteredPlays || mockPlays.filter(play => {
    return Object.entries(columnFilters).every(([column, values]) => {
      if (values.length === 0) return true;
      const playValue = String(play[column as keyof typeof play] || '');
      return values.includes(playValue);
    });
  });

  return (
    <div className={`h-full ${bgSecondary} flex flex-col ${className}`}>
      <div className={`p-2 border-b ${border} flex justify-between items-center`}>
        <span className={`text-sm ${textSecondary}`}>{filteredPlays.length} plays found</span>
      </div>
      <div className="overflow-auto flex-1">
        <table className="w-full">
          <thead className={`${theme === 'dark' ? 'bg-[#1e2129]' : 'bg-gray-50'} border-b ${border} sticky top-0`}>
            <tr>
              <th className="w-8 p-2">
                <Checkbox />
              </th>
              <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>Play #</th>
              <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>Team</th>
              <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>Date</th>
              <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>Time</th>
              <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>QTR</th>
              <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>ODK</th>
              <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>DN</th>
              <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>DIST</th>
              <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>YARD LN</th>
              <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>GN/LS</th>
              <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>EFF</th>
              <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>OFF STR</th>
              <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>OFF FORM</th>
              <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>OFF PLAY</th>
              <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>PLAY FAMILY</th>
              <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>PLAY DIR</th>
              <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>HASH</th>
              <th className={`px-3 py-2 text-left text-xs font-bold ${textSecondary} whitespace-nowrap`}>PLAY TYPE</th>
              {activePlaylist && (
                <th className="w-12 p-2"></th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredPlays.map((play, index) => (
              <tr
                key={play.id}
                className={`border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'} ${theme === 'dark' ? 'hover:bg-[#1e2129]' : 'hover:bg-gray-50'} cursor-pointer transition-colors ${
                  play.id === selectedPlayId ? (theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50') : 
                  index % 2 === 0 ? (theme === 'dark' ? 'bg-[#1a1d24]' : 'bg-white') : (theme === 'dark' ? 'bg-[#181b21]' : 'bg-gray-25')
                }`}
                onClick={() => handleRowClick(play.id)}
                onContextMenu={(e) => handleContextMenu(e, 'playType', play.playType)}
              >
                <td className="p-2">
                  <Checkbox checked={play.id === selectedPlayId} />
                </td>
                <td className={`px-3 py-2 text-sm ${textPrimary} whitespace-nowrap`} onContextMenu={(e) => handleContextMenu(e, 'id', play.id)}>{play.id}</td>
                <td className={`px-3 py-2 text-sm ${textPrimary} whitespace-nowrap`} onContextMenu={(e) => handleContextMenu(e, 'team', play.team)}>{play.team}</td>
                <td className={`px-3 py-2 text-sm ${textPrimary} whitespace-nowrap`} onContextMenu={(e) => handleContextMenu(e, 'date', play.date)}>{play.date}</td>
                <td className={`px-3 py-2 text-sm ${textPrimary} whitespace-nowrap`} onContextMenu={(e) => handleContextMenu(e, 'time', play.time)}>{play.time}</td>
                <td className={`px-3 py-2 text-sm ${textPrimary} whitespace-nowrap`} onContextMenu={(e) => handleContextMenu(e, 'qtr', play.qtr)}>{play.qtr}</td>
                <td className={`px-3 py-2 text-sm ${textPrimary} whitespace-nowrap`} onContextMenu={(e) => handleContextMenu(e, 'odk', play.odk)}>{play.odk}</td>
                <td className={`px-3 py-2 text-sm ${textPrimary} whitespace-nowrap`} onContextMenu={(e) => handleContextMenu(e, 'dn', play.dn)}>{play.dn}</td>
                <td className={`px-3 py-2 text-sm ${textPrimary} whitespace-nowrap`} onContextMenu={(e) => handleContextMenu(e, 'dist', play.dist)}>{play.dist}</td>
                <td className={`px-3 py-2 text-sm ${textPrimary} whitespace-nowrap`} onContextMenu={(e) => handleContextMenu(e, 'yardLine', play.yardLine)}>{play.yardLine}</td>
                <td className={`px-3 py-2 text-sm ${textPrimary} whitespace-nowrap`} onContextMenu={(e) => handleContextMenu(e, 'gnls', play.gnls)}>{play.gnls}</td>
                <td className={`px-3 py-2 text-sm ${textPrimary} whitespace-nowrap`} onContextMenu={(e) => handleContextMenu(e, 'eff', play.eff)}>{play.eff}</td>
                <td className={`px-3 py-2 text-sm ${textPrimary} whitespace-nowrap`} onContextMenu={(e) => handleContextMenu(e, 'offStr', play.offStr)}>{play.offStr}</td>
                <td 
                  className={`px-3 py-2 text-sm ${textPrimary} whitespace-nowrap`} 
                  onContextMenu={(e) => handleContextMenu(e, 'offForm', play.offForm)}
                  onDoubleClick={(e) => handleCellDoubleClick(play.id, 'offForm', e)}
                >
                  {editingCell?.playId === play.id && editingCell?.column === 'offForm' ? (
                    <EditableCell
                      value={play.offForm}
                      suggestions={getUniqueColumnValues('offForm')}
                      onSave={(newValue) => handleCellSave(play.id, 'offForm', newValue)}
                      onCancel={handleCellCancel}
                    />
                  ) : (
                    play.offForm
                  )}
                </td>
                <td 
                  className={`px-3 py-2 text-sm ${textPrimary} whitespace-nowrap`} 
                  onContextMenu={(e) => handleContextMenu(e, 'offPlay', play.offPlay)}
                  onDoubleClick={(e) => handleCellDoubleClick(play.id, 'offPlay', e)}
                >
                  {editingCell?.playId === play.id && editingCell?.column === 'offPlay' ? (
                    <EditableCell
                      value={play.offPlay}
                      suggestions={getUniqueColumnValues('offPlay')}
                      onSave={(newValue) => handleCellSave(play.id, 'offPlay', newValue)}
                      onCancel={handleCellCancel}
                    />
                  ) : (
                    play.offPlay
                  )}
                </td>
                <td 
                  className={`px-3 py-2 text-sm ${textPrimary} whitespace-nowrap`} 
                  onContextMenu={(e) => handleContextMenu(e, 'playFamily', play.playFamily)}
                  onDoubleClick={(e) => handleCellDoubleClick(play.id, 'playFamily', e)}
                >
                  {editingCell?.playId === play.id && editingCell?.column === 'playFamily' ? (
                    <EditableCell
                      value={play.playFamily}
                      suggestions={getUniqueColumnValues('playFamily')}
                      onSave={(newValue) => handleCellSave(play.id, 'playFamily', newValue)}
                      onCancel={handleCellCancel}
                    />
                  ) : (
                    play.playFamily
                  )}
                </td>
                <td 
                  className={`px-3 py-2 text-sm ${textPrimary} whitespace-nowrap`} 
                  onContextMenu={(e) => handleContextMenu(e, 'playDir', play.playDir)}
                  onDoubleClick={(e) => handleCellDoubleClick(play.id, 'playDir', e)}
                >
                  {editingCell?.playId === play.id && editingCell?.column === 'playDir' ? (
                    <EditableCell
                      value={play.playDir}
                      suggestions={getUniqueColumnValues('playDir')}
                      onSave={(newValue) => handleCellSave(play.id, 'playDir', newValue)}
                      onCancel={handleCellCancel}
                    />
                  ) : (
                    play.playDir
                  )}
                </td>
                <td 
                  className={`px-3 py-2 text-sm ${textPrimary} whitespace-nowrap`} 
                  onContextMenu={(e) => handleContextMenu(e, 'hash', play.hash)}
                  onDoubleClick={(e) => handleCellDoubleClick(play.id, 'hash', e)}
                >
                  {editingCell?.playId === play.id && editingCell?.column === 'hash' ? (
                    <EditableCell
                      value={play.hash}
                      suggestions={getUniqueColumnValues('hash')}
                      onSave={(newValue) => handleCellSave(play.id, 'hash', newValue)}
                      onCancel={handleCellCancel}
                    />
                  ) : (
                    play.hash
                  )}
                </td>
                <td 
                  className={`px-3 py-2 text-sm ${textPrimary} whitespace-nowrap`} 
                  onContextMenu={(e) => handleContextMenu(e, 'playType', play.playType)}
                  onDoubleClick={(e) => handleCellDoubleClick(play.id, 'playType', e)}
                >
                  {editingCell?.playId === play.id && editingCell?.column === 'playType' ? (
                    <EditableCell
                      value={play.playType}
                      suggestions={getUniqueColumnValues('playType')}
                      onSave={(newValue) => handleCellSave(play.id, 'playType', newValue)}
                      onCancel={handleCellCancel}
                    />
                  ) : (
                    play.playType
                  )}
                </td>
                {activePlaylist && (
                  <td className="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`${theme === 'dark' ? 'hover:bg-red-900/20 hover:text-red-400' : 'hover:bg-red-50 hover:text-red-600'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClip?.(play.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          column={contextMenu.column}
          availableValues={getUniqueColumnValues(contextMenu.column)}
          selectedValues={columnFilters[contextMenu.column] || []}
          onToggleValue={handleToggleValue}
        />
      )}
    </div>
  );
};