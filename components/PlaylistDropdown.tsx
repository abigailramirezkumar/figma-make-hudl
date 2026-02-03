import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { MoreVerticalIcon, PlusIcon, ShareIcon } from './icons';
import { getPlaylistsForClip, getAvailablePlaylistsForClip } from './playlistData';
import { mockUsers, currentUser } from './playDetailsData';

interface PlaylistDropdownProps {
  clipId: number;
  onAddToPlaylist: (playlistId: string, clipId: number) => void;
  onCreatePlaylist: (name: string, description: string, isPublic: boolean, clipId: number) => void;
  onShareClip: (clipId: number, userId: string, message?: string) => void;
}

export const PlaylistDropdown: React.FC<PlaylistDropdownProps> = ({ 
  clipId, onAddToPlaylist, onCreatePlaylist, onShareClip 
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [newPlaylistIsPublic, setNewPlaylistIsPublic] = useState(true);
  const [selectedShareUser, setSelectedShareUser] = useState('');
  const [shareMessage, setShareMessage] = useState('');

  const currentPlaylists = getPlaylistsForClip(clipId);
  const availablePlaylists = getAvailablePlaylistsForClip(clipId);

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      onCreatePlaylist(newPlaylistName.trim(), newPlaylistDescription.trim(), newPlaylistIsPublic, clipId);
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      setNewPlaylistIsPublic(true);
      setIsCreateDialogOpen(false);
    }
  };

  const handleShareClip = () => {
    if (selectedShareUser) {
      onShareClip(clipId, selectedShareUser, shareMessage.trim() || undefined);
      setSelectedShareUser('');
      setShareMessage('');
      setIsShareDialogOpen(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
        <div className="w-4 h-4">
          <MoreVerticalIcon />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Clip Actions</DropdownMenuLabel>
        
        {currentPlaylists.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-gray-500">Already in playlists:</DropdownMenuLabel>
            {currentPlaylists.map((playlist) => (
              <DropdownMenuItem key={playlist.id} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: playlist.color }}
                ></div>
                <span className="text-sm">{playlist.name}</span>
                <span className="text-xs text-gray-500 ml-auto">
                  {playlist.isPublic ? 'Public' : 'Private'}
                </span>
              </DropdownMenuItem>
            ))}
          </>
        )}

        {availablePlaylists.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-gray-500">Add to playlist:</DropdownMenuLabel>
            {availablePlaylists.map((playlist) => (
              <DropdownMenuItem 
                key={playlist.id}
                onClick={() => onAddToPlaylist(playlist.id, clipId)}
                className="flex items-center gap-2"
              >
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: playlist.color }}
                ></div>
                <span className="text-sm">{playlist.name}</span>
                <span className="text-xs text-gray-500 ml-auto">
                  {playlist.isPublic ? 'Public' : 'Private'}
                </span>
              </DropdownMenuItem>
            ))}
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
          <div className="w-4 h-4">
            <PlusIcon />
          </div>
          <span>Create new playlist</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setIsShareDialogOpen(true)} className="flex items-center gap-2">
          <div className="w-4 h-4">
            <ShareIcon />
          </div>
          <span>Share clip</span>
        </DropdownMenuItem>
      </DropdownMenuContent>

      {/* Create Playlist Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Playlist</DialogTitle>
            <DialogDescription>
              Create a new playlist and add this clip to it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Playlist Name</label>
              <Input
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Enter playlist name..."
                className="text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Description (optional)</label>
              <Textarea
                value={newPlaylistDescription}
                onChange={(e) => setNewPlaylistDescription(e.target.value)}
                placeholder="Describe this playlist..."
                className="text-sm min-h-[60px]"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-600">Make Public</label>
              <Switch
                checked={newPlaylistIsPublic}
                onCheckedChange={setNewPlaylistIsPublic}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePlaylist}
              disabled={!newPlaylistName.trim()}
            >
              Create Playlist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Clip Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Clip</DialogTitle>
            <DialogDescription>
              Share this clip with a team member.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Share with</label>
              <Select value={selectedShareUser} onValueChange={setSelectedShareUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team member..." />
                </SelectTrigger>
                <SelectContent>
                  {mockUsers
                    .filter(user => user.id !== currentUser.id)
                    .map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.role}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Message (optional)</label>
              <Textarea
                value={shareMessage}
                onChange={(e) => setShareMessage(e.target.value)}
                placeholder="Add a message about this clip..."
                className="text-sm min-h-[60px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleShareClip}
              disabled={!selectedShareUser}
            >
              Share Clip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
};