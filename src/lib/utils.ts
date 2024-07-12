import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function resolveStationName(stationName:string){
  return stationName === "西八王子駅南口" ? "西八王子駅" : stationName === "めじろ台駅" ? "めじろ台駅" : stationName==="相原駅西口"?"相原駅":stationName==="八王子駅南口" ?"JR八王子駅/京王八王子駅":"橋本駅"
}

export {resolveStationName}