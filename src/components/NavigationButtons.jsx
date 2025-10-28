import { Button } from "@/components/ui/button";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const NavigationButtons = ({ onMove, disabled }) => {
  const buttonClass =
    "w-12 h-12 md:w-20 md:h-20 text-2xl md:text-3xl font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg";

  return (
    <div className="flex flex-col items-center gap-3 mt-4">
      {/* Up Button */}
      <Button
        onClick={() => onMove("up")}
        disabled={disabled}
        className={`${buttonClass} bg-linear-to-b from-amber-200 to-amber-300 hover:from-amber-300 hover:to-amber-400 text-gray-800 border-2 border-amber-500 shadow-amber-500/30`}
        variant="outline"
      >
        <ChevronUp className="w-8 h-8" />
      </Button>

      {/* Left, Down, Right Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => onMove("left")}
          disabled={disabled}
          className={`${buttonClass} bg-linear-to-b from-amber-200 to-amber-300 hover:from-amber-300 hover:to-amber-400 text-gray-800 border-2 border-amber-500 shadow-amber-500/30`}
          variant="outline"
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>

        <Button
          onClick={() => onMove("down")}
          disabled={disabled}
          className={`${buttonClass} bg-linear-to-b from-amber-200 to-amber-300 hover:from-amber-300 hover:to-amber-400 text-gray-800 border-2 border-amber-500 shadow-amber-500/30`}
          variant="outline"
        >
          <ChevronDown className="w-8 h-8" />
        </Button>

        <Button
          onClick={() => onMove("right")}
          disabled={disabled}
          className={`${buttonClass} bg-linear-to-b from-amber-200 to-amber-300 hover:from-amber-300 hover:to-amber-400 text-gray-800 border-2 border-amber-500 shadow-amber-500/30`}
          variant="outline"
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      </div>
    </div>
  );
};

export default NavigationButtons;
