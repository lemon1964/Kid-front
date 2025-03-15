"use client";

import React, { useEffect, useState } from "react";
import { audioService } from "@/services/audioService";

interface MusicControlProps {
  music: string;
}

const MusicControl: React.FC<MusicControlProps> = ({ music }) => {
  const [volume, setVolume] = useState(0.5); // Начальная громкость

  useEffect(() => {
    // Воспроизводим музыку при изменении пути
    audioService.playMusic(music);
    audioService.setMusicVolume(volume);
    return () => {
      // Останавливаем музыку при размонтировании компонента
      audioService.stopMusic();
    };
  }, [music]);

  useEffect(() => {
    // Обновляем громкость при изменении state
    audioService.setMusicVolume(volume);
  }, [volume]);

  const handleVolumeChange = (delta: number) => {
    const newVolume = Math.max(0, Math.min(volume + delta, 1));
    setVolume(newVolume); // Обновляем state громкости
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleVolumeChange(-0.1)}
        className="bg-gray-300 text-black px-2 rounded"
      >
        -
      </button>
      <span className="text-lg">Music</span>
      <button
        onClick={() => handleVolumeChange(0.1)}
        className="bg-gray-300 text-black px-2 rounded"
      >
        +
      </button>
    </div>
  );
};

export default MusicControl;
