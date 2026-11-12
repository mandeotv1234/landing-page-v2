import { useState, useEffect } from 'react'
import { usePixel } from './hooks/usePixel'
import Header from './components/Header'
import Hero from './components/Hero'
import Products from './components/Products'
import CartModal from './components/CartModal'
import CheckoutModal from './components/CheckoutModal'
import Sections from './components/Sections'

// Không còn ZaloAdsPixel.init() ở đây — ztracker.js được GTM container tự tải
// qua tag "Zalo Pixel — Initialize" (Initialization - All Pages trigger). Xem
// GTM-DATALAYER-GUIDE.md để cấu hình container. usePixel() chỉ push dataLayer.

export default function App() {
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  const { fire } = usePixel()

  useEffect(() => {
    fire('ViewContent', {
      content_id: 'home',
      content_name: 'ZTech Homepage',
      content_type: 'product',
    })
  }, [])

  const handleCheckout = () => {
    // Defer unmount so ztracker's document-level click listener can still
    // traverse #btn-initiate-checkout's parent chain before React detaches it.
    // React 18 (createRoot) commits setShowCart synchronously at div#root BEFORE
    // the click event reaches document, leaving t.target detached → infinite loop.
    setTimeout(() => setShowCart(false), 0)
    setShowCheckout(true)
    fire('InitiateCheckout', {
      content_id: cart.map(i => i.id).join(','),
      value: cart.reduce((s, i) => s + i.price * i.qty, 0),
      currency: 'VND',
      contents: cart.map(i => i.name),
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header fire={fire} cart={cart} onCartOpen={() => setShowCart(true)} />

      <main>
        <Hero fire={fire} />
        <Products fire={fire} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />
        <Sections fire={fire} />
      </main>

      <footer className="bg-slate-900 text-slate-400 text-center text-sm py-8 px-4">
        <div className="text-white font-bold text-lg mb-1">ZTech</div>
        <p className="mb-1">Demo landing page — Zalo Pixel qua Google Tag Manager</p>
        <p className="text-xs text-slate-500">Mọi sự kiện chỉ push dataLayer; pixel được fire hoàn toàn từ container GTM</p>
      </footer>

      {showCart && (
        <CartModal
          cart={cart}
          setCart={setCart}
          // Defer unmount so ztracker's document-level click listener can still
          // traverse the clicked element's parent chain before React detaches it.
          onClose={() => setTimeout(() => setShowCart(false), 0)}
          onCheckout={handleCheckout}
        />
      )}
      {showCheckout && (
        <CheckoutModal
          cart={cart}
          onClose={() => setTimeout(() => { setShowCheckout(false); setCart([]) }, 0)}
          fire={fire}
        />
      )}

    </div>
  )
}
