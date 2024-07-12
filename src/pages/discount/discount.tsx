import { Link } from "react-router-dom"
import StoreCard from '../../components/store-card'
import fujiImage from "/images/fuji.webp"
import hicheeseImage from "/images/hicheese.webp"
import kokuterudouImage from "/images/kokuterudou.webp"
import { Undo2 } from "lucide-react"
const page = () => {
  return (
    <div className='bg-zinc-100 dark:bg-zinc-950 min-h-screen text-black dark:text-white'>
        <title>提携店舗一覧 - たまっぷ</title>
        <meta name="description" content="たまっぷと提携している店舗の一覧です。法政大学の学生証を提示すると、お得な割引を受けられます。" />
      <header className='bg-[#ff6347] text-white'>
        <h1 className='mx-auto p-3 font-bold text-2xl text-center'>たまっぷ 提携店舗一覧</h1>
      </header>
      <Link to="/" className='top-2 left-2 fixed bg-white dark:bg-black p-4 border-2 border-rose-500 rounded-full font-semibold text-black dark:text-white text-lg'><Undo2></Undo2></Link>
      <div className='gap-8 grid grid-cols-1 md:grid-cols-2 mx-auto mt-4 p-8 max-w-5xl'>
        {[
          { storeName: '藤', storeImage: fujiImage, storeDescription: 'めじろ台　うどん屋', url: '/fuji', children: <p>普通盛り50円引き<br />大盛無料</p> },
          { storeName: 'ハイチーズ', storeImage: hicheeseImage, storeDescription: '八王子　チーズ料理', url: '/hicheese', children: <p>ランチソフトドリンク無料<br />コースディナー500円引き<br />飲み放題30分延長</p> },
          // { storeName: '吾衛門', storeImage: '/goemon.jpg', storeDescription: '西八王子ラーメン店', url: '/discount/goemon', children: <p>大盛無料</p> },
          { storeName: 'コクテル堂', storeImage: kokuterudouImage, storeDescription: '橋本　カフェ', url: '/kokuterudo', children: <p>ケーキ×ドリンクのセット<br />さらに100円引き</p> }
        ].map((store, index) => (
          <StoreCard key={index} {...store} />
        ))}
      </div>
    </div>
  )
}

export default page
