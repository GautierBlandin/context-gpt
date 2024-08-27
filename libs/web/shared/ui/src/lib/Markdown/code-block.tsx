import { CheckIcon, ClipboardIcon } from 'lucide-react';
import { FC, memo, useEffect, useState } from 'react';
import { Prism } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from './button';

export const fence = {
  render: 'CodeBlock',
  attributes: {
    language: {
      type: String,
    },
    value: {
      type: String,
    },
  },
};

interface Props {
  language: string;
  children: string;
}

const customStyle = {
  ...darcula,
  'code[class*="language-"]': {
    ...darcula['code[class*="language-"]'],
    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    fontSize: '0.9rem', // Adjust this value to make the font smaller
  },
  'pre[class*="language-"]': {
    ...darcula['pre[class*="language-"]'],
    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    fontSize: '0.9rem', // Adjust this value to make the font smaller
  },
};

export const CodeBlock: FC<Props> = memo(({ language, children }) => {
  const [isIconChecked, setIsIconChecked] = useState(false);

  const handleButtonClick = () => {
    navigator.clipboard.writeText(children);
    setIsIconChecked(true);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsIconChecked(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isIconChecked]);

  return (
    <div className="flex flex-col -mx-9 p-0 px-10">
      <div className="flex items-center justify-end">
        <Button
          variant={'ghost'}
          size={'sm'}
          title="Copy text"
          className="justify-right flex gap-2"
          onClick={handleButtonClick}
        >
          <span className="text-xs text-muted-foreground">Copy {language}</span>
          {isIconChecked ? <CheckIcon size={16} /> : <ClipboardIcon size={16} />}
        </Button>
      </div>

      <Prism language={language} style={customStyle} PreTag="pre">
        {children}
      </Prism>
    </div>
  );
});

CodeBlock.displayName = 'CodeBlock';
