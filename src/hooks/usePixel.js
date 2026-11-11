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
export function usePixel() {
  const fire = useCallback((eventName, params = {}) => {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'zp_track',
      zp_event_name: eventName,
      zp_pixel_id: PIXEL_ID,
      ...params,
    })
  }, [])

  return { fire }
}
