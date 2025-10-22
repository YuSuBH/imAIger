import VoiceInput from "./VoiceInput";
import { ActionType } from "@/hooks/useAIInterpret";

interface PlaygroundPromptSectionProps {
  prompt: string;
  loading: boolean;
  hasImage: boolean;
  selectedOption: ActionType | null;
  hasResult: boolean;
  onPromptChange: (prompt: string) => void;
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
    <div className="rounded-lg">
      {/* Prompt Input */}
      <div className="flex gap-3 items-stretch">
        <div className="flex-1">
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full h-full min-h-[60px] p-3 bg-gray-900/50 border border-red-500/30 text-gray-100 placeholder-gray-400 rounded-2xl resize-vertical focus:outline-none focus:ring-2 focus:ring-red-500 animated-border-nonhover"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey && canSubmit) {
                onSubmit();
              }
            }}
          />
        </div>

        <VoiceInput
          onTranscript={(text) => onPromptChange(prompt + " " + text)}
          disabled={loading}
        />

        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all h-[60px] flex flex-col items-center justify-center animated-border-nonhover"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
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
              <span className="text-xs mt-1">Processing...</span>
            </>
          ) : (
            <>
              <svg
                className="h-5 w-5"
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
              <span className="text-xs mt-1">Submit</span>
            </>
          )}
        </button>

        {hasResult && (
          <button
            onClick={onReset}
            className="px-4 py-3 bg-gray-700 text-gray-200 rounded-lg font-medium hover:bg-gray-600 transition-all h-[60px] flex flex-col items-center justify-center shadow-lg border border-gray-600"
          >
            <svg
              className="h-5 w-5"
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
            <span className="text-xs mt-1">Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
