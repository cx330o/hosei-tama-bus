import { typeColor } from '../../utils/color';


type Props={
    trainType: string;
    destination: string;
    direction: string;
    line: string;
    hour: number;
    minute: number;
}

const TrainDetail = (props:Props) => {
  return (
    <div className='bg-zinc-950 shadow-lg mb-1 p-1 border border-zinc-800 rounded-md text-[10px] text-white md:text-xs'>
      <div className='flex gap-1'>
      <p className={`rounded-sm shadow p-1 text-center ${typeColor({line: props.line, trainType: props.trainType}).lineStyles}`}>{props.line}</p>
      <p className={`rounded-sm shadow p-1 ${typeColor({line: props.line, trainType: props.trainType}).trainTypeStyles}`}>{props.trainType}</p>
      <p className='p-1'>{props.destination}</p>
      <p className='p-1'>{props.hour}:{props.minute.toString().padStart(2,"0")}</p>
      </div>
    </div>
  )
}

export default TrainDetail