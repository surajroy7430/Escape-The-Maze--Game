import { Button } from "@/components/ui/button";
import { Play, Pause, Square, RotateCcw, SkipForward } from "lucide-react";

const GameControls = ({
  isGameActive,
  isGamePaused,
  isGameWon,
  isGameLost,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
  onNextLevel,
  currentLevel,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-4">
      {!isGameActive && !isGameWon && !isGameLost ? (
        <Button
          onClick={onStart}
          className="px-6 py-3 text-lg font-semibold bg-green-600 hover:bg-green-700 flex items-center gap-2"
        >
          <Play className="w-5 h-5" />
          Start Game
        </Button>
      ) : isGameActive && !isGamePaused ? (
        <Button
          onClick={onPause}
          className="px-6 py-3 text-lg font-semibold bg-yellow-600 hover:bg-yellow-700 flex items-center gap-2"
        >
          <Pause className="w-5 h-5" />
          Pause
        </Button>
      ) : isGamePaused ? (
        <Button
          onClick={onResume}
          className="px-6 py-3 text-lg font-semibold bg-green-600 hover:bg-green-700 flex items-center gap-2"
        >
          <Play className="w-5 h-5" />
          Resume
        </Button>
      ) : null}

      {(isGameActive || isGamePaused) && (
        <Button
          onClick={onStop}
          className="px-6 py-3 text-lg font-semibold bg-red-600 hover:bg-red-700 flex items-center gap-2"
        >
          <Square className="w-5 h-5" />
          Stop
        </Button>
      )}

      <Button
        onClick={onReset}
        className="px-6 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
      >
        <RotateCcw className="w-5 h-5" />
        Reset
      </Button>

      {isGameWon && (
        <Button
          onClick={onNextLevel}
          className="px-6 py-3 text-lg font-semibold bg-purple-600 hover:bg-purple-700 flex items-center gap-2 animate-pulse"
        >
          <SkipForward className="w-5 h-5" />
          Next Level
        </Button>
      )}

      <div className="text-center text-sm text-gray-400 w-full mt-2">
        <p>
          Level {currentLevel} of 5 • Use controls or arrow keys/WASD to move
        </p>
      </div>
    </div>
  );
};

export default GameControls;
