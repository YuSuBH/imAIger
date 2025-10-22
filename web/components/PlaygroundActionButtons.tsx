import { ActionType } from "@/hooks/useAIInterpret";

interface PlaygroundActionButtonsProps {
  selectedOption: ActionType | null;
  onOptionSelect: (option: ActionType | null) => void;
}

export default function PlaygroundActionButtons({
  selectedOption,
  onOptionSelect,
}: PlaygroundActionButtonsProps) {
  const toggleOption = (option: ActionType) => {
    onOptionSelect(selectedOption === option ? null : option);
  };

  const buttonClass = (option: ActionType) =>
    `px-3 py-1.5 text-sm rounded-md border transition-all shadow-lg ${
      selectedOption === option
        ? "bg-red-600 text-white border-red-600 hover:bg-red-700"
        : "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
    }`;

  return (
    <div className="flex gap-2">
      <button
        onClick={() => toggleOption("ANALYZE")}
        className={buttonClass("ANALYZE")}
      >
        Analyze
      </button>
      <button
        onClick={() => toggleOption("UPSCALE")}
        className={buttonClass("UPSCALE")}
      >
        Upscale
      </button>
      <button
        onClick={() => toggleOption("REMOVE_BG")}
        className={buttonClass("REMOVE_BG")}
      >
        Remove BG
      </button>
    </div>
  );
}
