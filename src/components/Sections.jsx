import { useState } from 'react'
import { MapPin, Calendar, Mail, Users, Gift, Briefcase, Palette, ChevronDown } from 'lucide-react'

const COLORS = [
  { name: 'Đen Titan', hex: '#374151' },
  { name: 'Xanh Biển', hex: '#2563eb' },
  { name: 'Trắng Ngọc', hex: '#f1f5f9' },
  { name: 'Vàng Gold', hex: '#d97706' },
]
const STORAGES = ['128GB', '256GB', '512GB', '1TB']

export default function Sections({ fire }) {
  const [color, setColor] = useState(COLORS[0])
  const [storage, setStorage] = useState(STORAGES[1])
  const [leadDone, setLeadDone] = useState(false)
  const [regDone, setRegDone] = useState(false)
  const [subDone, setSubDone] = useState(false)
  const [donateDone, setDonateDone] = useState(false)
  const [applyDone, setApplyDone] = useState(false)
  const [leadForm, setLeadForm] = useState({ name: '', phone: '' })
  const [regForm, setRegForm] = useState({ email: '', pass: '' })
  const [subEmail, setSubEmail] = useState('')
  const [applyForm, setApplyForm] = useState({ name: '', province: '' })

  const handleCustomize = (type, value) => {
    if (type === 'color') setColor(value)
    if (type === 'storage') setStorage(value)
    fire('CustomizeProduct', {
      content_id: 'sp001',
      content_name: 'ZPhone Pro 15',
      content_type: 'product',
    })
  }

  // Cac setXDone(true) ben duoi unmount chinh form/button vua duoc bam (swap sang thong bao
  // thanh cong) — defer qua setTimeout(0) de listener click cap document cua ztracker kip
  // chay xong truoc khi React detach DOM (cung race da fix o App.jsx/Products.jsx).
  const handleLead = (e) => {
    e.preventDefault()
    fire('Lead', { content_name: 'Đăng ký tư vấn miễn phí', value: 500000, currency: 'VND' })
    setTimeout(() => setLeadDone(true), 0)
  }

  const handleSchedule = () => fire('Schedule', { content_name: 'Đặt lịch tư vấn tại cửa hàng' })

  const handleLocation = () => fire('FindLocation', { content_name: 'Tìm cửa hàng gần nhất' })

  const handleRegister = (e) => {
    e.preventDefault()
    fire('CompleteRegistration', { content_id: 'membership', content_name: 'Đăng ký thành viên ZTech' })
    setTimeout(() => setRegDone(true), 0)
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    fire('Subscribe', { content_name: 'Đăng ký nhận tin ZTech' })
    setTimeout(() => setSubDone(true), 0)
  }

  const handleDonate = (amount) => {
    fire('Donate', { value: amount, currency: 'VND' })
    setDonateDone(true)
    setTimeout(() => setDonateDone(false), 3000)
  }

  const handleApply = (e) => {
    e.preventDefault()
    fire('SubmitApplication', { content_name: 'Đăng ký đại lý ZTech' })
    setTimeout(() => setApplyDone(true), 0)
  }

  return (
    <>
      {/* Customize section */}
      <section className="py-10 md:py-16 px-4 bg-slate-900 text-white" id="customize">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          {/* Preview — ẩn trên mobile nhỏ */}
          <div className="hidden sm:flex flex-1 justify-center">
            <div
              className="w-40 h-64 md:w-48 md:h-80 rounded-[2.5rem] border-4 border-slate-700 flex items-center justify-center text-6xl shadow-2xl transition-all duration-500"
              style={{ background: `linear-gradient(135deg, ${color.hex}cc, ${color.hex}66)` }}
            >
              📱
            </div>
          </div>

          {/* Controls */}
          <div className="flex-1">
            <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold mb-2">
              <Palette size={16} /> Tùy chỉnh sản phẩm
            </div>
            <h2 className="text-3xl font-bold mb-6">ZPhone Pro 15</h2>

            <div className="mb-6">
              <div className="text-sm text-slate-400 mb-3">Màu sắc — {color.name}</div>
              <div className="flex gap-3">
                {COLORS.map(c => (
                  <button
                    key={c.name}
                    id="btn-customize"
                    onClick={() => handleCustomize('color', c)}
                    className={`btn-customize w-10 h-10 rounded-full border-4 transition-all ${color.name === c.name ? 'border-blue-400 scale-110' : 'border-slate-600'}`}
                    style={{ background: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="text-sm text-slate-400 mb-3">Dung lượng</div>
              <div className="flex gap-3 flex-wrap">
                {STORAGES.map(s => (
                  <button
                    key={s}
                    id="btn-customize"
                    onClick={() => handleCustomize('storage', s)}
                    className={`btn-customize px-5 py-2 rounded-xl border text-sm font-semibold transition-all ${storage === s ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-600 text-slate-300 hover:border-slate-400'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-sm text-slate-400">
              Mỗi lần thay đổi màu hoặc dung lượng sẽ fire event <code className="bg-slate-800 px-2 py-0.5 rounded text-blue-300 text-xs">CustomizeProduct</code>
            </p>
          </div>
        </div>
      </section>

      {/* Contact & Lead */}
      <section id="contact" className="py-10 md:py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Lead form */}
          <div className="bg-slate-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-1">Đăng ký tư vấn miễn phí</h3>
            <p className="text-slate-500 text-sm mb-5">Chuyên gia ZTech sẽ liên hệ trong 30 phút</p>
            {leadDone ? (
              <div className="text-center py-8 text-green-600 font-semibold">
                ✓ Đăng ký thành công! Event <code className="bg-green-50 px-2 py-0.5 rounded text-sm">Lead</code> đã gửi.
              </div>
            ) : (
              <form onSubmit={handleLead} className="space-y-4">
                <input required value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Họ và tên" />
                <input required value={leadForm.phone} onChange={e => setLeadForm({...leadForm, phone: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Số điện thoại" />
                <div className="flex gap-3">
                  <button id="btn-lead" type="submit" className="btn-lead flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                    Gửi yêu cầu tư vấn
                  </button>
                  <button id="btn-schedule" type="button" onClick={handleSchedule}
                    className="btn-schedule flex items-center gap-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-colors text-sm">
                    <Calendar size={16} /> Đặt lịch
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Find location */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-1">Tìm cửa hàng gần nhất</h3>
            <p className="text-slate-500 text-sm mb-5">Trải nghiệm trực tiếp tại hơn 200 cửa hàng ZTech trên toàn quốc</p>
            <div className="space-y-3 mb-6">
              {['Hà Nội — 45 cửa hàng', 'TP. Hồ Chí Minh — 62 cửa hàng', 'Đà Nẵng — 18 cửa hàng'].map(loc => (
                <div key={loc} className="flex items-center gap-3 text-sm text-slate-600">
                  <MapPin size={14} className="text-blue-500 shrink-0" />
                  {loc}
                </div>
              ))}
            </div>
            <button id="btn-find-location" onClick={handleLocation}
              className="btn-find-location w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
              <MapPin size={18} /> Tìm cửa hàng gần tôi
            </button>
          </div>
        </div>
      </section>

      {/* Register + Subscribe */}
      <section className="py-10 md:py-16 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Register */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-2">
              <Users size={16} /> Đăng ký thành viên ZTech
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Tạo tài khoản</h3>
            <p className="text-slate-500 text-sm mb-5">Nhận ưu đãi độc quyền và theo dõi đơn hàng</p>
            {regDone ? (
              <div className="text-center py-6 text-green-600 font-semibold">
                ✓ Đăng ký thành công! Event <code className="bg-green-50 px-2 py-0.5 rounded text-sm">CompleteRegistration</code> đã gửi.
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <input required value={regForm.email} onChange={e => setRegForm({...regForm, email: e.target.value})}
                  type="email"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Email của bạn" />
                <input required value={regForm.pass} onChange={e => setRegForm({...regForm, pass: e.target.value})}
                  type="password"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Mật khẩu (ít nhất 8 ký tự)" />
                <button id="btn-register" type="submit" className="btn-register w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-colors">
                  Tạo tài khoản miễn phí
                </button>
              </form>
            )}
          </div>

          {/* Subscribe + Donate */}
          <div className="space-y-5">
            {/* Subscribe */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-2">
                <Mail size={16} /> Nhận tin ZTech
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Đăng ký nhận thông tin mới nhất</h3>
              {subDone ? (
                <div className="text-green-600 font-semibold text-sm py-2">✓ Cảm ơn bạn! Event <code className="bg-green-50 px-2 py-0.5 rounded">Subscribe</code> đã gửi.</div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <input required value={subEmail} onChange={e => setSubEmail(e.target.value)}
                    type="email"
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="your@email.com" />
                  <button id="btn-subscribe" type="submit" className="btn-subscribe bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm">
                    Đăng ký
                  </button>
                </form>
              )}
            </div>

            {/* Donate */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <div className="flex items-center gap-2 text-amber-600 font-semibold text-sm mb-2">
                <Gift size={16} /> Quỹ ZTech for Education
              </div>
              <p className="text-slate-600 text-sm mb-4">Mỗi đóng góp giúp trao tặng thiết bị công nghệ cho học sinh vùng xa</p>
              <div className="flex gap-2 flex-wrap">
                {[50000, 100000, 200000, 500000].map(amt => (
                  <button key={amt} id="btn-donate" onClick={() => handleDonate(amt)}
                    className={`btn-donate px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${donateDone ? 'border-green-400 text-green-600 bg-green-50' : 'border-amber-300 text-amber-700 hover:bg-amber-100'}`}>
                    {donateDone ? '✓' : ''} {(amt / 1000)}k
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apply as dealer */}
      <section className="py-10 md:py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold text-sm mb-2">
            <Briefcase size={16} /> Đại lý ZTech
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Trở thành đại lý ZTech</h2>
          <p className="text-slate-500 mb-8">Hoa hồng lên đến 15% · Hỗ trợ marketing · Đào tạo sản phẩm miễn phí</p>
          {applyDone ? (
            <div className="text-center py-6 text-green-600 font-semibold">
              ✓ Đơn đăng ký đã gửi! Event <code className="bg-green-50 px-2 py-0.5 rounded">SubmitApplication</code> đã gửi.
            </div>
          ) : (
            <form onSubmit={handleApply} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input required value={applyForm.name} onChange={e => setApplyForm({...applyForm, name: e.target.value})}
                className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tên cửa hàng / doanh nghiệp" />
              <input required value={applyForm.province} onChange={e => setApplyForm({...applyForm, province: e.target.value})}
                className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tỉnh / thành phố" />
              <button id="btn-submit-application" type="submit" className="btn-submit-application bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm whitespace-nowrap">
                Gửi đơn
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
