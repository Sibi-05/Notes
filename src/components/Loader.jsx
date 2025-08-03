import React from 'react'

const Loader = () => {
 
  return (
<div className="flex items-center gap-2 px-1 py-1 mt-1 rounded-full text-sm">
  <div className="w-2 h-2  rounded-full bg-green-400 animate-bounce"></div>
  <div
    className="w-2 h-2  rounded-full bg-yellow-400 animate-bounce [animation-delay:-.3s]"
  ></div>
  <div
    className="w-2 h-2 rounded-full bg-red-600 animate-bounce [animation-delay:-.5s]"
  ></div>
</div>
  )
}

export default Loader
