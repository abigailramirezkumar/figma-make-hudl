// D1 College Football Players Database
export const d1FootballPlayers = [
  // Quarterbacks
  'Fernando Mendoza',
  'Quinn Ewers',
  'Jalen Milroe',
  'Carson Beck',
  'Dillon Gabriel',
  'Cam Ward',
  'Jaxson Dart',
  'Cade Klubnik',
  'Garrett Nussmeier',
  'Riley Leonard',
  'Nico Iamaleava',
  'Drew Allar',
  'Miller Moss',
  'Conner Weigman',
  'Kyle McCord',
  'Quinn Ewers',
  'Will Howard',
  'Jackson Arnold',
  
  // Running Backs
  'Omarion Hampton',
  'Ashton Jeanty',
  'Quinshon Judkins',
  'TreVeyon Henderson',
  'Kaleb Johnson',
  'Damien Martinez',
  'Jaydn Ott',
  'Dylan Sampson',
  'Ollie Gordon II',
  'Nicholas Singleton',
  'Jordan James',
  'Tahj Brooks',
  'Devin Neal',
  'RJ Harvey',
  'Phil Mafah',
  
  // Wide Receivers
  'Tetairoa McMillan',
  'Emeka Egbuka',
  'Travis Hunter',
  'Tre Harris',
  'Ryan Williams',
  'Jeremiah Smith',
  'Isaiah Bond',
  'Evan Stewart',
  'Tyler Warren',
  'Elic Ayomanor',
  'Luther Burden III',
  'Tre Harris',
  'Jalen Royals',
  'CJ Williams',
  'Kyle Williams',
  
  // Tight Ends
  'Tyler Warren',
  'Harold Fannin Jr.',
  'Gunnar Helm',
  'Mitchell Evans',
  'Oronde Gadsden II',
  'Luke Lachey',
  'Terrance Ferguson',
  
  // Defensive Players
  'Abdul Carter',
  'Mykel Williams',
  'James Pearce Jr.',
  'Nic Scourton',
  'Derrick Harmon',
  'Shemar Stewart',
  'Princely Umanmielen',
  'Jack Sawyer',
  'Will Johnson',
  'Travis Hunter',
  'Benjamin Morrison',
  'Malaki Starks',
  'Xavier Watts',
  'Danny Stutsman',
  'Jalon Walker',
  'Barrett Carter',
  'Carson Beck',
  'Jihaad Campbell'
];

// Helper function to filter players by search term
export const filterPlayers = (searchTerm: string): string[] => {
  if (!searchTerm) return [];
  
  const term = searchTerm.toLowerCase();
  return d1FootballPlayers
    .filter(player => player.toLowerCase().includes(term))
    .slice(0, 10); // Limit to 10 suggestions
};

// Helper function to get all players sorted alphabetically
export const getAllPlayersSorted = (): string[] => {
  return [...d1FootballPlayers].sort((a, b) => a.localeCompare(b));
};
