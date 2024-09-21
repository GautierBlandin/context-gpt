import React from 'react';

interface SubmitButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick, disabled = false, children = 'Submit' }) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none
focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors duration-200 disabled:opacity-50
disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
};
