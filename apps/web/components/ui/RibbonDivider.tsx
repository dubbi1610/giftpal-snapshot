/**
 * Ribbon Divider Component
 * Creates flowing ribbon divider between sections
 */

interface RibbonDividerProps {
  color?: string;
  className?: string;
  flipped?: boolean;
}

export function RibbonDivider({ 
  color = '#FF6B9D', 
  className = '',
  flipped = false
}: RibbonDividerProps) {
  const path = flipped 
    ? "M 0,50 Q 200,20 400,50 T 800,50 T 1200,50 L 1200,100 L 0,100 Z"
    : "M 0,50 Q 200,80 400,50 T 800,50 T 1200,50 L 1200,0 L 0,0 Z";
  
  const gradientId = `ribbonGradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg
        width="100%"
        height="100"
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="50%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          d={path}
          fill={`url(#${gradientId})`}
        />
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeOpacity="0.3"
        />
      </svg>
    </div>
  );
}

export default RibbonDivider;
