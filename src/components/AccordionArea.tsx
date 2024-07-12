import React from 'react'
import { ScrollArea } from './ui/scroll-area'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { cn, resolveStationName } from '../lib/utils'
import { majorStations } from '../utils/constants'
import { findNextTrains, minutesToTime } from '../utils/timeHandlers'
import ekitanDataJSON from "../utils/ekitan.json"
import holidayData from "../utils/Holidays.json"
import { ekitanSchema } from '../utils/types'
import TrainSheet from '../components/ui/TrainSheet'

type Props = {
  previousBuses: {
    id: string;
    day: "Weekday" | "Sunday" | "Saturday";
    isComingToHosei: boolean;
    station: "nishihachioji" | "mejirodai" | "aihara";
    leaveHour: number;
    leaveMinute: number;
    arriveHour: number;
    arriveMinute: number;
    busStops: {
      hour: number,
      minute: number,
      busStop: string,
      date: Date
    }[];
    date: Date
  }[],
  futureBuses: {
    id: string;
    day: "Weekday" | "Sunday" | "Saturday";
    isComingToHosei: boolean;
    station: "nishihachioji" | "mejirodai" | "aihara";
    leaveHour: number;
    leaveMinute: number;
    arriveHour: number;
    arriveMinute: number;
    busStops: {
      hour: number,
      minute: number,
      busStop: string,
      date: Date
    }[];
    date: Date
  }[],
  timesContainer: React.RefObject<HTMLDivElement | null>
}

const ekitanData = ekitanSchema.parse(ekitanDataJSON)
const AccordionArea = ({ previousBuses, futureBuses, timesContainer }: Props) => {
  return (
    <ScrollArea className="h-96" ref={timesContainer}>

      <Accordion type="single" className="" collapsible>
        {previousBuses.map((item, i) => {
          return (
            <AccordionItem value={item.id} className="opacity-70 dark:border-white/50 border-black/20 font-sans font-semibold text-lg md:text-2xl text-center" key={i}>
              <AccordionTrigger className="p-2 text-xl">
                <p className="mx-auto">{minutesToTime(item.leaveHour * 60 + item.leaveMinute)}</p>
                <p className="mx-auto">{minutesToTime(item.arriveHour * 60 + item.arriveMinute)}</p>
              </AccordionTrigger>
              <AccordionContent className="">
                {item.busStops.map(busStop => {
                  return (
                    <div className={cn("border-t last:border-b dark:border-white/20 not-dark:border-black/20",
                      majorStations.find(j => j === busStop.busStop) ? "p-1 text-lg" : "pt-1 justify-between")}>
                      {majorStations.find(mjrSta => mjrSta === busStop.busStop) ? <TrainSheet trains={findNextTrains({ date: busStop.date, ekitanData:ekitanData, holidayData, station: resolveStationName(busStop.busStop) })} hour={busStop.hour} minute={busStop.minute} busStopName={busStop.busStop}/> :
                        <div className='grid grid-cols-3'>
                          <p className="col-span-2">{busStop.busStop}</p>
                          <p className="">{minutesToTime(busStop.hour * 60 + busStop.minute)}</p>
                        </div>}
                    </div>
                  )
                })}
              </AccordionContent>
            </AccordionItem>)
        })}
        {futureBuses.map((item, i) => {
          return (
            <AccordionItem value={item.id} className="-my-1 dark:border-white/50 border-black/20 font-sans font-semibold text-3xl md:text-4xl text-center" key={i}>
              <AccordionTrigger className="p-2">
                <p className="mx-auto text-3xl">{item ? minutesToTime(item.leaveHour * 60 + item.leaveMinute) : "--:--"}</p>
                <p className="mx-auto text-3xl">{item ? minutesToTime(item.arriveHour * 60 + item.arriveMinute) : "--:--"}</p>
              </AccordionTrigger>
              <AccordionContent className="">{item.busStops.map(busStop => {
                return (
                  <div key={`${busStop.busStop}-${busStop.hour}:${busStop.minute}`} className={cn("border-t last:border-b dark:border-white/20 not-dark:border-black/20",
                    majorStations.find(j => j === busStop.busStop) ? "p-1 text-lg" : "pt-1")}>
                    {majorStations.find(mjrSta => mjrSta === busStop.busStop) ? <TrainSheet trains={findNextTrains({ date: busStop.date, ekitanData:ekitanData, holidayData, station: resolveStationName(busStop.busStop) })} hour={busStop.hour} minute={busStop.minute} busStopName={busStop.busStop}/> : 
                    <div className='grid grid-cols-3'>
                      <p className="col-span-2">{busStop.busStop}</p>
                      <p className="">{minutesToTime(busStop.hour * 60 + busStop.minute)}</p>
                    </div>}
                  </div>
                )
              })}</AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </ScrollArea>
  )
}

export default AccordionArea