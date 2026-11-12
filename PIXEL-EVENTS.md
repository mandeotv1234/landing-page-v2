# Pixel Standard Events — landing-page-v2

> **landing-page-v2 fire qua GTM, không gọi SDK trực tiếp.** Mọi lời gọi `fire(name, params)`
> dưới đây giờ push `window.dataLayer` — theo đúng cách Meta/TikTok Pixel làm qua GTM: 9
> event có tên chuẩn GA4 tương đương push `event` bằng tên đó (`view_item`, `add_to_cart`,
> ...) kèm object `ecommerce` lồng nhau; 8 event còn lại push thẳng tên gốc Zalo làm
> `event`. Field `zp_event_name` (tên gốc Zalo, PascalCase) luôn có mặt ở mọi push — xem
> `src/hooks/usePixel.js` và `GTM-DATALAYER-GUIDE.md`. Bảng id/class/nội dung bên dưới
> **không đổi** (UI/component giống hệt bản gốc dùng SDK), chỉ cơ chế fire phía dưới khác.

Ghi lại đầy đủ 17 standard event (theo `STANDARD_EVENT_NAMES` của `adtima-ztracker`,
khớp danh sách custom code ở zalo-ads-v2) đang được landing-page này fire, cách trigger
trên web, param đi kèm, và id/class/nội dung để cấu hình Event Builder (dashboard
zalo-ads-v2) theo webElement — **hoặc để cấu hình GTM Click Trigger** (Click ID/Click Classes
built-in variables khớp y hệt cột id/class bên dưới, xem GTM-DATALAYER-GUIDE.md).

Quy ước chung:
- Mọi event được `fire()` push vào `dataLayer` — luôn submit dù Event Builder có cấu hình
  hay chưa khớp (xem ghi chú ở AI-workflow về `UNDECLARED_EVENT_ID`). Phần id/class/nội
  dung dưới đây phục vụ **2 việc độc lập**: (1) khớp qua webElement click-detection của
  Zalo Ads Manager (nếu KHÔNG dùng GTM), hoặc (2) cấu hình Click Trigger trong GTM (nếu
  dùng GTM) — **chỉ chọn một**, đừng bật cả hai cho cùng 1 event (xem cảnh báo trùng event
  trong `zalo-pixel-gtm-template/README.md`).
- Cột "Nội dung" lấy theo `Helpers.Browser.getOwnTextOnly()` của ztracker — **chỉ tính text
  node là con trực tiếp** của phần tử (không tính text nằm trong span/icon con cháu). Nút
  chỉ có icon (không có text node trực tiếp) sẽ ghi "— (icon-only)".
- id/class dùng nguyên văn, không lẫn với class Tailwind khác — nếu phần tử gốc có nhiều
  class Tailwind, đã bọc thêm 1 `<div style={{display:'contents'}}>` mang riêng class đó
  (không ảnh hưởng layout) để Event Builder tự pick ra đúng 1 token duy nhất.

## Bảng tổng hợp

| # | Event | File / hàm | Cách trigger trên web | Param fire() | id | class | Nội dung |
|---|---|---|---|---|---|---|---|
| 1 | `AddPaymentInfo` | `CheckoutModal.jsx` → `submitPaymentInfo` | Checkout modal bước 2 (Thanh toán), nhập xong số thẻ/ngày hết hạn/CVV rồi bấm "Lưu thẻ & xem lại đơn →" — **nút riêng, không trùng với `Purchase`** | `{ currency, value, content_id }` | `btn-add-payment-info` | `btn-add-payment-info` | "Lưu thẻ & xem lại đơn →" |
| 2 | `AddToCart` | `Products.jsx` → `addToCart` | Bấm "Thêm giỏ" ở card sản phẩm, hoặc "Thêm vào giỏ hàng" trong modal chi tiết | `{ content_id, content_type, quantity, value, currency }` | `btn-add-to-cart` | `btn-add-to-cart` | "Thêm giỏ" (card) / "Thêm vào giỏ hàng" (modal) |
| 3 | `AddToWishlist` | `Products.jsx` → `toggleWishlist` | Bấm icon trái tim ở card sản phẩm hoặc modal chi tiết | `{ content_id, contents }` | `btn-wishlist` | `btn-wishlist` | — (icon-only) |
| 4 | `CompleteRegistration` | `Sections.jsx` → `handleRegister` | Form "Tạo tài khoản", bấm "Tạo tài khoản miễn phí" | `{ content_id: 'membership', content_name: 'Đăng ký thành viên ZTech' }` | `btn-register` | `btn-register` | "Tạo tài khoản miễn phí" |
| 5 | `Contact` | `Header.jsx` → `handleContact` | Bấm số điện thoại "1900 1234" (nav desktop hoặc menu mobile) | `{ content_name: 'Hotline 1900 1234', method: 'phone' }` | `btn-contact` | `btn-contact` | "1900 1234" |
| 6 | `CustomizeProduct` | `Sections.jsx` → `handleCustomize` | Section "Tùy chỉnh sản phẩm": bấm đổi màu (4 nút tròn) hoặc đổi dung lượng (4 nút 128GB/256GB/512GB/1TB) | `{ content_id: 'sp001', content_name: 'ZPhone Pro 15', content_type: 'product' }` | `btn-customize` | `btn-customize` | — (nút màu, icon-only) / "128GB"...`1TB` (nút dung lượng, có text) |
| 7 | `Donate` | `Sections.jsx` → `handleDonate` | Section "Quỹ ZTech for Education", bấm 1 trong 4 mức tiền (50k/100k/200k/500k) | `{ value, currency: 'VND' }` | `btn-donate` | `btn-donate` | "50k" / "100k" / "200k" / "500k" |
| 8 | `FindLocation` | `Sections.jsx` → `handleLocation` | Bấm "Tìm cửa hàng gần tôi" | `{ content_name: 'Tìm cửa hàng gần nhất' }` | `btn-find-location` | `btn-find-location` | "Tìm cửa hàng gần tôi" |
| 9 | `InitiateCheckout` | `App.jsx` → `handleCheckout` | Mở giỏ hàng (icon cart ở header) → bấm "Tiến hành thanh toán" | `{ content_id, value, currency, contents }` | `btn-initiate-checkout` | `btn-initiate-checkout` | "Tiến hành thanh toán" |
| 10 | `Lead` | `Sections.jsx` → `handleLead` | Form "Đăng ký tư vấn miễn phí", bấm "Gửi yêu cầu tư vấn" | `{ content_name: 'Đăng ký tư vấn miễn phí', value: 500000, currency: 'VND' }` | `btn-lead` | `btn-lead` | "Gửi yêu cầu tư vấn" |
| 11 | `Purchase` | `CheckoutModal.jsx` → `confirmPurchase` | Checkout modal bước 3 (Xác nhận, màn review đơn hàng mới), bấm "Xác nhận đặt hàng ..." — **nút riêng, sau khi `AddPaymentInfo` đã fire ở bước 2** | `{ currency, value, contents, content_type, content_id, quantity }` | `btn-purchase` | `btn-purchase` | "Xác nhận đặt hàng {giá}" |
| 12 | `Schedule` | `Sections.jsx` → `handleSchedule` | Bấm "Đặt lịch" (cạnh form tư vấn) | `{ content_name: 'Đặt lịch tư vấn tại cửa hàng' }` | `btn-schedule` | `btn-schedule` | "Đặt lịch" |
| 13 | `Search` | `Header.jsx` → `handleSearch` | Gõ từ khoá rồi bấm nút "Tìm" (desktop, cạnh ô input) hoặc nút "Tìm" (menu mobile), hoặc Enter trong ô input | `{ query }` | `btn-search` | `btn-search` | "Tìm" |
| 14 | `StartTrial` | `Hero.jsx` → `handleStartTrial` | Bấm "Dùng thử 30 ngày" | `{ content_id: 'trial-zphone-pro-15', content_name: 'Dùng thử 30 ngày' }` | `btn-start-trial` | `btn-start-trial` | "Dùng thử 30 ngày" |
| 15 | `SubmitApplication` | `Sections.jsx` → `handleApply` | Form "Trở thành đại lý ZTech", bấm "Gửi đơn" | `{ content_name: 'Đăng ký đại lý ZTech' }` | `btn-submit-application` | `btn-submit-application` | "Gửi đơn" |
| 16 | `Subscribe` | `Sections.jsx` → `handleSubscribe` | Form "Nhận tin ZTech", bấm "Đăng ký" | `{ content_name: 'Đăng ký nhận tin ZTech' }` | `btn-subscribe` | `btn-subscribe` | "Đăng ký" |
| 17 | `ViewContent` | 3 chỗ khác nhau — xem bên dưới | — | — | — | — | — |

### `ViewContent` — 3 trigger riêng biệt

1. **Tải trang chủ** (`App.jsx`, `useEffect` chạy 1 lần lúc mount) — `{ content_id: 'home', content_name: 'ZTech Homepage', content_type: 'product' }`. **Không có phần tử trigger** (tự fire lúc load trang, không qua click) → không cấu hình được webElement cho case này, chỉ tồn tại dưới dạng custom code.
2. **Anchor "Khám phá ngay"** ở Hero (`Hero.jsx`) — `{ content_id: 'products', content_name: 'Danh sách sản phẩm', content_type: 'product' }`. id/class: `btn-view-content-hero`. Nội dung: "Khám phá ngay".
3. **Xem chi tiết sản phẩm** (`Products.jsx` → `viewProduct`) — bấm nút "Xem" ở card HOẶC bấm bất kỳ đâu trên card (trừ nút) — `{ content_id, content_name, content_type, value, currency }`. id/class nút "Xem": `btn-view-product` (text "Xem"). Cả card sản phẩm còn có class dùng chung `product-card` (không có id/text riêng vì lặp lại theo từng sản phẩm).

## Những chỗ không có đủ cả 3 cách trigger (id + class + nội dung)

Một số phần tử là icon/swatch nhỏ, không có chỗ hiển thị text mà không phá layout —
id/class vẫn đầy đủ, chỉ thiếu nội dung:

- `AddToWishlist` (`btn-wishlist`) — icon trái tim 32-48px, không đủ chỗ chèn text.
- `CustomizeProduct` nút màu (`btn-customize`, 4 nút tròn 40px) — chỉ có `title` attribute
  (không tính là text node), không đủ chỗ chèn text. Nút dung lượng (cũng `btn-customize`)
  thì có đủ text (128GB/256GB/...).
- `ViewContent` lúc tải trang chủ — không qua click nên không có phần tử nào để gắn
  id/class/text.

## Lưu ý param

- Đã rà soát lại từng event với `SUGGESTED_PARAMS` trong `zalo-ads-v2`
  (`src/app/modules/pixel/services/event-template.service.ts`, cũng chính là default khi
  dashboard sinh custom-code snippet — `snippet-builder.service.ts` + `event-setup-modal
  .component.ts`) cho 8 event có khai báo sẵn: `ViewContent`, `AddToCart`, `AddToWishlist`,
  `InitiateCheckout`, `AddPaymentInfo`, `Purchase`, `Lead`, `Search`. Đủ hết — đã bổ sung
  `content_id` cho `InitiateCheckout`/`AddPaymentInfo` và `content_id`+`quantity` cho
  `Purchase` (trước đó thiếu, dùng `contents` thay thế nhưng suggested vẫn muốn
  `content_id` riêng — nay có cả 2, `content_id` là chuỗi id sản phẩm trong giỏ nối dấu
  phẩy). Các event còn lại (`Contact`, `CompleteRegistration`, `CustomizeProduct`, `Donate`,
  `FindLocation`, `Schedule`, `StartTrial`, `SubmitApplication`, `Subscribe`) không có
  suggested params trong zalo-ads-v2 (tất cả 10 param đều optional, không event nào bắt
  buộc theo code), nên dùng `content_name`/`content_id` + `value`/`currency` khi hợp lý
  (đã áp dụng ở trên).
- **Không gửi PII thô** (tên/SĐT/email người dùng nhập ở form) lên pixel — các form Lead/
  Register/Subscribe/Apply chỉ gửi metadata mô tả hành động, không gửi giá trị người dùng
  gõ vào input.
- `contents` là **mảng string tên sản phẩm** (vd. `['ZPhone Pro 15', 'ZBuds Pro 3']`),
  không phải mảng object `{id, quantity}` — dùng cho `AddToWishlist`, `InitiateCheckout`,
  `Purchase`. `content_id` (chuỗi id nối dấu phẩy) và `quantity` (tổng số lượng) gửi riêng.
  Field `contents` trong `template.tpl` là TEXT (gán biến `{{DLV - zp_contents}}`), không
  phải SIMPLE_TABLE — xem `GTM-DATALAYER-GUIDE.md`.
