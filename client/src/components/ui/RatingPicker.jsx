import { Circle } from "lucide-react";

export default function RatingPicker({ value, onChange, disabled }) {
  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((score) => {
        const selected = value === score;
        return (
          <button
            key={score}
            type="button"
            disabled={disabled}
            onClick={() => onChange(score)}
            className="flex flex-col items-center gap-1 disabled:opacity-50"
            role="radio"
            aria-checked={selected}
            aria-label={`${score} stars`}
          >
            <span className="text-xs text-text-secondary">{score}</span>
            <Circle
              className={`h-5 w-5 ${
                selected ? "fill-accent text-accent" : "text-rating-unselected"
              }`}
              strokeWidth={selected ? 0 : 1.5}
            />
          </button>
        );
      })}
    </div>
  );
}
