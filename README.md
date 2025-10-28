# 🧩 Escape the Maze

**Escape the Maze** is an interactive puzzle-adventure game built with **React**.  
Navigate through challenging mazes, collect rewards, avoid deadly traps, and escape before the time runs out!

---

## 🚀 Features

- 🧠 **Multi-Level Gameplay** — 5 progressively harder maze levels with unique layouts and challenges.  
- 💎 **Collect Rewards** — Pick up coins and gems to boost your score.  
- ⚙️ **Dynamic Obstacles** — Avoid spinning saws and roaming snakes (appear in higher levels).  
- ⏱️ **Time-Limited Levels** — Beat each maze before the timer expires.  
- 🏆 **Player Stats** — Track your total wins, losses, streak, best time, and total score.  
- 🎮 **Keyboard Controls** — Move using **WASD** or **Arrow keys**, pause/resume with **Spacebar**.  
- 🌈 **Responsive UI** — Fully responsive with animated gradients.
- 💾 **Persistent Data** — Stats saved locally using browser storage.

---

## 🕹️ Gameplay Instructions

### 🎯 Objective
Find the **🏆 Goal** in each maze while avoiding **⚙️ Saws** and **🐍 Snakes**.

### 🧭 Controls
| Action | Key |
|--------|-----|
| Move Up | `W` / `↑` |
| Move Down | `S` / `↓` |
| Move Left | `A` / `←` |
| Move Right | `D` / `→` |
| Pause / Resume | `Spacebar` |

### 💰 Scoring System
- **Coins (💰)**: + small bonus points  
- **Gems (💎)**: + higher bonus points  
- **Time Bonus**: Faster escapes = higher score  
- **Streak Bonus**: Consecutive wins increase your streak score

---

## 🧱 Maze Legend

| Symbol | Meaning |
|---------|----------|
| 🧑 | Player |
| 🏆 | Goal |
| 💰 | Coin |
| 💎 | Gem |
| ⚙️ | Saw |
| 🐍 | Snake |

---

## ⚔️ Obstacles

| Symbol | Type | Description |
|---------|------|-------------|
| ⚙️ | Spinning Saw | Stationary obstacle that instantly ends the game if touched |
| 🐍 | Snake | Moves randomly in advanced levels (4–5) — avoid at all costs! |
| ⏱️ | Time Limit | Each level must be completed within a specific time |

---

## 🏅 Levels Overview

| Level | Description | Special Features |
|--------|--------------|------------------|
| 1 | Basic maze with few obstacles | Learn movement and goal finding |
| 2 | Moderate maze with coins and gems | Introduces rewards |
| 3 | Complex maze with multiple paths | Adds saw traps |
| 4 | Dynamic maze | Introduces moving snakes |
| 5 | Ultimate challenge | Faster snakes and strict time limit |

---

## 📊 Game Stats

The game tracks your performance persistently:

| Stat | Description |
|------|--------------|
| 🏆 Wins | Total number of successful escapes |
| 💀 Losses | Times you got caught or ran out of time |
| 🔥 Current Streak | Consecutive wins |
| ⏱️ Best Time | Fastest completion time |
| 💰 Total Score | Combined score from all levels |
| 💎 Rewards | Total coins and gems collected |

All stats are automatically updated after every level using local storage.

---

## ⚙️ Tech Stack

| Category | Technology |
|-----------|-------------|
| Frontend | **React** |
| UI Components | **ShadCN/UI**, **Tailwind CSS** |
| State Management | Local component state |
| Utilities | Custom game logic functions in `/utils/gameLogic.js` |
| Storage | Local Storage for persistent stats |
| Styling | Gradient backgrounds, glass effects, animations |

---

## 🧩 Project Structure
```tree
src/
├── components/
│ ├── GameStats.jsx
│ ├── GameControls.jsx
│ ├── NavigationButtons.jsx
├── utils/
│ ├── gameLogic.js
├── constants/
│ ├── game.js
├── game/
│ ├── MazeGame.jsx
```

---

## 💡 Key Functions

| Function | Purpose |
|-----------|----------|
| `createGameState()` | Initializes the game state |
| `findStartPosition()` | Locates player start position in maze |
| `isValidMove()` | Checks if a move is valid within maze boundaries |
| `isObstacle()` | Detects traps like saws and snakes |
| `isReward()` | Checks for collectible items (coins/gems) |
| `isGoalReached()` | Determines if the goal is reached |
| `updateStatsOnWin()` / `updateStatsOnLoss()` | Updates and persists player stats |
| `calculateScore()` | Calculates total score for each level |

---

## 🧑‍💻 Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/surajroy7430/Escape-The-Maze--Game.git

cd Escape-The-Maze--Game
```

### 2️⃣ Install Dependencies
```
npm install
```

### 3️⃣ Run the App
```
npm run dev
```

> _🧩 "Escape the maze, collect treasures, and outsmart the snakes!"_