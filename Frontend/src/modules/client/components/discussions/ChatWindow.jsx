import React, { useState } from 'react'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'
import { threadsData } from './ThreadList'

const messagesData = {
  0: [ // Amit Singh
    {
      id: 1,
      sender: "Amit Singh",
      time: "10:42 AM",
      text: "Hi! I've uploaded the revised concepts for the main lobby. We adjusted the lighting temperature as requested.",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      time: "10:45 AM",
      text: "Thanks Amit! The warm lighting looks much better. However, is it possible to make the logo slightly larger? It feels a bit lost on that big wall.",
      isOwn: true,
    },
  ],
  1: [ // Anup Singh
    {
      id: 1,
      sender: "Anup Singh",
      time: "10:42 AM",
      text: "Team will arrive on Monday at 9 AM for the installation. Please ensure the area is cleared.",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      time: "10:50 AM",
      text: "Perfect! The area will be ready. Do you need any special equipment or power outlets?",
      isOwn: true,
    },
  ],
  2: [ // Akash Gupta
    {
      id: 1,
      sender: "Akash Gupta",
      time: "10:42 AM",
      text: "Invoice #204 has been processed. Thanks for your quick payment!",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      time: "11:00 AM",
      text: "Great! When can we expect the delivery of the ordered items?",
      isOwn: true,
    },
  ],
}

const ChatWindow = ({ selectedThread }) => {
  const [messages, setMessages] = useState(messagesData)
  
  console.log('ChatWindow - Selected Thread ID:', selectedThread)
  console.log('ChatWindow - Available threads:', threadsData)
  
  const currentThread = threadsData.find(t => t.id === selectedThread)
  console.log('ChatWindow - Current Thread:', currentThread)
  
  const currentMessages = messages[selectedThread] || []
  console.log('ChatWindow - Current Messages:', currentMessages)

  const handleSendMessage = (text) => {
    const newMessage = {
      id: currentMessages.length + 1,
      sender: "You",
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      text: text,
      isOwn: true,
    }

    setMessages(prev => ({
      ...prev,
      [selectedThread]: [...(prev[selectedThread] || []), newMessage]
    }))
  }

  if (!currentThread) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">Select a thread to view messages</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b p-4 bg-white">
        <h2 className="font-semibold">{currentThread.name}</h2>
        <p className="text-xs text-gray-500">
          <span className="text-blue-600">{currentThread.role} Executive</span> • Chinhat Branch
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gray-50">
        <div className="text-center text-xs text-gray-400">Yesterday</div>

        {currentMessages.length === 0 ? (
          <div className="text-center text-gray-400 text-sm mt-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          currentMessages.map((msg) => (
            <MessageBubble
              key={msg.id}
              sender={msg.sender}
              time={msg.time}
              text={msg.text}
              isOwn={msg.isOwn}
            />
          ))
        )}
      </div>

      {/* Input */}
      <MessageInput onSend={handleSendMessage} />
    </div>
  )
}

export default ChatWindow