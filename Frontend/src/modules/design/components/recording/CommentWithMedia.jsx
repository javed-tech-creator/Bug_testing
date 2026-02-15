import React, { useRef, useState, useEffect } from "react";
import {
  Plus,
  Mic,
  Image,
  Video,
  Square,
  Pause,
  Play,
  Headphones,
  X,
  AudioLines,
  CircleStop,
} from "lucide-react";
import micStatic from "../../../../assets/recording/mic-static.svg";
import micRecording from "../../../../assets/recording/mic-recording.gif";
import WhatsAppAudioPlayer from "./WhatsAppAudioPlayer";

const CommentWithMedia = ({
  title = "Write Your Comments",
  placeholder = "Write your comment...",
  value = "",
  onChange,
  files = [],
  onFilesChange,
}) => {
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const optionBoxRef = useRef(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const [showOptions, setShowOptions] = useState(false);
  // const [selectedFiles, setSelectedFiles] = useState([]);
  // const [comments, setComments] = useState("");

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordTime, setRecordTime] = useState(0);

  /* ⏱️ Recording Timer */
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordTime((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording, isPaused]);

  const formatTime = (sec) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(
      sec % 60
    ).padStart(2, "0")}`;

  /* Outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (optionBoxRef.current && !optionBoxRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };
    if (showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showOptions]);

  /* File select */
  const handleFileSelect = (e) => {
    const newFiles = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    if (newFiles.length) {
      onFilesChange?.([...files, ...newFiles]);
    }
    e.target.value = "";
  };

  /*  Remove file */
  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    onFilesChange(updated);
  };

  /* 🎤 Start Recording */
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) =>
      audioChunksRef.current.push(e.data);

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const file = new File([blob], `recording-${Date.now()}.webm`, {
        type: "audio/webm",
      });
      onFilesChange([
        ...files,
        {
          file,
          preview: URL.createObjectURL(file),
        },
      ]);
      setRecordTime(0);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
    setIsPaused(false);
  };

  const pauseRecording = () => {
    mediaRecorderRef.current.pause();
    setIsPaused(true);
  };

  const resumeRecording = () => {
    mediaRecorderRef.current.resume();
    setIsPaused(false);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    setIsRecording(false);
    setIsPaused(false);
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      }
      clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border mt-5">
      <div className="px-5 py-3 border-b flex gap-2 items-center">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>

      <div className="p-5 relative">
        {/* <label className="block text-sm font-medium text-gray-800 mb-2">
          Comments
        </label> */}

        <div className="flex items-center gap-2 border rounded-md bg-gray-50 px-3 py-2">
          <input
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-sm"
          />

          <button
            onClick={() => setShowOptions((p) => !p)}
            title="Upload Media"
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            <Plus className="w-5 h-5" />
          </button>

          {!isRecording ? (
            <button
              onClick={startRecording}
              title="Voice Recording"
              className="p-2 rounded-full bg-green-400 hover:bg-green-500 text-white"
            >
              <Mic className="w-5 h-5 " />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600 flex gap-1 items-center">
                <img
                  src={isRecording && isPaused ? micStatic : micRecording}
                  alt="mic"
                  title="Mic"
                  className="w-6 h-6"
                />{" "}
                <span className="w-10"> {formatTime(recordTime)} </span>
              </span>

              {!isPaused ? (
                <button
                  onClick={pauseRecording}
                  title="Pause"
                  className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 text-red-600"
                >
                  <Pause className="w-5 h-5 text-yellow-600" />
                </button>
              ) : (
                <button
                  onClick={resumeRecording}
                  title="Resume"
                  className="p-2 rounded-full bg-green-100 hover:bg-green-200 text-red-600"
                >
                  <Play className="w-5 h-5 text-green-600" />
                </button>
              )}

              <button
                onClick={stopRecording}
                title="Stop"
                className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600"
              >
                <CircleStop className="w-5 h-5 text-red-600" />
              </button>
            </div>
          )}
        </div>

        {showOptions && (
          <div
            ref={optionBoxRef}
            className="absolute bottom-20 right-5 bg-white border rounded-lg shadow-lg w-44"
          >
            <button
              onClick={() => imageInputRef.current.click()}
              className="p-3 flex gap-2 w-full items-center hover:bg-gray-100"
            >
              <Image className="w-4 h-4 text-blue-600" /> Image
            </button>
            <button
              onClick={() => audioInputRef.current.click()}
              className="p-3 flex gap-2 w-full items-center hover:bg-gray-100"
            >
              <Headphones className="w-4 h-4 text-orange-600" /> Audio
            </button>
            <button
              onClick={() => videoInputRef.current.click()}
              className="p-3 flex gap-2 w-full items-center hover:bg-gray-100"
            >
              <Video className="w-4 h-4 text-purple-600" /> Video
            </button>
          </div>
        )}

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFileSelect}
        />
        <input
          ref={audioInputRef}
          type="file"
          accept="audio/*"
          multiple
          hidden
          onChange={handleFileSelect}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          multiple
          hidden
          onChange={handleFileSelect}
        />

        {files.length > 0 && (
          <p className="mt-2 text-sm text-gray-600 text-end">
            📎 {files.length} files selected
          </p>
        )}
      </div>

      {/* 🔥 PREVIEW SECTION */}
      {files.length > 0 && (
        <div className="px-5 pb-4 space-y-4">
          {/* Images & Videos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {files.map((item, i) => {
              const { file, preview } = item;
              if (
                !file.type.startsWith("image") &&
                !file.type.startsWith("video")
              ) {
                return null;
              }

              return (
                <div
                  key={i}
                  className="relative border rounded-lg overflow-hidden bg-gray-50"
                >
                  {/*  Remove */}
                  <button
                    onClick={() => removeFile(i)}
                    className="absolute top-1 right-1 z-10 bg-white rounded-full p-1 shadow hover:bg-red-50"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>

                  {file.type.startsWith("image") && (
                    <img
                      src={preview}
                      alt=""
                      onClick={() => window.open(preview, "_blank")}
                      className="h-32 w-full object-cover cursor-pointer hover:opacity-90"
                    />
                  )}

                  {file.type.startsWith("video") && (
                    <video
                      src={preview}
                      controls
                      className="h-32 w-full object-cover bg-black"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* 🎧 Audio List */}
          <div className="space-y-2 grid grid-cols-2 items-center gap-3">
            {files.map((item, i) => {
              const { file } = item;

              if (!file.type.startsWith("audio")) return null;

              return (
                <WhatsAppAudioPlayer
                  key={i}
                  file={file}
                  onRemove={() => removeFile(i)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentWithMedia;
