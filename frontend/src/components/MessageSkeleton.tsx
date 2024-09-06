const MessageSkeleton = () => {
  return (
    <div className="animate-pulse p-4 mx-2 mb-3 dark:bg-[#1a1a1a] bg-white rounded-xl border dark:border-gray-800/40 border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <div className="h-3 w-16 dark:bg-gray-800 bg-gray-200 rounded" />
        <div className="h-4 w-4 dark:bg-gray-800 bg-gray-200 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-3 dark:bg-gray-800 bg-gray-200 rounded w-full" />
        <div className="h-3 dark:bg-gray-800 bg-gray-200 rounded w-4/5" />
        <div className="h-3 dark:bg-gray-800 bg-gray-200 rounded w-3/5" />
      </div>
    </div>
  )
}

const MessageSkeletonList = () => {
  return (
    <div>
      {[1, 2, 3].map((i) => (
        <MessageSkeleton key={i} />
      ))}
    </div>
  )
}

export default MessageSkeletonList
