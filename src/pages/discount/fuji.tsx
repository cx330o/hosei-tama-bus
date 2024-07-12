import { Link } from "react-router-dom"
import fujiImage from "/images/fuji.webp"
import { Undo2 } from "lucide-react"
const page = () => {
  return (
    <div className='bg-gray-100 dark:bg-zinc-950 p-8 min-h-screen text-black dark:text-white'>
        <title>藤 - たまっぷ提携店舗</title>
        <meta name="description" content="めじろ台駅近くのうどん屋「藤」。法政大学の学生証提示で、うどん普通盛りが50円引き、または大盛が無料になります。" />
      <Link to="/discount" className='top-2 left-2 fixed backdrop-blur-xs p-4 border-2 border-rose-500 rounded-full font-semibold text-lg'><Undo2></Undo2></Link>
      <div className='dark:bg-zinc-900 shadow-lg mx-auto mt-10 rounded-lg max-w-xl'>
        <img src={fujiImage} alt="うどん屋　藤の画像" width={500} height={500} className='rounded-t-lg w-full' />
        <div className='px-5 py-4'>
          <p className='mt-2 font-bold text-2xl text-center'>藤</p>
          <p className='mt-4'>めじろ台駅からわずか徒歩１分！ランチタイムにリーズナブルな価格で本格的なうどんが食べられます！多種多様なうどんの他に、丼ものもあります！</p>
          <p className='font-semibold text-rose-400 text-lg'>割引内容</p>
          <p>・うどん普通盛50円引き</p>
          <p>・うどん大盛無料</p>
          <p>上記から1つ選択できます。</p>
          <p className='font-semibold text-rose-400 text-lg'>割引方法</p>
          <p>ご注文時に、本画面と法政大学の学生証または教職員証をご提示ください。</p>
          <p className='font-semibold text-rose-400 text-lg'>営業日／定休日</p>
          <p>ランチ</p>
          <p>11:00～15:00（ラストオーダー 14:30）</p>
          <p>ディナー</p>
          <p>17:00～21:00（ラストオーダー20:30）</p>
          <p>定休日：（第２・３火曜日）水曜日</p>
          <p className='font-semibold text-rose-400 text-lg'>お支払方法</p>
          <p>現金、クレジットカード(VISA、マスター、JCBなど)、交通系IC(Suica、PASMOなど)、 QRコード決済(PayPay、楽天ペイなど)</p>
          <p className='font-semibold text-rose-400 text-lg'>アクセス</p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1621.184591380742!2d139.30751329999998!3d35.6432748!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60191c23cdc1bc8b%3A0x2131ebb723e16b12!2z44GG44Gp44KT5oeQ55-z5aSp44G344KJ5pes6a6u44O75ZKM6Iaz44O76Jek!5e0!3m2!1sja!2sjp!4v1727600041739!5m2!1sja!2sjp"
            className="rounded-lg w-full h-64"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
          <p className='font-semibold text-rose-400 text-lg'>問い合わせ先</p>
          <p>042-662-8868</p>
          <p>〒193-0833 東京都八王子市めじろ台１丁目１００−１京王線 めじろ台駅より徒歩1分</p>
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
