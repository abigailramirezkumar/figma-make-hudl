import { d1FootballPlayers } from './playerData';

export interface Play {
  id: number;
  team: string;
  opponent: string; // This will now contain player names
  clipSource: 'Scout' | 'Game' | 'Practice';
  date: string;
  time: string;
  qtr: number;
  odk: 'Offense' | 'Defense';
  dn: number;
  dist: number;
  yardLn: number;
  gnLs: number;
  eff: 'Y' | 'N';
  offStr: string;
  offForm: string;
  offPlay: string;
  playFamily: string;
  playDir: string;
  hash: string;
  playType: string;
  result: string;
  player?: string;
  qbName?: string;
}

const teams = [
  "Kansas City Chiefs", "Buffalo Bills", "Miami Dolphins", "New England Patriots",
  "Cincinnati Bengals", "Pittsburgh Steelers", "Baltimore Ravens", "Cleveland Browns",
  "Houston Texans", "Indianapolis Colts", "Jacksonville Jaguars", "Tennessee Titans",
  "Denver Broncos", "Las Vegas Raiders", "Los Angeles Chargers", "Dallas Cowboys",
  "New York Giants", "Philadelphia Eagles", "Washington Commanders", "Chicago Bears",
  "Detroit Lions", "Green Bay Packers", "Minnesota Vikings", "Atlanta Falcons",
  "Carolina Panthers", "New Orleans Saints", "Tampa Bay Buccaneers", "Arizona Cardinals",
  "Los Angeles Rams", "San Francisco 49ers", "Seattle Seahawks",
  "Alabama Crimson Tide", "Georgia Bulldogs", "Michigan Wolverines", "Ohio State Buckeyes",
  "Texas Longhorns", "LSU Tigers", "Oregon Ducks", "Washington Huskies",
  "USC Trojans", "Notre Dame Fighting Irish", "Clemson Tigers", "Florida State Seminoles",
  "Miami Hurricanes", "Penn State Nittany Lions", "Wisconsin Badgers", "Iowa Hawkeyes"
];

const dates = ["Nov 20", "Nov 21", "Nov 22", "Nov 23", "Nov 24", "Nov 25", "Nov 26", "Nov 27", "Nov 28", "Nov 29", "Nov 30", "Dec 1", "Dec 2", "Dec 3", "Dec 4", "Dec 5", "Dec 6", "Dec 7", "Dec 8", "Dec 9", "Dec 10", "Dec 11", "Dec 12", "Dec 13", "Dec 14", "Dec 15"];
const formations = ["Shotgun", "I-Formation", "Singleback", "Pistol", "Spread", "Pro Set", "Wildcat"];
const playTypes = ["Pass", "Run"];
const playDirs = ["Left", "Right", "Middle"];
const hashes = ["Left", "Right", "Middle"];
const playFamilies = ["Play Action", "Zone Run", "4 Verticals", "Crossing Routes", "Quick Game", "QB Run", "Gap Run", "Go Routes", "Comeback Routes", "Screen", "Stick Concept", "RPO", "Wheel Concept", "Draw", "Goal Line", "Outside Run"];
const passResults = ["Complete", "Incomplete", "Touchdown", "First Down", "Short Gain", "Interception"];
const runResults = ["First Down", "Short Gain", "Tackle for Loss", "Touchdown", "No Gain"];
const offStrs = ["11", "12", "21", "22", "13", "10"];
const clipSources: ('Scout' | 'Game' | 'Practice')[] = ["Scout", "Game", "Practice"];

function generatePlay(id: number): Play {
  // Use D1 player for the opponent field (now representing Player)
  const playerName = d1FootballPlayers[Math.floor(Math.random() * d1FootballPlayers.length)];
  const clipSource: 'Scout' | 'Game' | 'Practice' = clipSources[Math.floor(Math.random() * clipSources.length)];
  const date = dates[Math.floor(Math.random() * dates.length)];
  const qtr = Math.floor(Math.random() * 4) + 1;
  const minutes = Math.floor(Math.random() * 15);
  const seconds = Math.floor(Math.random() * 60);
  const time = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const odk: 'Offense' | 'Defense' = Math.random() > 0.6 ? 'Offense' : 'Defense';
  const dn = Math.floor(Math.random() * 4) + 1;
  const dist = Math.floor(Math.random() * 20) + 1;
  const yardLn = Math.floor(Math.random() * 80) + 10;
  const playType = playTypes[Math.floor(Math.random() * playTypes.length)];
  
  let gnLs: number;
  let result: string;
  if (playType === "Pass") {
    result = passResults[Math.floor(Math.random() * passResults.length)];
    gnLs = result === "Incomplete" ? 0 : result === "Interception" ? 0 : result === "Touchdown" ? Math.floor(Math.random() * 30) + 10 : Math.floor(Math.random() * 25) - 3;
  } else {
    result = runResults[Math.floor(Math.random() * runResults.length)];
    gnLs = result === "No Gain" ? 0 : result === "Tackle for Loss" ? -Math.floor(Math.random() * 5) - 1 : result === "Touchdown" ? Math.floor(Math.random() * 40) + 10 : Math.floor(Math.random() * 15);
  }
  
  const eff: 'Y' | 'N' = gnLs >= dist || result === "Touchdown" || result === "First Down" ? 'Y' : 'N';
  const offStr = offStrs[Math.floor(Math.random() * offStrs.length)];
  const offForm = formations[Math.floor(Math.random() * formations.length)];
  const playFamily = playFamilies[Math.floor(Math.random() * playFamilies.length)];
  const playDir = playDirs[Math.floor(Math.random() * playDirs.length)];
  const hash = hashes[Math.floor(Math.random() * hashes.length)];
  
  const passPlays = ["PA Boot Right", "Smash Concept", "Comeback Route", "Four Verticals", "Slant Route", "Stick Route", "Out Route", "Dig Route", "Fade Route", "Hitch Route", "Curl Route", "Crossing Route", "Screen Pass", "Deep Comeback", "Post Route", "Quick Slant", "Corner Route", "Back Shoulder", "Go Route", "Drag Route", "PA Deep Ball", "Seam Route", "Wheel Route", "RPO Slant", "Mesh Concept", "Tunnel Screen", "Bubble Screen"];
  const runPlays = ["Inside Zone", "Outside Zone", "QB Power", "Sweep Run", "Power Run", "Stretch Run", "Counter Run", "Goal Line Run", "QB Draw", "Dive Run", "Toss Sweep", "Draw Play", "Trap Run", "Jet Sweep", "Fullback Dive"];
  
  const offPlay = playType === "Pass" ? passPlays[Math.floor(Math.random() * passPlays.length)] : runPlays[Math.floor(Math.random() * runPlays.length)];
  
  const player = d1FootballPlayers[Math.floor(Math.random() * d1FootballPlayers.length)];
  
  const qbs = ["Patrick Mahomes", "Josh Allen", "Tua Tagovailoa", "Mac Jones", "Joe Burrow", "Kenny Pickett", "Lamar Jackson", "Deshaun Watson", "C.J. Stroud", "Anthony Richardson", "Trevor Lawrence", "Ryan Tannehill", "Russell Wilson", "Derek Carr", "Justin Herbert", "Dak Prescott", "Daniel Jones", "Jalen Hurts", "Sam Howell", "Caleb Williams", "Jared Goff", "Jordan Love", "Kirk Cousins", "Bryce Young", "Baker Mayfield", "Kyler Murray", "Matthew Stafford", "Brock Purdy", "Geno Smith"];
  const qbName = qbs[Math.floor(Math.random() * qbs.length)];
  
  return {
    id,
    team: 'Hudl',
    opponent: playerName, // Now contains D1 player name
    clipSource,
    date,
    time,
    qtr,
    odk,
    dn,
    dist,
    yardLn,
    gnLs,
    eff,
    offStr,
    offForm,
    offPlay,
    playFamily,
    playDir,
    hash,
    playType,
    result,
    player,
    qbName
  };
}

export const mockPlays: Play[] = Array.from({ length: 1000 }, (_, i) => generatePlay(1001 + i));