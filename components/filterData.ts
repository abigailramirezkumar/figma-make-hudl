// Basic filter options
export const seasons = ['All', '2024', '2023', '2022', '2021', '2020'];
export const weeks = ['All', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12', 'Week 13', 'Week 14', 'Week 15', 'Week 16', 'Week 17', 'Week 18', 'Playoffs'];
export const sideOfBallOptions = ['Offense', 'Defense'];
export const clipSourceOptions = ['All', 'Scout', 'Game', 'Practice'];
export const playTypes = ['All', 'Pass', 'Run', 'Punt', 'Field Goal', 'Kickoff', 'Extra Point'];
export const results = ['All', 'Complete', 'Incomplete', 'Touchdown', 'Interception', 'Fumble', 'Sack', 'First Down'];
export const downOptions = ['1st', '2nd', '3rd', '4th'];
export const distanceOptions = ['Short (<3)', 'Medium (4-6)', 'Long (7-10)', 'Very Long (11+)'];

// Championship options
export const championships = ['All', 'NFL', 'NCAA D1', 'NCAA D2', 'NCAA D3'];

// Team data by championship
export const nflTeams = [
  // AFC East
  'Buffalo Bills', 'Miami Dolphins', 'New England Patriots', 'New York Jets',
  // AFC North
  'Baltimore Ravens', 'Cincinnati Bengals', 'Cleveland Browns', 'Pittsburgh Steelers',
  // AFC South
  'Houston Texans', 'Indianapolis Colts', 'Jacksonville Jaguars', 'Tennessee Titans',
  // AFC West
  'Denver Broncos', 'Kansas City Chiefs', 'Las Vegas Raiders', 'Los Angeles Chargers',
  // NFC East
  'Dallas Cowboys', 'New York Giants', 'Philadelphia Eagles', 'Washington Commanders',
  // NFC North
  'Chicago Bears', 'Detroit Lions', 'Green Bay Packers', 'Minnesota Vikings',
  // NFC South
  'Atlanta Falcons', 'Carolina Panthers', 'New Orleans Saints', 'Tampa Bay Buccaneers',
  // NFC West
  'Arizona Cardinals', 'Los Angeles Rams', 'San Francisco 49ers', 'Seattle Seahawks'
];

export const ncaaD1Teams = [
  // SEC
  'Alabama Crimson Tide', 'Auburn Tigers', 'Florida Gators', 'Georgia Bulldogs', 'Kentucky Wildcats', 'LSU Tigers',
  'Mississippi State Bulldogs', 'Ole Miss Rebels', 'South Carolina Gamecocks', 'Tennessee Volunteers', 
  'Texas A&M Aggies', 'Vanderbilt Commodores', 'Arkansas Razorbacks', 'Missouri Tigers', 'Texas Longhorns', 'Oklahoma Sooners',
  // Big Ten
  'Illinois Fighting Illini', 'Indiana Hoosiers', 'Iowa Hawkeyes', 'Maryland Terrapins', 'Michigan Wolverines',
  'Michigan State Spartans', 'Minnesota Golden Gophers', 'Nebraska Cornhuskers', 'Northwestern Wildcats',
  'Ohio State Buckeyes', 'Penn State Nittany Lions', 'Purdue Boilermakers', 'Rutgers Scarlet Knights', 'Wisconsin Badgers',
  'UCLA Bruins', 'USC Trojans', 'Oregon Ducks', 'Washington Huskies',
  // Big 12
  'Baylor Bears', 'Iowa State Cyclones', 'Kansas Jayhawks', 'Kansas State Wildcats', 'Oklahoma State Cowboys',
  'TCU Horned Frogs', 'Texas Tech Red Raiders', 'West Virginia Mountaineers', 'Cincinnati Bearcats', 'Houston Cougars',
  'UCF Knights', 'BYU Cougars', 'Arizona Wildcats', 'Arizona State Sun Devils', 'Colorado Buffaloes', 'Utah Utes',
  // ACC
  'Boston College Eagles', 'Clemson Tigers', 'Duke Blue Devils', 'Florida State Seminoles', 'Georgia Tech Yellow Jackets',
  'Louisville Cardinals', 'Miami Hurricanes', 'NC State Wolfpack', 'North Carolina Tar Heels', 'Pittsburgh Panthers',
  'Syracuse Orange', 'Virginia Cavaliers', 'Virginia Tech Hokies', 'Wake Forest Demon Deacons', 'Notre Dame Fighting Irish',
  // Pac-12 (remaining)
  'California Golden Bears', 'Stanford Cardinal', 'Washington State Cougars', 'Oregon State Beavers'
];

export const ncaaD2Teams = [
  'Adams State Grizzlies', 'Albany State Golden Rams', 'Angelo State Rams', 'Ashland Eagles',
  'Augustana Vikings', 'Bemidji State Beavers', 'Bloomsburg Huskies', 'California (PA) Vulcans',
  'Central Missouri Mules', 'Central Washington Wildcats', 'Chadron State Eagles', 'Colorado Mesa Mavericks',
  'Colorado School of Mines Orediggers', 'Colorado State Pueblo ThunderWolves', 'Concord Mountain Lions',
  'Delta State Statesmen', 'Dixie State Trailblazers', 'East Central Tigers', 'East Stroudsburg Warriors',
  'Emporia State Hornets', 'Ferris State Bulldogs', 'Fort Hays State Tigers', 'Fort Lewis Skyhawks',
  'Grand Valley State Lakers', 'Harding Bisons', 'Henderson State Reddies', 'Hillsdale Chargers',
  'Indiana (PA) Crimson Hawks', 'Kutztown Golden Bears', 'Lake Erie Storm', 'Lenoir-Rhyne Bears',
  'Lincoln Blue Tigers', 'Lindenwood Lions', 'Michigan Tech Huskies', 'Midwestern State Mustangs',
  'Minnesota Duluth Bulldogs', 'Minnesota State Mavericks', 'Missouri Southern Lions', 'Missouri Western Griffons',
  'New Mexico Highlands Cowboys', 'North Alabama Lions', 'North Dakota Fighting Hawks', 'Northern Colorado Bears',
  'Northern Michigan Wildcats', 'Northwest Missouri State Bearcats', 'Pittsburg State Gorillas',
  'Shepherd Rams', 'Shippensburg Red Raiders', 'Slippery Rock Pride', 'South Dakota Coyotes',
  'South Dakota School of Mines Hardrockers', 'Southwest Baptist Bearcats', 'Texas A&M-Commerce Lions',
  'Truman State Bulldogs', 'Tuskegee Golden Tigers', 'UNC Pembroke Braves', 'Valdosta State Blazers',
  'Wayne State Warriors', 'West Chester Golden Rams', 'West Florida Argonauts', 'Western Colorado Mountaineers',
  'Western Oregon Wolves', 'Western State Colorado Mountaineers', 'Winona State Warriors'
];

export const ncaaD3Teams = [
  'Allegheny Gators', 'Alma Scots', 'Amherst Mammoths', 'Augsburg Auggies', 'Baldwin Wallace Yellow Jackets',
  'Bates Bobcats', 'Bethel Royals', 'Bowdoin Polar Bears', 'Bridgewater Eagles', 'Brockport Golden Eagles',
  'Buffalo State Bengals', 'Calvin Knights', 'Carleton Knights', 'Carnegie Mellon Tartans', 'Case Western Spartans',
  'Central College Dutch', 'Centre Colonels', 'Christopher Newport Captains', 'Colby Mules', 'Cortland Red Dragons',
  'Delaware Valley Aggies', 'Denison Big Red', 'DePauw Tigers', 'Dickinson Red Devils', 'Emory Eagles',
  'Frostburg State Bobcats', 'Gettysburg Bullets', 'Gustavus Adolphus Golden Gusties', 'Hamilton Continentals',
  'Hamline Pipers', 'Hardin-Simmons Cowboys', 'Hope Flying Dutchmen', 'Ithaca Bombers', 'Johns Hopkins Blue Jays',
  'Kalamazoo Hornets', 'Kenyon Lords', 'Knox Prairie Fire', 'Lake Forest Foresters', 'Lebanon Valley Flying Dutchmen',
  'Linfield Wildcats', 'Luther Norse', 'Lycoming Warriors', 'Macalester Scots', 'Mary Hardin-Baylor Crusaders',
  'Middlebury Panthers', 'Millikin Big Blue', 'Montclair State Red Hawks', 'Mount Union Purple Raiders',
  'Muhlenberg Mules', 'New Jersey City Gothic Knights', 'North Central Cardinals', 'Occidental Tigers',
  'Ohio Northern Polar Bears', 'Olivet Comets', 'Pacific Lutheran Lutes', 'Plymouth State Panthers',
  'Pomona-Pitzer Sagehens', 'Puget Sound Loggers', 'Randolph-Macon Yellow Jackets', 'Rhodes Lynx',
  'Ripon Red Hawks', 'Rochester Yellowjackets', 'Rose-Hulman Fightin\' Engineers', 'RPI Engineers',
  'Salisbury Sea Gulls', 'Springfield Pride', 'St. John\'s Johnnies', 'St. Norbert Green Knights',
  'St. Olaf Oles', 'St. Thomas Tommies', 'Susquehanna River Hawks', 'Swarthmore Garnet', 'Trinity Bantams',
  'Tufts Jumbos', 'Union Dutchmen', 'Ursinus Bears', 'Washington and Lee Generals', 'Washington University Bears',
  'Wesleyan Cardinals', 'Wheaton Thunder', 'Whitworth Pirates', 'Widener Pride', 'Williams Ephs',
  'Wisconsin-Eau Claire Blugolds', 'Wisconsin-La Crosse Eagles', 'Wisconsin-Oshkosh Titans',
  'Wisconsin-Platteville Pioneers', 'Wisconsin-River Falls Falcons', 'Wisconsin-Stevens Point Pointers',
  'Wisconsin-Stout Blue Devils', 'Wisconsin-Whitewater Warhawks', 'Wittenberg Tigers'
];

// Helper function to get teams by championship
export const getTeamsByChampionship = (championship: string): string[] => {
  switch (championship) {
    case 'NFL':
      return nflTeams;
    case 'NCAA D1':
      return ncaaD1Teams;
    case 'NCAA D2':
      return ncaaD2Teams;
    case 'NCAA D3':
      return ncaaD3Teams;
    case 'All':
      return [];
    default:
      return [];
  }
};

// Players and quarterbacks
export const quarterbacks = [
  'Josh Allen', 'Lamar Jackson', 'Aaron Rodgers', 'Tom Brady', 'Patrick Mahomes', 'Dak Prescott',
  'Russell Wilson', 'Kyler Murray', 'Joe Burrow', 'Justin Herbert', 'Tua Tagovailoa', 'Mac Jones',
  'Jalen Hurts', 'Daniel Jones', 'Kirk Cousins', 'Derek Carr', 'Ryan Tannehill', 'Matt Ryan',
  'Carson Wentz', 'Jameis Winston', 'Baker Mayfield', 'Sam Darnold', 'Teddy Bridgewater', 'Jimmy Garoppolo'
];

export const players = [
  // Wide Receivers
  'Davante Adams', 'DeAndre Hopkins', 'Stefon Diggs', 'Tyreek Hill', 'Cooper Kupp', 'Calvin Ridley',
  'Mike Evans', 'Chris Godwin', 'Amari Cooper', 'Tyler Lockett', 'Keenan Allen', 'CeeDee Lamb',
  'DK Metcalf', 'Terry McLaurin', 'Courtland Sutton', 'Jerry Jeudy', 'Jaylen Waddle', 'DeVonta Smith',
  'A.J. Brown', 'Ja\'Marr Chase', 'Tee Higgins', 'Michael Pittman Jr.', 'Diontae Johnson', 'Chase Claypool',
  
  // Running Backs
  'Derrick Henry', 'Jonathan Taylor', 'Austin Ekeler', 'Alvin Kamara', 'Dalvin Cook', 'Nick Chubb',
  'Joe Mixon', 'Ezekiel Elliott', 'Saquon Barkley', 'Christian McCaffrey', 'Aaron Jones', 'Josh Jacobs',
  'Clyde Edwards-Helaire', 'Miles Sanders', 'D\'Andre Swift', 'James Robinson', 'Kareem Hunt', 'Leonard Fournette',
  
  // Tight Ends
  'Travis Kelce', 'George Kittle', 'Darren Waller', 'Mark Andrews', 'T.J. Hockenson', 'Kyle Pitts',
  'Mike Gesicki', 'Dallas Goedert', 'Noah Fant', 'Tyler Higbee', 'Hunter Henry', 'Rob Gronkowski',
  
  // Defensive Players
  'Aaron Donald', 'T.J. Watt', 'Myles Garrett', 'Khalil Mack', 'Von Miller', 'Chandler Jones',
  'Jalen Ramsey', 'Stephon Gilmore', 'Xavien Howard', 'Tre\'Davious White', 'Derwin James', 'Minkah Fitzpatrick'
];

// Formation and advanced options
export const formationOptions = ['All', 'I-Formation', 'Shotgun', 'Pistol', 'Singleback', 'Wildcat', 'Goal Line'];
export const personnelGroupings = ['All', '11 Personnel', '12 Personnel', '21 Personnel', '22 Personnel', '10 Personnel', '13 Personnel'];
export const coverageTypes = ['All', 'Cover 0', 'Cover 1', 'Cover 2', 'Cover 3', 'Cover 4', 'Cover 6', 'Man', 'Zone'];
export const playDirections = ['Left', 'Right', 'Middle', 'Outside'];
export const rushTypes = ['Inside Zone', 'Outside Zone', 'Gap', 'Power', 'Counter', 'Draw', 'Sweep'];
export const passTypes = ['Quick Game', 'Intermediate', 'Deep', 'Screen', 'Play Action', 'RPO'];
export const routeConcepts = ['Slants', 'Hitches', 'Comebacks', 'Outs', 'Posts', 'Go Routes', 'Drags', 'Crossing Routes'];

// OFF PLAY options with hierarchical structure
export interface MetricOption {
  value: string;
  children?: MetricOption[];
}

export const playDirOptions = ['Left', 'Middle', 'Right'];
export const hashOptions = ['Left', 'Middle', 'Right'];

export const offPlayOptions: MetricOption[] = [
  { value: 'Back Shoulder' },
  { value: 'Jet Sweep' },
  { value: 'Power' },
  { value: 'Counter' },
  { value: 'Inside Zone' },
  { value: 'Outside Zone' },
  { value: 'Split Zone' },
  { value: 'Duo' },
  { value: 'Trap' },
  { value: 'Pull' },
  { value: 'Toss' },
  { value: 'Sweep' },
  { value: 'Pitch' },
  { value: 'Draw' },
  { value: 'Delay' },
  { value: 'QB Sneak' },
  { value: 'QB Draw' },
  { value: 'QB Power' },
  { value: 'Read Option' },
  { value: 'Speed Option' },
  { value: 'Triple Option' },
  { value: 'Veer' },
  { value: 'Inverted Veer' },
  { value: 'Zone Read' },
  { value: 'Slant' },
  { value: 'Flat' },
  { value: 'Out' },
  { value: 'Comeback' },
  { value: 'Curl' },
  { value: 'Hitch' },
  { value: 'Go' },
  { value: 'Post' },
  { value: 'Corner' },
  { value: 'Dig' },
  { value: 'Seam' },
  { value: 'Wheel' },
  { value: 'Screen' },
  { value: 'Bubble Screen' },
  { value: 'Smoke Screen' },
  { value: 'Tunnel Screen' },
  { value: 'Play Action Pass' },
  { value: 'Boot' },
  { value: 'Naked Boot' },
  { value: 'RPO' },
  { value: 'Stick' },
  { value: 'Mesh' },
  { value: 'Levels' },
  { value: 'Flood' },
  { value: 'Smash' },
  { value: 'Four Verticals' },
  { value: 'Y-Cross' },
  { value: 'Scissors' },
  { value: 'Curl Flat' },
  { value: 'Sail' },
  { value: 'Drive' },
  { value: 'Spacing' }
];

export const offFormOptions: MetricOption[] = [
  {
    value: 'Ace',
    children: [
      { value: 'Ace Pair' },
      { value: 'Ace Trips' },
      { value: 'Ace Wing' },
      { value: 'Ace Doubles' }
    ]
  },
  {
    value: 'Shotgun',
    children: [
      { value: 'Shotgun Empty' },
      { value: 'Shotgun Trips' },
      { value: 'Shotgun Bunch' },
      { value: 'Shotgun Wing' },
      { value: 'Shotgun Spread' }
    ]
  },
  {
    value: 'I-Formation',
    children: [
      { value: 'I-Form Pro' },
      { value: 'I-Form Tight' },
      { value: 'I-Form Twins' },
      { value: 'I-Form Slot' }
    ]
  },
  {
    value: 'Pistol',
    children: [
      { value: 'Pistol Strong' },
      { value: 'Pistol Weak' },
      { value: 'Pistol Ace' },
      { value: 'Pistol Trips' }
    ]
  },
  {
    value: 'Singleback',
    children: [
      { value: 'Singleback Ace' },
      { value: 'Singleback Deuce' },
      { value: 'Singleback Wing' },
      { value: 'Singleback Bunch' }
    ]
  },
  { value: 'Wildcat' },
  { value: 'Goal Line' },
  {
    value: 'Pro Set',
    children: [
      { value: 'Pro Set Twins' },
      { value: 'Pro Set Trips' },
      { value: 'Pro Set Slot' }
    ]
  },
  {
    value: 'Spread',
    children: [
      { value: 'Spread 4 Wide' },
      { value: 'Spread 5 Wide' },
      { value: 'Spread Trips' }
    ]
  },
  { value: 'Jumbo' },
  { value: 'Heavy' }
];

export const offStrOptions: MetricOption[] = [
  {
    value: '11',
    children: [
      { value: '11 Base' },
      { value: '11 Trips' },
      { value: '11 Empty' }
    ]
  },
  {
    value: '12',
    children: [
      { value: '12 Base' },
      { value: '12 Wing' },
      { value: '12 Nasty' }
    ]
  },
  {
    value: '21',
    children: [
      { value: '21 Base' },
      { value: '21 Pro' },
      { value: '21 Ace' }
    ]
  },
  {
    value: '22',
    children: [
      { value: '22 Base' },
      { value: '22 Heavy' }
    ]
  },
  { value: '10' },
  { value: '13' },
  { value: '20' },
  { value: '23' }
];

export interface MetricCategory {
  label: string;
  key: string;
  options: string[] | MetricOption[];
  isHierarchical?: boolean;
}

// Filter state interface
export interface FilterState {
  // Basic filters
  season: string;
  week: string;
  championship: string;
  team: string;
  player: string[]; // Changed to array for multiple player selection
  clipSource: string;
  sideOfBall: string | null;
  playType: string;
  result: string;
  selectedDowns: string[];
  selectedDistances: string[];
  playerInvolved: string;
  qbName: string;
  hasNotes: boolean;
  hasComments: boolean;

  // Advanced filters
  gameRelated: {
    quarter: [number, number];
    timeRemaining: [number, number];
    scoreMargin: [number, number];
  };
  timeRelated: {
    gameTime: [number, number];
    playClock: [number, number];
  };
  fieldRelated: {
    yardLine: [number, number];
    redZone: boolean;
    goalLine: boolean;
    midfield: boolean;
  };
  formation: {
    offensiveFormation: string;
    motionUsed: boolean;
    shiftsUsed: boolean;
  };
  personnelGrouping: {
    offensive: string;
    defensive: string;
  };
  coverage: {
    coverageType: string;
    blitzPresent: boolean;
    manCoverage: boolean;
  };
  performance: {
    yardsGained: [number, number];
    successRate: [number, number];
    epa: [number, number];
  };
  playResultAnalysis: {
    firstDownGained: boolean;
    touchdownScored: boolean;
    turnoverOccurred: boolean;
  };
  passSpecific: {
    passType: string;
    routeConcept: string;
    targetDepth: [number, number];
  };
  runSpecific: {
    rushType: string;
    runDirection: string;
    runGap: string;
  };
  specialTeams: {
    kickoffType: string;
    puntType: string;
    fieldGoalDistance: [number, number];
  };
}

export const defaultFilters: FilterState = {
  // Basic filters
  season: 'All',
  week: 'All',
  championship: 'All',
  team: '',
  player: [],
  clipSource: 'All',
  sideOfBall: null,
  playType: 'All',
  result: 'All',
  selectedDowns: [],
  selectedDistances: [],
  playerInvolved: '',
  qbName: '',
  hasNotes: false,
  hasComments: false,

  // Advanced filters
  gameRelated: {
    quarter: [1, 4],
    timeRemaining: [0, 60],
    scoreMargin: [-50, 50],
  },
  timeRelated: {
    gameTime: [0, 60],
    playClock: [0, 40],
  },
  fieldRelated: {
    yardLine: [0, 100],
    redZone: false,
    goalLine: false,
    midfield: false,
  },
  formation: {
    offensiveFormation: 'All',
    motionUsed: false,
    shiftsUsed: false,
  },
  personnelGrouping: {
    offensive: 'All',
    defensive: 'All',
  },
  coverage: {
    coverageType: 'All',
    blitzPresent: false,
    manCoverage: false,
  },
  performance: {
    yardsGained: [-20, 100],
    successRate: [0, 100],
    epa: [-5, 5],
  },
  playResultAnalysis: {
    firstDownGained: false,
    touchdownScored: false,
    turnoverOccurred: false,
  },
  passSpecific: {
    passType: 'All',
    routeConcept: 'All',
    targetDepth: [0, 60],
  },
  runSpecific: {
    rushType: 'All',
    runDirection: 'All',
    runGap: 'All',
  },
  specialTeams: {
    kickoffType: 'All',
    puntType: 'All',
    fieldGoalDistance: [0, 70],
  },
};