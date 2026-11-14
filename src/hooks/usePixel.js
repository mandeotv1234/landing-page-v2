import { useCallback } from 'react'

export const PIXEL_ID = '7525140531349815296'

// landing-page-v2 KHÔNG gọi SDK/ztrq trực tiếp — pixel được gắn hoàn toàn qua
// Google Tag Manager (xem GTM-DATALAYER-GUIDE.md). fire() chỉ push dataLayer;
// container GTM mới là nơi quyết định có fire ztracker.js hay không, dùng tag
// "Zalo Pixel" (zalo-pixel-gtm-template, template.tpl).
//
// Theo đúng cách Meta Pixel / TikTok Pixel làm qua GTM (GTM template chính thức
// của họ đọc thẳng từ dataLayer ecommerce chuẩn GA4 thay vì bắt web push riêng 1
// schema cho từng vendor): với 9 event có tên chuẩn GA4 tương đương, dataLayer
// `event` dùng đúng tên GA4 đó + kèm object `ecommerce` lồng nhau — để sau này
// nếu site thêm GA4/Meta/TikTok, các tag đó dùng chung được luôn, không cần
// code thêm gì ở web. 8 event còn lại (không có tên GA4 tương ứng) vẫn push
// thẳng tên gốc Zalo làm `event`, như Meta/TikTok vẫn làm với custom event
// không thuộc danh sách chuẩn của họ.
//
// Field phẳng (content_id, value, currency, quantity, contents...) GIỮ NGUYÊN
// không đổi — tag Zalo Pixel của mình chỉ đọc từ các field phẳng này, không
// đọc `ecommerce` (field đó chỉ để tool khác dùng sau này).
const GA4_EVENT_MAP = {
  ViewContent: 'view_item',
  AddToCart: 'add_to_cart',
  AddToWishlist: 'add_to_wishlist',
  InitiateCheckout: 'begin_checkout',
  AddPaymentInfo: 'add_payment_info',
  Purchase: 'purchase',
  Lead: 'generate_lead',
  CompleteRegistration: 'sign_up',
  Search: 'search',
}

// GTM's dataLayer là 1 model được MERGE qua từng lần push — key không redefine ở lần
// push sau vẫn đọc ra giá trị CŨ từ lần push trước (đây là lý do convention ecommerce
// của GA4 luôn push {ecommerce: null} trước mỗi event mới). Nếu chỉ spread ...params
// như cũ, event không có 'currency'/'value' (vd. Contact) có thể vô tình đọc nhầm giá
// trị còn sót của event trước đó (vd. AddToCart) qua DLV - zp_currency/zp_value.
// Reset toàn bộ field về null trước, rồi mới ghi đè bằng params thật của event này.
const PARAM_KEYS = [
  'content_id', 'content_name', 'content_type', 'content_category',
  'currency', 'value', 'price', 'quantity', 'query', 'contents',
]

function buildEcommerce(zaloEventName, params) {
  if (!GA4_EVENT_MAP[zaloEventName]) return null
  // contents là chuỗi mã sản phẩm phân cách dấu phẩy ('401,402' — đúng theo tài liệu
  // zalo-ads-v2: "Danh sách mã trang hoặc mã sản phẩm, phân cách bằng dấu phẩy"), không
  // phải mảng — tách ra để map sang item_id cho ecommerce.items.
  const items = params.contents
    ? params.contents.split(',').map((id) => ({ item_id: id }))
    : params.content_id
      ? [{ item_id: params.content_id, item_name: params.content_name, quantity: params.quantity ?? 1 }]
      : null
  return {
    currency: params.currency ?? null,
    value: params.value ?? null,
    items,
  }
}

export function usePixel() {
  const fire = useCallback((zaloEventName, params = {}) => {
    window.dataLayer = window.dataLayer || []
    const reset = Object.fromEntries(PARAM_KEYS.map((key) => [key, null]))
    window.dataLayer.push({
      event: GA4_EVENT_MAP[zaloEventName] || zaloEventName,
      zp_event_name: zaloEventName,
      ...reset,
      ...params,
      ecommerce: buildEcommerce(zaloEventName, params),
    })
  }, [])

  return { fire }
}
