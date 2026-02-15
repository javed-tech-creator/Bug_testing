// // import React, { useRef, useState, useEffect } from "react";
// // import {
// //   Plus,
// //   Mic,
// //   Image,
// //   Video,
// //   Send,
// //   Headphones,
// //   X,
// //   Pause,
// //   Play,
// //   CircleStop,
// // } from "lucide-react";
// // import micStatic from "../../../../assets/recording/mic-static.svg";
// // import micRecording from "../../../../assets/recording/mic-recording.gif";
// // import WhatsAppAudioPlayer from "../../../design/components/recording/WhatsAppAudioPlayer";

// // const MessageInputcomp  = ({
// //   placeholder = "Enter your message...",
// //   value = "",
// //   onChange,
// //   onSend,
// //   files = [],
// //   onFilesChange,
// // }) => {
// //   const imageInputRef = useRef(null);
// //   const videoInputRef = useRef(null);
// //   const audioInputRef = useRef(null);
// //   const optionBoxRef = useRef(null);

// //   const mediaRecorderRef = useRef(null);
// //   const audioChunksRef = useRef([]);
// //   const timerRef = useRef(null);

// //   const [showOptions, setShowOptions] = useState(false);
// //   const [isRecording, setIsRecording] = useState(false);
// //   const [isPaused, setIsPaused] = useState(false);
// //   const [recordTime, setRecordTime] = useState(0);
// //   const [recordError, setRecordError] = useState("");

// //   /* ⏱️ Recording Timer */
// //   useEffect(() => {
// //     if (isRecording && !isPaused) {
// //       timerRef.current = setInterval(() => {
// //         setRecordTime((t) => t + 1);
// //       }, 1000);
// //     }
// //     return () => clearInterval(timerRef.current);
// //   }, [isRecording, isPaused]);

// //   const formatTime = (sec) =>
// //     `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(
// //       sec % 60
// //     ).padStart(2, "0")}`;

// //   /* Outside click */
// //   useEffect(() => {
// //     const handleClickOutside = (e) => {
// //       if (optionBoxRef.current && !optionBoxRef.current.contains(e.target)) {
// //         setShowOptions(false);
// //       }
// //     };
// //     if (showOptions) {
// //       document.addEventListener("mousedown", handleClickOutside);
// //     }
// //     return () => document.removeEventListener("mousedown", handleClickOutside);
// //   }, [showOptions]);

// //   /* File select */
// //   const handleFileSelect = (e) => {
// //     const newFiles = Array.from(e.target.files).map((file) => ({
// //       file,
// //       preview: URL.createObjectURL(file),
// //     }));

// //     if (newFiles.length) {
// //       onFilesChange?.([...files, ...newFiles]);
// //     }
// //     e.target.value = "";
// //   };

// //   /* Remove file */
// //   const removeFile = (index) => {
// //     const updated = files.filter((_, i) => i !== index);
// //     onFilesChange(updated);
// //   };

// //   /* 🎤 Start Recording */
// //   const startRecording = async () => {
// //     if (isRecording) return;
// //     setRecordError("");

// //     if (!navigator.mediaDevices?.getUserMedia) {
// //       setRecordError("Microphone access is not supported in this browser.");
// //       return;
// //     }
// //     if (!window.MediaRecorder) {
// //       setRecordError("Audio recording is not supported in this browser.");
// //       return;
// //     }

// //     try {
// //       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
// //       mediaRecorderRef.current = new MediaRecorder(stream);
// //       audioChunksRef.current = [];

// //       mediaRecorderRef.current.ondataavailable = (e) =>
// //         audioChunksRef.current.push(e.data);

// //       mediaRecorderRef.current.onstop = () => {
// //         if (audioChunksRef.current.length === 0) {
// //           setRecordTime(0);
// //           return;
// //         }
// //         const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
// //         const file = new File([blob], `recording-${Date.now()}.webm`, {
// //           type: "audio/webm",
// //         });
// //         onFilesChange([
// //           ...files,
// //           {
// //             file,
// //             preview: URL.createObjectURL(file),
// //           },
// //         ]);
// //         setRecordTime(0);
// //       };

// //       mediaRecorderRef.current.start();
// //       setIsRecording(true);
// //       setIsPaused(false);
// //     } catch (err) {
// //       const message = err?.message || "Microphone permission was blocked.";
// //       setRecordError(message);
// //     }
// //   };

// //   const pauseRecording = () => {
// //     mediaRecorderRef.current.pause();
// //     setIsPaused(true);
// //   };

// //   const resumeRecording = () => {
// //     mediaRecorderRef.current.resume();
// //     setIsPaused(false);
// //   };

// //   const stopRecording = () => {
// //     mediaRecorderRef.current.stop();
// //     mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
// //     setIsRecording(false);
// //     setIsPaused(false);
// //   };

// //   const handleSend = () => {
// //     if (value.trim() || files.length > 0) {
// //       onSend?.({ message: value, files });
// //     }
// //   };

// //   useEffect(() => {
// //     return () => {
// //       if (mediaRecorderRef.current?.stream) {
// //         mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
// //       }
// //       clearInterval(timerRef.current);
// //     };
// //   }, []);

// //   return (
// //     <div className="bg-white rounded-lg shadow-sm border">
// //       {/* 🔥 PREVIEW SECTION - Show above input if files exist */}
// //       {files.length > 0 && (
// //         <div className="px-5 pt-4 pb-2 space-y-4 border-b">
// //           {/* Images & Videos Grid */}
// //           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
// //             {files.map((item, i) => {
// //               const { file, preview } = item;
// //               if (
// //                 !file.type.startsWith("image") &&
// //                 !file.type.startsWith("video")
// //               ) {
// //                 return null;
// //               }

// //               return (
// //                 <div
// //                   key={i}
// //                   className="relative border rounded-lg overflow-hidden bg-gray-50"
// //                 >
// //                   <button
// //                     onClick={() => removeFile(i)}
// //                     className="absolute top-1 right-1 z-10 bg-white rounded-full p-1 shadow hover:bg-red-50"
// //                   >
// //                     <X className="w-4 h-4 text-red-500" />
// //                   </button>

// //                   {file.type.startsWith("image") && (
// //                     <img
// //                       src={preview}
// //                       alt=""
// //                       onClick={() => window.open(preview, "_blank")}
// //                       className="h-32 w-full object-cover cursor-pointer hover:opacity-90"
// //                     />
// //                   )}

// //                   {file.type.startsWith("video") && (
// //                     <video
// //                       src={preview}
// //                       controls
// //                       className="h-32 w-full object-cover bg-black"
// //                     />
// //                   )}
// //                 </div>
// //               );
// //             })}
// //           </div>

// //           {/* 🎧 Audio List */}
// //           <div className="space-y-2 grid grid-cols-2 items-center gap-3">
// //             {files.map((item, i) => {
// //               const { file } = item;
// //               if (!file.type.startsWith("audio")) return null;

// //               return (
// //                 <WhatsAppAudioPlayer
// //                   key={i}
// //                   file={file}
// //                   onRemove={() => removeFile(i)}
// //                 />
// //               );
// //             })}
// //           </div>
// //         </div>
// //       )}

// //       {/* Input Section */}
// //       <div className="p-4 relative">
// //         <div className="flex items-center gap-2">
// //           {/* Plus Icon */}
// //           <button
// //             onClick={() => setShowOptions((p) => !p)}
// //             title="Attach"
// //             className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 flex-shrink-0"
// //           >
// //             <Plus className="w-5 h-5" />
// //           </button>

// //           {/* Message Input */}
// //           <input
// //             value={value}
// //             onChange={(e) => onChange?.(e.target.value)}
// //             placeholder={placeholder}
// //             onKeyPress={(e) => e.key === "Enter" && handleSend()}
// //             className="flex-1 bg-gray-50 rounded-full px-4 py-2 outline-none text-sm border border-gray-200 focus:border-gray-300"
// //           />

// //           {/* Mic Button */}
// //           {!isRecording ? (
// //             <button
// //               onClick={startRecording}
// //               title="Voice Recording"
// //               className="p-2 rounded-full bg-green-400 hover:bg-green-500 text-white flex-shrink-0"
// //             >
// //               <Mic className="w-5 h-5" />
// //             </button>
// //           ) : (
// //             <div className="flex items-center gap-1">
// //               <span className="text-sm text-gray-600 flex gap-1 items-center">
// //                 <img
// //                   src={isRecording && isPaused ? micStatic : micRecording}
// //                   alt="mic"
// //                   title="Mic"
// //                   className="w-6 h-6"
// //                 />
// //                 <span className="w-10">{formatTime(recordTime)}</span>
// //               </span>

// //               {!isPaused ? (
// //                 <button
// //                   onClick={pauseRecording}
// //                   title="Pause"
// //                   className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200"
// //                 >
// //                   <Pause className="w-5 h-5 text-yellow-600" />
// //                 </button>
// //               ) : (
// //                 <button
// //                   onClick={resumeRecording}
// //                   title="Resume"
// //                   className="p-2 rounded-full bg-green-100 hover:bg-green-200"
// //                 >
// //                   <Play className="w-5 h-5 text-green-600" />
// //                 </button>
// //               )}

// //               <button
// //                 onClick={stopRecording}
// //                 title="Stop"
// //                 className="p-2 rounded-full bg-red-100 hover:bg-red-200"
// //               >
// //                 <CircleStop className="w-5 h-5 text-red-600" />
// //               </button>
// //             </div>
// //           )}

// //           {/* Send Button */}
// //           <button
// //             onClick={handleSend}
// //             title="Send"
// //             className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex-shrink-0"
// //           >
// //             <Send className="w-5 h-5" />
// //           </button>
// //         </div>

// //         {recordError && (
// //           <div className="mt-2 text-xs text-red-600">{recordError}</div>
// //         )}

// //         {/* Options Popup */}
// //         {showOptions && (
// //           <div
// //             ref={optionBoxRef}
// //             className="absolute bottom-16 left-4 bg-white border rounded-lg shadow-lg w-44 z-10"
// //           >
// //             <button
// //               onClick={() => {
// //                 imageInputRef.current.click();
// //                 setShowOptions(false);
// //               }}
// //               className="p-3 flex gap-2 w-full items-center hover:bg-gray-100"
// //             >
// //               <Image className="w-4 h-4 text-blue-600" /> Image
// //             </button>
// //             <button
// //               onClick={() => {
// //                 audioInputRef.current.click();
// //                 setShowOptions(false);
// //               }}
// //               className="p-3 flex gap-2 w-full items-center hover:bg-gray-100"
// //             >
// //               <Headphones className="w-4 h-4 text-orange-600" /> Audio
// //             </button>
// //             <button
// //               onClick={() => {
// //                 videoInputRef.current.click();
// //                 setShowOptions(false);
// //               }}
// //               className="p-3 flex gap-2 w-full items-center hover:bg-gray-100"
// //             >
// //               <Video className="w-4 h-4 text-purple-600" /> Video
// //             </button>
// //           </div>
// //         )}

// //         {/* Hidden File Inputs */}
// //         <input
// //           ref={imageInputRef}
// //           type="file"
// //           accept="image/*"
// //           multiple
// //           hidden
// //           onChange={handleFileSelect}
// //         />
// //         <input
// //           ref={audioInputRef}
// //           type="file"
// //           accept="audio/*"
// //           multiple
// //           hidden
// //           onChange={handleFileSelect}
// //         />
// //         <input
// //           ref={videoInputRef}
// //           type="file"
// //           accept="video/*"
// //           multiple
// //           hidden
// //           onChange={handleFileSelect}
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// // export default MessageInputcomp;

import React from 'react'

const MessageInputcomp = () => {
  return (
    <div>MessageInputcomp</div>
  )
}

export default MessageInputcomp