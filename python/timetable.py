from bs4 import beautifulsoup
import requests
from json import dump
import asyncio
import aiohttp
import ssl

# JSONで出力する際に煩雑なのですべてキャメルケースを採用する
# 始発と終点の表すleaveとarriveを表記する
# それぞれのバス停には到着時刻と出発時刻の区別がないのでleaveとarriveは使わない

# 神奈中バスは往復で系列がそれぞれ3つずつ存在する（ホームページ上は5つだが実際には3つである）。
# 時刻表には急行のみが載っているものと急行と各駅停車が混ざって載っているものがあるので時刻表からの種別判定は困難である
# 停車バス停を取得し、そこから判定を判別するといった方法が妥当である。




def superjoin(l:list[list]):
  """リストの中のリストを分解して1つのリストにする"""
  r=[]
  for i in l:
    r.extend(i)
  return r

async def getKeioTimetable(url,ignoreMejirodaiOnly=False):
  wkdDict=dict(wkd="Weekday",std="Saturday",snd="Sunday")
  timetable=[]
  response=requests.get(url)
  soup=BeautifulSoup(response.text,"html.parser")
  # 時刻で分割
  trs=soup.select("tr.l2")
  urls=[]
  exList=[]
  for tr in trs:
    leaveHour=int(tr.select_one("th.hour").text)
    # 曜日で分割
    for wkd in wkdDict.keys():
      day=tr.select_one(f"td.{wkd}")
      items=day.select("div.diagram-item")
      for item in items:
        if item.select_one("div.top").text.find("グ")==-1 and (not ignoreMejirodaiOnly or item.select_one("div.top").text.find("め")==-1):
          time=item.select_one("span[aria-hidden='true']")
          leaveMinute=int(time.text)
          url="https://transfer.navitime.biz/" + item.select_one("a").get("href")
          urls.append(url)
          exList.append(dict(leaveHour=leaveHour,leaveMinute=leaveMinute,day=wkdDict[wkd]))
  async with aiohttp.ClientSession() as session:
    busStopListList=await asyncio.gather(*map(getKeioBusStops,urls,[session for i in range(len(urls))]))
  
  for idx in range(len(exList)):
    timetable.append(dict(**exList[idx],busStopList=busStopListList[idx]))
  print(timetable)
  return timetable

async def getKeioBusStops(url,session):
  print(url)
  busStopList=[]
  async with session.get(url) as response:
    response=await response.text()
  print(f"{url}からのレスポンスを確認")
  soup=BeautifulSoup(response,"html.parser")
  trs=soup.select("#railroad-matrix > center > div")
  for tr in trs:
    hour,minute=map(int,tr.select_one("span").text.replace("\t","").replace("\n","").replace(" ","")[0:5].split(":"))
    busStop=tr.select_one("strong").text.replace("\t","").replace("\n","").replace(" ","")
    busStopList.append(dict(hour=hour,minute=minute,busStop=busStop))
  busStopList.sort(key=lambda x:(x["hour"],x["minute"]))
  return busStopList


async def getKanachuTimetable(url)->list:
  print(url)
  timetable=[]
  day=["Weekday","Saturday","Sunday"]
  response=requests.get(url)
  soup=BeautifulSoup(response.text,"html.parser")
  # 時刻で分解
  trs=soup.select("tr.row1")+soup.select("tr.row2")
  exList=[]
  urls=[]
  for tr in trs:
    leaveHour=int(tr.select_one("th.hour").text)
    # 曜日で分解
    tds=tr.select("td")
    # CSSセレクターで金・土・日祝の順で拾われるはずなのでその順に並べる
    for i,td in enumerate(tds):
      aTags=td.select("a")
      for aTag in aTags:
        leaveMinute=int(aTag.text)
        exList.append(dict(leaveHour=leaveHour,leaveMinute=leaveMinute,day=day[i]))
        urls.append("https://www.kanachu.co.jp"+aTag.get("href"))
  context=ssl.create_default_context()
  context.set_ciphers("DEFAULT@SECLEVEL=1")
  async with aiohttp.ClientSession(connector=aiohttp.TCPConnector(ssl=context)) as session:
    busStopListList=await asyncio.gather(*map(getKanachuBusStops,urls,[session for i in range(len(urls))]))
  for idx in range(len(exList)):
    timetable.append(dict(**exList[idx],busStopList=busStopListList[idx]))
  timetable.sort(key=lambda x:(day.index(x["day"]),x["leaveHour"],x["leaveMinute"]))
  print(timetable)
  return timetable

async def getKanachuBusStops(url,session)->list[dict]:
  print(url)
  busStopList=[]
  async with session.get(url) as response:
    response=await response.text()
  print(f"{url}からのレスポンスを確認")
  soup=BeautifulSoup(response,"html.parser")
  trs=soup.select("ul.routeList")
  for tr in trs:
    lis=tr.select("li")
    for li in lis:
      hour,minute=0,0
      try:
        hour,minute=map(int,li.select_one("a").text[0:5].split(":"))
      except:
        continue
      busStop=li.select_one("span.busStopPoint").text.replace("\t","").replace("\n","").replace(" ","")
      busStopList.append(dict(hour=hour,minute=minute,busStop=busStop))
  busStopList.sort(key=lambda x:(x["hour"],x["minute"]))
  return busStopList
    
busRouteURLs={
  "keio":{
    "nishihachiojiToHosei":[
      r"https://transfer.navitime.biz/bus-navi/pc/diagram/BusDiagram?orvCode=00020677&course=0000456025&stopNo=1",
      r"https://transfer.navitime.biz/bus-navi/pc/diagram/BusDiagram?orvCode=00020677&course=0000457109&stopNo=1"],
    "mejirodaiToHosei":[
      r"https://transfer.navitime.biz/bus-navi/pc/diagram/BusDiagram?orvCode=00020064&course=0000456027&stopNo=17",
      r"https://transfer.navitime.biz/bus-navi/pc/diagram/BusDiagram?orvCode=00020064&course=0000457106&stopNo=1"
    ],
    "hoseiTo":[
      # 時刻表の中にめじろ台終点で西八王子までいかないものがあるので注意！
    r"https://transfer.navitime.biz/bus-navi/pc/diagram/BusDiagram?orvCode=00021279&course=0000456026&stopNo=1",
    r"https://transfer.navitime.biz/bus-navi/pc/diagram/BusDiagram?orvCode=00021279&course=0000457108&stopNo=1"
    ],
  },
  "kanachu":{
    "aiharaTo":
    [r"https://www.kanachu.co.jp/dia/diagram/timetable/cs:0000802900-1/nid:00130397/rt:0/k:%E7%9B%B8%E5%8E%9F%E9%A7%85%E8%A5%BF%E5%8F%A3",
    r"https://www.kanachu.co.jp/dia/diagram/timetable/cs:0000803034-12/nid:00130397/rt:0/k:%E6%B3%95%E6%94%BF%E5%A4%A7%E5%AD%A6%EF%BC%88%E7%94%BA%E7%94%B0%E5%B8%82%EF%BC%89",
    ],
    "hoseiTo":
    [r"https://www.kanachu.co.jp/dia/diagram/timetable/cs:0000802289-1/nid:00021279/rt:0/k:%E6%B3%95%E6%94%BF%E5%A4%A7%E5%AD%A6%EF%BC%88%E7%94%BA%E7%94%B0%E5%B8%82%EF%BC%89",
     r"https://www.kanachu.co.jp/dia/diagram/timetable/cs:0000803723-1/nid:00021279/dts:1750186800",
     r"https://www.kanachu.co.jp/dia/diagram/timetable/cs:0000803039-6/nid:00021279/dts:1750186800"]
  }
}

async def main():
  with open("./TimeTable.json","w") as f:

    # URLから時刻表を取得する
    aiharaToHosei=[]
    for URL in busRouteURLs["kanachu"]["aiharaTo"]:
      # 駅と方向の情報を加えて配列に追加する
      aiharaToHosei.extend([dict(**bus,station="aihara",isComingToHosei=True) for bus in await getKanachuTimetable(url=URL)])
    hoseiToAihara=[]
      # 駅と方向の情報を加えて配列に追加する
    for URL in busRouteURLs["kanachu"]["hoseiTo"]:
      hoseiToAihara.extend([dict(**bus,station="aihara",isComingToHosei=False) for bus in await getKanachuTimetable(url=URL)])
    
    # 到着時刻の情報を加える
    for bus in aiharaToHosei:
      for busStop in bus["busStopList"]:
        if busStop["busStop"]=="法政大学（町田市）":
          bus["arriveHour"]=busStop["hour"]
          bus["arriveMinute"]=busStop["minute"]
          break
    # arriveHourのキーがないもの⇔バス停に法政大学が含まれないものは法政大学を経由しないため削除する
    aiharaToHosei=list(filter(lambda x:x.get("arriveHour"),aiharaToHosei))
    for bus in hoseiToAihara:
      for busStop in bus["busStopList"]:
        if busStop["busStop"]=="相原駅西口":
          bus["arriveHour"]=busStop["hour"]
          bus["arriveMinute"]=busStop["minute"]
          break
    
    kanachuTimetable = superjoin([aiharaToHosei,hoseiToAihara])

    mejirodaiToHoseiTimetable=[]
    for URL in busRouteURLs["keio"]["mejirodaiToHosei"]:
      mejirodaiToHoseiTimetable.extend([dict(**bus,station="mejirodai",isComingToHosei=True) for bus in (await getKeioTimetable(url=URL,ignoreMejirodaiOnly=False))])
    for bus in mejirodaiToHoseiTimetable:
      for busStop in bus["busStopList"]:
        if busStop["busStop"]=="法政大学":
          bus["arriveHour"]=busStop["hour"]
          bus["arriveMinute"]=busStop["minute"]
          break
    print(mejirodaiToHoseiTimetable)

    nishihachiojiToHoseiTimetable=[]
    for URL in busRouteURLs["keio"]["nishihachiojiToHosei"]:
      nishihachiojiToHoseiTimetable.extend([dict(**bus,station="nishihachioji",isComingToHosei=True) for bus in (await getKeioTimetable(url=URL,ignoreMejirodaiOnly=True))])
    for bus in nishihachiojiToHoseiTimetable:
      for busStop in bus["busStopList"]:
        if busStop["busStop"]=="法政大学":
          bus["arriveHour"]=busStop["hour"]
          bus["arriveMinute"]=busStop["minute"]
          break
    
    
 
    hoseiToMejirodai=[]
    hoseiToNishihachioji=[]
    for url in busRouteURLs["keio"]["hoseiTo"]:
      hoseiToMejirodai.extend([dict(**bus,station="mejirodai",isComingToHosei=False) for bus in await getKeioTimetable(url=url,ignoreMejirodaiOnly=False)])  
      hoseiToNishihachioji.extend([dict(**bus,station="nishihachioji",isComingToHosei=False) for bus in await getKeioTimetable(url=url,ignoreMejirodaiOnly=True)])  

    for bus in hoseiToMejirodai:
      for busStop in bus["busStopList"]:
        if busStop["busStop"]=="めじろ台駅":
          bus["arriveHour"]=busStop["hour"]
          bus["arriveMinute"]=busStop["minute"]
          break
    
    for bus in hoseiToNishihachioji:
      for busStop in bus["busStopList"]:
        if busStop["busStop"]=="西八王子駅南口":
          bus["arriveHour"]=busStop["hour"]
          bus["arriveMinute"]=busStop["minute"]
    
    keioTimetable=superjoin([mejirodaiToHoseiTimetable,nishihachiojiToHoseiTimetable,hoseiToMejirodai,hoseiToNishihachioji])
    result=superjoin([keioTimetable,kanachuTimetable])
    result.sort(key=lambda x:(x["station"],x["isComingToHosei"],x["day"],x["leaveHour"],x["leaveMinute"]))


    



    dump(result,f,indent=2,ensure_ascii=False)
    print("Successfully finished")
  
if __name__=="__main__":
  asyncio.run(main())