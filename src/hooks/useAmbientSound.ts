import { useState, useCallback, useEffect, useRef } from "react";

export type SoundTrack = "off" | "rain" | "calm" | "night";

// Local high-quality ambient sounds
const SOUND_URLS: Record<Exclude<SoundTrack, "off">, string> = {
  rain: "/music/rain.mp3",
  calm: "/music/calm.mp3",
  night: "/music/night.mp3",
};

// No backups needed for local files
const BACKUP_URLS: Record<Exclude<SoundTrack, "off">, string> = {
  rain: "/music/rain.mp3",
  calm: "/music/calm.mp3",
  night: "/music/night.mp3",
};

const TRACK_KEY = "tgwfhe_sound_track";
const VOL_KEY = "tgwfhe_sound_volume";

export function useAmbientSound() {
  const [track, setTrack] = useState<SoundTrack>("off");
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedTrack = (localStorage.getItem(TRACK_KEY) as SoundTrack) ?? "off";
    const savedVol = parseFloat(localStorage.getItem(VOL_KEY) ?? "0.3");
    setTrack(savedTrack);
    setVolume(savedVol);
  }, []);

  // Switch track
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (track === "off") return;

    const audio = new Audio();
    audio.loop = true;
    audio.volume = volume;

    // Try primary URL first
    const primaryUrl = SOUND_URLS[track];
    const backupUrl = BACKUP_URLS[track];

    audio.src = primaryUrl;
    audio.play().catch(() => {
      // If primary fails, try backup
      audio.src = backupUrl;
      audio.play().catch(() => {
        console.debug(`Could not play ambient sound: ${track}`);
      });
    });

    audioRef.current = audio;

    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
      }
      audioRef.current = null;
    };
  }, [track]);

  // Update volume without restarting
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = Math.max(0, Math.min(1, volume));
  }, [volume]);

  const changeTrack = useCallback((t: SoundTrack) => {
    setTrack(t);
    localStorage.setItem(TRACK_KEY, t);
  }, []);

  const changeVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolume(clamped);
    localStorage.setItem(VOL_KEY, String(clamped));
  }, []);

  return { track, volume, changeTrack, changeVolume };
}
