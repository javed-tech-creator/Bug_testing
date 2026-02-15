import React, { useState } from 'react'
import ThreadList from '../../components/discussions/ThreadList'
import ChatWindow from '../../components/discussions/ChatWindow'

const Discussions = () => {
  const [selectedThread, setSelectedThread] = useState(0)

  console.log('Discussions - Current Selected Thread:', selectedThread)

  return (
    <div className="">
      <div className="bg-white border rounded-lg flex h-[80vh] overflow-hidden">
        <ThreadList 
          selectedThread={selectedThread}
          onSelectThread={(id) => {
            console.log('Discussions - Setting thread to:', id)
            setSelectedThread(id)
          }}
        />
        <ChatWindow selectedThread={selectedThread} />
      </div>
    </div>
  )
}

export default Discussions