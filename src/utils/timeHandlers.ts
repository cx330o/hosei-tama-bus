import * as z from "zod/v4"
import { ekitanSchema, holidayDataSchema, timetableSchema } from "./types"

const dayIndices = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const equationOfTime = 9

function toMinutes({ hour, minutes }: { hour: number, minutes: number }) {
  return hour * 60 + minutes
}

function timeDifference({ nowInMinutes, busInMinutes }: { nowInMinutes: number, busInMinutes: number }) {
  return busInMinutes - nowInMinutes
}

// 日付が祝日かどうかを判定
function isHoliday({ date, holidayData }: { date: Date, holidayData: z.infer<typeof holidayDataSchema> }) {
  const newDate=structuredClone(date)
  // 日本時間と標準時の差を足す。
  // 文字列としてみた際に日本の日付になるようにする。
  newDate.setHours(newDate.getHours() + equationOfTime)
  const formattedDate = newDate.toISOString().split('T')[0]
  if (!holidayData) {
    throw new Error("Holiday data is not provided")
  }
  return holidayData[formattedDate]
}

// 平日かどうかを判定
function isWeekday(day: string) {
  return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(day)
}

// 次の曜日を取得する関数（祝日も「日曜日」として扱う）
function getNextDay({ currentDay, currentDate, holidayData }: { currentDay: string, currentDate: Date, holidayData: z.infer<typeof holidayDataSchema> }) {
  const nextDate = new Date(currentDate)
  nextDate.setDate(nextDate.getDate() + 1)
  if (isHoliday({
    date: nextDate,
    holidayData
  })) {
    return "Sunday" // 祝日を日曜日と扱う
  }
  const nextDayIndex = (dayIndices.indexOf(currentDay) + 1) % 7
  return dayIndices[nextDayIndex]
}

function getPreviousDay({ currentDay, currentDate, holidayData }: { currentDay: string, currentDate: Date, holidayData: z.infer<typeof holidayDataSchema> }) {
  const previousDate = new Date(currentDate)
  previousDate.setDate(previousDate.getDate() - 1)
  if (isHoliday({
    date: previousDate,
    holidayData
  })) {
    return "Sunday" // 祝日を日曜日と扱う
  }
  const previousDayIndex = (dayIndices.indexOf(currentDay) - 1 + 7) % 7
  return dayIndices[previousDayIndex]
}

// 次のバスを検索
function findNextBuses({
  timetable, holidayData, currentDate, length, isComingToHosei, station }: {
    timetable: z.infer<typeof timetableSchema>, holidayData: z.infer<typeof holidayDataSchema>, currentDate: Date, length: number, isComingToHosei: boolean, station: string
  }) {
    const currentHour=currentDate.getHours()
    const currentMinutes=currentDate.getMinutes()
    const currentDay=dayIndices[currentDate.getDay()]
    const nowInMinutes = toMinutes({
      hour: currentHour,
      minutes: currentMinutes
    })
    const returnBuses = []
  // 現在の曜日のバスを取得
  let newTimetable = timetable.slice()
  newTimetable = newTimetable.filter(item => item.station === station && item.isComingToHosei === isComingToHosei)
  newTimetable = newTimetable.sort((a, b) => {
    if (a.leaveHour * 60 + a.leaveMinute > b.leaveHour * 60 + b.leaveMinute) {
      return 1
    } else {
      return -1
    }
  })
  if (length <= -1) {
    newTimetable.reverse()
  }
  let dayToCheck: string
  if (isHoliday({
    date: currentDate,
    holidayData
  })) {
    dayToCheck = "Sunday"
  } else {
    dayToCheck = currentDay
  }
  const dateToCheck = structuredClone(currentDate)
  // バスが見つかるまで次の日に進む
  for (let i = 0; i < 7; i++) {
    let busesForDay = newTimetable.slice().filter(bus =>
    bus.day === dayToCheck || (isWeekday(dayToCheck) && bus.day === "Weekday")
    )
    // 2025年7月21日の京王バスだけ特別対応
    if(currentDate.getFullYear() === 2025 && currentDate.getMonth() === 7-1 && currentDate.getDate() === 21 && (station==="nishihachioji"||station==="mejirodai")) {
        busesForDay=newTimetable.slice().filter(bus=>{
          console.log(bus.busStops.length)
          return bus.day==="Sunday"||bus.busStops.length<=5 && bus.day==="Weekday"
        })
    }

    for (const bus of busesForDay) {
      const busLeaveTime = toMinutes({
        hour: bus.leaveHour,
        minutes: bus.leaveMinute
      })
      if (length >= 1) {
        if (i > 0 || timeDifference({
          nowInMinutes,
          busInMinutes: busLeaveTime
        }) >= 0) {
          let newBus
          returnBuses.push({
            date: (() => {
              const newDate = new Date(dateToCheck)
              newDate.setHours(bus.leaveHour, bus.leaveMinute, 0, 0)
              newBus = {
                ...bus, busStops: bus.busStops.map(stop => {
                  const stopDate = new Date(newDate)
                  stopDate.setHours(stop.hour, stop.minute, 0, 0)
                  return {
                    // date: stopDate.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
                    date: stopDate,
                    hour: stopDate.getHours(),
                    minute: stopDate.getMinutes(),
                    busStop: stop.busStop
                  }
                })
              } // バス停の日時を設定
              // console.log(`発見したバスの日時：${newDate}`)
              return newDate
            })(), ...newBus
          })
        }
      } else {
        if (i > 0 || timeDifference({
          nowInMinutes,
          busInMinutes: busLeaveTime
        }) < 0) {
          let newBus
          returnBuses.push({
            date: (() => {
              const newDate = new Date(dateToCheck)
              newDate.setHours(bus.leaveHour, bus.leaveMinute, 0, 0)
              newBus = {
                ...bus, busStops: bus.busStops.map(stop => {
                  const stopDate = new Date(newDate)
                  stopDate.setHours(stop.hour, stop.minute, 0, 0)
                  return {
                    // date: stopDate.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
                    date: stopDate,
                    hour: stopDate.getHours(),
                    minute: stopDate.getMinutes(),
                    busStop: stop.busStop
                  }
                })
              } // バス停の日時を設定
              // console.log(`発見したバスの日時：${newDate}`)
              return newDate
            })(), ...newBus
          })
        }
      }
      if (returnBuses.length >= Math.abs(length)) {
        if (length >= 0) {
          return returnBuses
        } else {
          return returnBuses.reverse()
        }
      } // 2本のバスを見つけたら返す
    }
    if (length >= 1) {
      dayToCheck = getNextDay({
        currentDay: dayToCheck,
        currentDate: dateToCheck,
        holidayData
      })
      dateToCheck.setDate(dateToCheck.getDate() + 1)
    } else {
      dayToCheck = getPreviousDay({
        currentDay: dayToCheck,
        currentDate: dateToCheck,
        holidayData
      })
      dateToCheck.setDate(dateToCheck.getDate() - 1)
    }
  }
  return returnBuses
}

// `hh:mm` を分単位に変換する関数
function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

// 分単位を `hh:mm` に戻す関数
function minutesToTime(minutes: number) {
  const hours = String(Math.floor(minutes / 60))
  const mins = String(minutes % 60).padStart(2, "0")
  return `${hours}:${mins}`
}

function getDateString(now:Date) {
  return `${now.getFullYear().toString().padStart(4, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}`
}

function getTimeString(now:Date) {
  return `${now.getHours().toString()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
}


function findNextTrains({ ekitanData, station, holidayData, date }: { ekitanData: z.infer<typeof ekitanSchema>, station: string, holidayData: z.infer<typeof holidayDataSchema>, date: Date }) {
  const currentHour = date.getHours();
  const currentMinutes = date.getMinutes();
  let currentDay = isHoliday({ date, holidayData }) ? "Sunday" : dayIndices[date.getDay()];
  const nextTrains: {
    day: "Weekday" | "Sunday" | "Saturday";
    station: "西八王子駅" | "めじろ台駅" | "相原駅" | "JR八王子駅/京王八王子駅" | "橋本駅";
    trainType: string;
    destination: string;
    direction: string;
    line: string;
    hour: number;
    minute: number,
    date: Date
  }[] = []
  const currentDate = date
  for (let i = 0; i < 7; i++) {
    ekitanData.filter(item => item.station === station && (item.day === currentDay || isWeekday(currentDay) && item.day === "Weekday")).sort((a, b) => {
      return a.hour * 60 + a.minute - (b.hour * 60 + b.minute);
    }).map(item => {
      const itemTime = item.hour * 60 + item.minute;
      const nowTime = currentHour * 60 + currentMinutes;
      if (itemTime >= nowTime || i > 0) {
        nextTrains.push({ date: currentDate, ...item });
      }
    });
    currentDay = getNextDay({
      currentDay,
      currentDate: date,
      holidayData
    });
    if (nextTrains.length >= 15) {
      break
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return [...nextTrains.slice(0, 15)];
}


export {
  toMinutes,
  timeDifference,
  isHoliday,
  isWeekday,
  getNextDay,
  findNextBuses,
  timeToMinutes,
  minutesToTime,
  dayIndices,
  equationOfTime,
  getDateString,
  getTimeString,
  findNextTrains,
}