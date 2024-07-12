import React from 'react'
type CardProps={children:React.ReactNode,className?:string}
const card = ({children,className}:CardProps) => {
  return (
    <div className={`
      bg-white/5 border border-t-white/20 border-l-white/20 border-b-white/5 border-r-white/5 dark:bg-black/30 dark:bg-opacity-30 dark:border-t-white/30 dark:border-l-white/30 dark:border-b-white/10 dark:border-r-white/10
      shadow-lg p-2 rounded-2xl ${className}`}>
      {children}
    </div>
  )
}

export default card
