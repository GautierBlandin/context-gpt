import React, { useState, useEffect } from 'react';

interface TextInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ value: externalValue, onChange, placeholder = '' }) => {
  const [localValue, setLocalValue] = useState(externalValue || '');

  useEffect(() => {
    if (externalValue !== undefined) {
      setLocalValue(externalValue);
    }
  }, [externalValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <input
      type="text"
      value={localValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
    />
  );
};
