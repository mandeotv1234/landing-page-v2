import { X, Minus, Plus, Trash2 } from 'lucide-react'

const fmt = (n) => n.toLocaleString('vi-VN') + ' ₫'

export default function CartModal({ cart, setCart, onClose, onCheckout }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)

  const updateQty = (id, delta) => {
    // Khi delta dua qty ve 0, dong setCart ben duoi xoa luon item (va nut vua bam) khoi DOM —
    // defer qua setTimeout(0) de listener click cap document cua ztracker kip chay xong truoc
    // khi React detach DOM (cung race da fix o App.jsx/Products.jsx/CheckoutModal.jsx).
    setTimeout(() => {
      setCart(prev => prev.map(i => i.id === id
        ? { ...i, qty: Math.max(0, i.qty + delta) }
        : i
      ).filter(i => i.qty > 0))
    }, 0)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white w-full sm:max-w-md h-full flex flex-col animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Giỏ hàng ({cart.length} sản phẩm)</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-slate-400 py-16">
              <div className="text-5xl mb-3">🛒</div>
              <p>Giỏ hàng trống</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
              <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-2xl shrink-0`}>
                {item.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900 text-sm truncate">{item.name}</div>
                <div className="text-blue-600 font-bold text-sm">{fmt(item.price)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-100">
                  {item.qty === 1 ? <Trash2 size={12} className="text-red-400" /> : <Minus size={12} />}
                </button>
                <span className="w-6 text-center font-bold text-sm">{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-100">
                  <Plus size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-200 space-y-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Tổng cộng</span>
              <span className="text-blue-600">{fmt(total)}</span>
            </div>
            <button
              id="btn-initiate-checkout"
              onClick={onCheckout}
              className="btn-initiate-checkout w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-colors text-lg"
            >
              Tiến hành thanh toán
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
