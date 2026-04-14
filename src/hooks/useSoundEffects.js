import { useRef, useCallback } from 'react';

const SOUNDS = {
  attack: 'https://assets.mixkit.co/active_storage/sfx/2755/2755-preview.mp3',
  hit: 'https://assets.mixkit.co/active_storage/sfx/1508/1508-preview.mp3',
  heal: 'https://assets.mixkit.co/active_storage/sfx/2848/2848-preview.mp3',
  ultimate: 'https://assets.mixkit.co/active_storage/sfx/2864/2864-preview.mp3',
  qte: 'https://assets.mixkit.co/active_storage/sfx/3080/3080-preview.mp3',
  victory: 'https://assets.mixkit.co/active_storage/sfx/2859/2859-preview.mp3',
  defeat: 'https://assets.mixkit.co/active_storage/sfx/2730/2730-preview.mp3',
  bgMusic: 'https://assets.mixkit.co/active_storage/music/5028/5028-preview.mp3',
};

export function useSoundEffects() {
  const audioRefs = useRef({});
  const bgMusicRef = useRef(null);

  const playSound = useCallback((soundKey, volume = 0.5) => {
    if (!audioRefs.current[soundKey]) {
      const audio = new Audio(SOUNDS[soundKey]);
      audio.volume = volume;
      audioRefs.current[soundKey] = audio;
    }
    const audio = audioRefs.current[soundKey];
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, []);

  const startBgMusic = useCallback(() => {
    if (!bgMusicRef.current) {
      const audio = new Audio(SOUNDS.bgMusic);
      audio.volume = 0.3;
      audio.loop = true;
      bgMusicRef.current = audio;
    }
    bgMusicRef.current.play().catch(() => {});
  }, []);

  const stopBgMusic = useCallback(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
      bgMusicRef.current.currentTime = 0;
    }
  }, []);

  return { playSound, startBgMusic, stopBgMusic };
}