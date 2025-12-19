import React, { useState, useEffect } from 'react';

interface TypingHeadingProps {
  text: string;
}

const TypingHeading: React.FC<TypingHeadingProps> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const startDelay = setTimeout(() => {
      setIsTyping(true);
    }, 500);

    return () => clearTimeout(startDelay);
  }, []);

  useEffect(() => {
    if (!isTyping || currentIndex >= text.length) return;

    const timeout = setTimeout(() => {
      setDisplayedText(prev => prev + text[currentIndex]);
      setCurrentIndex(prev => prev + 1);
    }, Math.random() * 30 + 40);

    return () => clearTimeout(timeout);
  }, [currentIndex, isTyping, text]);

  const renderHighlightedText = (text: string) => {
    if (text.startsWith('<') && text.endsWith('>')) {
      return <span className="text-[#142F32]">{text}</span>;
    } else if (text.includes('.')) {
      const [obj, method] = text.split('.');
      return (
        <>
          <span className="text-[#142F32]">{obj}</span>
          <span className="text-[#E3FFCC]">{'.' + method}</span>
        </>
      );
    }
    return <span className="text-[#282930]">{text}</span>;
  };

  return (
    <div className="bg-[#F9FAFB] border border-gray-300 rounded-sm shadow-sm p-4 font-mono text-center">
      <div className="inline-block">
        {renderHighlightedText(displayedText)}
        <span className={`inline-block w-0.5 h-6 bg-[#142F32] ml-1 ${currentIndex >= text.length ? 'animate-pulse' : 'animate-pulse'}`}>|</span>
      </div>
    </div>
  );
};

export default TypingHeading;