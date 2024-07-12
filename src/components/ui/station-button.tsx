import React from 'react'
import { cn } from '../../lib/utils'
type StationButtonProps = {
  station: string
  selectedStation: string
  onClick: () => void
  ref: React.RefObject<HTMLButtonElement>
  children: React.ReactNode
}
const StationButton = React.forwardRef<HTMLButtonElement, StationButtonProps>(({ station, onClick, selectedStation, children }, ref) => {
  return (
    <button 
      onClick={onClick} 
      ref={ref} 
      className={cn("shadow-lg rounded-xl p-2 transition-all",station === selectedStation ? 'bg-black/80 dark:bg-white/80 text-white dark:text-black scale-110' : 'bg-black/50 dark:bg-white/50 text-white dark:text-black')}
      aria-pressed={station === selectedStation}
      aria-label={station}
      type="button"
    >
      {children}   
    </button>
  );
});

StationButton.displayName = 'StationButton';

export default StationButton;
