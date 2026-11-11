import React from 'react';

interface RansomWordProps {
  word: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const RansomWord: React.FC<RansomWordProps> = ({
  word,
  size = 'md',
  className = '',
}) => {
  // Pure Manga Black & White contrasting cutout styles
  const styles = [
    { bg: 'bg-white', text: 'text-black', border: 'border-[3px] border-black', rot: '-rotate-2' },
    { bg: 'bg-black', text: 'text-white', border: 'border-[3px] border-white', rot: 'rotate-3' },
    { bg: 'bg-zinc-200', text: 'text-black', border: 'border-[3px] border-black', rot: '-rotate-3' },
    { bg: 'bg-black', text: 'text-zinc-100', border: 'border-[3px] border-zinc-400', rot: 'rotate-2' },
    { bg: 'bg-white', text: 'text-black', border: 'border-[3px] border-black', rot: '-rotate-1' },
    { bg: 'bg-zinc-900', text: 'text-white', border: 'border-[3px] border-white', rot: 'rotate-4' },
  ];

  const sizeStyles = {
    sm: 'text-base md:text-lg px-2 py-0.5 mx-0.5 min-w-[28px] h-8',
    md: 'text-xl md:text-2xl px-2.5 py-1 mx-0.5 min-w-[34px] h-10',
    lg: 'text-2xl md:text-4xl px-2 md:px-3 py-1.5 mx-0.5 md:mx-1 min-w-[36px] md:min-w-[44px] h-12 md:h-14',
    xl: 'text-4xl md:text-6xl lg:text-7xl px-3 md:px-4 py-2 mx-0.5 md:mx-1 min-w-[48px] md:min-w-[64px] lg:min-w-[74px] h-14 md:h-20 lg:h-24',
  };

  return (
    <div className={`inline-flex flex-nowrap items-center ${className}`}>
      {word.split('').map((char, idx) => {
        if (char === ' ') {
          return <span key={idx} className="w-3 md:w-6" />;
        }

        const style = styles[(idx * 5 + word.length) % styles.length];

        return (
          <span
            key={idx}
            className={`ransom-letter font-black select-none ${style.bg} ${style.text} ${style.border} ${style.rot} ${sizeStyles[size]}`}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};
