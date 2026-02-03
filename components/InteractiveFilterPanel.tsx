import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { FilterState } from './filterData';
import { useTheme } from './ThemeContext';
import { getTeamsByChampionship } from './filterData';
import { filterPlayers } from './playerData';

// Player Autocomplete Component - Now supports multiple selections
interface PlayerAutocompleteProps {
  values: string[]; // Changed from value to values array
  onChange: (values: string[]) => void; // Changed to accept array
  inputBg: string;
  inputBorder: string;
  inputText: string;
  textPrimary: string;
  textSecondary: string;
}

const PlayerAutocomplete: React.FC<PlayerAutocompleteProps> = ({
  values,
  onChange,
  inputBg,
  inputBorder,
  inputText,
  textPrimary,
  textSecondary,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [filteredPlayers, setFilteredPlayers] = React.useState<string[]>([]);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  // Filter players based on input
  React.useEffect(() => {
    if (!inputValue) {
      setFilteredPlayers([]);
      setIsOpen(false);
      return;
    }

    const matches = filterPlayers(inputValue);
    // Filter out already selected players
    const availableMatches = matches.filter(player => !values.includes(player));
    setFilteredPlayers(availableMatches);
    setIsOpen(availableMatches.length > 0);
  }, [inputValue, values]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddPlayer = (player: string) => {
    onChange([...values, player]);
    setInputValue('');
    setIsOpen(false);
  };

  const handleRemovePlayer = (playerToRemove: string) => {
    onChange(values.filter(p => p !== playerToRemove));
  };

  return (
    <div ref={wrapperRef} className="space-y-2">
      {/* Selected Players as Badges */}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map((player) => (
            <div
              key={player}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs ${inputBg} ${inputBorder} border ${textPrimary}`}
            >
              <span>{player}</span>
              <button
                onClick={() => handleRemovePlayer(player)}
                className="hover:text-red-500 ml-1"
                type="button"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Input Field */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={values.length > 0 ? "Add another player..." : "Search for a player..."}
          className={`w-full px-3 py-2 text-sm rounded-md ${inputBg} ${inputBorder} ${inputText} focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {isOpen && filteredPlayers.length > 0 && (
          <div className={`absolute z-50 w-full mt-1 ${inputBg} ${inputBorder} rounded-md shadow-lg max-h-60 overflow-y-auto`}>
            {filteredPlayers.map((player, index) => (
              <button
                key={index}
                onClick={() => handleAddPlayer(player)}
                className={`w-full text-left px-3 py-2 text-sm ${textPrimary} hover:bg-blue-500 hover:text-white transition-colors`}
              >
                {player}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Team Autocomplete Component
interface TeamAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  championship: string;
  inputBg: string;
  inputBorder: string;
  inputText: string;
  textPrimary: string;
  textSecondary: string;
}

const TeamAutocomplete: React.FC<TeamAutocompleteProps> = ({
  value,
  onChange,
  championship,
  inputBg,
  inputBorder,
  inputText,
  textPrimary,
  textSecondary,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [filteredTeams, setFilteredTeams] = React.useState<string[]>([]);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const allTeams = React.useMemo(() => getTeamsByChampionship(championship), [championship]);

  // Filter teams based on input
  React.useEffect(() => {
    if (!value) {
      setFilteredTeams([]);
      setIsOpen(false);
      return;
    }

    const searchTerm = value.toLowerCase();
    const matches = allTeams.filter(team => 
      team.toLowerCase().includes(searchTerm)
    ).slice(0, 10); // Limit to 10 suggestions

    setFilteredTeams(matches);
    setIsOpen(matches.length > 0);
  }, [value, allTeams]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectTeam = (team: string) => {
    onChange(team);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleInputFocus = () => {
    if (value && filteredTeams.length > 0) {
      setIsOpen(true);
    }
  };

  // Function to render highlighted text
  const renderHighlightedText = (team: string) => {
    if (!value) return team;
    
    const searchTerm = value.toLowerCase();
    const teamLower = team.toLowerCase();
    const matchIndex = teamLower.indexOf(searchTerm);
    
    if (matchIndex === -1) return team;
    
    const beforeMatch = team.substring(0, matchIndex);
    const match = team.substring(matchIndex, matchIndex + value.length);
    const afterMatch = team.substring(matchIndex + value.length);
    
    return (
      <>
        {beforeMatch}
        <span className="font-semibold">{match}</span>
        {afterMatch}
      </>
    );
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        placeholder="Search team..."
        className={`w-full text-sm ${inputBg} ${inputBorder} border rounded px-3 py-1.5 ${inputText}`}
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
      />
      
      {isOpen && filteredTeams.length > 0 && (
        <div 
          className={`absolute z-50 w-full mt-1 ${inputBg} border ${inputBorder} rounded-md shadow-lg max-h-60 overflow-y-auto`}
        >
          {filteredTeams.map((team, index) => (
            <button
              key={team}
              onClick={() => handleSelectTeam(team)}
              className={`w-full text-left px-3 py-2 text-sm ${textPrimary} hover:bg-opacity-10 hover:bg-blue-500 transition-colors ${
                index !== filteredTeams.length - 1 ? `border-b ${inputBorder}` : ''
              }`}
            >
              {renderHighlightedText(team)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface InteractiveFilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const InteractiveFilterPanel: React.FC<InteractiveFilterPanelProps> = ({ filters, onFilterChange }) => {
  const { theme } = useTheme();
  const textPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const inputBg = theme === 'dark' ? 'bg-[#2a2d35]' : 'bg-white';
  const inputBorder = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const inputText = theme === 'dark' ? 'text-gray-200' : 'text-gray-900';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const chipBg = theme === 'dark' ? 'bg-[#2a2d35]' : 'bg-white';
  const chipBorder = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const chipHover = theme === 'dark' ? 'hover:bg-[#34373f]' : 'hover:bg-gray-50';
  const chipActiveBg = theme === 'dark' ? 'bg-blue-900/40' : 'bg-blue-50';
  const chipActiveBorder = theme === 'dark' ? 'border-blue-500' : 'border-blue-600';
  const chipActiveText = theme === 'dark' ? 'text-blue-400' : 'text-blue-600';
  const chipText = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
  
  return (
    <div className="p-4 space-y-4">
      {/* Game Range Section */}
      <div>
        <h4 className={`text-sm font-bold ${textPrimary} mb-3`}>Game Range</h4>
        
        <div className="space-y-3">
          <div>
            <label className={`text-sm ${textSecondary} mb-1 block`}>Season</label>
            <Select value={filters.season} onValueChange={(value) => onFilterChange({ ...filters, season: value })}>
              <SelectTrigger className={`w-full text-sm ${inputBg} ${inputBorder} ${inputText}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className={`text-sm ${textSecondary} mb-1 block`}>Championship</label>
            <Select value={filters.championship} onValueChange={(value) => onFilterChange({ ...filters, championship: value, team: '' })}>
              <SelectTrigger className={`w-full text-sm ${inputBg} ${inputBorder} ${inputText}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="NFL">NFL</SelectItem>
                <SelectItem value="NCAA D1">NCAA D1</SelectItem>
                <SelectItem value="NCAA D2">NCAA D2</SelectItem>
                <SelectItem value="NCAA D3">NCAA D3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className={`text-sm ${textSecondary} mb-1 block`}>Team</label>
            <TeamAutocomplete
              value={filters.team}
              onChange={(value) => onFilterChange({ ...filters, team: value })}
              championship={filters.championship}
              inputBg={inputBg}
              inputBorder={inputBorder}
              inputText={inputText}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            />
          </div>

          <div>
            <label className={`text-sm ${textSecondary} mb-1 block`}>Player</label>
            <PlayerAutocomplete
              values={filters.player} // Changed to values
              onChange={(values) => onFilterChange({ ...filters, player: values })} // Changed to values
              inputBg={inputBg}
              inputBorder={inputBorder}
              inputText={inputText}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            />
          </div>

          <div>
            <label className={`text-sm ${textSecondary} mb-1 block`}>Week</label>
            <Select value={filters.week} onValueChange={(value) => onFilterChange({ ...filters, week: value })}>
              <SelectTrigger className={`w-full text-sm ${inputBg} ${inputBorder} ${inputText}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {Array.from({ length: 18 }, (_, i) => (
                  <SelectItem key={i + 1} value={`Week ${i + 1}`}>Week {i + 1}</SelectItem>
                ))}
                <SelectItem value="Playoffs">Playoffs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className={`text-sm ${textSecondary} mb-2 block`}>Side of Ball</label>
            <div className="flex gap-2">
              {['Offense', 'Defense', 'ST'].map((side) => (
                <button
                  key={side}
                  onClick={() => onFilterChange({ ...filters, sideOfBall: filters.sideOfBall === side ? null : side as any })}
                  className={`px-3 py-1 text-sm border rounded transition-colors ${
                    filters.sideOfBall === side
                      ? `${chipActiveBorder} ${chipActiveBg} ${chipActiveText}`
                      : `${chipBorder} ${chipBg} ${chipText} ${chipHover}`
                  }`}
                >
                  {side === 'Offense' ? 'O' : side === 'Defense' ? 'D' : 'ST'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={`text-sm ${textSecondary} mb-1 block`}>Clip Source</label>
            <Select value={filters.clipSource} onValueChange={(value) => onFilterChange({ ...filters, clipSource: value })}>
              <SelectTrigger className={`w-full text-sm ${inputBg} ${inputBorder} ${inputText}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Scout">Scout</SelectItem>
                <SelectItem value="Game">Game</SelectItem>
                <SelectItem value="Practice">Practice</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Play Type Section */}
      <div className={`border-t ${borderColor} pt-4`}>
        <h4 className={`text-sm font-bold ${textPrimary} mb-3`}>Play Type</h4>
        
        <div className="space-y-3">
          <div>
            <label className={`text-sm ${textSecondary} mb-1 block`}>Play Type</label>
            <Select value={filters.playType} onValueChange={(value) => onFilterChange({ ...filters, playType: value })}>
              <SelectTrigger className={`w-full text-sm ${inputBg} ${inputBorder} ${inputText}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Pass">Pass</SelectItem>
                <SelectItem value="Run">Run</SelectItem>
                <SelectItem value="Punt">Punt</SelectItem>
                <SelectItem value="Field Goal">Field Goal</SelectItem>
                <SelectItem value="Kickoff">Kickoff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className={`text-sm ${textSecondary} mb-1 block`}>Result</label>
            <Select value={filters.result} onValueChange={(value) => onFilterChange({ ...filters, result: value })}>
              <SelectTrigger className={`w-full text-sm ${inputBg} ${inputBorder} ${inputText}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Complete">Complete</SelectItem>
                <SelectItem value="Incomplete">Incomplete</SelectItem>
                <SelectItem value="Touchdown">Touchdown</SelectItem>
                <SelectItem value="First Down">First Down</SelectItem>
                <SelectItem value="Interception">Interception</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Situation Section */}
      <div className={`border-t ${borderColor} pt-4`}>
        <h4 className={`text-sm font-bold ${textPrimary} mb-3`}>Situation</h4>
        
        <div className="space-y-3">
          <div>
            <label className={`text-sm ${textSecondary} mb-2 block`}>Down</label>
            <div className="flex flex-wrap gap-2">
              {['1st', '2nd', '3rd', '4th'].map((down) => (
                <button
                  key={down}
                  onClick={() => {
                    const newDowns = filters.selectedDowns.includes(down)
                      ? filters.selectedDowns.filter(d => d !== down)
                      : [...filters.selectedDowns, down];
                    onFilterChange({ ...filters, selectedDowns: newDowns });
                  }}
                  className={`px-3 py-1 text-sm border rounded transition-colors ${
                    filters.selectedDowns.includes(down)
                      ? `${chipActiveBorder} ${chipActiveBg} ${chipActiveText}`
                      : `${chipBorder} ${chipBg} ${chipText} ${chipHover}`
                  }`}
                >
                  {down}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={`text-sm ${textSecondary} mb-2 block`}>Distance</label>
            <div className="flex flex-wrap gap-2">
              {['Short <3', 'Med 4-6', 'Long 7-10', '11+'].map((dist, idx) => {
                const displayValue = ['Short (<3)', 'Medium (4-6)', 'Long (7-10)', 'Very Long (11+)'][idx];
                return (
                  <button
                    key={dist}
                    onClick={() => {
                      const newDistances = filters.selectedDistances.includes(displayValue)
                        ? filters.selectedDistances.filter(d => d !== displayValue)
                        : [...filters.selectedDistances, displayValue];
                      onFilterChange({ ...filters, selectedDistances: newDistances });
                    }}
                    className={`px-2 py-1 text-xs border rounded transition-colors ${
                      filters.selectedDistances.includes(displayValue)
                        ? `${chipActiveBorder} ${chipActiveBg} ${chipActiveText}`
                        : `${chipBorder} ${chipBg} ${chipText} ${chipHover}`
                    }`}
                  >
                    {dist}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};