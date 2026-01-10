/**
 * Ribbon Component
 * Creates flowing ribbon SVG paths for gift-wrapping theme
 */

interface RibbonProps {
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  direction?: 'diagonal-left' | 'diagonal-right' | 'curved' | 'horizontal';
}

export function Ribbon({ 
  color = '#FF6B9D', 
  width = 200, 
  height = 60,
  className = '',
  direction = 'diagonal-left'
}: RibbonProps) {
  const paths = {
    'diagonal-left': `M 0,${height * 0.2} Q ${width * 0.25},${height * 0.5} ${width * 0.5},${height * 0.3} T ${width},${height * 0.2} L ${width},${height * 0.8} Q ${width * 0.75},${height * 0.5} ${width * 0.5},${height * 0.7} T 0,${height * 0.8} Z`,
    'diagonal-right': `M 0,${height * 0.8} Q ${width * 0.25},${height * 0.5} ${width * 0.5},${height * 0.7} T ${width},${height * 0.8} L ${width},${height * 0.2} Q ${width * 0.75},${height * 0.5} ${width * 0.5},${height * 0.3} T 0,${height * 0.2} Z`,
    'curved': `M 0,${height * 0.5} Q ${width * 0.2},${height * 0.3} ${width * 0.4},${height * 0.5} T ${width * 0.8},${height * 0.5} Q ${width},${height * 0.7} ${width},${height * 1} L ${width},${height} L 0,${height} Z`,
    'horizontal': `M 0,${height * 0.35} L ${width * 0.3},${height * 0.4} L ${width * 0.7},${height * 0.6} L ${width},${height * 0.65} L ${width},${height * 0.85} L ${width * 0.7},${height * 0.8} L ${width * 0.3},${height * 0.6} L 0,${height * 0.55} Z`,
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={paths[direction]}
        fill={color}
        fillOpacity="0.8"
      />
      <path
        d={paths[direction]}
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.3"
      />
    </svg>
  );
}

export default Ribbon;
