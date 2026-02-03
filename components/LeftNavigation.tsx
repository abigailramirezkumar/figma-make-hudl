import React from 'react';
import svgPaths from '../imports/svg-fyvomladj2';
import imgAvatar from 'figma:asset/2e4f112271cbc3213e90a92aee44ddd88e23a067.png';
import { useTheme } from './ThemeContext';

interface LeftNavigationProps {
  activeView: 'playback' | 'library' | 'search';
  onViewChange: (view: 'playback' | 'library' | 'search') => void;
}

function HudlLogo() {
  return (
    <div className="relative shrink-0 size-[40px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g>
          <path clipRule="evenodd" d={svgPaths.p25c5080} fill="#FF6300" fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p218faf00} fill="white" fillRule="evenodd" />
        </g>
      </svg>
    </div>
  );
}

function VideoIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
      <path
        d="M2 3.5C2 2.67157 2.67157 2 3.5 2H12.5C13.3284 2 14 2.67157 14 3.5V12.5C14 13.3284 13.3284 14 12.5 14H3.5C2.67157 14 2 13.3284 2 12.5V3.5Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M6.5 5.5L10.5 8L6.5 10.5V5.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
      <path d={svgPaths.p3d358780} fill="currentColor" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M10 10L13.5 13.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export const LeftNavigation: React.FC<LeftNavigationProps> = ({ activeView, onViewChange }) => {
  const { theme } = useTheme();
  
  const navItems = [
    { id: 'playback' as const, icon: VideoIcon, label: 'Video Playback' },
    { id: 'library' as const, icon: FolderIcon, label: 'Library' },
    { id: 'search' as const, icon: SearchIcon, label: 'Clip Search' },
  ];

  const bgColor = theme === 'dark' ? 'bg-[#0f1115]' : 'bg-[#eff0f0]';
  const hoverBg = theme === 'dark' ? 'hover:bg-[#1a1d24]' : 'hover:bg-[#e0e1e1]';
  const activeBg = theme === 'dark' ? 'bg-[#1a1d24]' : 'bg-[#e0e1e1]';
  const iconColor = theme === 'dark' ? 'text-gray-400' : 'text-[#36485C]';
  const activeIconColor = theme === 'dark' ? 'text-blue-400' : 'text-[#FF6300]';

  return (
    <div className={`fixed left-0 top-0 bottom-0 w-[56px] ${bgColor} flex flex-col items-center z-50`}>
      {/* Logo */}
      <div className="flex h-[56px] items-center justify-center p-2 w-full">
        <HudlLogo />
      </div>

      {/* Top Navigation Items */}
      <div className="flex flex-col items-center gap-2 pt-2 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-[40px] h-[40px] flex items-center justify-center rounded transition-all ${
                isActive
                  ? `${activeBg} ${activeIconColor}`
                  : `${iconColor} ${hoverBg}`
              }`}
              title={item.label}
            >
              <Icon />
            </button>
          );
        })}
      </div>

      {/* Bottom Spacer and User Avatar */}
      <div className="flex-1"></div>
      
      {/* User Avatar */}
      <div className={`h-[56px] w-full flex items-center justify-center p-2 ${activeBg}`}>
        <div className="bg-white flex items-center p-[2px] rounded-full size-[32px]">
          <div className="w-full h-full rounded-full overflow-hidden">
            <img 
              alt="User avatar" 
              className="w-full h-full object-cover" 
              src={imgAvatar} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
