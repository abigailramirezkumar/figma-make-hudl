// Mock data for multiple seasons of fixtures and library content

export interface Fixture {
  id: string;
  date: string;
  opponent: string;
  homeAway: 'Home' | 'Away';
  result?: 'W' | 'L' | 'T';
  score?: string;
  week: number;
  homeTeam?: string;
  awayTeam?: string;
  season: string;
  location?: string;
}

export interface LibraryItem {
  id: string;
  fixtureId: string;
  type: 'game-footage' | 'scout-report' | 'practice' | 'playlist';
  title: string;
  thumbnail?: string;
  duration?: string;
  date: string;
  description?: string;
  clips?: number;
  storage?: string;
  angles?: number;
  createdDate?: string;
  isLocked?: boolean;
  modifiedDate?: string;
}

// 2025 Season - 17 games
export const fixtures2025: Fixture[] = [
  { id: 'f25-1', season: '2025', week: 1, date: '2025-09-07', opponent: 'Buffalo Bills', homeTeam: 'Kansas City Chiefs', awayTeam: 'Buffalo Bills', homeAway: 'Home', result: 'W', score: '31-24' },
  { id: 'f25-2', season: '2025', week: 2, date: '2025-09-14', opponent: 'Cincinnati Bengals', homeTeam: 'Kansas City Chiefs', awayTeam: 'Cincinnati Bengals', homeAway: 'Home', result: 'W', score: '28-17' },
  { id: 'f25-3', season: '2025', week: 3, date: '2025-09-21', opponent: 'Miami Dolphins', homeTeam: 'Miami Dolphins', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'L', score: '20-27' },
  { id: 'f25-4', season: '2025', week: 4, date: '2025-09-28', opponent: 'Cleveland Browns', homeTeam: 'Kansas City Chiefs', awayTeam: 'Cleveland Browns', homeAway: 'Home', result: 'W', score: '35-21' },
  { id: 'f25-5', season: '2025', week: 5, date: '2025-10-05', opponent: 'Las Vegas Raiders', homeTeam: 'Las Vegas Raiders', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '31-17' },
  { id: 'f25-6', season: '2025', week: 6, date: '2025-10-12', opponent: 'Los Angeles Chargers', homeTeam: 'Kansas City Chiefs', awayTeam: 'Los Angeles Chargers', homeAway: 'Home', result: 'W', score: '42-14' },
  { id: 'f25-7', season: '2025', week: 7, date: '2025-10-19', opponent: 'Denver Broncos', homeTeam: 'Denver Broncos', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'T', score: '24-24' },
  { id: 'f25-8', season: '2025', week: 8, date: '2025-10-26', opponent: 'San Francisco 49ers', homeTeam: 'Kansas City Chiefs', awayTeam: 'San Francisco 49ers', homeAway: 'Home', result: 'W', score: '38-13' },
  { id: 'f25-9', season: '2025', week: 9, date: '2025-11-02', opponent: 'Tampa Bay Buccaneers', homeTeam: 'Tampa Bay Buccaneers', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '27-20' },
  { id: 'f25-10', season: '2025', week: 10, date: '2025-11-09', opponent: 'Jacksonville Jaguars', homeTeam: 'Kansas City Chiefs', awayTeam: 'Jacksonville Jaguars', homeAway: 'Home', result: 'W', score: '35-28' },
  { id: 'f25-11', season: '2025', week: 11, date: '2025-11-16', opponent: 'Pittsburgh Steelers', homeTeam: 'Pittsburgh Steelers', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '31-27' },
  { id: 'f25-12', season: '2025', week: 12, date: '2025-11-23', opponent: 'Baltimore Ravens', homeTeam: 'Kansas City Chiefs', awayTeam: 'Baltimore Ravens', homeAway: 'Home', result: 'W', score: '28-21' },
  { id: 'f25-13', season: '2025', week: 13, date: '2025-11-30', opponent: 'Philadelphia Eagles', homeTeam: 'Philadelphia Eagles', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'L', score: '17-20' },
  { id: 'f25-14', season: '2025', week: 14, date: '2025-12-07', opponent: 'New York Giants', homeTeam: 'Kansas City Chiefs', awayTeam: 'New York Giants', homeAway: 'Home', result: 'W', score: '41-24' },
  { id: 'f25-15', season: '2025', week: 15, date: '2025-12-14', opponent: 'Seattle Seahawks', homeTeam: 'Seattle Seahawks', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '34-31' },
  { id: 'f25-16', season: '2025', week: 16, date: '2025-12-21', opponent: 'Dallas Cowboys', homeTeam: 'Kansas City Chiefs', awayTeam: 'Dallas Cowboys', homeAway: 'Home', result: 'W', score: '38-17' },
  { id: 'f25-17', season: '2025', week: 17, date: '2025-12-28', opponent: 'Tennessee Titans', homeTeam: 'Tennessee Titans', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '42-10' },
];

// 2024 Season - 17 games
export const fixtures2024: Fixture[] = [
  { id: 'f24-1', season: '2024', week: 1, date: '2024-09-08', opponent: 'Detroit Lions', homeTeam: 'Kansas City Chiefs', awayTeam: 'Detroit Lions', homeAway: 'Home', result: 'W', score: '27-20' },
  { id: 'f24-2', season: '2024', week: 2, date: '2024-09-15', opponent: 'Green Bay Packers', homeTeam: 'Green Bay Packers', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'L', score: '24-31' },
  { id: 'f24-3', season: '2024', week: 3, date: '2024-09-22', opponent: 'Atlanta Falcons', homeTeam: 'Kansas City Chiefs', awayTeam: 'Atlanta Falcons', homeAway: 'Home', result: 'W', score: '35-14' },
  { id: 'f24-4', season: '2024', week: 4, date: '2024-09-29', opponent: 'Los Angeles Chargers', homeTeam: 'Los Angeles Chargers', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '28-24' },
  { id: 'f24-5', season: '2024', week: 5, date: '2024-10-06', opponent: 'New Orleans Saints', homeTeam: 'Kansas City Chiefs', awayTeam: 'New Orleans Saints', homeAway: 'Home', result: 'W', score: '31-17' },
  { id: 'f24-6', season: '2024', week: 6, date: '2024-10-13', opponent: 'Arizona Cardinals', homeTeam: 'Arizona Cardinals', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'L', score: '21-27' },
  { id: 'f24-7', season: '2024', week: 7, date: '2024-10-20', opponent: 'Las Vegas Raiders', homeTeam: 'Kansas City Chiefs', awayTeam: 'Las Vegas Raiders', homeAway: 'Home', result: 'W', score: '38-20' },
  { id: 'f24-8', season: '2024', week: 8, date: '2024-10-27', opponent: 'Minnesota Vikings', homeTeam: 'Minnesota Vikings', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '31-28' },
  { id: 'f24-9', season: '2024', week: 9, date: '2024-11-03', opponent: 'Houston Texans', homeTeam: 'Kansas City Chiefs', awayTeam: 'Houston Texans', homeAway: 'Home', result: 'W', score: '42-17' },
  { id: 'f24-10', season: '2024', week: 10, date: '2024-11-10', opponent: 'Denver Broncos', homeTeam: 'Denver Broncos', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '27-24' },
  { id: 'f24-11', season: '2024', week: 11, date: '2024-11-17', opponent: 'Buffalo Bills', homeTeam: 'Kansas City Chiefs', awayTeam: 'Buffalo Bills', homeAway: 'Home', result: 'W', score: '35-21' },
  { id: 'f24-12', season: '2024', week: 12, date: '2024-11-24', opponent: 'Carolina Panthers', homeTeam: 'Carolina Panthers', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'T', score: '20-20' },
  { id: 'f24-13', season: '2024', week: 13, date: '2024-12-01', opponent: 'Indianapolis Colts', homeTeam: 'Kansas City Chiefs', awayTeam: 'Indianapolis Colts', homeAway: 'Home', result: 'W', score: '31-14' },
  { id: 'f24-14', season: '2024', week: 14, date: '2024-12-08', opponent: 'Washington Commanders', homeTeam: 'Washington Commanders', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '28-17' },
  { id: 'f24-15', season: '2024', week: 15, date: '2024-12-15', opponent: 'Cleveland Browns', homeTeam: 'Kansas City Chiefs', awayTeam: 'Cleveland Browns', homeAway: 'Home', result: 'W', score: '45-24' },
  { id: 'f24-16', season: '2024', week: 16, date: '2024-12-22', opponent: 'Miami Dolphins', homeTeam: 'Miami Dolphins', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '38-21' },
  { id: 'f24-17', season: '2024', week: 17, date: '2024-12-29', opponent: 'New York Jets', homeTeam: 'Kansas City Chiefs', awayTeam: 'New York Jets', homeAway: 'Home', result: 'W', score: '34-10' },
];

// 2023 Season - 17 games
export const fixtures2023: Fixture[] = [
  { id: 'f23-1', season: '2023', week: 1, date: '2023-09-10', opponent: 'Detroit Lions', homeTeam: 'Kansas City Chiefs', awayTeam: 'Detroit Lions', homeAway: 'Home', result: 'W', score: '35-20' },
  { id: 'f23-2', season: '2023', week: 2, date: '2023-09-17', opponent: 'Jacksonville Jaguars', homeTeam: 'Jacksonville Jaguars', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '28-24' },
  { id: 'f23-3', season: '2023', week: 3, date: '2023-09-24', opponent: 'Chicago Bears', homeTeam: 'Kansas City Chiefs', awayTeam: 'Chicago Bears', homeAway: 'Home', result: 'W', score: '31-17' },
  { id: 'f23-4', season: '2023', week: 4, date: '2023-10-01', opponent: 'New York Jets', homeTeam: 'New York Jets', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'L', score: '21-24' },
  { id: 'f23-5', season: '2023', week: 5, date: '2023-10-08', opponent: 'Minnesota Vikings', homeTeam: 'Kansas City Chiefs', awayTeam: 'Minnesota Vikings', homeAway: 'Home', result: 'W', score: '38-14' },
  { id: 'f23-6', season: '2023', week: 6, date: '2023-10-15', opponent: 'Denver Broncos', homeTeam: 'Denver Broncos', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '27-20' },
  { id: 'f23-7', season: '2023', week: 7, date: '2023-10-22', opponent: 'Los Angeles Chargers', homeTeam: 'Kansas City Chiefs', awayTeam: 'Los Angeles Chargers', homeAway: 'Home', result: 'L', score: '17-24' },
  { id: 'f23-8', season: '2023', week: 8, date: '2023-10-29', opponent: 'Las Vegas Raiders', homeTeam: 'Las Vegas Raiders', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '31-28' },
  { id: 'f23-9', season: '2023', week: 9, date: '2023-11-05', opponent: 'Miami Dolphins', homeTeam: 'Kansas City Chiefs', awayTeam: 'Miami Dolphins', homeAway: 'Home', result: 'W', score: '42-21' },
  { id: 'f23-10', season: '2023', week: 10, date: '2023-11-12', opponent: 'Philadelphia Eagles', homeTeam: 'Philadelphia Eagles', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '35-17' },
  { id: 'f23-11', season: '2023', week: 11, date: '2023-11-19', opponent: 'Green Bay Packers', homeTeam: 'Kansas City Chiefs', awayTeam: 'Green Bay Packers', homeAway: 'Home', result: 'W', score: '45-10' },
  { id: 'f23-12', season: '2023', week: 12, date: '2023-11-26', opponent: 'Buffalo Bills', homeTeam: 'Buffalo Bills', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '28-21' },
  { id: 'f23-13', season: '2023', week: 13, date: '2023-12-03', opponent: 'Pittsburgh Steelers', homeTeam: 'Kansas City Chiefs', awayTeam: 'Pittsburgh Steelers', homeAway: 'Home', result: 'W', score: '31-24' },
  { id: 'f23-14', season: '2023', week: 14, date: '2023-12-10', opponent: 'New England Patriots', homeTeam: 'New England Patriots', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'L', score: '20-27' },
  { id: 'f23-15', season: '2023', week: 15, date: '2023-12-17', opponent: 'Cincinnati Bengals', homeTeam: 'Kansas City Chiefs', awayTeam: 'Cincinnati Bengals', homeAway: 'Home', result: 'W', score: '38-17' },
  { id: 'f23-16', season: '2023', week: 16, date: '2023-12-24', opponent: 'Seattle Seahawks', homeTeam: 'Seattle Seahawks', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '34-14' },
  { id: 'f23-17', season: '2023', week: 17, date: '2023-12-31', opponent: 'Cleveland Browns', homeTeam: 'Kansas City Chiefs', awayTeam: 'Cleveland Browns', homeAway: 'Home', result: 'W', score: '41-20' },
];

// 2022 Season - 17 games
export const fixtures2022: Fixture[] = [
  { id: 'f22-1', season: '2022', week: 1, date: '2022-09-11', opponent: 'Arizona Cardinals', homeTeam: 'Kansas City Chiefs', awayTeam: 'Arizona Cardinals', homeAway: 'Home', result: 'W', score: '38-17' },
  { id: 'f22-2', season: '2022', week: 2, date: '2022-09-18', opponent: 'Los Angeles Chargers', homeTeam: 'Los Angeles Chargers', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '27-24' },
  { id: 'f22-3', season: '2022', week: 3, date: '2022-09-25', opponent: 'Indianapolis Colts', homeTeam: 'Kansas City Chiefs', awayTeam: 'Indianapolis Colts', homeAway: 'Home', result: 'W', score: '35-21' },
  { id: 'f22-4', season: '2022', week: 4, date: '2022-10-02', opponent: 'Tampa Bay Buccaneers', homeTeam: 'Tampa Bay Buccaneers', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'L', score: '17-20' },
  { id: 'f22-5', season: '2022', week: 5, date: '2022-10-09', opponent: 'Las Vegas Raiders', homeTeam: 'Kansas City Chiefs', awayTeam: 'Las Vegas Raiders', homeAway: 'Home', result: 'W', score: '42-14' },
  { id: 'f22-6', season: '2022', week: 6, date: '2022-10-16', opponent: 'Buffalo Bills', homeTeam: 'Buffalo Bills', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '31-27' },
  { id: 'f22-7', season: '2022', week: 7, date: '2022-10-23', opponent: 'San Francisco 49ers', homeTeam: 'Kansas City Chiefs', awayTeam: 'San Francisco 49ers', homeAway: 'Home', result: 'W', score: '45-10' },
  { id: 'f22-8', season: '2022', week: 8, date: '2022-10-30', opponent: 'Tennessee Titans', homeTeam: 'Tennessee Titans', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'T', score: '27-27' },
  { id: 'f22-9', season: '2022', week: 9, date: '2022-11-06', opponent: 'Jacksonville Jaguars', homeTeam: 'Kansas City Chiefs', awayTeam: 'Jacksonville Jaguars', homeAway: 'Home', result: 'W', score: '35-17' },
  { id: 'f22-10', season: '2022', week: 10, date: '2022-11-13', opponent: 'Denver Broncos', homeTeam: 'Denver Broncos', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'L', score: '21-24' },
  { id: 'f22-11', season: '2022', week: 11, date: '2022-11-20', opponent: 'Los Angeles Rams', homeTeam: 'Kansas City Chiefs', awayTeam: 'Los Angeles Rams', homeAway: 'Home', result: 'W', score: '48-14' },
  { id: 'f22-12', season: '2022', week: 12, date: '2022-11-27', opponent: 'Seattle Seahawks', homeTeam: 'Seattle Seahawks', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '31-24' },
  { id: 'f22-13', season: '2022', week: 13, date: '2022-12-04', opponent: 'Cincinnati Bengals', homeTeam: 'Kansas City Chiefs', awayTeam: 'Cincinnati Bengals', homeAway: 'Home', result: 'W', score: '38-21' },
  { id: 'f22-14', season: '2022', week: 14, date: '2022-12-11', opponent: 'Houston Texans', homeTeam: 'Houston Texans', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '28-24' },
  { id: 'f22-15', season: '2022', week: 15, date: '2022-12-18', opponent: 'New England Patriots', homeTeam: 'Kansas City Chiefs', awayTeam: 'New England Patriots', homeAway: 'Home', result: 'W', score: '42-20' },
  { id: 'f22-16', season: '2022', week: 16, date: '2022-12-25', opponent: 'Atlanta Falcons', homeTeam: 'Atlanta Falcons', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '35-17' },
  { id: 'f22-17', season: '2022', week: 17, date: '2023-01-01', opponent: 'Denver Broncos', homeTeam: 'Kansas City Chiefs', awayTeam: 'Denver Broncos', homeAway: 'Home', result: 'W', score: '31-14' },
];

// 2021 Season - 17 games
export const fixtures2021: Fixture[] = [
  { id: 'f21-1', season: '2021', week: 1, date: '2021-09-12', opponent: 'Cleveland Browns', homeTeam: 'Kansas City Chiefs', awayTeam: 'Cleveland Browns', homeAway: 'Home', result: 'W', score: '41-17' },
  { id: 'f21-2', season: '2021', week: 2, date: '2021-09-19', opponent: 'Baltimore Ravens', homeTeam: 'Baltimore Ravens', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'L', score: '24-31' },
  { id: 'f21-3', season: '2021', week: 3, date: '2021-09-26', opponent: 'Los Angeles Chargers', homeTeam: 'Kansas City Chiefs', awayTeam: 'Los Angeles Chargers', homeAway: 'Home', result: 'W', score: '35-20' },
  { id: 'f21-4', season: '2021', week: 4, date: '2021-10-03', opponent: 'Philadelphia Eagles', homeTeam: 'Philadelphia Eagles', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '31-27' },
  { id: 'f21-5', season: '2021', week: 5, date: '2021-10-10', opponent: 'Buffalo Bills', homeTeam: 'Kansas City Chiefs', awayTeam: 'Buffalo Bills', homeAway: 'Home', result: 'W', score: '45-10' },
  { id: 'f21-6', season: '2021', week: 6, date: '2021-10-17', opponent: 'Washington Commanders', homeTeam: 'Washington Commanders', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'L', score: '20-27' },
  { id: 'f21-7', season: '2021', week: 7, date: '2021-10-24', opponent: 'Tennessee Titans', homeTeam: 'Kansas City Chiefs', awayTeam: 'Tennessee Titans', homeAway: 'Home', result: 'W', score: '38-24' },
  { id: 'f21-8', season: '2021', week: 8, date: '2021-10-31', opponent: 'New York Giants', homeTeam: 'New York Giants', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'T', score: '24-24' },
  { id: 'f21-9', season: '2021', week: 9, date: '2021-11-07', opponent: 'Green Bay Packers', homeTeam: 'Kansas City Chiefs', awayTeam: 'Green Bay Packers', homeAway: 'Home', result: 'W', score: '42-21' },
  { id: 'f21-10', season: '2021', week: 10, date: '2021-11-14', opponent: 'Las Vegas Raiders', homeTeam: 'Las Vegas Raiders', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '35-28' },
  { id: 'f21-11', season: '2021', week: 11, date: '2021-11-21', opponent: 'Dallas Cowboys', homeTeam: 'Kansas City Chiefs', awayTeam: 'Dallas Cowboys', homeAway: 'Home', result: 'W', score: '31-17' },
  { id: 'f21-12', season: '2021', week: 12, date: '2021-11-28', opponent: 'Denver Broncos', homeTeam: 'Denver Broncos', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '28-21' },
  { id: 'f21-13', season: '2021', week: 13, date: '2021-12-05', opponent: 'Cincinnati Bengals', homeTeam: 'Kansas City Chiefs', awayTeam: 'Cincinnati Bengals', homeAway: 'Home', result: 'W', score: '45-20' },
  { id: 'f21-14', season: '2021', week: 14, date: '2021-12-12', opponent: 'Pittsburgh Steelers', homeTeam: 'Pittsburgh Steelers', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '31-27' },
  { id: 'f21-15', season: '2021', week: 15, date: '2021-12-19', opponent: 'Los Angeles Chargers', homeTeam: 'Kansas City Chiefs', awayTeam: 'Los Angeles Chargers', homeAway: 'Home', result: 'L', score: '24-28' },
  { id: 'f21-16', season: '2021', week: 16, date: '2021-12-26', opponent: 'Pittsburgh Steelers', homeTeam: 'Pittsburgh Steelers', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '38-24' },
  { id: 'f21-17', season: '2021', week: 17, date: '2022-01-02', opponent: 'Denver Broncos', homeTeam: 'Kansas City Chiefs', awayTeam: 'Denver Broncos', homeAway: 'Home', result: 'W', score: '35-21' },
];

// 2020 Season - 17 games
export const fixtures2020: Fixture[] = [
  { id: 'f20-1', season: '2020', week: 1, date: '2020-09-13', opponent: 'Houston Texans', homeTeam: 'Kansas City Chiefs', awayTeam: 'Houston Texans', homeAway: 'Home', result: 'W', score: '42-14' },
  { id: 'f20-2', season: '2020', week: 2, date: '2020-09-20', opponent: 'Los Angeles Chargers', homeTeam: 'Los Angeles Chargers', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '31-20' },
  { id: 'f20-3', season: '2020', week: 3, date: '2020-09-27', opponent: 'Baltimore Ravens', homeTeam: 'Kansas City Chiefs', awayTeam: 'Baltimore Ravens', homeAway: 'Home', result: 'W', score: '35-17' },
  { id: 'f20-4', season: '2020', week: 4, date: '2020-10-04', opponent: 'New England Patriots', homeTeam: 'New England Patriots', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'L', score: '20-26' },
  { id: 'f20-5', season: '2020', week: 5, date: '2020-10-11', opponent: 'Las Vegas Raiders', homeTeam: 'Kansas City Chiefs', awayTeam: 'Las Vegas Raiders', homeAway: 'Home', result: 'W', score: '38-21' },
  { id: 'f20-6', season: '2020', week: 6, date: '2020-10-18', opponent: 'Buffalo Bills', homeTeam: 'Buffalo Bills', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'L', score: '24-27' },
  { id: 'f20-7', season: '2020', week: 7, date: '2020-10-25', opponent: 'Denver Broncos', homeTeam: 'Kansas City Chiefs', awayTeam: 'Denver Broncos', homeAway: 'Home', result: 'W', score: '45-17' },
  { id: 'f20-8', season: '2020', week: 8, date: '2020-11-01', opponent: 'New York Jets', homeTeam: 'New York Jets', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '35-10' },
  { id: 'f20-9', season: '2020', week: 9, date: '2020-11-08', opponent: 'Carolina Panthers', homeTeam: 'Kansas City Chiefs', awayTeam: 'Carolina Panthers', homeAway: 'Home', result: 'T', score: '21-21' },
  { id: 'f20-10', season: '2020', week: 10, date: '2020-11-15', opponent: 'Las Vegas Raiders', homeTeam: 'Las Vegas Raiders', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '31-24' },
  { id: 'f20-11', season: '2020', week: 11, date: '2020-11-22', opponent: 'Tampa Bay Buccaneers', homeTeam: 'Kansas City Chiefs', awayTeam: 'Tampa Bay Buccaneers', homeAway: 'Home', result: 'W', score: '38-14' },
  { id: 'f20-12', season: '2020', week: 12, date: '2020-11-29', opponent: 'Tampa Bay Buccaneers', homeTeam: 'Tampa Bay Buccaneers', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'L', score: '24-27' },
  { id: 'f20-13', season: '2020', week: 13, date: '2020-12-06', opponent: 'Denver Broncos', homeTeam: 'Kansas City Chiefs', awayTeam: 'Denver Broncos', homeAway: 'Home', result: 'W', score: '42-20' },
  { id: 'f20-14', season: '2020', week: 14, date: '2020-12-13', opponent: 'Miami Dolphins', homeTeam: 'Miami Dolphins', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '35-28' },
  { id: 'f20-15', season: '2020', week: 15, date: '2020-12-20', opponent: 'New Orleans Saints', homeTeam: 'Kansas City Chiefs', awayTeam: 'New Orleans Saints', homeAway: 'Home', result: 'W', score: '31-17' },
  { id: 'f20-16', season: '2020', week: 16, date: '2020-12-27', opponent: 'Atlanta Falcons', homeTeam: 'Atlanta Falcons', awayTeam: 'Kansas City Chiefs', homeAway: 'Away', result: 'W', score: '38-21' },
  { id: 'f20-17', season: '2020', week: 17, date: '2021-01-03', opponent: 'Los Angeles Chargers', homeTeam: 'Kansas City Chiefs', awayTeam: 'Los Angeles Chargers', homeAway: 'Home', result: 'W', score: '41-24' },
];

export const allFixtures = [
  ...fixtures2025,
  ...fixtures2024,
  ...fixtures2023,
  ...fixtures2022,
  ...fixtures2021,
  ...fixtures2020,
];

// Helper to generate library items for a fixture
const generateLibraryItems = (fixture: Fixture): LibraryItem[] => {
  const baseDate = new Date(fixture.date);
  const practiceDates = [-5, -3, -1].map(offset => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + offset);
    return d;
  });
  
  const formatDate = (date: Date) => {
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formatPracticeDate = (date: Date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Generate modified dates (for Recent view) - random dates within last 30 days
  const now = new Date();
  const getRandomModifiedDate = (seed: number) => {
    const daysAgo = Math.floor((seed % 30) + 1);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
  };

  const homeTeamAbbr = fixture.homeTeam?.split(' ').map(w => w[0]).join('').slice(0, 4).toUpperCase() || 'HOME';
  const awayTeamAbbr = fixture.awayTeam?.split(' ').map(w => w[0]).join('').slice(0, 4).toUpperCase() || 'AWAY';

  return [
    {
      id: `${fixture.id}-game`,
      fixtureId: fixture.id,
      type: 'game-footage' as const,
      title: `${homeTeamAbbr} vs ${awayTeamAbbr}`,
      duration: `${3 + Math.floor(Math.random() * 0.5)}:${20 + Math.floor(Math.random() * 30)}:${Math.floor(Math.random() * 60)}`,
      date: fixture.date,
      clips: 150 + Math.floor(Math.random() * 100),
      storage: 'Free',
      angles: 3 + Math.floor(Math.random() * 3),
      createdDate: formatDate(new Date(baseDate.getTime() + 86400000)),
      modifiedDate: getRandomModifiedDate(parseInt(fixture.id.replace(/\D/g, '')) + 0),
    },
    {
      id: `${fixture.id}-scout`,
      fixtureId: fixture.id,
      type: 'scout-report' as const,
      title: `${fixture.opponent} Game Prep`,
      duration: `${15 + Math.floor(Math.random() * 10)}:${Math.floor(Math.random() * 60)}`,
      date: fixture.date,
      clips: 10 + Math.floor(Math.random() * 10),
      storage: 'Free',
      createdDate: formatDate(practiceDates[0]),
      modifiedDate: getRandomModifiedDate(parseInt(fixture.id.replace(/\D/g, '')) + 1),
    },
    {
      id: `${fixture.id}-practice1`,
      fixtureId: fixture.id,
      type: 'practice' as const,
      title: `${formatPracticeDate(practiceDates[0])} Practice`,
      duration: `${40 + Math.floor(Math.random() * 15)}:${Math.floor(Math.random() * 60)}`,
      date: practiceDates[0].toISOString().split('T')[0],
      clips: 60 + Math.floor(Math.random() * 40),
      storage: 'Free',
      createdDate: formatDate(practiceDates[0]),
      modifiedDate: getRandomModifiedDate(parseInt(fixture.id.replace(/\D/g, '')) + 2),
    },
    {
      id: `${fixture.id}-practice2`,
      fixtureId: fixture.id,
      type: 'practice' as const,
      title: `${formatPracticeDate(practiceDates[1])} Practice`,
      duration: `${40 + Math.floor(Math.random() * 15)}:${Math.floor(Math.random() * 60)}`,
      date: practiceDates[1].toISOString().split('T')[0],
      clips: 60 + Math.floor(Math.random() * 40),
      storage: 'Free',
      createdDate: formatDate(practiceDates[1]),
      modifiedDate: getRandomModifiedDate(parseInt(fixture.id.replace(/\D/g, '')) + 3),
    },
    {
      id: `${fixture.id}-practice3`,
      fixtureId: fixture.id,
      type: 'practice' as const,
      title: `${formatPracticeDate(practiceDates[2])} Practice`,
      duration: `${40 + Math.floor(Math.random() * 15)}:${Math.floor(Math.random() * 60)}`,
      date: practiceDates[2].toISOString().split('T')[0],
      clips: 60 + Math.floor(Math.random() * 40),
      storage: 'Free',
      createdDate: formatDate(practiceDates[2]),
      modifiedDate: getRandomModifiedDate(parseInt(fixture.id.replace(/\D/g, '')) + 4),
    },
  ];
};

// Generate all library items
export const libraryItems: LibraryItem[] = allFixtures.flatMap(generateLibraryItems);

export const getLibraryItemsByFixture = (fixtureId: string): LibraryItem[] => {
  return libraryItems.filter(item => item.fixtureId === fixtureId);
};

export const getItemsByType = (fixtureId: string, type: LibraryItem['type']): LibraryItem[] => {
  return libraryItems.filter(item => item.fixtureId === fixtureId && item.type === type);
};

export const getFixturesBySeason = (season: string): Fixture[] => {
  return allFixtures.filter(fixture => fixture.season === season);
};

export const seasons = ['2025', '2024', '2023', '2022', '2021', '2020'];
