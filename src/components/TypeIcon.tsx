'use client';

import Image from 'next/image';

interface TypeIconProps {
  type: string;
  size?: number;
  className?: string;
}

const TypeIcon = ({ type, size = 24, className = '' }: TypeIconProps) => {
  return (
    <Image
      src={`/types/${type}.png`}
      alt={`${type} type`}
      width={size}
      height={size}
      className={`object-contain drop-shadow-sm ${className}`}
    />
  );
};

export default TypeIcon;
