import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { minutesToTime } from '../../utils/timeHandlers';
import { TrainIcon } from 'lucide-react';
import TrainDetail from './TrainDetail';
type Props = {
  trains: {
    day: "Weekday" | "Saturday" | "Sunday";
    station: "相原駅" | "めじろ台駅" | "西八王子駅" | "JR八王子駅/京王八王子駅" | "橋本駅";
    trainType: string;
    destination: string;
    direction: string;
    line: string;
    hour: number;
    minute: number;
    date: Date;
  }[],
  hour: number,
  minute: number,
  busStopName: string
}

const TrainSheet = (props: Props) => {
  return (
    <Sheet>
      <SheetTrigger className='flex justify-between dark:bg-white not-dark:bg-black p-1 rounded-md w-full dark:text-black not-dark:text-white'>
        <p>
          <TrainIcon size={30} className='text-center' />
        </p>
        <p>{props.trains[0].station}・{props.busStopName}</p>
        <p>{minutesToTime(props.hour * 60 + props.minute)}</p>
      </SheetTrigger>
      <SheetContent side="left" className='bg-black/30 dark:bg-zinc-950/30 backdrop-blur-sm border-zinc-900 text-white'>
        <SheetHeader className='dark:text-white not-dark:text-white'>
          <SheetTitle className="text-white text-center">{props.trains[0].station} {props.trains[0].date.toLocaleString()}</SheetTitle>
          <SheetDescription>
            {props.trains.map((train, i) => (
              <TrainDetail key={i} destination={train.destination} direction={train.direction} hour={train.hour} minute={train.minute} line={train.line} trainType={train.trainType} />
            ))}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default TrainSheet