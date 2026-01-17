/**
 * Bow Component
 * Creates decorative bow SVG for gift-wrapping theme
 */

interface BowProps {
  color?: string;
  size?: number;
  className?: string;
}

export function Bow({ 
  color = '#FF6B9D', 
  size = 80,
  className = ''
}: BowProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bow center */}
      <circle cx="50" cy="50" r="8" fill={color} opacity="0.9" />
      
      {/* Left loop */}
      <path
        d="M 50,50 Q 30,40 25,50 Q 30,60 50,50"
        fill={color}
        opacity="0.8"
      />
      <path
        d="M 50,50 Q 30,40 25,50"
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      
      {/* Right loop */}
      <path
        d="M 50,50 Q 70,40 75,50 Q 70,60 50,50"
        fill={color}
        opacity="0.8"
      />
      <path
        d="M 50,50 Q 70,40 75,50"
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      
      {/* Bottom left tail */}
      <path
        d="M 50,50 Q 45,70 35,85"
        stroke={color}
        strokeWidth="3"
        fill="none"
        opacity="0.7"
        strokeLinecap="round"
      />
      
      {/* Bottom right tail */}
      <path
        d="M 50,50 Q 55,70 65,85"
        stroke={color}
        strokeWidth="3"
        fill="none"
        opacity="0.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default Bow;
