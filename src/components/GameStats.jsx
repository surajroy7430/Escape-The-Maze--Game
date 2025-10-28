import { formatTime, LEVELS } from "../utils/gameLogic";

const GameStats = ({
  currentTime,
  score,
  wins,
  losses,
  currentStreak,
  bestTime,
  currentLevel,
  totalScore,
  coinsCollected,
  gemsCollected,
  timeLimit,
}) => {
  const level = LEVELS[currentLevel - 1];
  const isTimeRunningOut =
    timeLimit && timeLimit > 0 && currentTime > timeLimit - 10;

  return (
    <div className="w-full max-w-6xl mx-auto mb-6">
      {/* Level Info */}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-amber-300 mb-2 drop-shadow-lg">
          Level {currentLevel}: {level?.name}
        </h2>
        <p className="text-gray-300 mb-2">{level?.description}</p>
        {timeLimit && timeLimit > 0 && (
          <p
            className={`text-sm font-medium ${
              isTimeRunningOut
                ? "text-red-400 animate-pulse"
                : "text-yellow-400"
            }`}
          >
            Time Limit: {formatTime(timeLimit)}{" "}
            {isTimeRunningOut && "⚠️ HURRY!"}
          </p>
        )}
      </div>

      {/* Main Timer and Score */}
      <div className="flex items-center justify-between mb-4 px-4">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-300 mb-1">TIME</div>
          <div
            className={`text-2xl md:text-3xl font-bold ${
              isTimeRunningOut ? "text-red-400" : "text-zinc-500"
            }`}
          >
            {formatTime(currentTime)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-300 mb-1">SCORE</div>
          <div
            className={`text-2xl md:text-3xl font-bold ${
              score === 0 ? "text-zinc-500" : "text-amber-400/70"
            }`}
          >
            {score}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs md:text-sm mb-4">
        <div className="bg-green-900/40 backdrop-blur-sm border border-green-700/50 p-3 rounded-lg min-w-[100px]">
          <div className="font-semibold text-green-400 mb-1">Wins</div>
          <div className="text-green-300 text-lg font-bold">{wins}</div>
        </div>
        <div className="bg-red-900/40 backdrop-blur-sm border border-red-700/50 p-3 rounded-lg min-w-[100px]">
          <div className="font-semibold text-red-400 mb-1">Losses</div>
          <div className="text-red-300 text-lg font-bold">{losses}</div>
        </div>
        <div className="bg-blue-900/40 backdrop-blur-sm border border-blue-700/50 p-3 rounded-lg min-w-[100px]">
          <div className="font-semibold text-blue-400 mb-1">Streak</div>
          <div className="text-blue-300 text-lg font-bold">{currentStreak}</div>
        </div>
        <div className="bg-purple-900/40 backdrop-blur-sm border border-purple-700/50 p-3 rounded-lg min-w-[100px]">
          <div className="font-semibold text-purple-400 mb-1">Best Time</div>
          <div className="text-purple-300 text-lg font-bold">
            {bestTime > 0 ? formatTime(bestTime) : "--:--"}
          </div>
        </div>
        <div className="bg-yellow-900/40 backdrop-blur-sm border border-yellow-700/50 p-3 rounded-lg min-w-[120px]">
          <div className="font-semibold text-yellow-400 mb-1">Total Score</div>
          <div className="text-yellow-300 text-lg font-bold">{totalScore}</div>
        </div>
        <div className="bg-orange-900/40 backdrop-blur-sm border border-orange-700/50 p-3 rounded-lg min-w-[120px]">
          <div className="font-semibold text-orange-400 mb-1">Rewards</div>
          <div className="text-orange-300 text-lg font-bold">
            💰{coinsCollected} 💎{gemsCollected}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStats;
