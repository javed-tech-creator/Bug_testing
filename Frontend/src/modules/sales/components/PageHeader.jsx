import React from 'react'

function PageHeader({title = 'Title'}) {
  return (
    <div>
         <div className="w-full border-l-4 border-l-black mb-6 rounded-lg shadow-md bg-white p-3 hover:shadow-lg transition duration-300">
        <div className="flex items-center justify-between bg-gray-50 p-1 border border-gray-200 rounded-md">
          <h2 className="text-xl animate-bounce px-4 font-semibold">!! {title} !!</h2>
          
        </div>
      </div>
    </div>
  )
}

export default PageHeader