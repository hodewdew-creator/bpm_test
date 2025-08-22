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

  const containerClass =
    "flex flex-col items-center justify-between h-screen p-4 transition-all duration-500 " +
    (hasTapped ? "bg-[url('/bg-cat.jpg')] bg-cover bg-center" : "bg-white");

  return (
    <div
      className={containerClass}
      style={hasTapped ? { backdropFilter: "brightness(0.85) blur(3px)" } : {}}
    >
      {/* 헤더 */}
      <div className="w-full flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">CAT HR/RR COUNTER</h1>
        <button
          onClick={() => setIsMuted(v => !v)}
          className="text-2xl"
          title="(M) 음소거 토글"
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
      </div>

      {/* 중앙 TAP 영역 */}
      <div
        id="tap-box"
        onClick={handleTap}
        className="flex-1 w-full max-w-sm flex items-center justify-center bg-white bg-opacity-80 shadow-xl border-4 border-lime-400 active:scale-95 transition-transform rounded-xl"
      >
        {bpm ? (
          <span className="text-6xl text-lime-700 font-extrabold">{bpm}</span>
        ) : (
          <span className="text-3xl text-lime-700 font-semibold">TAP!</span>
        )}
      </div>

      {/* 하단 보조 정보 */}
      <div className="w-full max-w-sm mt-4 space-y-1 text-center">
        <p className="text-gray-800 text-base">
          측정 횟수: <span className="font-bold text-lime-600">{taps.length}</span>
        </p>
        <p className="text-gray-800 text-base">
          경과 시간: <span className="font-bold text-lime-600">{elapsed}</span> 초
        </p>
        <button
          onClick={reset}
          className="mt-3 px-6 py-2 w-full rounded-full bg-lime-500 text-white font-medium hover:bg-lime-600 transition"
        >
          RESET
        </button>
      </div>

      <audio ref={audioRef} src="/meow.mp3" preload="auto" />
    </div>
  );
}
