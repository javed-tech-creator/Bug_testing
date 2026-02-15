import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause, X } from "lucide-react";

const WhatsAppAudioPlayer = ({ file, onRemove }) => {
  const waveformRef = useRef(null);
  const waveSurferRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!waveformRef.current) return;

    waveSurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#d1d5db",
      progressColor: "#22c55e",
      height: 40,
      barWidth: 3,
      barRadius: 3,
      cursorWidth: 0,
      normalize: true,
    });

    const url = URL.createObjectURL(file);
    waveSurferRef.current.load(url);

    waveSurferRef.current.on("ready", () => {
      setDuration(waveSurferRef.current.getDuration());
    });

    waveSurferRef.current.on("audioprocess", () => {
      setCurrent(waveSurferRef.current.getCurrentTime());
    });

    waveSurferRef.current.on("finish", () => {
      setIsPlaying(false);
    });

    return () => {
      waveSurferRef.current.destroy();
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const togglePlay = () => {
    waveSurferRef.current.playPause();
    setIsPlaying((p) => !p);
  };

  const formatTime = (t) =>
    `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

  return (
    <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3">
      {/* Play / Pause */}
      <button
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center"
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>

      {/* Waveform */}
      <div className="flex-1">
        <div ref={waveformRef} />
        <div className="text-xs text-gray-600 mt-1">
          {formatTime(current)} / {formatTime(duration)}
        </div>
      </div>

      {/* Remove */}
      {onRemove && (
        <button
          onClick={onRemove}
          className=" bg-white rounded-full p-1 shadow hover:bg-red-50"
        >
          <X className="w-4 h-4 text-red-500" />
        </button>
      )}
    </div>
  );
};

export default WhatsAppAudioPlayer;
