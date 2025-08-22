import { useState, useEffect, useRef } from "react";

export default function BpmCounterApp() {
  const [taps, setTaps] = useState([]);
  const [bpm, setBpm] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [hasTapped, setHasTapped] = useState(false);
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem("muted") === "1");
  const audioRef = useRef(null);

  useEffect(() => {
    if (taps.length > 1) {
      const diff = (taps[taps.length - 1] - taps[0]) / 1000;
      setElapsed(diff.toFixed(2));
      setBpm(Math.round(((taps.length - 1) / diff) * 60));
    } else {
      setBpm(null);
      setElapsed(0);
    }
  }, [taps]);

  useEffect(() => {
    localStorage.setItem("muted", isMuted ? "1" : "0");
  }, [isMuted]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() === "m") setIsMuted(v => !v);
      if (e.key === " " || e.key.toLowerCase() === "t") handleTap();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleTap = () => {
    if (!isMuted && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
    setTaps((prev) => [...prev, Date.now()]);
    setHasTapped(true);
  };

  const reset = () => {
    setTaps([]);
    setBpm(null);
    setElapsed(0);
    setHasTapped(false);
  };

  const containerBase =
    "app flex flex-col items-center justify-between p-4 transition-all duration-500 ";
  const containerClass = containerBase + (hasTapped ? "bg-[url('/bg-cat.jpg')] bg-cover bg-center" : "bg-white");

  return (
    <div
      className={containerClass}
      style={hasTapped ? { backdropFilter: "brightness(0.9) blur(2px)" } : {}}
    >
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-2 sm:mb-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-lime-400 to-emerald-600 bg-clip-text text-transparent drop-shadow">
          🐾 CAT HR/RR <span className="opacity-80">Counter</span>
        </h1>
        <button
          onClick={() => setIsMuted(v => !v)}
          className="text-2xl"
          title="(M) 음소거 토글"
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
      </div>

      {/* Center TAP area */}
      <div
        id="tap-box"
        onClick={handleTap}
        className="w-full max-w-sm flex items-center justify-center bg-white/85 shadow-xl border-4 border-lime-400 active:scale-95 transition-transform rounded-xl"
        style={{ minHeight: "42vh", maxHeight: "460px", flex: "1 1 auto" }}
      >
        {bpm ? (
          <span className="text-6xl text-lime-700 font-extrabold leading-none">{bpm}</span>
        ) : (
          <span className="text-3xl text-lime-700 font-semibold">TAP!</span>
        )}
      </div>

      {/* Footer */}
      <div className="w-full max-w-sm mt-3 sm:mt-4 space-y-1 text-center">
        <p className="text-gray-800 text-sm sm:text-base">
          측정 횟수: <span className="font-bold text-lime-600">{taps.length}</span>
          {" · "}
          경과 시간: <span className="font-bold text-lime-600">{elapsed}</span>초
        </p>
        <button
          onClick={reset}
          className="mt-2 px-6 py-2 w-full rounded-full bg-lime-500 text-white font-medium hover:bg-lime-600 transition"
        >
          RESET
        </button>
      </div>

      <audio ref={audioRef} src="/meow.mp3" preload="auto" />
    </div>
  );
}
