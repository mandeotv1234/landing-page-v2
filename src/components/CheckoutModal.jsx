import { useState } from 'react'
import { X, CreditCard, Check } from 'lucide-react'

const fmt = (n) => n.toLocaleString('vi-VN') + ' ₫'

export default function CheckoutModal({ cart, onClose, fire }) {
  const [step, setStep] = useState(1) // 1=info, 2=payment, 3=review, 4=done
  const [form, setForm] = useState({ name: '', phone: '', address: '', card: '', exp: '', cvv: '' })

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const contentId = cart.map(i => i.id).join(',')
  const totalQuantity = cart.reduce((s, i) => s + i.qty, 0)

  // setStep unmounts the step vua submit (swap sang step ke) — defer qua setTimeout(0) de
  // listener click cap document cua ztracker kip chay xong truoc khi React detach DOM.
  const submitInfo = (e) => {
    e.preventDefault()
    setTimeout(() => setStep(2), 0)
  }

  // AddPaymentInfo fire rieng o day — luc the thanh toan vua duoc nhap xong — tach khoi
  // Purchase (chi fire o buoc 3 khi bam "Xac nhan dat hang"). Truoc day ca 2 fire chung
  // 1 nut nen QC khong test rieng tung event duoc.
  const submitPaymentInfo = (e) => {
    e.preventDefault()
    fire('AddPaymentInfo', { currency: 'VND', value: total, content_id: contentId })
    setTimeout(() => setStep(3), 0)
  }

  const confirmPurchase = () => {
    fire('Purchase', {
      currency: 'VND',
      value: total,
      contents: contentId,
      content_type: 'product',
      content_id: contentId,
      quantity: totalQuantity,
    })
    setTimeout(() => setStep(4), 0)
  }

  const steps = ['Thông tin', 'Thanh toán', 'Xác nhận', 'Hoàn tất']

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg animate-slide-up overflow-hidden max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="font-bold text-slate-900">Thanh toán</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
        </div>

        {/* Steps */}
        <div className="flex border-b border-slate-200">
          {steps.map((s, i) => (
            <div key={s} className={`flex-1 py-3 text-center text-sm font-semibold transition-colors ${step === i + 1 ? 'text-blue-600 border-b-2 border-blue-600' : step > i + 1 ? 'text-green-600' : 'text-slate-400'}`}>
              {step > i + 1 ? '✓ ' : ''}{s}
            </div>
          ))}
        </div>

        <div className="p-5">
          {/* Step 1: Info */}
          {step === 1 && (
            <form onSubmit={submitInfo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nguyễn Văn A" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
                <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="09xxxxxxxx" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Địa chỉ giao hàng</label>
                <input required value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Số nhà, đường, quận, thành phố" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-slate-900">Tổng: <span className="text-blue-600">{fmt(total)}</span></span>
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                  Tiếp theo →
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <form onSubmit={submitPaymentInfo} className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">
                <CreditCard size={18} className="text-blue-500" />
                Thanh toán thẻ tín dụng / ghi nợ
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Số thẻ</label>
                <input required value={form.card} onChange={e => setForm({...form, card: e.target.value})}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="0000 0000 0000 0000" maxLength={19} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ngày hết hạn</label>
                  <input required value={form.exp} onChange={e => setForm({...form, exp: e.target.value})}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="MM/YY" maxLength={5} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
                  <input required value={form.cvv} onChange={e => setForm({...form, cvv: e.target.value})}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="***" maxLength={3} type="password" />
                </div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <button type="button" onClick={() => setTimeout(() => setStep(1), 0)} className="text-slate-500 hover:text-slate-800 text-sm">← Quay lại</button>
                <button id="btn-add-payment-info" type="submit" className="btn-add-payment-info bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                  Lưu thẻ & xem lại đơn →
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Review & confirm — Purchase chi fire o day, tach rieng khoi AddPaymentInfo */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">
                <Check size={18} className="text-green-500" />
                Đã lưu thông tin thẻ, kiểm tra lại đơn hàng trước khi xác nhận
              </div>
              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between px-4 py-3 text-sm">
                    <span className="text-slate-700">{item.name} <span className="text-slate-400">x{item.qty}</span></span>
                    <span className="font-semibold text-slate-900">{fmt(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2">
                <button type="button" onClick={() => setTimeout(() => setStep(2), 0)} className="text-slate-500 hover:text-slate-800 text-sm">← Quay lại</button>
                <span className="font-bold text-slate-900">Tổng: <span className="text-blue-600">{fmt(total)}</span></span>
              </div>
              <button id="btn-purchase" onClick={confirmPurchase} className="btn-purchase w-full bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                Xác nhận đặt hàng {fmt(total)}
              </button>
            </div>
          )}

          {/* Step 4: Done */}
          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={40} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Đặt hàng thành công!</h3>
              <p className="text-slate-500 mb-2">Cảm ơn bạn đã mua hàng tại ZTech.</p>
              <p className="text-sm text-slate-400 mb-6">Sự kiện <code className="bg-slate-100 px-2 py-0.5 rounded text-xs">Purchase</code> đã được ghi nhận.</p>
              <button onClick={onClose} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
                Đóng
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
