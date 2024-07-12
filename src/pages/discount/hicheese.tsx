import { Link } from "react-router-dom"
import hicheeseImage from "/images/hicheese.webp"
import { Undo2 } from "lucide-react"

const page = () => {
  return (
    <div className='bg-gray-100 dark:bg-zinc-950 p-8 min-h-screen text-black dark:text-white'>
        <title>ハイチーズ Hi Cheese! - たまっぷ提携店舗</title>
        <meta name="description" content="八王子駅近くのチーズ料理店「ハイチーズ Hi Cheese!」。法政大学の学生証提示で、ランチはソフトドリンク1杯無料、ディナーはコース価格100円引きまたは飲み放題30分延長の特典があります。" />
      <Link to="/discount" className='top-2 left-2 fixed backdrop-blur-xs p-4 border-2 border-rose-500 rounded-full font-semibold text-lg'><Undo2></Undo2></Link>
      <div className='dark:bg-zinc-900 shadow-lg mx-auto mt-10 rounded-lg max-w-xl'>
        <img src={hicheeseImage} alt="ハイチーズの画像" width={500} height={500} className='rounded-t-lg w-full' />
        <div className='px-5 py-4'>
          <p className='mt-2 font-bold text-2xl text-center'>ハイチーズ Hi Cheese!</p>
          <p className='mt-4'>肉料理やチーズ料理が盛りだくさん！食べ放題＆飲み放題が揃っているので様々な用途にご利用いただけます！サークルでの飲み会にもどうぞ。</p>
          <p className='font-semibold text-rose-400 text-lg'>割引内容</p>
          <p>ランチ:</p>
          <p>ソフトドリンク1杯無料サービスをご利用いただけます。</p>
          <p>ディナー:</p>
          <p>・選んだコース価格100円引き</p>
          <p>・飲み放題の制限時間 30分延長から1つ選択し、ご利用いただけます。</p>
          <p>上記から1つ選択できます。</p>
          <p className='font-semibold text-rose-400 text-lg'>割引方法</p>
          <p>ご注文時に、本画面と法政大学の学生証または教職員証をご提示ください。</p>
          <p className='font-semibold text-rose-400 text-lg'>営業日／定休日</p>
          <p>11:30～23:00（ラストオーダー 22:30）</p>
          <p>定休日：なし(年末年始を除く)</p>
          <p className='font-semibold text-rose-400 text-lg'>お支払方法</p>
          <p>現金、クレジットカード(VISA、マスター、JCBなど)、COIN＋</p>
          <p className='font-semibold text-rose-400 text-lg'>アクセス</p>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.7632553916537!2d139.3353063757866!3d35.65820407259479!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60191d4518112437%3A0x625305339bb22b07!2z5YCL5a6k5bGF6YWS5bGLIEhpIENoZWVzZSDlhavnjovlrZDpp4Xlupc!5e0!3m2!1sja!2sjp!4v1727708475694!5m2!1sja!2sjp"
            className="rounded-lg w-full h-64"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
          <p className='font-semibold text-rose-400 text-lg'>問い合わせ先</p>
          <p>042-656-8392</p>
          <p>〒192-0082 東京都八王子市東町１２−８ 長澤ビル 2F JR中央線 八王子駅 北口より徒歩3分</p>
          <p className='font-semibold text-rose-400 text-lg'>注意事項</p>
          <p>・2026年3月31日まで有効です。</p>
          <p>・他飲食サイトの割引との併用はできません。</p>
          <p>・ご利用には、法政大学の学生証または教職員証のご提示が必要です。</p>
        </div>
      </div>
    </div>
  )
}

export default page
