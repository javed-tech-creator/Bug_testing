import React, { useRef } from "react";
import { Send, Paperclip } from "lucide-react";

const MessageInputcomp = ({
  value,
  onChange,
  files = [],
  onFilesChange,
  onSend,
  placeholder = "Type a message...",
}) => {
  const fileInputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!value?.trim() && (!files || files.length === 0)) return;

    onSend?.({
      message: value,
      files,
    });
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    onFilesChange?.([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    onFilesChange?.(updated);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Attached files preview */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm"
            >
              <span className="truncate max-w-[120px]">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="flex-1 resize-none rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          ref={fileInputRef}
          type="file"
          multiple
          hidden
          onChange={handleFileSelect}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <Paperclip size={20} />
        </button>

        <button
          type="button"
          onClick={handleSend}
          className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageInputcomp;
