import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import GameStats from "../components/GameStats.jsx";
import NavigationButtons from "../components/NavigationButtons.jsx";
import GameControls from "../components/GameControls.jsx";
import {
  createGameState,
  createPosition,
  CELL_TYPES,
} from "../constants/game.js";
import {
  LEVELS,
  findStartPosition,
  isValidMove,
  isGoalReached,
  isObstacle,
  isReward,
  calculateScore,
  updateStatsOnWin,
  updateStatsOnLoss,
  getGameStats,
} from "../utils/gameLogic.js";
import { cn } from "../lib/utils.js";

const MazeGame = () => {
  const [gameState, setGameState] = useState(() =>
    createGameState({
      playerPosition: findStartPosition(LEVELS[0].maze),
    })
  );

  const [gameStats, setGameStats] = useState(() => getGameStats());
  const [showDialog, setShowDialog] = useState(false);
  const [snakePositions, setSnakePositions] = useState([]);

  const currentLevelConfig = LEVELS[gameState.currentLevel - 1];

  // Initialize snake positions when level changes
  useEffect(() => {
    const initialSnakePositions = [];
    const maze = currentLevelConfig.maze;

    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        if (maze[y][x] === CELL_TYPES.SNAKE) {
          initialSnakePositions.push(createPosition(x, y));
        }
      }
    }

    setSnakePositions(initialSnakePositions);
  }, [gameState.currentLevel, currentLevelConfig.maze]);

  // Snake movement effect - only for levels 4 and 5
  useEffect(() => {
    let snakeInterval;

    if (
      gameState.isGameActive &&
      !gameState.isGamePaused &&
      !gameState.isGameWon &&
      !gameState.isGameLost &&
      gameState.currentLevel >= 4
    ) {
      snakeInterval = setInterval(() => {
        setSnakePositions((prevPositions) => {
          return prevPositions.map((snakePos) => {
            const directions = [
              { x: 0, y: -1 }, // up
              { x: 0, y: 1 }, // down
              { x: -1, y: 0 }, // left
              { x: 1, y: 0 }, // right
            ];

            // Try to move in a random direction
            const validMoves = directions.filter((dir) => {
              const newPos = createPosition(
                snakePos.x + dir.x,
                snakePos.y + dir.y
              );
              return (
                isValidMove(currentLevelConfig.maze, newPos) &&
                currentLevelConfig.maze[newPos.y][newPos.x] !==
                  CELL_TYPES.GOAL &&
                currentLevelConfig.maze[newPos.y][newPos.x] !==
                  CELL_TYPES.SAW &&
                currentLevelConfig.maze[newPos.y][newPos.x] !==
                  CELL_TYPES.COIN &&
                currentLevelConfig.maze[newPos.y][newPos.x] !== CELL_TYPES.GEM
              );
            });

            if (validMoves.length > 0) {
              const randomDirection =
                validMoves[Math.floor(Math.random() * validMoves.length)];
              return createPosition(
                snakePos.x + randomDirection.x,
                snakePos.y + randomDirection.y
              );
            }

            return snakePos; // Stay in place if no valid moves
          });
        });
      }, 2000); // Move every 2 seconds
    }

    return () => clearInterval(snakeInterval);
  }, [
    gameState.isGameActive,
    gameState.isGamePaused,
    gameState.isGameWon,
    gameState.isGameLost,
    gameState.currentLevel,
    currentLevelConfig.maze,
  ]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (
      gameState.isGameActive &&
      !gameState.isGamePaused &&
      !gameState.isGameWon &&
      !gameState.isGameLost
    ) {
      interval = setInterval(() => {
        setGameState((prev) => {
          const newTime = Math.floor(
            (Date.now() - prev.startTime - prev.pausedTime) / 1000
          );

          // Check time limit
          if (
            currentLevelConfig.timeLimit > 0 &&
            newTime >= currentLevelConfig.timeLimit
          ) {
            const updatedStats = updateStatsOnLoss();
            setGameStats(updatedStats);
            setShowDialog(true);
            return {
              ...prev,
              currentTime: currentLevelConfig.timeLimit,
              isGameActive: false,
              isGameLost: true,
              lossReason: "Time limit exceeded!",
            };
          }

          return { ...prev, currentTime: newTime };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [
    gameState.isGameActive,
    gameState.isGamePaused,
    gameState.isGameWon,
    gameState.isGameLost,
    currentLevelConfig.timeLimit,
  ]);

  const startGame = useCallback(() => {
    const startPos = findStartPosition(currentLevelConfig.maze);
    setGameState((prev) => ({
      ...prev,
      playerPosition: startPos,
      isGameActive: true,
      isGamePaused: false,
      isGameWon: false,
      isGameLost: false,
      startTime: Date.now(),
      currentTime: 0,
      pausedTime: 0,
      score: 0,
      collectedRewards: [],
      lossReason: "",
    }));
    setShowDialog(false);
  }, [currentLevelConfig.maze]);

  const pauseGame = useCallback(() => {
    setGameState((prev) => ({ ...prev, isGamePaused: true }));
  }, []);

  const resumeGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isGamePaused: false,
      startTime: Date.now() - prev.currentTime * 1000,
    }));
  }, []);

  const stopGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isGameActive: false,
      isGamePaused: false,
    }));
  }, []);

  const resetGame = useCallback(() => {
    startGame();
    stopGame();
  }, [startGame, stopGame]);

  const nextLevel = useCallback(() => {
    const nextLevelNum =
      gameState.currentLevel >= 5 ? 1 : gameState.currentLevel + 1;
    const nextLevelConfig = LEVELS[nextLevelNum - 1];
    const startPos = findStartPosition(nextLevelConfig.maze);

    setGameState((prev) => ({
      ...prev,
      currentLevel: nextLevelNum,
      playerPosition: startPos,
      isGameActive: false,
      isGamePaused: false,
      isGameWon: false,
      isGameLost: false,
      currentTime: 0,
      pausedTime: 0,
      score: 0,
      collectedRewards: [],
      lossReason: "",
    }));
    setShowDialog(false);

    startGame();
  }, [gameState.currentLevel, startGame]);

  const handleNextLevel = () => {
    setShowDialog(false);

    setTimeout(() => {
      nextLevel();
    }, 300);
  };

  const handleMove = useCallback(
    (direction) => {
      if (
        !gameState.isGameActive ||
        gameState.isGamePaused ||
        gameState.isGameWon ||
        gameState.isGameLost
      )
        return;

      setGameState((prev) => {
        const { x, y } = prev.playerPosition;
        let newPosition;

        switch (direction) {
          case "up":
            newPosition = createPosition(x, y - 1);
            break;
          case "down":
            newPosition = createPosition(x, y + 1);
            break;
          case "left":
            newPosition = createPosition(x - 1, y);
            break;
          case "right":
            newPosition = createPosition(x + 1, y);
            break;
          default:
            return prev;
        }

        if (!isValidMove(currentLevelConfig.maze, newPosition)) {
          return prev;
        }

        // Check for obstacles (static saws or moving snakes)
        const obstacleCheck = isObstacle(currentLevelConfig.maze, newPosition);
        const isOnMovingSnake = snakePositions.some(
          (snakePos) =>
            snakePos.x === newPosition.x && snakePos.y === newPosition.y
        );

        if (obstacleCheck.isObstacle || isOnMovingSnake) {
          const updatedStats = updateStatsOnLoss();
          setGameStats(updatedStats);
          setShowDialog(true);

          return {
            ...prev,
            playerPosition: newPosition,
            isGameActive: false,
            isGameLost: true,
            lossReason:
              obstacleCheck.type === "saw" || isOnMovingSnake
                ? obstacleCheck.type === "saw"
                  ? "Cut by a spinning saw!"
                  : "Caught by a roaming snake!"
                : "Bitten by a deadly snake!",
          };
        }

        const newCollectedRewards = [...prev.collectedRewards];
        let bonusScore = 0;

        // Check for rewards
        const rewardCheck = isReward(currentLevelConfig.maze, newPosition);
        if (rewardCheck.isReward) {
          const alreadyCollected = newCollectedRewards.some(
            (pos) => pos.x === newPosition.x && pos.y === newPosition.y
          );
          if (!alreadyCollected) {
            newCollectedRewards.push(newPosition);
            bonusScore = rewardCheck.value;
          }
        }

        const newState = {
          ...prev,
          playerPosition: newPosition,
          collectedRewards: newCollectedRewards,
          score: prev.score + bonusScore,
        };

        // Check if goal is reached
        if (isGoalReached(currentLevelConfig.maze, newPosition)) {
          const finalTime = Math.floor(
            (Date.now() - prev.startTime - prev.pausedTime) / 1000
          );
          const coinsCollected = newCollectedRewards.filter((pos) => {
            const cell = currentLevelConfig.maze[pos.y][pos.x];
            return cell === CELL_TYPES.COIN;
          }).length;
          const gemsCollected = newCollectedRewards.filter((pos) => {
            const cell = currentLevelConfig.maze[pos.y][pos.x];
            return cell === CELL_TYPES.GEM;
          }).length;

          const finalScore = calculateScore(
            finalTime,
            prev.currentLevel,
            coinsCollected,
            gemsCollected,
            currentLevelConfig.coinValue,
            currentLevelConfig.gemValue
          );

          const updatedStats = updateStatsOnWin(
            finalTime,
            prev.currentLevel,
            finalScore,
            coinsCollected,
            gemsCollected
          );
          setGameStats(updatedStats);
          setShowDialog(true);

          return {
            ...newState,
            isGameActive: false,
            isGameWon: true,
            currentTime: finalTime,
            score: finalScore,
          };
        }

        return newState;
      });
    },
    [
      gameState.isGameActive,
      gameState.isGamePaused,
      gameState.isGameWon,
      gameState.isGameLost,
      currentLevelConfig,
      snakePositions,
    ]
  );

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case "ArrowUp":
        case "w":
        case "W":
          event.preventDefault();
          handleMove("up");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          event.preventDefault();
          handleMove("down");
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          event.preventDefault();
          handleMove("left");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          event.preventDefault();
          handleMove("right");
          break;
        case " ":
          event.preventDefault();
          if (gameState.isGameActive && !gameState.isGamePaused) {
            pauseGame();
          } else if (gameState.isGamePaused) {
            resumeGame();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    handleMove,
    gameState.isGameActive,
    gameState.isGamePaused,
    pauseGame,
    resumeGame,
  ]);

  const renderMaze = () => {
    const maze = currentLevelConfig.maze;

    return (
      <div
        className={cn(
          "inline-block p-2 sm:p-4 bg-linear-to-br from-gray-900 via-gray-800 to-gray-950 rounded-2xl shadow-2xl relative",
          gameState.isGamePaused && "border-3 border-amber-400"
        )}
      >
        {/* Maze Grid */}
        <div
          className="grid gap-0 border-2 sm:border-4 border-amber-300 rounded-lg overflow-hidden shadow-inner bg-gray-900"
          style={{
            gridTemplateColumns: `repeat(${maze[0].length}, minmax(0, 1fr))`,
            maxWidth: "90vw",
            aspectRatio: `${maze[0].length} / ${maze.length}`,
          }}
        >
          {maze.map((row, y) =>
            row.map((cell, x) => {
              const isPlayer =
                gameState.playerPosition.x === x &&
                gameState.playerPosition.y === y;
              const isCollected = gameState.collectedRewards.some(
                (pos) => pos.x === x && pos.y === y
              );
              const isMovingSnake = snakePositions.some(
                (snakePos) => snakePos.x === x && snakePos.y === y
              );
              const cellSize =
                "w-4 h-4 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8";

              let cellClass =
                cellSize +
                " flex items-center justify-center text-xs relative transition-all duration-200 border border-gray-700/30";
              let cellContent = "";
              let cellStyle = {};

              if (cell === CELL_TYPES.WALL) {
                cellClass +=
                  " bg-linear-to-br from-gray-700 via-gray-800 to-gray-900 shadow-inner";
              } else if (cell === CELL_TYPES.GOAL) {
                cellClass +=
                  " bg-linear-to-br from-yellow-400 via-yellow-500 to-amber-600 shadow-lg animate-pulse";
                cellContent = "🏆";
              } else if (cell === CELL_TYPES.SAW) {
                cellClass += " bg-linear-to-br from-gray-200 to-gray-300";
                cellContent = "⚙️";
                cellStyle = {
                  animation: "spin 2s linear infinite",
                  color: "#ef4444",
                };
              } else if (cell === CELL_TYPES.SNAKE || isMovingSnake) {
                cellClass += " bg-linear-to-br from-gray-200 to-gray-300";
                cellContent = "🐍";
              } else if (cell === CELL_TYPES.COIN && !isCollected) {
                cellClass += " bg-linear-to-br from-gray-200 to-gray-300";
                cellContent = "💰";
                cellStyle = {
                  animation: "pulse 2s ease-in-out infinite",
                  filter: "drop-shadow(0 0 4px #fbbf24)",
                };
              } else if (cell === CELL_TYPES.GEM && !isCollected) {
                cellClass += " bg-linear-to-br from-gray-200 to-gray-300";
                cellContent = "💎";
                cellStyle = {
                  animation: "pulse 2s ease-in-out infinite",
                  filter: "drop-shadow(0 0 4px #3b82f6)",
                };
              } else {
                cellClass += " bg-linear-to-br from-gray-200 to-gray-300";
              }

              return (
                <div key={`${x}-${y}`} className={cellClass} style={cellStyle}>
                  {isPlayer ? (
                    <div className="w-full h-full bg-linear-to-br from-red-500 via-red-600 to-red-700 rounded-sm flex items-center justify-center relative z-10 shadow-lg border-2 border-red-400 animate-pulse">
                      <div className="text-white text-xs font-bold drop-shadow-lg">
                        🧑
                      </div>
                    </div>
                  ) : (
                    <span className="drop-shadow-sm text-xs">
                      {cellContent}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {gameState.isGamePaused && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-2xl backdrop-blur-sm z-20">
            <div className="text-white text-4xl font-bold animate-pulse bg-gray-900 px-8 py-4 rounded-xl border-3 border-amber-400 shadow-2xl">
              ⏸️ PAUSED
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-slate-900 to-black text-white p-4 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-amber-400 rounded-full animate-ping opacity-20"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce opacity-25"></div>
        <div className="absolute bottom-40 right-1/3 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-pulse opacity-25"></div>
        <div className="absolute top-1/3 left-1/5 w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-8 bg-linear-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent drop-shadow-2xl">
          Escape the Maze
        </h1>

        <GameStats
          currentTime={gameState.currentTime}
          score={gameState.score}
          wins={gameStats.wins}
          losses={gameStats.losses}
          currentStreak={gameStats.currentStreak}
          bestTime={gameStats.bestTime}
          currentLevel={gameState.currentLevel}
          totalScore={gameStats.totalScore}
          coinsCollected={gameStats.coinsCollected}
          gemsCollected={gameStats.gemsCollected}
          timeLimit={currentLevelConfig.timeLimit}
        />

        <GameControls
          isGameActive={gameState.isGameActive}
          isGamePaused={gameState.isGamePaused}
          isGameWon={gameState.isGameWon}
          isGameLost={gameState.isGameLost}
          onStart={startGame}
          onPause={pauseGame}
          onResume={resumeGame}
          onStop={stopGame}
          onReset={resetGame}
          onNextLevel={handleNextLevel}
          currentLevel={gameState.currentLevel}
        />

        <div className="flex flex-col items-center gap-6 relative">
          {renderMaze()}

          <NavigationButtons
            onMove={handleMove}
            disabled={
              !gameState.isGameActive ||
              gameState.isGamePaused ||
              gameState.isGameWon ||
              gameState.isGameLost
            }
          />

          <div className="text-center text-sm text-gray-300 max-w-lg bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700 shadow-2xl">
            <p className="mb-3 text-base">
              <strong className="text-amber-300">Legend:</strong> 🧑 You • 🏆
              Goal • 💰 Coin • 💎 Gem • ⚙️ Saw • 🐍 Snake
            </p>
            <p className="mb-3">
              Collect rewards for bonus points! Avoid obstacles or you'll lose!
            </p>
            <p className="mb-3">
              Press{" "}
              <kbd className="bg-gray-800 border border-gray-600 px-3 py-1 rounded text-xs font-mono">
                SPACE
              </kbd>{" "}
              to pause/resume during gameplay.
            </p>
            {gameState.currentLevel >= 4 && (
              <p className="text-red-400 font-bold animate-pulse text-base">
                ⚠️ Snakes are moving! Stay alert!
              </p>
            )}
          </div>
        </div>

        {/* Game Over Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="bg-linear-to-br from-gray-900 to-black text-white border-amber-400 border-2 shadow-2xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-3xl text-center font-bold mb-0.5">
                {gameState.isGameWon ? (
                  <span className="text-green-400 drop-shadow-lg">
                    🎉 Level Complete!
                  </span>
                ) : (
                  <span className="text-red-400 drop-shadow-lg">
                    💀 Game Over
                  </span>
                )}
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-center mb-2">
                {gameState.isGameWon
                  ? `You escaped ${currentLevelConfig.name}!`
                  : gameState.lossReason}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-linear-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-600 shadow-lg">
                  <div className="text-sm text-gray-400 mb-1">Time</div>
                  <div className="text-2xl font-bold text-white">
                    {Math.floor(gameState.currentTime / 60)}:
                    {(gameState.currentTime % 60).toString().padStart(2, "0")}
                  </div>
                </div>
                <div className="bg-linear-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-600 shadow-lg">
                  <div className="text-sm text-gray-400 mb-1">Score</div>
                  <div className="text-2xl font-bold text-amber-300">
                    {gameState.score}
                  </div>
                </div>
              </div>

              {gameState.isGameWon && (
                <div className="text-center text-sm text-gray-300 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <p className="mb-1">
                    Rewards Collected: 💰
                    {
                      gameState.collectedRewards.filter(
                        (pos) =>
                          currentLevelConfig.maze[pos.y][pos.x] ===
                          CELL_TYPES.COIN
                      ).length
                    }{" "}
                    💎
                    {
                      gameState.collectedRewards.filter(
                        (pos) =>
                          currentLevelConfig.maze[pos.y][pos.x] ===
                          CELL_TYPES.GEM
                      ).length
                    }
                  </p>
                  <p>Current Streak: {gameStats.currentStreak} wins</p>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                {gameState.isGameWon ? (
                  <Button
                    onClick={handleNextLevel}
                    className="bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg px-6 py-2"
                  >
                    {gameState.currentLevel >= 5
                      ? "Restart from Level 1"
                      : "Next Level"}
                  </Button>
                ) : (
                  <Button
                    onClick={resetGame}
                    className="bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg px-6 py-2"
                  >
                    Try Again
                  </Button>
                )}
                <Button
                  onClick={() => setShowDialog(false)}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 shadow-lg px-6 py-2"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MazeGame;
