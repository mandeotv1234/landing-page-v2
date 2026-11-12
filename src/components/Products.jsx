import { useState } from 'react'
import { Heart, ShoppingCart, Eye, Check } from 'lucide-react'

const PRODUCTS = [
  { id: 'sp001', name: 'ZPhone Pro 15', price: 14990000, category: 'smartphone', emoji: '📱', color: 'from-blue-500 to-cyan-500', desc: 'Chip ZA9 Pro · 200MP · 5000mAh · IP68' },
  { id: 'sp002', name: 'ZTablet Air 11', price: 9990000, category: 'tablet', emoji: '💻', color: 'from-violet-500 to-purple-600', desc: 'OLED 11" · 120Hz · S-Pen · 10000mAh' },
  { id: 'sp003', name: 'ZWatch Ultra S', price: 3490000, category: 'wearable', emoji: '⌚', color: 'from-orange-400 to-red-500', desc: 'GPS · SpO2 · ECG · 72h pin' },
  { id: 'sp004', name: 'ZBuds Pro 3', price: 1990000, category: 'audio', emoji: '🎧', color: 'from-emerald-500 to-teal-600', desc: 'ANC chủ động · LDAC · 36h tổng' },
  { id: 'sp005', name: 'ZLaptop Slim X', price: 22990000, category: 'laptop', emoji: '🖥️', color: 'from-slate-600 to-slate-800', desc: 'ZA9 M3 · 16GB · 1TB SSD · 16"' },
  { id: 'sp006', name: 'ZCam 4K Pro', price: 7490000, category: 'camera', emoji: '📷', color: 'from-amber-500 to-yellow-600', desc: '4K 120fps · Gimbal 3-axis · WiFi' },
]

const fmt = (n) => n.toLocaleString('vi-VN') + ' ₫'

export default function Products({ fire, cart, setCart, wishlist, setWishlist }) {
  const [added, setAdded] = useState({})
  const [selected, setSelected] = useState(null)

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id)
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
    fire('AddToCart', {
      content_id: product.id,
      content_type: 'product',
      quantity: 1,
      value: product.price,
      currency: 'VND',
    })
    setAdded(a => ({ ...a, [product.id]: true }))
    setTimeout(() => setAdded(a => ({ ...a, [product.id]: false })), 2000)
  }

  const toggleWishlist = (product) => {
    const inWL = wishlist.includes(product.id)
    setWishlist(prev => inWL ? prev.filter(i => i !== product.id) : [...prev, product.id])
    if (!inWL) fire('AddToWishlist', { content_id: product.id, contents: [product.name] })
  }

  const viewProduct = (product) => {
    setSelected(product)
    fire('ViewContent', {
      content_id: product.id,
      content_name: product.name,
      content_type: 'product',
      value: product.price,
      currency: 'VND',
    })
  }

  return (
    <section id="products" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Sản phẩm nổi bật</h2>
          <p className="text-slate-500">Bộ sưu tập thiết bị ZTech mới nhất 2025</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map(p => (
            <div
              key={p.id}
              onClick={(e) => { if (!e.target.closest('button')) viewProduct(p) }}
              className="product-card group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer"
            >
              {/* Image area */}
              <div className={`h-44 bg-gradient-to-br ${p.color} flex items-center justify-center text-6xl relative`}>
                {p.emoji}
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/40 transition-colors">
                  {/* btn-wishlist is the only class on this element — kept free of Tailwind
                      utility classes so dashboard event tools can target it by a single,
                      stable class instead of the full (and volatile) styling className. */}
                  <button
                    id="btn-wishlist"
                    onClick={() => toggleWishlist(p)}
                    className="btn-wishlist"
                    style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Heart
                      size={16}
                      className={wishlist.includes(p.id) ? 'fill-red-500 text-red-500' : 'text-white'}
                    />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">{p.category}</div>
                <h3 className="font-bold text-slate-900 mb-1">{p.name}</h3>
                <p className="text-sm text-slate-500 mb-3">{p.desc}</p>
                <div className="font-bold text-blue-600 text-lg mb-4">{fmt(p.price)}</div>

                <div className="flex gap-2">
                  <div className="btn-add-to-cart flex-1" style={{ display: 'contents' }}>
                    <button
                      onClick={() => addToCart(p)}
                      id="btn-add-to-cart"
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-semibold text-sm transition-all ${
                        added[p.id]
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      {added[p.id] ? <><Check size={15} /> Đã thêm</> : <><ShoppingCart size={15} /> Thêm giỏ</>}
                    </button>
                  </div>
                  <button
                    onClick={() => viewProduct(p)}
                    id="btn-view-product"
                    className="btn-view-product flex items-center justify-center gap-1.5 px-3 h-10 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors text-sm"
                  >
                    <Eye size={16} /> Xem
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product detail modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => {
            // Defer unmount so ztracker's document-level click listener can still
            // traverse the clicked element's parent chain before React detaches it
            // (same race as CartModal's close — see App.jsx handleCheckout).
            setTimeout(() => setSelected(null), 0)
          }}
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className={`h-48 bg-gradient-to-br ${selected.color} rounded-xl flex items-center justify-center text-7xl mb-4`}>
              {selected.emoji}
            </div>
            <h3 className="text-xl font-bold mb-1">{selected.name}</h3>
            <p className="text-slate-500 mb-2">{selected.desc}</p>
            <div className="text-2xl font-bold text-blue-600 mb-4">{fmt(selected.price)}</div>
            <div className="flex gap-3">
              <button
                id="btn-add-to-cart"
                onClick={() => { addToCart(selected); setTimeout(() => setSelected(null), 0) }}
                className="btn-add-to-cart flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                Thêm vào giỏ hàng
              </button>
              <div className="w-12 h-12 border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50">
                <button
                  id="btn-wishlist"
                  onClick={() => toggleWishlist(selected)}
                  className="btn-wishlist"
                  style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Heart size={20} className={wishlist.includes(selected.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
