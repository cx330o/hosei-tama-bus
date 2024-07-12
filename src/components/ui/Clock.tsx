// import { useEffect, useState } from 'react'
import { getDateString, getTimeString, isHoliday } from '../../utils/timeHandlers'
import holidayData from '../../utils/Holidays.json'

type Props={
    now: Date
}

const Clock = ({ now }: Props) => {
  if(isHoliday({ date: now ,holidayData})) {
    return (
      <div className="top-3 left-3 z-10 fixed bg-white/70 dark:bg-black/60 shadow backdrop-blur-sm p-5 rounded-full w-1/3 text-black dark:text-white">
        <p suppressHydrationWarning={false} className="w-auto h-7 font-medium text-lg text-center">{getDateString(now)}</p>
        <p suppressHydrationWarning={false} className="w-auto h-7 font-medium text-2xl text-center">{getTimeString(now)}</p>
        <p className="text-red-500 text-center">{isHoliday({ date: now, holidayData })}</p>
      </div>
    )
  }
  return (
    <div className="top-3 left-3 z-10 fixed bg-white/70 dark:bg-black/60 shadow backdrop-blur-sm p-5 rounded-full w-1/3 text-black dark:text-white">
      <p suppressHydrationWarning={false} className="w-auto h-7 font-medium text-lg text-center">{getDateString(now)}</p>
      <p suppressHydrationWarning={false} className="w-auto h-7 font-medium text-2xl text-center">{getTimeString(now)}</p>
    </div>
  )
}

export default Clock