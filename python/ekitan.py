from bs4 import BeautifulSoup
import json
import asyncio
import aiohttp


async def get_ekitan(url, session):
    days = ["Weekday", "Saturday", "Sunday"]
    print(url)
    result = []
    for i, day in enumerate(days):
        async with session.get(f"{url}?view=list&dw={i}") as response:
            res = await response.text()
        soup = BeautifulSoup(res, "html.parser")
        directions = soup.select("li.ek-direction_tab > a")
        line = soup.select_one("li.line-name a").text
        station = soup.select_one(
            "div.station-name a").text.replace("(神奈川)", "").strip()
        for j, d in enumerate(soup.select("div.tab-content-inner")):
            for el in d.select("li.ek-narrow"):
                try:
                    time = el.select_one("span.dep-time").text
                except:
                    break
                hour, minute = map(int, time.split(":"))
                train_type = el.select_one("span.train-type").text
                destination = el.select_one("span.destination").text
                direction = directions[j].text
                result.append(dict(hour=hour, minute=minute, trainType=train_type,
                              destination=destination, direction=direction, line=line, station=station, day=day))
    print(result)
    return result


async def main():
    urls = [
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
    async with aiohttp.ClientSession(headers={"User-Agent": "Mozilla/5.0"},) as session:
        trainListList = await asyncio.gather(*map(get_ekitan, urls, [session for i in range(len(urls))]))
    result = []
    for trainList in trainListList:
        for item in trainList:
            result.append(item)
    result.sort(key=lambda x: (
        x["hour"], x["minute"], x["station"], x["line"], x["direction"], x["destination"]))
    print(result)
    for item in result:
        if item["destination"] == "京王多摩センターから特急新宿行き行き":
            item["destination"] = "新宿行き"
            item["trainType"] = f"各停・京王多摩センターから特急"
        elif item["destination"] == "新線新宿から各駅停車本八幡行き行き":
            item["destination"] = "本八幡行き"
            item["trainType"] = "急行・新線新宿から各停"
        elif item["destination"] == "高幡不動から特急新宿行き行き":
            item["destination"] = "新宿行き"
            item["trainType"] = "各停・高幡不動から特急"
        elif item["destination"] == "高幡不動から急行新宿行き行き":
            item["destination"] = "新宿行き"
            item["trainType"] = "各停・高幡不動から急行"
        # JR八王子駅と京王八王子駅を統合する
        if item["station"] == "八王子駅" or item["station"] == "京王八王子駅":
            item["station"] = "JR八王子駅/京王八王子駅"

    open("ekitan.json", "w").write(json.dumps(
        result, ensure_ascii=False, indent=2))
    print("Successfully finished")

if __name__ == "__main__":
    asyncio.run(main())
