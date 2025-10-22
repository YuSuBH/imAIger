import VoiceInput from "./VoiceInput";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  disabled?: boolean;
  showVoiceInput?: boolean;
}

export default function PromptInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Enter your prompt...",
  disabled = false,
  showVoiceInput = true,
}: PromptInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="flex gap-2">
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="flex-1 min-h-[120px] p-3 border border-gray-200 rounded resize-vertical focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      {showVoiceInput && (
        <VoiceInput
          onTranscript={(text) => onChange(value + " " + text)}
          disabled={disabled}
        />
      )}
    </div>
  );
}
