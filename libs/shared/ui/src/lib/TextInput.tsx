import React, { useState, useEffect, ChangeEvent } from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value?: string;
  setValue?: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ label, value: propValue, setValue, ...props }) => {
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

  return (
    <div>
      <label htmlFor={props.id || props.name} className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <input
          {...props}
          value={localValue}
          onChange={handleChange}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
};

export default TextInput;
