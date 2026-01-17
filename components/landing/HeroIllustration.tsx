'use client';

export function HeroIllustration() {
  return (
    <div className="relative flex items-center justify-center h-full w-full">
      <svg
        viewBox="0 0 600 600"
        className="w-full h-full max-w-2xl animate-float-slow"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft abstract background shapes */}
        <circle cx="100" cy="100" r="80" fill="rgba(255, 182, 193, 0.15)" />
        <circle cx="500" cy="200" r="100" fill="rgba(221, 160, 221, 0.15)" />
        <circle cx="150" cy="450" r="90" fill="rgba(173, 216, 230, 0.15)" />
        
        {/* Gift boxes */}
        {/* Large gift box (center) */}
        <g transform="translate(200, 200)">
          {/* Box */}
          <rect x="0" y="0" width="200" height="200" rx="8" fill="#9333ea" opacity="0.9">
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-10; 0,0" dur="3s" repeatCount="indefinite" />
          </rect>
          <rect x="80" y="0" width="40" height="200" fill="#a855f7">
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-10; 0,0" dur="3s" repeatCount="indefinite" />
          </rect>
          <rect x="0" y="80" width="200" height="40" fill="#a855f7">
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-10; 0,0" dur="3s" repeatCount="indefinite" />
          </rect>
          
          {/* Ribbon bow on top */}
          <circle cx="100" cy="40" r="25" fill="#ec4899">
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-10; 0,0" dur="3s" repeatCount="indefinite" />
          </circle>
          <path d="M 75 40 Q 65 30 65 20 Q 65 10 75 10 Q 85 10 85 20 Q 85 30 75 40" fill="#ec4899">
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-10; 0,0" dur="3s" repeatCount="indefinite" />
          </path>
          <path d="M 125 40 Q 135 30 135 20 Q 135 10 125 10 Q 115 10 115 20 Q 115 30 125 40" fill="#ec4899">
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-10; 0,0" dur="3s" repeatCount="indefinite" />
          </path>
          <path d="M 75 50 L 85 70 L 100 50 L 115 70 L 125 50" fill="#ec4899" stroke="#ec4899" strokeWidth="2">
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-10; 0,0" dur="3s" repeatCount="indefinite" />
          </path>
        </g>

        {/* Medium gift box (left) */}
        <g transform="translate(50, 350)">
          <rect x="0" y="0" width="150" height="150" rx="6" fill="#ec4899" opacity="0.85">
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-8; 0,0" dur="4s" begin="1s" repeatCount="indefinite" />
          </rect>
          <rect x="55" y="0" width="40" height="150" fill="#f472b6">
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-8; 0,0" dur="4s" begin="1s" repeatCount="indefinite" />
          </rect>
          <rect x="0" y="55" width="150" height="40" fill="#f472b6">
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-8; 0,0" dur="4s" begin="1s" repeatCount="indefinite" />
          </rect>
          
          {/* Ribbon */}
          <circle cx="75" cy="30" r="18" fill="#fbbf24">
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-8; 0,0" dur="4s" begin="1s" repeatCount="indefinite" />
          </circle>
          <path d="M 60 30 Q 55 25 55 18 Q 55 12 60 12 Q 65 12 65 18 Q 65 25 60 30" fill="#fbbf24">
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-8; 0,0" dur="4s" begin="1s" repeatCount="indefinite" />
          </path>
          <path d="M 90 30 Q 95 25 95 18 Q 95 12 90 12 Q 85 12 85 18 Q 85 25 90 30" fill="#fbbf24">
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-8; 0,0" dur="4s" begin="1s" repeatCount="indefinite" />
          </path>
        </g>

        {/* Small gift box (right) */}
        <g transform="translate(380, 300)">
          <rect x="0" y="0" width="120" height="120" rx="6" fill="#3b82f6" opacity="0.85">
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-6; 0,0" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
          </rect>
          <rect x="40" y="0" width="40" height="120" fill="#60a5fa">
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-6; 0,0" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
          </rect>
          <rect x="0" y="40" width="120" height="40" fill="#60a5fa">
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-6; 0,0" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
          </rect>
          
          {/* Ribbon */}
          <circle cx="60" cy="25" r="15" fill="#fbbf24">
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-6; 0,0" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
          </circle>
          <path d="M 48 25 Q 45 22 45 18 Q 45 15 48 15 Q 51 15 51 18 Q 51 22 48 25" fill="#fbbf24">
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-6; 0,0" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
          </path>
          <path d="M 72 25 Q 75 22 75 18 Q 75 15 72 15 Q 69 15 69 18 Q 69 22 72 25" fill="#fbbf24">
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-6; 0,0" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
          </path>
        </g>

        {/* Floating hearts/sparkles */}
        <g opacity="0.6">
          <path d="M 120 250 C 120 245, 115 240, 110 240 C 105 240, 100 245, 100 250 C 100 255, 110 265, 110 265 C 110 265, 120 255, 120 250 Z" fill="#ec4899">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-5; 0,0" dur="2s" repeatCount="indefinite" />
          </path>
          <path d="M 450 180 C 450 175, 445 170, 440 170 C 435 170, 430 175, 430 180 C 430 185, 440 195, 440 195 C 440 195, 450 185, 450 180 Z" fill="#f472b6">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0.5s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-5; 0,0" dur="2s" begin="0.5s" repeatCount="indefinite" />
          </path>
          <path d="M 200 480 C 200 475, 195 470, 190 470 C 185 470, 180 475, 180 480 C 180 485, 190 495, 190 495 C 190 495, 200 485, 200 480 Z" fill="#60a5fa">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="1s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-5; 0,0" dur="2s" begin="1s" repeatCount="indefinite" />
          </path>
        </g>

        {/* Sparkles */}
        <g fill="#fbbf24" opacity="0.7">
          <circle cx="80" cy="150" r="3">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="r" values="3;4;3" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="480" cy="120" r="2.5">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
            <animate attributeName="r" values="2.5;3.5;2.5" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
          </circle>
          <circle cx="350" cy="450" r="3">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="0.6s" repeatCount="indefinite" />
            <animate attributeName="r" values="3;4;3" dur="1.5s" begin="0.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="250" cy="100" r="2">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="0.9s" repeatCount="indefinite" />
            <animate attributeName="r" values="2;3;2" dur="1.5s" begin="0.9s" repeatCount="indefinite" />
          </circle>
          <circle cx="520" cy="350" r="2.5">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="1.2s" repeatCount="indefinite" />
            <animate attributeName="r" values="2.5;3.5;2.5" dur="1.5s" begin="1.2s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  );
}
