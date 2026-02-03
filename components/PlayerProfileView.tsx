import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from './ThemeContext';
import svgPaths from '../imports/svg-6wbvdlgebn';
import imgAvatar from "figma:asset/3a0872259dd119b5bb85e6c388552a4d783f352d.png";
import imgLogo from "figma:asset/aa6057b4b673be4babd0765e7ae9c99a4ce5d4d0.png";

interface PlayerProfileViewProps {
  playerName: string;
  onBack: () => void;
  onStatClick?: (statName: string) => void;
}

interface StatTileProps {
  title: string;
  value: string;
  context: string;
  onClick?: () => void;
}

const StatTile: React.FC<StatTileProps> = ({ title, value, context, onClick }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div 
      onClick={onClick}
      className={`flex-1 min-w-[120px] max-w-[310px] rounded-lg border ${
        isDark ? 'border-gray-600' : 'border-[#c4c6c8]'
      } ${onClick ? 'cursor-pointer hover:border-blue-500 transition-colors' : ''}`}
    >
      <div className="flex flex-col gap-0.5 p-3">
        <p className={`text-base font-bold ${isDark ? 'text-gray-300' : 'text-[#36485c]'}`}>{title}</p>
        <p className={`text-2xl font-bold italic ${isDark ? 'text-white' : 'text-[#071c31]'}`}>{value}</p>
        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-[#607081]'}`}>{context}</p>
      </div>
    </div>
  );
};

export const PlayerProfileView: React.FC<PlayerProfileViewProps> = ({ 
  playerName, 
  onBack,
  onStatClick 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedTab, setSelectedTab] = useState<'summary' | 'events' | 'career' | 'report'>('summary');
  
  const bgPrimary = isDark ? 'bg-[#1e2128]' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-[#071c31]';
  const textSecondary = isDark ? 'text-gray-400' : 'text-[#36485c]';
  const textTertiary = isDark ? 'text-gray-500' : 'text-[#607081]';
  const borderColor = isDark ? 'border-gray-700' : 'border-[#c4c6c8]';

  return (
    <div className={`flex flex-col h-full ${bgPrimary} overflow-hidden`}>
      {/* Back Button */}
      <div className={`flex items-center gap-2 p-4 border-b ${borderColor}`}>
        <button
          onClick={onBack}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${
            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          } transition-colors`}
        >
          <ArrowLeft className="size-4" />
          <span className={`text-sm font-medium ${textPrimary}`}>Back</span>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col gap-6 w-full">
          {/* Identity Section */}
          <div className="flex gap-6 items-start w-full">
            {/* Avatar */}
            <div className="flex items-center p-0.5 shrink-0 size-16">
              <div className="flex-1 h-full min-h-px min-w-px relative rounded-full">
                <div className="absolute inset-0 pointer-events-none rounded-full">
                  <div className={`absolute ${isDark ? 'bg-gray-700' : 'bg-[#e0e1e1]'} inset-0 rounded-full`} />
                  <img alt="" className="absolute max-w-none object-cover rounded-full size-full" src={imgAvatar} />
                </div>
              </div>
            </div>

            {/* Name and Description */}
            <div className="flex-1 flex flex-col gap-1">
              <h1 className={`text-2xl font-bold ${textPrimary}`}>{playerName}</h1>
              <div className="flex gap-1 items-center text-xs">
                {/* Team Logo */}
                <div className="flex items-center p-0.5 size-6">
                  <div className={`${isDark ? 'bg-gray-700' : 'bg-[#fafafa]'} flex-1 h-full flex items-center justify-center rounded-full overflow-hidden`}>
                    <img alt="" className="max-w-none object-contain size-full" src={imgLogo} />
                  </div>
                </div>
                <a href="#" className={`${isDark ? 'text-blue-400' : 'text-[#36485c]'} underline`}>Indiana Hoosiers</a>
                <span className={`${textTertiary}`}>•</span>
                <span className={textSecondary}>QB</span>
                <span className={textTertiary}>•</span>
                <span className={textSecondary}>#15</span>
              </div>
            </div>

            {/* Star Button */}
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg className="block size-4" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                <path d={svgPaths.p2e1484f0} fill="currentColor" className={textSecondary} />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 items-center overflow-x-auto w-full">
            <button
              onClick={() => setSelectedTab('summary')}
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-colors ${
                selectedTab === 'summary'
                  ? 'bg-[#0273e3] text-white'
                  : isDark ? 'bg-gray-700 text-gray-300' : 'bg-[#e0e1e1] text-[#36485c]'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setSelectedTab('events')}
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-colors ${
                selectedTab === 'events'
                  ? 'bg-[#0273e3] text-white'
                  : isDark ? 'bg-gray-700 text-gray-300' : 'bg-[#e0e1e1] text-[#36485c]'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setSelectedTab('career')}
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-colors ${
                selectedTab === 'career'
                  ? 'bg-[#0273e3] text-white'
                  : isDark ? 'bg-gray-700 text-gray-300' : 'bg-[#e0e1e1] text-[#36485c]'
              }`}
            >
              Career
            </button>
            <button
              onClick={() => setSelectedTab('report')}
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-colors ${
                selectedTab === 'report'
                  ? 'bg-[#0273e3] text-white'
                  : isDark ? 'bg-gray-700 text-gray-300' : 'bg-[#e0e1e1] text-[#36485c]'
              }`}
            >
              Report
            </button>
          </div>

          {/* Key Stats Section */}
          {selectedTab === 'summary' && (
            <div className="flex flex-col gap-6 w-full">
              {/* Stats Header */}
              <div className="flex items-center justify-between w-full">
                <h2 className={`text-base font-bold ${textPrimary}`}>Key Stats</h2>
                <button className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${textTertiary}`}>
                  2025/26
                  <svg className="size-4" fill="none" viewBox="0 0 16 16">
                    <path d={svgPaths.p36669e00} fill="currentColor" />
                  </svg>
                </button>
              </div>

              {/* Stat Tiles */}
              <div className="flex gap-3 w-full">
                <StatTile
                  title="Completition"
                  value="72%"
                  context="272/379 passes"
                  onClick={() => onStatClick?.('completion')}
                />
                <StatTile
                  title="Passing Yards"
                  value="3,535"
                  context="Top 15 nationally"
                  onClick={() => onStatClick?.('passing-yards')}
                />
              </div>

              <div className="flex gap-3 w-full">
                <StatTile
                  title="Passing Touchdowns"
                  value="41"
                  context="National leader in FBS"
                  onClick={() => onStatClick?.('touchdowns')}
                />
                <StatTile
                  title="Interceptions"
                  value="6"
                  context="Strong decision making"
                  onClick={() => onStatClick?.('interceptions')}
                />
              </div>

              <div className="flex gap-3 w-full">
                <StatTile
                  title="Rushing Yards"
                  value="276"
                  context="7 Rushing Touchdowns"
                  onClick={() => onStatClick?.('rushing')}
                />
                <StatTile
                  title="Passer Rating"
                  value="182.9"
                  context="95th+ percentile"
                  onClick={() => onStatClick?.('rating')}
                />
              </div>

              {/* Bio Section */}
              <div className="flex flex-col gap-2.5 w-full">
                <div className="flex items-center justify-between w-full">
                  <h2 className={`text-base font-bold ${textPrimary}`}>Bio</h2>
                  <button className={`px-2 py-1 rounded text-xs font-bold ${
                    isDark ? 'bg-gray-700 text-gray-300' : 'bg-[#e0e1e1] text-[#36485c]'
                  }`}>
                    Message
                  </button>
                </div>

                {/* Bio Info Rows */}
                <div className="flex flex-col gap-0.5">
                  <div className={`flex gap-0.5 items-center py-2 w-full border-b border-dashed ${borderColor}`}>
                    <p className={`text-sm font-bold ${textPrimary}`}>Height / Weight</p>
                    <div className="flex-1 flex justify-end">
                      <p className={`text-sm ${textSecondary}`}>6'5" / 225 lbs</p>
                    </div>
                  </div>

                  <div className={`flex gap-0.5 items-center py-2 w-full border-b border-dashed ${borderColor}`}>
                    <p className={`text-sm font-bold ${textPrimary}`}>Date of birth</p>
                    <div className="flex-1 flex justify-end">
                      <p className={`text-sm ${textSecondary}`}>-</p>
                    </div>
                  </div>

                  <div className={`flex gap-0.5 items-center py-2 w-full border-b border-dashed ${borderColor}`}>
                    <p className={`text-sm font-bold ${textPrimary}`}>High School Team</p>
                    <div className="flex-1 flex justify-end">
                      <p className={`text-sm ${textSecondary}`}>Christopher Columbus High School</p>
                    </div>
                  </div>

                  <div className={`flex gap-0.5 items-center py-2 w-full border-b border-dashed ${borderColor}`}>
                    <p className={`text-sm font-bold ${textPrimary}`}>Class</p>
                    <div className="flex-1 flex justify-end">
                      <p className={`text-sm ${textSecondary}`}>Redshirt Junior</p>
                    </div>
                  </div>

                  <div className={`flex gap-0.5 items-center py-2 w-full border-b border-dashed ${borderColor}`}>
                    <p className={`text-sm font-bold ${textPrimary}`}>Hometown</p>
                    <div className="flex-1 flex justify-end">
                      <p className={`text-sm ${textSecondary}`}>Miami, FL</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Tabs Content */}
          {selectedTab !== 'summary' && (
            <div className={`flex items-center justify-center py-12 ${textSecondary}`}>
              <p>Content for {selectedTab} tab coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
