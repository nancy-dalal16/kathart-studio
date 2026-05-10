"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import gsap from "gsap";

export default function AmbientMusic() {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedMutedState = localStorage.getItem("ambient-music-muted");
    setIsMuted(savedMutedState === null ? false : savedMutedState === "true");
    setIsInitialized(true);
  }, []);

  const playAudio = useCallback(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    audio.volume = 0;
    audio.play().then(() => {
      gsap.to(audio, { volume: 0.8, duration: 2, ease: "power2.inOut" });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isInitialized || hasInteracted) return;

    const handleFirstInteraction = () => {
      setHasInteracted(true);
      if (!isMuted) playAudio();
    };

    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstInteraction, { once: true });
    window.addEventListener("keydown", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [isInitialized, hasInteracted, isMuted, playAudio]);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    setIsMuted(prev => {
      const newMuted = !prev;
      localStorage.setItem("ambient-music-muted", String(newMuted));

      if (newMuted) {
        gsap.to(audio, {
          volume: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => audio.pause(),
        });
      } else {
        audio.volume = 0;
        audio.play().then(() => {
          gsap.to(audio, { volume: 0.8, duration: 1, ease: "power2.inOut" });
        }).catch(() => {});
      }

      return newMuted;
    });
  }, []);

  return (
    <>
      <audio ref={audioRef} src="/music/electric-ghats.mp3" loop preload="auto" />

      {mounted && (
        <button
          onClick={toggleMute}
          className="fixed bottom-8 right-8 z-[999] group"
          aria-label={isMuted ? "Unmute background music" : "Mute background music"}
        >
          <div
            className="relative w-14 h-14 rounded-full backdrop-blur-xl border transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden"
            style={{
              background: isMuted
                ? "linear-gradient(135deg, rgba(26,23,51,0.8) 0%, rgba(15,15,26,0.9) 100%)"
                : "linear-gradient(135deg, rgba(139,92,246,0.3) 0%, rgba(168,85,247,0.4) 100%)",
              borderColor: isMuted ? "rgba(255,255,255,0.1)" : "rgba(168,85,247,0.5)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {!isMuted && (
              <div className="absolute inset-0 rounded-full border-2 border-purple-400/50 animate-ping" />
            )}
            <div className="relative w-full h-full flex items-center justify-center">
              {isMuted ? (
                <VolumeX className="w-6 h-6 text-gray-400 transition-colors duration-300" />
              ) : (
                <Volume2 className="w-6 h-6 text-purple-300 transition-colors duration-300" />
              )}
            </div>
          </div>
        </button>
      )}
    </>
  );
}