// Dev/context-gpt/libs/shared/src/lib/TextInput.tsx

import React, { useState, useEffect, KeyboardEvent } from 'react';

interface TextInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  submitButton?: React.ReactNode;
  multiline?: boolean;
}

export const TextArea: React.FC<TextInputProps> = ({
  value: externalValue,
  onChange,
  onSubmit,
  placeholder = '',
  submitButton,
  multiline = false,
}) => {
  const [localValue, setLocalValue] = useState(externalValue || '');

  useEffect(() => {
    if (externalValue !== undefined) {
      setLocalValue(externalValue);
    }
  }, [externalValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange?.(newValue);
  };

  // Submit when the user presses Enter
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }
  };

  return (
    <div className="relative">
      <textarea
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={multiline ? 3 : 1}
        className={`block w-full rounded-md border-0 py-1.5 pl-2 pr-10 text-gray-900 shadow-sm ring-1 ring-inset
ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6
${multiline ? 'resize-y' : 'resize-none'}`}
      />
      {submitButton && <div className="absolute inset-y-0 right-0 flex items-center pr-2">{submitButton}</div>}
    </div>
  );
};
