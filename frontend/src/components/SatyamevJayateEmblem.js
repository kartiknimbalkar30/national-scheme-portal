import React, { useState } from 'react';
import emblemImg from '../assets/emblem.png';

/**
 * SatyamevJayateEmblem
 * Pure, transparent golden Ashoka Lion Capital (Satyamev Jayate) emblem
 * Supports 3D standing coin spin on intro and interactive click/touch in-place spin.
 */
function SatyamevJayateEmblem({
  size = 300,
  className = '',
  isRotating = false,
  interactive = false,
  onClick
}) {
  const [isSelfSpinning, setIsSelfSpinning] = useState(false);

  const handleClick = (e) => {
    if (interactive && !isSelfSpinning) {
      setIsSelfSpinning(true);
      setTimeout(() => {
        setIsSelfSpinning(false);
      }, 1200);
    }
    if (onClick) {
      onClick(e);
    }
  };

  const isSpinningNow = isRotating || isSelfSpinning;

  return (
    <div
      className={`satyamev-emblem-wrap ${className} ${isSpinningNow ? 'emblem-coin-spin' : ''} ${interactive ? 'emblem-interactive' : ''}`}
      onClick={handleClick}
      onTouchStart={handleClick}
      title={interactive ? "Click or tap to spin the emblem" : undefined}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: 'transparent',
        transformStyle: 'preserve-3d',
        perspective: '1200px',
        cursor: interactive ? 'pointer' : 'default',
        userSelect: 'none'
      }}
    >
      {/* PURE TRANSPARENT EMBLEM LOGO */}
      <img
        src={emblemImg}
        alt="Satyamev Jayate — National Scheme Portal Emblem"
        className="emblem-logo-img"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          background: 'transparent',
          filter: 'drop-shadow(0 12px 28px rgba(0, 0, 0, 0.45)) drop-shadow(0 0 24px rgba(245, 158, 11, 0.35))',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}

export default SatyamevJayateEmblem;
