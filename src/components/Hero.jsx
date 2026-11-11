import { useState } from 'react'
import { ChevronRight, Play, Star } from 'lucide-react'

export default function Hero({ fire }) {
  const [trialDone, setTrialDone] = useState(false)

  const handleStartTrial = () => {
    fire('StartTrial', { content_id: 'trial-zphone-pro-15', content_name: 'Dùng thử 30 ngày' })
    setTrialDone(true)
    setTimeout(() => setTrialDone(false), 3000)
  }

  return (
    <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-20 flex flex-col md:flex-row items-center gap-8 md:gap-12">

        {/* Text */}
        <div className="flex-1 text-center md:text-left w-full">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-3 py-1 text-xs md:text-sm text-blue-300 mb-4 md:mb-6">
            <Star size={11} fill="currentColor" />
            Mới nhất 2025 — ZPhone Pro 15
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-4 md:mb-6">
            Công nghệ{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              đỉnh cao
            </span>
            ,{' '}trải nghiệm vượt trội
          </h1>

          <p className="text-slate-300 text-base md:text-lg mb-6 md:mb-8 max-w-lg mx-auto md:mx-0">
            Hệ sinh thái thiết bị ZTech — từ smartphone đến wearable — thiết kế cho cuộc sống hiện đại.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <a
              id="btn-view-content-hero"
              href="#products"
              onClick={() => fire('ViewContent', { content_id: 'products', content_name: 'Danh sách sản phẩm', content_type: 'product' })}
              className="btn-view-content-hero inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Khám phá ngay <ChevronRight size={18} />
            </a>
            <button
              id="btn-start-trial"
              onClick={handleStartTrial}
              className={`btn-start-trial inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white/60 text-white px-6 py-3 rounded-xl transition-all ${trialDone ? 'bg-green-600/30 border-green-500/50' : ''}`}
            >
              <Play size={16} />
              {trialDone ? '✓ Đã đăng ký!' : 'Dùng thử 30 ngày'}
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm text-slate-400 justify-center md:justify-start">
            <span className="flex items-center gap-1"><span className="text-yellow-400">★★★★★</span> 4.9/5</span>
            <span className="hidden sm:inline">·</span>
            <span>Miễn phí vận chuyển</span>
            <span className="hidden sm:inline">·</span>
            <span>Bảo hành 24 tháng</span>
          </div>
        </div>

        {/* Phone mockup — ẩn trên màn hình rất nhỏ (<sm), thu nhỏ trên sm */}
        <div className="hidden sm:flex flex-1 justify-center">
          <div className="relative">
            <div className="w-44 h-72 md:w-56 md:h-96 bg-gradient-to-b from-slate-700 to-slate-900 rounded-[2.5rem] md:rounded-[3rem] border-4 border-slate-600 shadow-2xl shadow-blue-500/20 flex flex-col items-center justify-center gap-3 md:gap-4 p-5">
              <div className="w-12 h-1 bg-slate-600 rounded-full" />
              <div className="w-full h-36 md:h-52 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center">
                <span className="text-4xl md:text-5xl">📱</span>
              </div>
              <div className="text-white text-center">
                <div className="font-bold text-xs md:text-sm">ZPhone Pro 15</div>
                <div className="text-blue-400 text-xs">14.990.000 ₫</div>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-slate-600 flex items-center justify-center">
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-700" />
              </div>
            </div>
            {/* Floating badges — ẩn trên sm, hiện md trở lên */}
            <div className="hidden md:block absolute -left-12 top-16 bg-white text-slate-900 rounded-xl px-3 py-2 text-xs font-semibold shadow-xl animate-bounce">
              🔋 5000 mAh
            </div>
            <div className="hidden md:block absolute -right-12 top-48 bg-white text-slate-900 rounded-xl px-3 py-2 text-xs font-semibold shadow-xl">
              📸 200MP
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
