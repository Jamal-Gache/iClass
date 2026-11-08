import { useEffect, useRef } from 'react';

// To swap to a different TTS provider later: replace this hook's internals only.
// audioUrl comes from /api/tts/preload — a cached ElevenLabs MP3 served at /tts/*.mp3
export function useSpeech(audioUrl: string | null, enabled: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!enabled || !audioUrl) return;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.play().catch(() => {}); // ignore autoplay block (browser policy)
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []); // runs once on mount; slides remount on nav via key={currentNodeId}
}
