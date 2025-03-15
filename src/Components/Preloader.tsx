import React from 'react';
import { localizationService } from "@/services/localizationService";

const Preloader = () => {
  // Типизация стилей с использованием React.CSSProperties
  const preloaderContainerStyle: React.CSSProperties = {
    width: '100%',
    height: '500px',
    background: 'linear-gradient(135deg, #fbbf24, #f87171, #ec4899)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  };

  const preloaderTextStyle: React.CSSProperties = {
    position: 'absolute',
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
  };

  const rocketStyle: React.CSSProperties = {
    fontSize: '48px',
  };

  return (
    <div style={preloaderContainerStyle}>
      <div style={preloaderTextStyle}>
        <div>{localizationService.get("Preloader")}</div>
        <div style={rocketStyle}>🚀</div>
      </div>
    </div>
  );
};

export default Preloader;
