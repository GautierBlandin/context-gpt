interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
}

export function Loader({ size = 'medium' }: LoaderProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex justify-center items-center" aria-label="Loader">
      <div
        className={` ${sizeClasses[size]} border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin `}
      ></div>
    </div>
  );
}
