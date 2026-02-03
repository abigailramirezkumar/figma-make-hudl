import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { LockIcon } from './icons';
import { Tag, Note, getUserById, formatTimeAgo, currentUser } from './playDetailsData';
import { useTheme } from './ThemeContext';

interface TagsTabProps {
  playId: number;
  tags: Tag[];
  onAddTag: (text: string) => void;
  onRemoveTag: (tagId: string) => void;
}

export const TagsTab: React.FC<TagsTabProps> = ({ playId, tags, onAddTag, onRemoveTag }) => {
  const { theme } = useTheme();
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  const lastEditUser = tags.length > 0 ? getUserById(tags[tags.length - 1].createdBy) : null;

  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const textTertiary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const bgSecondary = theme === 'dark' ? 'bg-[#2a2d35]' : 'bg-gray-50';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const hoverText = theme === 'dark' ? 'hover:text-gray-200' : 'hover:text-gray-600';

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className={`text-sm ${textSecondary} mb-2 block`}>Add Tag</label>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter tag name..."
            className={`text-sm flex-1 ${theme === 'dark' ? 'bg-[#2a2d35] border-gray-600 text-gray-200' : ''}`}
          />
          <Button 
            onClick={handleAddTag} 
            size="sm"
            disabled={!newTag.trim()}
          >
            Add
          </Button>
        </div>
      </div>

      {tags.length > 0 && (
        <div>
          <label className={`text-sm ${textSecondary} mb-2 block`}>Current Tags</label>
          <div className="space-y-2">
            {tags.map((tag) => {
              const user = getUserById(tag.createdBy);
              return (
                <div key={tag.id} className={`flex items-center justify-between ${bgSecondary} p-2 rounded`}>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={theme === 'dark' ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-800'}>
                      {tag.text}
                    </Badge>
                    <span className={`text-xs ${textTertiary}`}>
                      by {user?.name} • {formatTimeAgo(tag.createdAt)}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveTag(tag.id)}
                    className={`${textTertiary} ${hoverText} text-sm`}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {lastEditUser && (
        <div className={`border-t ${borderColor} pt-3`}>
          <div className={`flex items-center gap-2 text-xs ${textTertiary}`}>
            <div className={`w-5 h-5 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded-full flex items-center justify-center`}>
              <span>{lastEditUser.name.charAt(0)}</span>
            </div>
            <span>Last edited by {lastEditUser.name}</span>
          </div>
        </div>
      )}
    </div>
  );
};

interface NotesTabProps {
  playId: number;
  notes: Note[];
  onAddNote: (content: string) => void;
  onUpdateNote: (noteId: string, content: string) => void;
  currentUser: { permissions: string[] };
}

export const NotesTab: React.FC<NotesTabProps> = ({ playId, notes, onAddNote, onUpdateNote, currentUser }) => {
  const { theme } = useTheme();
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(newNote.trim());
      setNewNote('');
    }
  };

  const handleStartEdit = (note: Note) => {
    if (note.isLocked && !currentUser.permissions.includes('edit-locked')) {
      return;
    }
    setEditingNoteId(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = () => {
    if (editingNoteId && editContent.trim()) {
      onUpdateNote(editingNoteId, editContent.trim());
      setEditingNoteId(null);
      setEditContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditContent('');
  };

  const visibleNotes = notes.filter(note => {
    if (note.isLocked && !currentUser.permissions.includes('view-locked')) {
      return false;
    }
    return true;
  });

  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const textPrimary = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
  const textTertiary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const bgSecondary = theme === 'dark' ? 'bg-[#2a2d35]' : 'bg-gray-50';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className={`text-sm ${textSecondary} mb-2 block`}>Add Note</label>
        <div className="space-y-2">
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter your analysis or observation..."
            className={`text-sm min-h-[80px] ${theme === 'dark' ? 'bg-[#2a2d35] border-gray-600 text-gray-200' : ''}`}
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleAddNote} 
              size="sm"
              disabled={!newNote.trim()}
            >
              Add Note
            </Button>
          </div>
        </div>
      </div>

      {visibleNotes.length > 0 && (
        <div>
          <label className={`text-sm ${textSecondary} mb-3 block`}>Notes History</label>
          <div className="space-y-3">
            {visibleNotes
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((note) => {
                const user = getUserById(note.createdBy);
                const canEdit = !note.isLocked || currentUser.permissions.includes('edit-locked');
                const isEditing = editingNoteId === note.id;

                return (
                  <div key={note.id} className={`${bgSecondary} p-3 rounded border ${borderColor}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'} rounded-full flex items-center justify-center text-white text-xs`}>
                          {user?.name.charAt(0)}
                        </div>
                        <div className="text-sm">
                          <span className={`font-medium ${textPrimary}`}>{user?.name}</span>
                          <span className={`${textTertiary} ml-1`}>• {user?.role}</span>
                        </div>
                        {note.isLocked && (
                          <div className="text-amber-600">
                            <LockIcon />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${textTertiary}`}>
                          {formatTimeAgo(note.createdAt)}
                        </span>
                        {canEdit && !isEditing && (
                          <button
                            onClick={() => handleStartEdit(note)}
                            className={`text-xs ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className={`text-sm ${theme === 'dark' ? 'bg-[#2a2d35] border-gray-600 text-gray-200' : ''}`}
                        />
                        <div className="flex gap-2 justify-end">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={handleSaveEdit}
                            disabled={!editContent.trim()}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className={`text-sm ${textPrimary} leading-relaxed`}>
                        {note.content}
                      </p>
                    )}

                    {note.editHistory.length > 0 && (
                      <div className={`mt-2 pt-2 border-t ${borderColor}`}>
                        <span className={`text-xs ${textTertiary}`}>
                          Edited {formatTimeAgo(note.editHistory[note.editHistory.length - 1].editedAt)} 
                          by {getUserById(note.editHistory[note.editHistory.length - 1].editedBy)?.name}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};