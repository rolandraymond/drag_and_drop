import React, { useState, useEffect } from 'react';

interface TypingHeadingProps {
  text: string;
}

const TypingHeading: React.FC<TypingHeadingProps> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    let timeoutId: number;

    const startTyping = () => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
        const delay = Math.random() * (70 - 40) + 40;
        timeoutId = setTimeout(startTyping, delay);
      }
    };

    const initialDelay = setTimeout(startTyping, 500);

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(timeoutId);
      clearInterval(cursorInterval);
    };
  }, [text]);


  return (
    <span className="inline-block">
      {displayedText}
      <span className={`ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
    </span>
  );
};

export default TypingHeading;