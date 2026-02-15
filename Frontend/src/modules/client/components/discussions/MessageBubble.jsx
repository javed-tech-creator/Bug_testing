import React from 'react'

const MessageBubble = ({ sender, time, text, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-md ${isOwn ? "text-right" : ""}`}>
        <div className="flex items-center gap-2 mb-1">
          {!isOwn && (
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-medium text-sm">
              {sender.split(' ').map(n => n[0]).join('')}
            </div>
          )}
          <span className="text-sm font-medium">
            {isOwn ? "You" : sender}
          </span>
        </div>

        <div
          className={`p-4 rounded-lg text-sm ${
            isOwn
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-white border rounded-bl-none"
          }`}
        >
          {text}
        </div>

        <div className="text-xs text-gray-400 mt-1">{time}</div>
      </div>
    </div>
  )
}

export default MessageBubble