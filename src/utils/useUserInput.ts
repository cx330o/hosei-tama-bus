import { useEffect, useState } from "react";
import { stateSchema, stationSchema } from "./types";
import * as z from "zod/v4"

export default function useUserInput() {
  const [state, setState] = useState<z.infer<typeof stateSchema>>({ isComingToHosei: true, station: "nishihachioji" })
  useEffect(()=>{
    if (localStorage.getItem("firstAccessed")) {
      try {
        const station = stationSchema.parse(localStorage.getItem("station"))
        const isComingToHosei = localStorage.getItem("isComingToHosei") === "true"
        setState(() => {
          return { station, isComingToHosei }
        })
      } catch (e) {
        console.error("Invalide localStorage data:", e)
      }
    }
  },[])
  return { state, setState }
}