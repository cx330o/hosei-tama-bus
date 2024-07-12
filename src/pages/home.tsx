"use client"
import { useEffect, useMemo, useRef, useState } from "react";
import { findNextBuses, minutesToTime } from "../utils/timeHandlers";
import { buildings, stationNames } from "../utils/constants";
import gsap from "gsap"
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import Card from "../components/ui/card"
import timetableJSON from "../utils/Timetable.json"
import holidayDataJSON from "../utils/Holidays.json"
import { Link } from "react-router-dom";
import Menu from "../components/menu";
import { timetableSchema, holidayDataSchema, stateSchema, } from "../utils/types";

import StationButton from "..//components/ui/station-button";
import tamapLogo from "/images/tamap_logo.webp"
import mapImage from "/images/Map.webp"
import { toast, Toaster } from "sonner";
import AccordionArea from "../components/AccordionArea";
import useUserInput from "../utils/useUserInput";
import * as z from "zod/v4";
import { ArrowsCounterClockwiseIcon } from "@phosphor-icons/react";
import Clock from "../components/ui/Clock";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);
gsap.ticker.fps(120);
gsap.ticker.lagSmoothing(1000, 16);

let timetable: z.infer<typeof timetableSchema> = [];
let holidayData: z.infer<typeof holidayDataSchema> = {};
export default function Home() {
  console.log("レンダリング")
  try {
    console.log({timetableJSON})
    timetable = useMemo(() => timetableSchema.parse(timetableJSON), []);
  } catch (e) {
    throw e;
    console.error("Invalid timetable data:", e);
  }
  try {
    holidayData = useMemo(() => holidayDataSchema.parse(holidayDataJSON), []);
  } catch (e) {
    console.error("Invalid holiday data:", e);
    throw new Error("Invalid holiday data");
  }
  const [now, setNow] = useState(new Date());
  const mainContainer = useRef(null);
  const arrowsRef = useRef(null);
  const departureRef = useRef(null);
  const destinationRef = useRef(null);
  const arrowsContainer = useRef(null);
  const animateArrows = useGSAP().contextSafe(() => {
    gsap.fromTo(arrowsRef.current, { rotate: 0 }, { rotate: 180, duration: 0.3 });
  });
  const animateDirectionButton = useGSAP().contextSafe(() => {
    gsap.fromTo(arrowsContainer.current, { scale: 1.05 }, { scale: 1, duration: 0.3 });
  });
  const timesContainer = useRef(null);
  const directionContainer = useRef(null);
  const times = {
    economics: useRef(null),
    health: useRef(null),
    gym: useRef(null),
    sport: useRef(null),
  };
  const animateText = useGSAP().contextSafe(() => {
    gsap.fromTo(timesContainer.current, { opacity: 0, y: 10 }, { y: 0, duration: 0.3, opacity: 1, stagger: 0.01 });
    gsap.fromTo(Object.values(times).map(ref => ref.current), { opacity: 0, y: 5 }, { y: 0, duration: 0.3, opacity: 1, stagger: 0.01 });
  });
  const { setState, state } = useUserInput()
  const waribikiRef = useRef(null);
  useEffect(() => {
    setNow(new Date())
    setInterval(() => {
      setNow(new Date())
    }, 1000)
  }, [])

  useEffect(() => {
    localStorage.setItem("station", state.station)
    localStorage.setItem("isComingToHosei", state.isComingToHosei ? "true" : "false")
    if (now >= new Date("2025/7/20 21:00:00") && now < new Date("2025/7/21 21:00:00") &&state.station!=="aihara") {
      toast("2025年7月21日京王バスは特別ダイヤです(祝日の各停+平日の急行)")
    }
  }, [state.station, state.isComingToHosei])

  const handleDirectionButtonClicked = () => {
    setState(prev => {
      return stateSchema.parse({
        ...prev,
        isComingToHosei: !prev.isComingToHosei
      })
    })
  }

  const handleStationButtonClicked = (station: "nishihachioji" | "mejirodai" | "aihara") => {
    setState(prev => {
      return stateSchema.parse({
        ...prev,
        station
      })
    })

  }
  useGSAP(() => {
    animateText()
  }, [state.isComingToHosei, state.station])
  useGSAP(() => {
    animateDirectionButton()
    animateArrows()
    gsap.fromTo(directionContainer.current, { rotateY: 180, autoAlpha: 0 }, { rotateY: 0, duration: 0.3, autoAlpha: 1 })
  }, [state.isComingToHosei])
  useGSAP(() => {
    if (state.isComingToHosei) {
      gsap.fromTo(departureRef.current, { y: -20, autoAlpha: 0 }, { y: 0, duration: 0.3, autoAlpha: 1 })
    } else {
      gsap.fromTo(destinationRef.current, { y: -20, autoAlpha: 0 }, { y: 0, duration: 0.3, autoAlpha: 1 })
    }
  }, [state.station])



  let departure = "";
  let destination = "";
  const overlay = {
    economics: "--:--",
    health: "--:--",
    sport: "--:--",
    gym: "--:--"
  }
  let previousBuses: {
    id: string;
    day: "Weekday" | "Sunday" | "Saturday";
    isComingToHosei: boolean;
    station: "nishihachioji" | "mejirodai" | "aihara";
    leaveHour: number;
    leaveMinute: number;
    arriveHour: number;
    arriveMinute: number;
    date: Date,
    busStops: {
      hour: number,
      minute: number,
      busStop: string,
      date: Date
    }[];
  }[] = []
  let futureBuses: {
    id: string;
    day: "Weekday" | "Sunday" | "Saturday";
    isComingToHosei: boolean;
    station: "nishihachioji" | "mejirodai" | "aihara";
    leaveHour: number;
    leaveMinute: number;
    arriveHour: number;
    arriveMinute: number;
    date: Date,
    busStops: {
      hour: number,
      minute: number,
      busStop: string,
      date: Date
    }[];
  }[] = []
  previousBuses = findNextBuses({
    timetable,
    station: state.station,
    isComingToHosei: state.isComingToHosei,
    holidayData: holidayData,
    currentDate: now,
    length: -2
  })
  futureBuses = findNextBuses({
    timetable,
    station: state.station,
    isComingToHosei: state.isComingToHosei,
    holidayData: holidayData,
    currentDate: now,
    length: 3
  })
  const [nextBus] = futureBuses
  departure = stationNames[state.station]
  destination = "法政大学"
  if (!state.isComingToHosei) {
    [departure, destination] = [destination, departure]
  }
  if (state.isComingToHosei && nextBus) {
    overlay.economics = minutesToTime(nextBus.arriveHour * 60 + nextBus.arriveMinute + buildings.economics)
    overlay.health = minutesToTime(nextBus.arriveHour * 60 + nextBus.arriveMinute + buildings.health)
    overlay.sport = minutesToTime(nextBus.arriveHour * 60 + nextBus.arriveMinute + buildings.sport)
    overlay.gym = minutesToTime(nextBus.arriveHour * 60 + nextBus.arriveMinute + buildings.gym)
  }


  return (
    <>
        <title>たまっぷ - 法政大学多摩キャンパス向けバス時刻アプリ</title>
        <meta name="description" content="法政大学多摩キャンパスと最寄り駅（西八王子、めじろ台、相原）を結ぶバスの時刻表をリアルタイムで確認できます。次のバスの発車時刻や、各学部棟への到着時刻もわかります。" />
      <Toaster />
      <Menu />
      <div className="bg-gradient-to-bl from-sky-500 dark:from-blue-500 to-orange-400 dark:to-orange-400 p-3 md:p-7 w-full min-h-screen text-black dark:text-white">
        {/* 時計 */}
        <Clock now={now} />
        <img alt="たまっぷのロゴ" src={tamapLogo} height={400} width={400} className="md:col-span-1 mx-auto -my-8 w-60 h-60" />
        <div className="gap-3 grid mx-auto p-3 max-w-2xl touch-manipulation" ref={mainContainer}>
          {/* 一つ目のカード */}
          <Card>

            {/* 行先表示 */}
            <div className="grid grid-cols-5 mx-auto mt-5 px-8 font-semibold text-xl text-center" ref={directionContainer}>
              <p className="inline-block col-span-2 h-8 text-center js-departure" ref={departureRef}>{departure}</p>
              <p className="col-span-1 h-4">⇒</p>
              <p className="inline-block col-span-2 h-8 text-center js-arrival" ref={destinationRef}>{destination}</p>
            </div>
            {/* 時刻一覧 */}
            <AccordionArea previousBuses={previousBuses} futureBuses={futureBuses} timesContainer={timesContainer}/>
            <button className="flex bg-black/50 dark:bg-white/50 shadow-xl dark:shadow-black/30 mx-auto mt-3 rounded-lg w-1/2 text-white dark:text-black text-center" onClick={() => {
              handleDirectionButtonClicked()
            }} ref={arrowsContainer}>
              <ArrowsCounterClockwiseIcon size={28} ref={arrowsRef} className="mt-[8px] ml-3 rotate-x-180" />
              <span className="mx-auto my-2 font-semibold text-lg text-center">左右切替</span>
            </button>
          </Card>

          {/* 二つ目のカード */}
          <Card>
            <div className="relative font-semibold text-lg text-center">
              <img src={mapImage} alt="地図のイラスト" width={300} className="mx-auto h-48 object-cover" height={300} />
              <Card className="top-0 left-0 absolute backdrop-blur-sm rounded-lg w-1/3 h-16">
                経済
                <span className="block" ref={times.economics}>{overlay.economics}</span>
              </Card>
              <Card className="top-0 right-0 absolute backdrop-blur-sm rounded-lg w-1/3 h-16">
                社・現福
                <span className="block" ref={times.health}>{overlay.health}</span>
              </Card>
              <Card className="bottom-0 left-0 absolute backdrop-blur-sm rounded-lg w-1/3 h-16">
                体育館
                <span className="block" ref={times.gym}>{overlay.gym}</span>
              </Card>
              <Card className="right-0 bottom-0 absolute backdrop-blur-sm rounded-lg w-1/3 h-16">
                スポ健康
                <span className="block" ref={times.sport}>{overlay.sport}</span>
              </Card>
            </div>
          </Card>

          {/* 三つ目のカード */}
          <Card>
            <div className="gap-3 grid grid-cols-3 font-semibold text-lg text-center">
              <StationButton station="nishihachioji" onClick={() => {
                handleStationButtonClicked("nishihachioji")
              }} selectedStation={state.station}>
                西八王子
              </StationButton>
              <StationButton station="mejirodai" onClick={() => {
                handleStationButtonClicked("mejirodai")
              }} selectedStation={state.station} >
                めじろ台
              </StationButton>
              <StationButton station="aihara" onClick={() => {
                handleStationButtonClicked("aihara")
              }} selectedStation={state.station} >
                相原
              </StationButton>
            </div>
          </Card>

          {/* 割引ボタン */}
          <Link
            to="/discount"
            className="block bg-gradient-to-r from-red-500 to-blue-500 shadow-lg md:m-0 my-2 p-3 border border-white/30 rounded-full w-full font-bold text-white text-3xl text-center"
            ref={waribikiRef}>
            飲食店割引はこちら
          </Link>
        </div>
        <p className="mx-auto mt-2 font-medium text-black text-center">時刻は目安であり、交通状況等による変わる可能性があります。<br />また臨時便等には対応しておりません。</p>
        <p className="text-black text-center">©CODE MATES︎</p>
        <div className="text-black">
        </div>
      </div>

    </>
  );
}
