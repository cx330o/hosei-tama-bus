import * as z from "zod/v4";

const holidayDataSchema = z.record(
  z.string(),
  z.string())

const timetableSchema = z.array(
  z.object({
    id: z.string(),
    day: z.union([
      z.literal("Weekday"),
      z.literal("Sunday"),
      z.literal("Saturday"),
    ]),
    isComingToHosei: z.boolean(),
    station: z.union([
      z.literal("nishihachioji"),
      z.literal("mejirodai"),
      z.literal("aihara"),
    ]),
    leaveHour: z.number(),
    leaveMinute: z.number(),
    arriveHour: z.number(),
    arriveMinute: z.number(),
    busStops: z.array(
      z.object({
        hour: z.number(),
        minute: z.number(),
        busStop: z.string()
      })
    )
  })
)


const BusSchema=z.object({
    id: z.string(),
    day: z.union([
      z.literal("Weekday"),
      z.literal("Sunday"),
      z.literal("Saturday"),
    ]),
    isComingToHosei: z.boolean(),
    station: z.union([
      z.literal("nishihachioji"),
      z.literal("mejirodai"),
      z.literal("aihara"),
    ]),
    leaveHour: z.number(),
    leaveMinute: z.number(),
    arriveHour: z.number(),
    arriveMinute: z.number(),
    busStops: z.array(
      z.object({
        hour: z.number(),
        minute: z.number(),
        busStop: z.string()
      })
    ),
    date:z.date()
  })

const ekitanSchema=z.array(
  z.object({
    day: z.union([
      z.literal("Weekday"),
      z.literal("Sunday"),
      z.literal("Saturday"),
    ]),
    station: z.union([
      z.literal("西八王子駅"),
      z.literal("めじろ台駅"),
      z.literal("相原駅"),
      z.literal("JR八王子駅/京王八王子駅"),
      z.literal("橋本駅"),
    ]),
    trainType:z.string(),
    destination:z.string(),
    direction:z.string(),
    line:z.string(),
    hour: z.number(),
    minute: z.number(),
  })
)

const stateSchema = z.object({
  station: z.union([
    z.literal("nishihachioji"),
    z.literal("mejirodai"),
    z.literal("aihara"),
  ]),
  isComingToHosei: z.boolean(),
})

const stationSchema = z.union([
  z.literal("nishihachioji"),
  z.literal("mejirodai"),
  z.literal("aihara"),
]);



export { holidayDataSchema, timetableSchema, stationSchema ,stateSchema,ekitanSchema,BusSchema };