// Data structures for play details tabs

export interface User {
  id: string;
  name: string;
  role: 'Head Coach' | 'Offensive Coordinator' | 'Defensive Coordinator' | 'Analyst' | 'Scout';
  avatar: string;
  permissions: ('view-locked' | 'edit-locked' | 'delete-notes')[];
}

export interface Tag {
  id: string;
  text: string;
  createdBy: string;
  createdAt: string;
  playId: number;
}

export interface Note {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
  playId: number;
  isLocked: boolean;
  editHistory: {
    editedBy: string;
    editedAt: string;
    previousContent: string;
  }[];
}

// Mock users
export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Mike McDaniel',
    role: 'Head Coach',
    avatar: '/avatars/coach1.jpg',
    permissions: ['view-locked', 'edit-locked', 'delete-notes']
  },
  {
    id: 'u2',
    name: 'Frank Smith',
    role: 'Offensive Coordinator',
    avatar: '/avatars/coach2.jpg',
    permissions: ['view-locked', 'edit-locked']
  },
  {
    id: 'u3',
    name: 'Anthony Weaver',
    role: 'Defensive Coordinator',
    avatar: '/avatars/coach3.jpg',
    permissions: ['view-locked', 'edit-locked']
  },
  {
    id: 'u4',
    name: 'Sarah Johnson',
    role: 'Analyst',
    avatar: '/avatars/analyst1.jpg',
    permissions: ['view-locked']
  },
  {
    id: 'u5',
    name: 'Tom Wilson',
    role: 'Scout',
    avatar: '/avatars/scout1.jpg',
    permissions: []
  }
];

// Mock current user (Head Coach with full permissions)
export const currentUser = mockUsers[0];

// Generate mock tags for plays
export const generateMockTags = (): Tag[] => {
  const tagTexts = [
    'Red Zone Efficiency', 'Third Down Success', 'Blitz Pickup', 'Missed Assignment',
    'Great Coverage', 'Pressure Generated', 'Open Field Tackle', 'Broken Coverage',
    'Perfect Timing', 'Communication Breakdown', 'Audible Success', 'Situational Football',
    'Clock Management', 'Field Position', 'Turnover Risk', 'Big Play Potential',
    'Defensive Adjustment', 'Offensive Mismatch', 'Special Teams Impact'
  ];

  const tags: Tag[] = [];
  const playIds = [4, 5, 6, 7, 8]; // Some example play IDs

  playIds.forEach(playId => {
    const numTags = Math.floor(Math.random() * 4) + 1; // 1-4 tags per play
    const usedTags = new Set<string>();

    for (let i = 0; i < numTags; i++) {
      let tagText;
      do {
        tagText = tagTexts[Math.floor(Math.random() * tagTexts.length)];
      } while (usedTags.has(tagText));
      
      usedTags.add(tagText);
      
      tags.push({
        id: `tag_${playId}_${i}`,
        text: tagText,
        createdBy: mockUsers[Math.floor(Math.random() * mockUsers.length)].id,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        playId
      });
    }
  });

  return tags;
};

// Generate mock notes for plays
export const generateMockNotes = (): Note[] => {
  const noteContents = [
    'Excellent execution of the play design. QB made the right read and delivered the ball on time.',
    'Defense showed good discipline staying in coverage. Safety rotation was textbook.',
    'O-line struggled with the twist stunt. Need to work on communication in practice.',
    'WR ran a perfect route but QB was under pressure. Protection breakdown on the left side.',
    'Great adjustment by the linebacker to jump the underneath route. Shows good film study.',
    'This is exactly the type of play we want to see in the red zone. Efficient and safe.',
    'Defensive backs need to be more physical at the line of scrimmage on these short routes.',
    'Clock management could have been better here. Should have used the timeout earlier.',
    'RB showed good vision finding the cutback lane. Exactly what we coached this week.',
    'Coverage bust by the corner. This is a coaching point for the secondary meeting.'
  ];

  const notes: Note[] = [];
  const playIds = [4, 5, 6, 7, 8];

  playIds.forEach(playId => {
    const numNotes = Math.floor(Math.random() * 3) + 1; // 1-3 notes per play
    
    for (let i = 0; i < numNotes; i++) {
      const createdBy = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const isLocked = Math.random() < 0.3; // 30% chance of being locked
      
      notes.push({
        id: `note_${playId}_${i}`,
        content: noteContents[Math.floor(Math.random() * noteContents.length)],
        createdBy: createdBy.id,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        playId,
        isLocked,
        editHistory: []
      });
    }
  });

  return notes;
};

export const mockTags = generateMockTags();
export const mockNotes = generateMockNotes();

// Helper functions
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getTagsForPlay = (playId: number): Tag[] => {
  return mockTags.filter(tag => tag.playId === playId);
};

export const getNotesForPlay = (playId: number): Note[] => {
  return mockNotes.filter(note => note.playId === playId);
};

export const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};