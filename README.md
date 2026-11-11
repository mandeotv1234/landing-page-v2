# landing-page-v2

Bản sao của `landing-page` (demo ZTech) dùng để test gắn **Zalo Pixel qua Google Tag
Manager** thay vì gọi SDK/`ztrq` trực tiếp trong code.

- Setup GTM từ đầu: [`GTM-DATALAYER-GUIDE.md`](GTM-DATALAYER-GUIDE.md)
- Danh sách 17 standard event, id/class/nội dung từng nút: [`PIXEL-EVENTS.md`](PIXEL-EVENTS.md)
- GTM custom tag template dùng chung: `../zalo-pixel-gtm-template/`

## Chạy local

```bash
npm install
npm run dev
```

## Khác biệt duy nhất so với `landing-page`

`src/hooks/usePixel.js` push `window.dataLayer` thay vì gọi `ZaloAdsPixel.track()`. Toàn
bộ UI, component, id/class/nội dung nút giữ nguyên — xem `GTM-DATALAYER-GUIDE.md` để biết
container GTM cần cấu hình gì để thực sự fire pixel từ các dataLayer push này.
