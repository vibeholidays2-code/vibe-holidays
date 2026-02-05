import React from 'react';
import './SpinningWorld3D.css';

interface SpinningWorld3DProps {
  size?: number;
  className?: string;
}

const SpinningWorld3D: React.FC<SpinningWorld3DProps> = ({ 
  size = 200, 
  className = '' 
}) => {
  return (
    <div className={`spinning-world-container ${className}`} style={{ width: size, height: size }}>
      {/* World Globe */}
      <div className="world-globe">
        <div className="world-surface">
          <div className="continent continent-1"></div>
          <div className="continent continent-2"></div>
          <div className="continent continent-3"></div>
          <div className="continent continent-4"></div>
          <div className="continent continent-5"></div>
          <div className="continent continent-6"></div>
        </div>
        
        {/* Atmosphere glow */}
        <div className="atmosphere"></div>
      </div>
      
      {/* Airplane orbits */}
      <div className="airplane-orbit orbit-1">
        <div className="airplane airplane-1">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M21,16V14L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z"/>
          </svg>
        </div>
      </div>
      
      <div className="airplane-orbit orbit-2">
        <div className="airplane airplane-2">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M21,16V14L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z"/>
          </svg>
        </div>
      </div>
      
      <div className="airplane-orbit orbit-3">
        <div className="airplane airplane-3">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M21,16V14L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z"/>
          </svg>
        </div>
      </div>
      
      {/* Flight paths/trails */}
      <div className="flight-path path-1"></div>
      <div className="flight-path path-2"></div>
      <div className="flight-path path-3"></div>
    </div>
  );
};

export default SpinningWorld3D;