// src/components/SvgFilters.jsx
import React from 'react';

export default function SvgFilters() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
      <defs>
        {/* Procedural noise filter (optional if you use an image instead) */}
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>

        {/* Displacement for CRT warble */}
        <filter id="crtWarble">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.005"
            numOctaves="3"
            result="warp"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="warp"
            scale="8"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}