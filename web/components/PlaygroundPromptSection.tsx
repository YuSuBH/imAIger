import VoiceInput from "./VoiceInput";
import { ActionType } from "@/hooks/useAIInterpret";
import PlaygroundActionButtons from "./PlaygroundActionButtons";

interface PlaygroundPromptSectionProps {
  prompt: string;
  loading: boolean;
  hasImage: boolean;
  selectedOption: ActionType | null;
  hasResult: boolean;
  onPromptChange: (prompt: string) => void;
  onOptionSelect: (option: ActionType | null) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export default function PlaygroundPromptSection({
  prompt,
  loading,
  hasImage,
  selectedOption,
  hasResult,
  onPromptChange,
  onOptionSelect,
  onSubmit,
  onReset,
}: PlaygroundPromptSectionProps) {
  const canSubmit = !loading && (prompt || hasImage);

  const getPlaceholder = () => {
    if (!hasImage) {
      return "A futuristic city at sunset with flying cars...";
    }
    if (selectedOption) {
      return "Optional: Add specific instructions...";
    }
    return "Describe what you want to do with this image...";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Instruction Text or Options */}
      <div className="mb-4">
        {!hasImage ? (
          <p className="text-sm text-gray-600 italic">
            Describe the image you want to generate...
          </p>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Choose an action or describe what you want:
            </p>
            <PlaygroundActionButtons
              selectedOption={selectedOption}
              onOptionSelect={onOptionSelect}
            />
          </div>
        )}
      </div>

      {/* Prompt Input */}
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg resize-vertical focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey && canSubmit) {
                onSubmit();
              }
            }}
          />
          <p className="text-xs text-gray-500 mt-1">
            Press Ctrl+Enter to submit
          </p>
        </div>

        <VoiceInput
          onTranscript={(text) => onPromptChange(prompt + " " + text)}
          disabled={loading}
        />

        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-[100px] flex flex-col items-center justify-center"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <span className="text-xs mt-2">Processing...</span>
            </>
          ) : (
            <>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
              <span className="text-xs mt-2">Submit</span>
            </>
          )}
        </button>

        {hasResult && (
          <button
            onClick={onReset}
            className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors h-[100px] flex flex-col items-center justify-center"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="text-xs mt-2">Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
