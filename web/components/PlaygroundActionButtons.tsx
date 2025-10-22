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
    `px-3 py-1.5 text-sm rounded-md border transition-colors ${
      selectedOption === option
        ? "bg-indigo-600 text-white border-indigo-600"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
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
