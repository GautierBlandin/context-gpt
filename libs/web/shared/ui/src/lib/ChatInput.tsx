import { useEffect, useRef } from 'react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  submitDisabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  submitDisabled = false,
  placeholder = 'Type your message...',
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div
        className="flex items-start rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2
focus-within:ring-indigo-600 p-3"
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={placeholder}
          className="flex-grow w-full resize-none border-0 bg-transparent p-0 text-gray-900 placeholder:text-gray-400
sm:text-sm sm:leading-6 min-h-[7em] max-h-[200px] overflow-y-auto focus:ring-0 focus:outline-none"
        />
        <div className="flex-shrink-0">
          <button
            type="submit"
            disabled={submitDisabled}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white
shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </form>
  );
}