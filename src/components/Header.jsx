import { useState } from 'react'
import { Search, ShoppingCart, Menu, X, Smartphone } from 'lucide-react'

export default function Header({ fire, cart, onCartOpen }) {
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    fire('Search', { query: query.trim() })
    setQuery('')
  }

  const handleContact = () => {
    fire('Contact', { content_name: 'Hotline 1900 1234', method: 'phone' })
    window.open('tel:19001234')
  }

  const totalQty = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <header className="sticky top-0 z-40 bg-slate-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 text-white font-bold text-xl shrink-0">
          <Smartphone className="text-blue-400" size={22} />
          ZTech
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:flex">
          <div className="relative w-full">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full bg-slate-800 text-white placeholder-slate-400 rounded-lg pl-4 pr-10 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="btn-search absolute right-1.5 top-1/2 -translate-y-1/2" style={{ display: 'contents' }}>
              <button
                type="submit"
                id="btn-search"
                className="flex items-center gap-1 text-slate-400 hover:text-white bg-slate-700/60 hover:bg-slate-700 rounded-md px-2 py-1 text-xs absolute right-1.5 top-1/2 -translate-y-1/2"
              >
                <Search size={13} /> Tìm
              </button>
            </div>
          </div>
        </form>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
          <a href="#products" className="hover:text-white transition-colors">Sản phẩm</a>
          <a href="#contact" className="hover:text-white transition-colors">Liên hệ</a>
          <button id="btn-contact" onClick={handleContact} className="btn-contact hover:text-blue-400 transition-colors">
            1900 1234
          </button>
        </nav>

        {/* Cart */}
        <button
          onClick={onCartOpen}
          className="relative ml-auto text-white hover:text-blue-400 transition-colors"
        >
          <ShoppingCart size={22} />
          {totalQty > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {totalQty}
            </span>
          )}
        </button>

        {/* Mobile menu */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white ml-2">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-slate-800 px-4 py-3 flex flex-col gap-3 text-sm text-slate-300 animate-fade-in">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="flex-1 bg-slate-700 text-white placeholder-slate-400 rounded px-3 py-2 text-sm outline-none"
            />
            <button type="submit" id="btn-search" className="btn-search bg-blue-600 text-white px-3 py-2 rounded text-sm">Tìm</button>
          </form>
          <button id="btn-contact" onClick={handleContact} className="btn-contact text-left hover:text-blue-400">1900 1234</button>
        </div>
      )}
    </header>
  )
}
