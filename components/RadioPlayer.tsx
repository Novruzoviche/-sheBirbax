
import React, { useState, useRef, useEffect } from 'react';

const RadioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Updated Stream URL to the one provided by the user
  const STREAM_URL = "https://play.asanradio.az/";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => {
      setIsLoading(false);
      setHasError(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleError = () => {
      console.error("Audio stream error occurred");
      setIsLoading(false);
      setHasError(true);
      setIsPlaying(false);
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        setHasError(false);
        // Reload source to handle stale connections
        audioRef.current.load();
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        }).catch(e => {
          console.error("Playback failed", e);
          setIsPlaying(false);
          setIsLoading(false);
          setHasError(true);
        });
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className={`flex items-center bg-gray-50 border rounded-full px-2 py-1 h-9 select-none transition-colors ${hasError ? 'border-red-200' : 'border-gray-200'}`}>
      <audio 
        ref={audioRef} 
        preload="none"
        crossOrigin="anonymous"
      >
        <source src={STREAM_URL} type="audio/mpeg" />
        Sizin brauzeriniz radio pleyeri dəstəkləmir.
      </audio>
      
      {/* Play/Pause Button */}
      <button 
        onClick={togglePlay}
        disabled={isLoading}
        className={`flex items-center justify-center w-7 h-7 rounded-full transition-all ${
          isPlaying ? 'text-blue-600 bg-blue-50' : 'text-blue-600 hover:bg-blue-50'
        } ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
        title={isPlaying ? "Dayaqlandır" : "Oynat"}
      >
        {isLoading ? (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : isPlaying ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </button>

      <div className="w-px h-4 bg-gray-200 mx-1"></div>

      {/* Mute Button */}
      <button 
        onClick={toggleMute}
        className="flex items-center justify-center w-7 h-7 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        title={isMuted ? "Səsi aç" : "Səsi bağla"}
      >
        {isMuted ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15L4 13.414V10.586L5.586 9M9 5v14l-4.5-4.5H3v-6h1.5L9 5zM16 12l3 3m0-3l-3 3M21 12l-3-3m0 3l3-3" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15L4 13.414V10.586L5.586 9M9 5v14l-4.5-4.5H3v-6h1.5L9 5z" />
          </svg>
        )}
      </button>

      {/* Mini Label */}
      <span className={`hidden sm:inline-block ml-1 mr-1 text-[9px] font-bold uppercase tracking-widest pointer-events-none transition-colors ${hasError ? 'text-red-400' : 'text-gray-400'}`}>
        {hasError ? 'Xəta' : 'Asan'}
      </span>
    </div>
  );
};

export default RadioPlayer;
