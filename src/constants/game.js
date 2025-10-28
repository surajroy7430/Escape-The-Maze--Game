// Game type definitions as constants and helper functions

export const CELL_TYPES = {
  PATH: 0,
  WALL: 1,
  START: 2,
  GOAL: 3,
  SAW: 4,
  SNAKE: 5,
  COIN: 6,
  GEM: 7,
};

export const createPosition = (x, y) => ({ x, y });

export const createGameStats = (stats = {}) => ({
  wins: 0,
  losses: 0,
  bestTime: 0,
  currentStreak: 0,
  totalGames: 0,
  level1Wins: 0,
  level2Wins: 0,
  level3Wins: 0,
  level4Wins: 0,
  level5Wins: 0,
  totalScore: 0,
  coinsCollected: 0,
  gemsCollected: 0,
  ...stats,
});

export const createGameState = (state = {}) => ({
  playerPosition: createPosition(1, 1),
  isGameActive: false,
  isGamePaused: false,
  isGameWon: false,
  isGameLost: false,
  startTime: 0,
  currentTime: 0,
  pausedTime: 0,
  score: 0,
  currentLevel: 1,
  collectedRewards: [],
  lossReason: "",
  ...state,
});

export const createLevelConfig = (config) => ({
  name: "",
  description: "",
  timeLimit: 0,
  coinValue: 50,
  gemValue: 100,
  maze: [],
  ...config,
});
