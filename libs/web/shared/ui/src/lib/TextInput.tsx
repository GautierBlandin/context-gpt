import React, { ChangeEvent, useEffect, useState } from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value?: string;
  setValue?: (value: string) => void;
  error?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value: propValue,
  setValue,
  error,
  disabled,
  ...props
}) => {
  const [localValue, setLocalValue] = useState<string>(propValue || '');

  useEffect(() => {
    setLocalValue(propValue || '');
  }, [propValue]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (setValue) {
      setValue(newValue);
    }
  };

  const inputId = props.id || props.name || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = `${inputId}-error`;

  return (
    <div className="relative">
      <label htmlFor={inputId} className="block text-sm font-medium leading-6 text-neutral-emphasis">
        {label}
      </label>
      <div className="mt-2">
        <input
          {...props}
          id={inputId}
          value={localValue}
          onChange={handleChange}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          className={`block w-full rounded-md border-0 py-1.5 text-neutral-primary shadow-sm ring-1 ring-inset
${error ? 'ring-error-primary' : 'ring-neutral-muted'} placeholder:text-neutral-muted focus:ring-2 focus:ring-inset
focus:ring-main-primary sm:text-sm sm:leading-6 ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        />
      </div>
      {error && (
        <p id={errorId} className="mt-2 text-sm text-error-primary">
          {error}
        </p>
      )}
    </div>
  );
};
