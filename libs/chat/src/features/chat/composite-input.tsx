import React, { useState } from 'react';
import { SubmitButton, TextInput } from '@context-gpt/shared';

interface CompositeInputProps {
  onSubmit: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const CompositeInput: React.FC<CompositeInputProps> = ({
  onSubmit,
  placeholder = 'Type your message...',
  disabled = false,
}) => {
  const [inputText, setInputText] = useState('');

  const handleInputChange = (text: string) => {
    setInputText(text);
  };

  const handleSubmit = () => {
    if (inputText.trim() !== '' && !disabled) {
      onSubmit(inputText);
      setInputText('');
    }
  };

  return (
    <TextInput
      value={inputText}
      onChange={handleInputChange}
      onSubmit={handleSubmit}
      placeholder={placeholder}
      multiline={true}
      submitButton={
        <SubmitButton onClick={handleSubmit} disabled={disabled || inputText.trim() === ''}>
          Send
        </SubmitButton>
      }
    />
  );
};
