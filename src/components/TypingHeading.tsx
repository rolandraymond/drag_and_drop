import { useEffect, useState } from 'react';

interface TypingHeadingProps {
  text: string;
}

export default function TypingHeading({ text }: TypingHeadingProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    let typingTimer: number | undefined;

    setDisplayedText('');

    const typeNextChar = () => {
      index += 1;
      setDisplayedText(text.slice(0, index));

      if (index < text.length) {
        const delay = Math.floor(Math.random() * 30) + 40;
        typingTimer = window.setTimeout(typeNextChar, delay);
      }
    };

    typingTimer = window.setTimeout(typeNextChar, 500);

    return () => {
      if (typingTimer) clearTimeout(typingTimer);
    };
  }, [text]);

  useEffect(() => {
    const cursorTimer = window.setInterval(() => {
      setShowCursor((v) => !v);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <span className='inline-flex items-center font-mono'>
      {displayedText}
      <span
        className={`ml-1 transition-opacity duration-150 ${
          showCursor ? 'opacity-100' : 'opacity-0'
        }`}
      >
        |
      </span>
    </span>
  );
}
