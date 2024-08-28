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
        className="flex items-start rounded-lg shadow-sm ring-1 ring-inset ring-main-primary focus-within:ring-2
focus-within:ring-primary p-3 bg-white"
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={placeholder}
          className="flex-grow w-full resize-none border-0 bg-transparent p-0 text-neutral-primary
placeholder:text-neutral-muted sm:text-sm sm:leading-6 min-h-[7em] max-h-[200px] overflow-y-auto focus:ring-0
focus:outline-none"
        />
        <div className="flex-shrink-0">
          <button
            type="submit"
            disabled={submitDisabled}
            className="inline-flex items-center rounded-md bg-main-primary px-3 py-2 text-sm font-semibold
text-main-onprimary shadow-sm hover:bg-main-primary-hover focus-visible:outline focus-visible:outline-2
focus-visible:outline-offset-2 focus-visible:outline-highlight disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </form>
  );
}
