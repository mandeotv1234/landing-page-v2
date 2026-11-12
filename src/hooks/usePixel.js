import { useCallback } from 'react'

export const PIXEL_ID = '7525140531349815296'

// landing-page-v2 KHÔNG gọi SDK/ztrq trực tiếp — pixel được gắn hoàn toàn qua
// Google Tag Manager (xem GTM-DATALAYER-GUIDE.md). fire() chỉ push một event
// chuẩn vào dataLayer; container GTM mới là nơi quyết định có fire ztracker.js
// hay không, dùng tag "Zalo Pixel" (zalo-pixel-gtm-template, template.tpl).
//
// Payload khớp đúng tên dataLayer variable trong GTM-SETUP.md:
// zp_event_name, zp_pixel_id, value, currency, content_id, content_name,
// content_type, quantity, query, contents (mảng {id, quantity}).
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

export function usePixel() {
  const fire = useCallback((eventName, params = {}) => {
    window.dataLayer = window.dataLayer || []
    const reset = Object.fromEntries(PARAM_KEYS.map((key) => [key, null]))
    window.dataLayer.push({
      event: 'zp_track',
      zp_event_name: eventName,
      zp_pixel_id: PIXEL_ID,
      ...reset,
      ...params,
    })
  }, [])

  return { fire }
}
