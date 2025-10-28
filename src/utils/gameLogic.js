import { createGameStats, createPosition, CELL_TYPES } from "../constants/game";

export const STORAGE_KEY = "maze-game-stats";

export const defaultStats = createGameStats();

export const getGameStats = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return Object.assign({}, defaultStats, JSON.parse(stored || "{}"));
  } catch {
    return defaultStats;
  }
};

export const saveGameStats = (stats) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error("Failed to save game stats:", error);
  }
};

export const updateStatsOnWin = (
  timeInSeconds,
  level,
  score,
  coinsCollected,
  gemsCollected
) => {
  const currentStats = getGameStats();
  const levelKey = `level${level}Wins`;

  const newStats = {
    ...currentStats,
    wins: currentStats.wins + 1,
    bestTime:
      currentStats.bestTime === 0
        ? timeInSeconds
        : Math.min(currentStats.bestTime, timeInSeconds),
    currentStreak: currentStats.currentStreak + 1,
    totalGames: currentStats.totalGames + 1,
    [levelKey]: (currentStats[levelKey] || 0) + 1,
    totalScore: currentStats.totalScore + score,
    coinsCollected: currentStats.coinsCollected + coinsCollected,
    gemsCollected: currentStats.gemsCollected + gemsCollected,
  };
  saveGameStats(newStats);
  return newStats;
};

export const updateStatsOnLoss = () => {
  const currentStats = getGameStats();
  const newStats = {
    ...currentStats,
    losses: currentStats.losses + 1,
    currentStreak: 0,
    totalGames: currentStats.totalGames + 1,
  };
  saveGameStats(newStats);
  return newStats;
};

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export const calculateScore = (
  timeInSeconds,
  level,
  coinsCollected,
  gemsCollected,
  coinValue,
  gemValue
) => {
  const baseScore = 1000 + level * 200;
  const timePenalty = Math.min(timeInSeconds * 2, 900);
  const timeScore = Math.max(baseScore - timePenalty, 100);
  const rewardScore = coinsCollected * coinValue + gemsCollected * gemValue;
  return timeScore + rewardScore;
};

export const isValidMove = (maze, position) => {
  const { x, y } = position;
  if (x < 0 || x >= maze[0].length || y < 0 || y >= maze.length) {
    return false;
  }
  return maze[y][x] !== CELL_TYPES.WALL;
};

export const isGoalReached = (maze, position) => {
  const { x, y } = position;
  return maze[y][x] === CELL_TYPES.GOAL;
};

export const isObstacle = (maze, position) => {
  const { x, y } = position;
  const cell = maze[y][x];
  if (cell === CELL_TYPES.SAW) return { isObstacle: true, type: "saw" };
  if (cell === CELL_TYPES.SNAKE) return { isObstacle: true, type: "snake" };
  return { isObstacle: false, type: "" };
};

export const isReward = (maze, position) => {
  const { x, y } = position;
  const cell = maze[y][x];
  if (cell === CELL_TYPES.COIN)
    return { isReward: true, type: "coin", value: 50 };
  if (cell === CELL_TYPES.GEM)
    return { isReward: true, type: "gem", value: 100 };
  return { isReward: false, type: "", value: 0 };
};

export const findStartPosition = (maze) => {
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === CELL_TYPES.START) {
        return createPosition(x, y);
      }
    }
  }
  return createPosition(1, 1); // Fallback
};

// Level configurations
export const LEVELS = [
  {
    name: "Novice Path",
    description: "A gentle introduction to maze navigation",
    timeLimit: 0,
    coinValue: 50,
    gemValue: 100,
    maze: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 6, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 4, 7, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 6, 5, 1],
      [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
  },
  {
    name: "Apprentice Trial",
    description: "Beware of the spinning saws!",
    timeLimit: 120,
    coinValue: 75,
    gemValue: 150,
    maze: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 0, 5, 1, 0, 0, 6, 1, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 4, 0, 1, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 6, 5, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 4, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 7, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 4, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
  },
  {
    name: "Warrior's Gauntlet",
    description: "Navigate through deadly serpents and sharp blades",
    timeLimit: 100,
    coinValue: 100,
    gemValue: 200,
    maze: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 0, 0, 1, 0, 6, 1, 1, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 5, 0, 1, 0, 0, 1, 0, 6, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 4, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
      [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 7, 0, 0, 0, 0, 0, 0, 1, 0, 0, 4, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 4, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 1, 0, 6, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 5, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
  },
  {
    name: "Master's Labyrinth",
    description:
      "Only the skilled survive this treacherous maze with moving snakes",
    timeLimit: 90,
    coinValue: 125,
    gemValue: 250,
    maze: [
      [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1,
      ],
      [
        1, 2, 0, 0, 1, 0, 5, 0, 1, 0, 6, 0, 0, 5, 0, 0, 7, 0, 0, 0, 0, 5, 0, 0,
        0, 0, 0, 1,
      ],
      [
        1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1,
        1, 1, 0, 1,
      ],
      [
        1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 5, 0, 1, 0, 0, 1, 0, 6, 0, 1, 0, 1,
        0, 0, 0, 1,
      ],
      [
        1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1,
        0, 1, 0, 1,
      ],
      [
        1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 7, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
        0, 1, 0, 1,
      ],
      [
        1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1,
        0, 1, 0, 1,
      ],
      [
        1, 0, 0, 0, 1, 0, 0, 0, 0, 5, 0, 0, 1, 0, 0, 4, 0, 0, 0, 0, 0, 6, 0, 1,
        0, 0, 0, 1,
      ],
      [
        1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1,
        1, 1, 0, 1,
      ],
      [
        1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 6, 0, 0, 1, 0, 0,
        0, 5, 0, 1,
      ],
      [
        1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1,
        0, 1, 0, 1,
      ],
      [
        1, 0, 0, 5, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 5,
        0, 0, 0, 1,
      ],
      [
        1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0,
        1, 1, 0, 1,
      ],
      [
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 4, 0, 1,
      ],
      [
        1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 0, 3, 1,
      ],
      [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1,
      ],
    ],
  },
  {
    name: "Nightmare Realm",
    description: "The ultimate test with roaming serpents and deadly traps",
    timeLimit: 75,
    coinValue: 150,
    gemValue: 300,
    maze: [
      [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1,
      ],
      [
        1, 2, 0, 0, 1, 0, 0, 0, 1, 0, 6, 0, 0, 5, 0, 0, 7, 0, 0, 0, 0, 5, 0, 4,
        0, 0, 6, 0, 0, 1,
      ],
      [
        1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1,
        1, 1, 0, 1, 0, 1,
      ],
      [
        1, 0, 0, 0, 4, 0, 1, 0, 0, 0, 1, 0, 5, 0, 1, 0, 0, 1, 0, 6, 0, 1, 0, 1,
        0, 4, 0, 1, 0, 1,
      ],
      [
        1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1,
        0, 1, 0, 1, 0, 1,
      ],
      [
        1, 0, 0, 5, 0, 0, 0, 0, 1, 0, 0, 0, 1, 7, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
        0, 1, 0, 0, 0, 1,
      ],
      [
        1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1,
        0, 1, 1, 1, 0, 1,
      ],
      [
        1, 0, 0, 0, 1, 0, 0, 0, 0, 5, 0, 0, 1, 0, 0, 4, 0, 0, 0, 0, 0, 6, 4, 1,
        0, 0, 0, 5, 0, 1,
      ],
      [
        1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1,
        1, 1, 0, 1, 0, 1,
      ],
      [
        1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 6, 0, 0, 1, 0, 0,
        0, 5, 0, 0, 0, 1,
      ],
      [
        1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1,
        0, 1, 1, 1, 0, 1,
      ],
      [
        1, 0, 0, 5, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 5,
        0, 0, 0, 4, 0, 1,
      ],
      [
        1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 0,
        1, 1, 1, 5, 0, 1,
      ],
      [
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1,
      ],
      [
        1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 0, 1,
      ],
      [
        1, 0, 0, 5, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 5,
        0, 0, 0, 0, 0, 1,
      ],
      [
        1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0,
        1, 1, 1, 1, 3, 1,
      ],
      [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1,
      ],
    ],
  },
];
