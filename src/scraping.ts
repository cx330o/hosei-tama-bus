import { JSDOM } from "jsdom"
import * as z from "zod"
import fs from "fs"

async function getKeioBusStops({ url }: { url: string }) {
        const dom = await JSDOM.fromURL(url);
        const document = dom.window.document
        const trs = [...document.querySelectorAll("#railroad-matrix>center>div")]
        const busStops = trs.map(tr => {
            const hour = parseInt(z.string().parse((tr.querySelector("span")?.textContent?.match(/(\d{2}:)/)?.[0].slice(0, 2))))
            const minute = parseInt(z.string().parse(tr.querySelector("span")?.textContent?.match(/(:\d{2})/)?.[0].slice(1, 3)))

            const busStop = z.string().parse(tr.querySelector("strong")?.textContent?.replace(/[\n\r\t]/g, "").trim())
            return { hour, minute, busStop }
        })
        return busStops
}

async function getKeioTimeTable({ url, ignoreMejirodaiOnly }: { url: string, ignoreMejirodaiOnly: boolean }) {
    const wkDict = { wkd: "Weekday", std: "Saturday", snd: "Sunday" }
        const dom = await JSDOM.fromURL(url);
        const document = dom.window.document;
        const trs = [...document.querySelectorAll("tr.l2")]
        const urls: { url: string, leaveHour: number, leaveMinute: number, day: string }[] = []
        trs.map(tr => {
            const r = tr.querySelector("th.hour")?.textContent?.replace(/[\n\r\t]/g, "")
            let leaveHour = -1
            if (r) {
                leaveHour = parseInt(r)
            } else {
            }
            for (const week in wkDict) {
                const day = tr.querySelector(`td.${week}`)
                const items = [...day?.querySelectorAll("div.diagram-item") || []]
                for (const item of items) {
                    if (item.querySelector("div.top")?.textContent?.indexOf("グ") != -1 && !ignoreMejirodaiOnly || item.querySelector("div.top")?.textContent?.indexOf("め") == -1) {
                        const time = item.querySelector("span[aria-hidden='true']")
                        let leaveMinute = -1
                        if (time) {
                            leaveMinute = parseInt(z.string().parse(time?.textContent))
                        }
                        const url = "https://transfer.navitime.biz" + item.querySelector("a")?.getAttribute("href")
                        urls.push({ url, leaveHour, leaveMinute, day: wkDict[week as keyof typeof wkDict] })
                    }
                }
            }
        })
        const results = await Promise.all(urls.map(async ({ url, leaveHour, leaveMinute, day }) => {
            const busStops = await getKeioBusStops({ url })
            return { leaveHour, leaveMinute, busStops, day }
        }))
        return results
}

async function getKanachuTimetable({ url }: { url: string }) {
    const data = await fetch(url)
    const text = await data.text()
    const dom = new JSDOM(text);
    const document = dom.window.document;
    const trs = [...document.querySelectorAll("tr.row1")].concat([...document.querySelectorAll("tr.row2")]);
    const urls: { url: string, leaveHour: number, leaveMinute: number, day: string }[] = []
    const days = ["Weekday", "Saturday", "Sunday"]
    for (const tr of trs) {
        const leaveHour = tr.querySelector("th.hour")?.textContent?.replace(/[\n\r\t]/g, "")
        const tds = [...tr.querySelectorAll("td")];
        tds.map((td, index) => {
            const aTags = [...td.querySelectorAll("a")];
            aTags.map(aTag => {
                const url = "https://www.kanachu.co.jp" + aTag.getAttribute("href")
                const leaveMinute = aTag.textContent?.replace(/[\n\r\t]/g, "")
                if (leaveHour && leaveMinute && url) {
                    urls.push({ url, leaveHour: parseInt(leaveHour), leaveMinute: parseInt(leaveMinute), day: days[index] })
                }
            })
        })
    }
    const results = await Promise.all(urls.map(async ({ url, leaveHour, leaveMinute, day }) => {
        const busStops = await getKanachuBusStops({ url })
        return { leaveHour, leaveMinute, busStops, day }
    }))
    return results
}

async function getKanachuBusStops({ url }: { url: string }) {
    const data = await fetch(url)
    const text = await data.text()
    const dom = new JSDOM(text);
    const document = dom.window.document;
    const busStops: { hour: number, minute: number, busStop: string }[] = []
    const trs = [...document.querySelectorAll("ul.routeList")]
    for (const tr of trs) {
        const lis = [...tr.querySelectorAll("li")]
        for (const li of lis) {

            const [hour, minute] = li.querySelector("a")?.textContent?.slice(0, 5).split(":").map(s => parseInt(s)) || [-1, -1]
            if (hour === undefined || minute === undefined) {
                // throw new Error("Failed to parse time")
                continue
            }
            const busStop = z.string().parse(li.querySelector("span.busStopPoint")?.textContent?.replace(/[\n\r\t]/g, "").trim())
            busStops.push({ hour, minute, busStop })

        }
    }
    return busStops
}

const busRouteUrls = {
    "keio": {
        "nishihachiojiToHosei": [
            "https://transfer.navitime.biz/bus-navi/pc/diagram/BusDiagram?orvCode=00020677&course=0000456027&stopNo=11",
        ],
        "mejirodaiToHosei": [
            "https://transfer.navitime.biz/bus-navi/pc/diagram/BusDiagram?orvCode=00020064&course=0000456027&stopNo=17",
        ],
        "hoseiTo": [
            "https://transfer.navitime.biz/bus-navi/pc/diagram/BusDiagram?orvCode=00021279&course=0000456026&stopNo=1",
        ],
    },
    "kanachu": {
        "aiharaTo":
            ["https://www.kanachu.co.jp/dia/diagram/timetable/cs:0000802900-1/nid:00130397/rt:0/k:%E7%9B%B8%E5%8E%9F%E9%A7%85%E8%A5%BF%E5%8F%A3",
                "https://www.kanachu.co.jp/dia/diagram/timetable/cs:0000803034-12/nid:00130397/rt:0/k:%E6%B3%95%E6%94%BF%E5%A4%A7%E5%AD%A6%EF%BC%88%E7%94%BA%E7%94%B0%E5%B8%82%EF%BC%89",
            ],
        "hoseiTo":
            ["https://www.kanachu.co.jp/dia/diagram/timetable/cs:0000802289-1/nid:00021279/rt:0/k:%E6%B3%95%E6%94%BF%E5%A4%A7%E5%AD%A6%EF%BC%88%E7%94%BA%E7%94%B0%E5%B8%82%EF%BC%89",
                "https://www.kanachu.co.jp/dia/diagram/timetable/cs:0000803723-1/nid:00021279/dts:1750186800",
                "https://www.kanachu.co.jp/dia/diagram/timetable/cs:0000803039-6/nid:00021279/dts:1750186800"]
    }
}

async function getAllTimetables() {
    let aiharaToHosei: { leaveHour: number, leaveMinute: number, arriveHour: number, arriveMinute: number, busStops: { hour: number, minute: number, busStop: string }[], day: string, station: string, isComingToHosei: boolean, id: string }[] = []
    for (const url of busRouteUrls.kanachu.aiharaTo) {
        const res = await getKanachuTimetable({ url })
        res.forEach(item => aiharaToHosei.push({ ...item, station: "aihara", isComingToHosei: true, arriveHour: -1, arriveMinute: -1, id: crypto.randomUUID() }))
    }
    const hoseiToAihara: { leaveHour: number, leaveMinute: number, arriveHour: number, arriveMinute: number, busStops: { hour: number, minute: number, busStop: string }[], day: string, station: string, isComingToHosei: boolean, id: string }[] = []
    for (const url of busRouteUrls.kanachu.hoseiTo) {
        const res = await getKanachuTimetable({ url })
        res.forEach(item => hoseiToAihara.push({ ...item, station: "aihara", isComingToHosei: false, arriveHour: -1, arriveMinute: -1, id: crypto.randomUUID() }))
    }
    for (const bus of aiharaToHosei) {
        for (const busStop of bus.busStops) {
            // Do something with busStop
            bus.arriveHour = busStop.hour
            bus.arriveMinute = busStop.minute
            break; // Exit after the first iteration
        }
    }
    aiharaToHosei = structuredClone(aiharaToHosei).filter(bus => bus.arriveHour)
    for (const bus of hoseiToAihara) {
        for (const busStop of bus.busStops) {
            if (busStop.busStop === "相原駅西口") {
                bus.arriveHour = busStop.hour
                bus.arriveMinute = busStop.minute
                break; // Exit after the first iteration
            }
        }
    }
    const kanachuTimetable = aiharaToHosei.concat(hoseiToAihara)

    let mejirodaiToHosei: { leaveHour: number, leaveMinute: number, arriveHour: number, arriveMinute: number, busStops: { hour: number, minute: number, busStop: string }[], day: string, station: string, isComingToHosei: boolean, id: string }[] = []
    for (const url of busRouteUrls.keio.mejirodaiToHosei) {
        const res = await getKeioTimeTable({ url, ignoreMejirodaiOnly: false })
        res.forEach(item => mejirodaiToHosei.push({ ...item, station: "mejirodai", isComingToHosei: true, arriveHour: -1, arriveMinute: -1, id: crypto.randomUUID() }))
    }
    for (const bus of mejirodaiToHosei) {
        for (const busStop of bus.busStops) {
            bus.arriveHour = busStop.hour
            bus.arriveMinute = busStop.minute
            break; // Exit after the first iteration
        }
    }
    let nishihachiojiToHosei: { leaveHour: number, leaveMinute: number, arriveHour: number, arriveMinute: number, busStops: { hour: number, minute: number, busStop: string }[], day: string, station: string, isComingToHosei: boolean, id: string }[] = []
    for (const url of busRouteUrls.keio.nishihachiojiToHosei) {
        const res = await getKeioTimeTable({ url, ignoreMejirodaiOnly: true })
        res.forEach(item => nishihachiojiToHosei.push({ ...item, station: "nishihachioji", isComingToHosei: true, arriveHour: -1, arriveMinute: -1, id: crypto.randomUUID() }))
    }
    for (const bus of nishihachiojiToHosei) {
        for (const busStop of bus.busStops) {
            bus.arriveHour = busStop.hour
            bus.arriveMinute = busStop.minute
            break; // Exit after the first iteration
        }
    }
    let hoseiToMejirodai: {
        leaveHour: number, leaveMinute: number, arriveHour: number, arriveMinute: number, busStops: { hour: number, minute: number, busStop: string }[], day: string,
        station: string, isComingToHosei: boolean, id: string
    }[] = []
    let hoseiToNishihachioji: {
        leaveHour: number, leaveMinute: number, arriveHour: number, arriveMinute: number, busStops: { hour: number, minute: number, busStop: string }[], day: string,
        station: string, isComingToHosei: boolean, id: string
    }[] = []
    for (const url of busRouteUrls.keio.hoseiTo) {
        const res = await getKeioTimeTable({ url, ignoreMejirodaiOnly: false })
        res.forEach(item => hoseiToMejirodai.push({ ...item, station: "mejirodai", isComingToHosei: false, arriveHour: -1, arriveMinute: -1, id: crypto.randomUUID() }))
    }
    for (const url of busRouteUrls.keio.hoseiTo) {
        const res = await getKeioTimeTable({ url, ignoreMejirodaiOnly: true })
        res.forEach(item => hoseiToNishihachioji.push({ ...item, station: "nishihachioji", isComingToHosei: false, arriveHour: -1, arriveMinute: -1, id: crypto.randomUUID() }))
    }
    for (const bus of hoseiToMejirodai) {
        for (const busStop of bus.busStops) {
            if (busStop.busStop === "めじろ台駅") {
                bus.arriveHour = busStop.hour
                bus.arriveMinute = busStop.minute
                break; // Exit after the first iteration
            }
        }
    }
    for (const bus of hoseiToNishihachioji) {
        for (const busStop of bus.busStops) {
            if (busStop.busStop === "西八王子駅南口") {
                bus.arriveHour = busStop.hour
                bus.arriveMinute = busStop.minute
                break; // Exit after the first iteration
            }
        }
    }
    const keioTimetable = hoseiToMejirodai.concat(hoseiToNishihachioji).concat(mejirodaiToHosei).concat(nishihachiojiToHosei).filter(bus => bus.arriveHour)
    const allTimetable = kanachuTimetable.concat(keioTimetable)
    fs.writeFileSync("src/utils/Timetable.json", JSON.stringify(allTimetable, null, 2))
}



async function getEkitan({ url }: { url: string }) {
    const days = ["Weekday", "Saturday", "Sunday"]
    const result: { hour: number, minute: number, trainType: string, destination: string, direction: string, station: string, line: string, day: string }[] = []
    await Promise.all(days.map(async (day, idx) => {
        const dom = await JSDOM.fromURL(`${url}?view=list&dw=${idx}`, {
            referrer: "https://ekitan.com/",
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
        })
        const document = dom.window.document
        const directions = document.querySelectorAll("li.ek-direction_tab > a")
        const line = z.string().parse(document.querySelector("li.line-name a")?.textContent)
        const station = z.string().parse(document.querySelector("div.station-name a")?.textContent?.replace(/\(神奈川\)/, ""));
        [...document.querySelectorAll("div.tab-content-inner")].map((d, idx) => {
            for (const el of d.querySelectorAll("li.ek-narrow")) {
                let time = ""
                try {
                    time = z.string().parse(el.querySelector("span.dep-time")?.textContent)
                } catch {
                    break
                }
                const [hour, minute] = time.split(":").map(item => parseInt(item))
                const trainType = z.string().parse(el.querySelector("span.train-type")?.textContent)
                const destination = z.string().parse(el.querySelector("span.destination")?.textContent)
                const direction = z.string().parse(directions[idx]?.textContent)
                result.push({ hour, minute, trainType, destination, direction, station, line, day })
            }
        })
    }))
    return result;
}

async function getAllEkitan() {
    const urls = [

        "https://ekitan.com/timetable/railway/line-station/163-16/d1",

        "https://ekitan.com/timetable/railway/line-station/264-3/d1",

        "https://ekitan.com/timetable/railway/line-station/180-22/d1",

        "https://ekitan.com/timetable/railway/line-station/180-21/d1",

        "https://ekitan.com/timetable/railway/line-station/163-19/d1",

        "https://ekitan.com/timetable/railway/line-station/25-0/d1",

        "https://ekitan.com/timetable/railway/line-station/110-17/d1",

        "https://ekitan.com/timetable/railway/line-station/163-15/d1",

        "https://ekitan.com/timetable/railway/line-station/261-11/d1",

        "https://ekitan.com/timetable/railway/line-station/262-31/d1"

    ]
    const result: {
        hour: number;
        minute: number;
        trainType: string;
        destination: string;
        direction: string;
        station: string
    }[] = []
    await Promise.all(urls.map(async url => {
        return await getEkitan({ url })
    })).then(item => {
        item.map(i => {
            i.map(j => {
                result.push(j)
            })
        })
    })
    result.map(item => {
        if (item.destination === "京王多摩センターから特急新宿行き行き") {
            item.destination = "新宿行き"
            item.trainType = "各停・京王多摩センターから特急"
        } else if (item.destination === "新線新宿から各駅停車本八幡行き行き") {
            item.destination = "本八幡行き"
            item.trainType = "急行・新線新宿から各停"
        } else if (item.destination === "高幡不動から特急新宿行き行き") {
            item.destination = "新宿行き"
            item.trainType = "各停・高幡不動から特急"
        } else if (item.destination === "高幡不動から急行新宿行き行き") {
            item.destination = "新宿行き"
            item.trainType = "各停・高幡不動から急行"
        }
        if (item.station === "八王子駅" || item.station === "京王八王子駅") {
            item.station = "JR八王子駅/京王八王子駅"
        }
    })
    fs.writeFileSync("src/utils/ekitan.json", JSON.stringify(result, null, 2))

}

getAllEkitan()
getAllTimetables()