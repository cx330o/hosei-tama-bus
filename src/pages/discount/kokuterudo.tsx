import { Link } from "react-router-dom"
import kokuterudouImage from "/images/kokuterudou.webp"
import { Undo2 } from "lucide-react"

const page = () => {
  return (
    <div className='bg-gray-100 dark:bg-zinc-950 p-8 min-h-screen text-black dark:text-white'>
        <title>コクテル堂 - たまっぷ提携店舗</title>
        <meta name="description" content="橋本駅近くのカフェ「コクテル堂」。法政大学の学生証提示で、「ケーキ×ドリンクのセット」がさらに100円割引になります。" />
      <Link to="/discount" className='top-2 left-2 fixed backdrop-blur-xs p-4 border-2 border-rose-500 rounded-full font-semibold text-lg'><Undo2></Undo2></Link>
      <div className='dark:bg-zinc-900 shadow-lg mx-auto mt-10 rounded-lg max-w-xl'>
        <img src={kokuterudouImage} alt="コクテル堂の画像" width={500} height={500} className='rounded-t-lg w-full' />
        <div className='px-5 py-4'>
          <p className='mt-2 font-bold text-2xl text-center'>コクテル堂</p>
          <p className='font-semibold text-rose-400 text-lg'>割引内容</p>
          <p>通常100円引きの「ケーキ×ドリンクのセット」をさらに100円割引</p>
          <p className='font-semibold text-rose-400 text-lg'>割引方法</p>
          <p>ご注文時に、本画面と法政大学の学生証または教職員証をご提示ください。</p>
          <p className='font-semibold text-rose-400 text-lg'>営業日／定休日</p>
          <p>9:00～20:00</p>
          <p>19:00 (フードラストオーダー)</p>
          <p>19:30 (ドリンク/ケーキラストオーダー)</p>
          <p>20:00 (テイクアウトケーキ・物販ラストオーダー)</p>
          <p>定休日：なし(施設休は除く)</p>
          <p className='font-semibold text-rose-400 text-lg'>お支払方法</p>
          <p>現金、クレジットカード(VISA、マスター、JCBなど)</p>
          <p>交通系IC(Suica、PASMOなど)</p>
          <p>QRコード決済(paypay、AEON Payなど)</p>
          <p className='font-semibold text-rose-400 text-lg'>アクセス</p>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3244.280509464267!2d139.3424809752558!3d35.59614657261483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60191d37d330c62d%3A0x919a4b9f23796e74!2z44Kz44Kv44OG44Or5aCC5qmL5pys5bqX!5e0!3m2!1sja!2sjp!4v1730106307614!5m2!1sja!2sjp" className="rounded-lg w-full h-64" style={{ border: 0 }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade">
          </iframe>
          <p className='font-semibold text-rose-400 text-lg'>問い合わせ先</p>
          <p>042-773-0960</p>
          <p>〒252-0143 神奈川県相模原市緑区橋本6-2-1 イオン橋本店 2F JR橋本駅から徒歩1分</p>
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
