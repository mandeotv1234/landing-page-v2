# Hướng dẫn gắn Zalo Pixel vào landing-page-v2 qua Google Tag Manager

Repo này là bản sao của `landing-page` (ZTech demo), nhưng **không gọi SDK/`ztrq` trực
tiếp trong code** — toàn bộ việc fire pixel được chuyển hẳn sang Google Tag Manager (GTM),
dùng custom tag template `zalo-pixel-gtm-template` (repo cạnh bên,
`../zalo-pixel-gtm-template/template.tpl`).

```
landing-page-v2 (React)
  └─ usePixel().fire(zaloEventName, params)
        └─ window.dataLayer.push({ event: GA4_NAME_or_zaloEventName, zp_event_name, ...params, ecommerce })
              └─ GTM Trigger: Custom Event, regex khớp 1 trong 17 tên
                    └─ GTM Tag: Zalo Pixel — Track Event  (template.tpl, Pixel V2, đọc zp_event_name + field phẳng)
                          └─ ztracker.js → dev-log.adtima.vn/ptrck/log
```

Việc **duy nhất** code JS làm là push dataLayer — không biết gì về `ztracker.js`,
`dev-adtima-static.zdn.vn`, hay `dev-log.adtima.vn`. Toàn bộ quyết định "fire cái gì, khi nào" nằm
trong container GTM, cấu hình qua giao diện, không cần sửa code mỗi khi đổi trigger.

---

## Checklist

```
[ ] Bước 1 — Tạo container GTM, thay GTM-XXXXXXX trong index.html
[ ] Bước 2 — Import template.tpl
[ ] Bước 3 — Tạo biến (1 Constant + 10 Data Layer Variable)
[ ] Bước 4 — Tạo 2 Trigger
[ ] Bước 5 — Tạo Tag Initialize + Tag Track Event (Tag Sequencing)
[ ] Bước 6 — Preview mode trên localhost
[ ] Bước 7 — Publish + lọc traffic bot gtm-msr.appspot.com
[ ] Bước 8 — Verify trên Network + dataLayer console
```

---

## Bước 1 — Tạo container GTM

1. [tagmanager.google.com](https://tagmanager.google.com) → **Create Account** → chọn
   container type **Web**.
2. Copy container ID (dạng `GTM-XXXXXXX`), dán đè vào **2 chỗ** trong `index.html` của repo
   này (đoạn `<script>` trong `<head>` và `<iframe>` trong `<noscript>` ngay sau `<body>`) —
   đây là snippet chuẩn Google đưa ra khi tạo container, đừng tự viết lại.

> Container GTM độc lập với Pixel ID của Zalo — container quản lý toàn bộ tag trên site
> (có thể có GA4, Ads conversion... khác), pixel chỉ là 1 tag bên trong.

## Bước 2 — Import Custom Template

1. Trong GTM: **Templates (Mẫu) → Tag Templates (Mẫu thẻ) → New (Mới)**
2. Menu ⋮ góc trên phải → **Import** → chọn file
   `../zalo-pixel-gtm-template/template.tpl`
3. **Save**

(Khi template đã publish lên Community Template Gallery, có thể thay bằng
**Search Gallery** → tìm "Zalo Pixel" thay vì import file thủ công.)

## Bước 3 — Tạo biến (Variables)

### 3a. Biến hằng — Pixel ID

**Variables → User-Defined Variables → New → Constant**
- Tên: `Zalo Pixel ID`
- Giá trị: `7525140531349815296` (khớp `PIXEL_ID` trong `src/hooks/usePixel.js`)

### 3b. Biến lớp dữ liệu (Data Layer Variable)

**Variables → User-Defined Variables → New → Data Layer Variable**, tạo đủ 9 biến —
tên và version phải khớp chính xác với payload mà `usePixel.js` push:

| Tên biến GTM | Tên biến lớp dữ liệu | Giá trị mặc định |
|---|---|---|
| `DLV - zp_event_name` | `zp_event_name` | *(để trống)* |
| `DLV - zp_value` | `value` | `0` |
| `DLV - zp_currency` | `currency` | `VND` |
| `DLV - zp_content_id` | `content_id` | *(để trống)* |
| `DLV - zp_content_name` | `content_name` | *(để trống)* |
| `DLV - zp_content_type` | `content_type` | *(để trống)* |
| `DLV - zp_quantity` | `quantity` | *(để trống)* |
| `DLV - zp_query` | `query` | *(để trống — bắt buộc cho `Search`)* |
| `DLV - zp_contents` | `contents` | *(để trống — chuỗi mã sản phẩm phân cách dấu phẩy)* |

Mỗi biến: chọn **Data Layer Version 2**. Không cần biến đọc Pixel ID từ dataLayer — Pixel
ID luôn lấy từ biến Constant `{{Zalo Pixel ID}}` ở mọi tag, `usePixel.js` không push
`zp_pixel_id` nữa.

> `contents` là field **TEXT** trong `template.tpl` (không phải SIMPLE_TABLE, SIMPLE_TABLE
> không gán biến được) — gán thẳng `{{DLV - zp_contents}}` vào field `contents` dưới mục
> "Custom event parameters" của tag Track Event. `usePixel.js` push `contents` là **chuỗi
> mã sản phẩm phân cách dấu phẩy** (vd. `'sp001,sp002'`) — đúng theo tài liệu zalo-ads-v2
> ("Danh sách mã trang hoặc mã sản phẩm, phân cách bằng dấu phẩy") — không phải mảng, xem
> `src/components/Products.jsx`/`CheckoutModal.jsx`.

> **Giống cách Meta/TikTok Pixel làm qua GTM:** `usePixel.js` push dataLayer `event` bằng
> **tên chuẩn GA4** cho 9 event có tương đương (`view_item`, `add_to_cart`,
> `add_to_wishlist`, `begin_checkout`, `add_payment_info`, `purchase`, `generate_lead`,
> `sign_up`, `search`), kèm object `ecommerce: {currency, value, items}` lồng nhau theo
> đúng chuẩn GA4 ecommerce — để sau này site có thêm tag GA4/Meta/TikTok thì dùng chung
> được pushes này, không cần code thêm. Tag Zalo Pixel ở đây **không đọc `ecommerce`**, chỉ
> đọc các biến phẳng `DLV - zp_*` ở trên (không đổi) — `zp_event_name` luôn có mặt dù
> `event` là tên GA4 hay tên gốc Zalo, nên Custom event name của tag vẫn dùng
> `{{DLV - zp_event_name}}` như cũ, không cần Lookup Table.

## Bước 4 — Tạo Trigger

### Trigger 1 — Initialization

- Loại: **Initialization — All Pages**
- Tên: `Trigger - Initialization - All Pages`

### Trigger 2 — Custom Event (17 tên, dùng regex)

`event` giờ không còn cố định là `zp_track` — nó là tên GA4 chuẩn (9 event) hoặc tên gốc
Zalo (8 event còn lại). Dùng 1 trigger regex gộp hết:

- Loại: **Custom Event**
- Tên sự kiện: bật **"Sử dụng khớp regex"** (Use regex matching), nhập:
  ```
  ^(view_item|add_to_cart|add_to_wishlist|begin_checkout|add_payment_info|purchase|generate_lead|sign_up|search|Contact|CustomizeProduct|Donate|FindLocation|Schedule|StartTrial|SubmitApplication|Subscribe)$
  ```
- Kích hoạt trên: **Tất cả sự kiện tùy chỉnh** (KHÔNG chọn "Một số sự kiện tùy chỉnh" —
  chọn "Một số" bắt buộc phải thêm 1 điều kiện AND phụ, không cần thiết ở đây. Ô "Tên sự
  kiện" + regex ở trên đã tự lọc đúng rồi, "Tất cả" vẫn tôn trọng bộ lọc đó, không fire bừa
  trên mọi custom event)
- Tên trigger: `Trigger - Zalo Pixel Events`

## Bước 5 — Tạo Tag

### Tag 1 — Zalo Pixel - Initialize

| Field | Giá trị |
|---|---|
| Loại thẻ | Zalo Pixel |
| Action | Initialize |
| Pixel ID | `{{Zalo Pixel ID}}` |
| Trigger | `Trigger - Initialization - All Pages` |

### Tag 2 — Zalo Pixel - Track Event

| Field | Giá trị |
|---|---|
| Loại thẻ | Zalo Pixel |
| Action | Track event |
| Event type | Custom event |
| Custom event name | `{{DLV - zp_event_name}}` |
| Pixel ID | `{{Zalo Pixel ID}}` |
| content_id | `{{DLV - zp_content_id}}` |
| content_name | `{{DLV - zp_content_name}}` |
| content_type | `{{DLV - zp_content_type}}` |
| currency | `{{DLV - zp_currency}}` |
| value | `{{DLV - zp_value}}` |
| quantity | `{{DLV - zp_quantity}}` |
| contents *(mục "Custom event parameters")* | `{{DLV - zp_contents}}` |
| Additional parameters | `query` → `{{DLV - zp_query}}` |
| Trigger | `Trigger - Zalo Pixel Events` |

**Tag Sequencing** (cuối form, mục "Advanced Settings"):
☑ Fire a tag before this tag fires → `Zalo Pixel - Initialize`
☑ Don't fire this tag if the setup tag fails

> **landing-page-v2 không dùng React Router / Next / Nuxt kiểu SPA route-based** — mọi
> modal/section nằm trên 1 trang, nên **không cần** tag Pageview (SPA). Nếu bạn fork repo
> này thành multi-page SPA, xem thêm action `Pageview (SPA)` + trigger **History Change**
> trong `zalo-pixel-gtm-template/README.md`.

## Bước 6 — Preview mode trên localhost

1. Chạy demo: `npm install && npm run dev` (mặc định `http://localhost:5173`)
2. GTM → **Preview** → nhập URL localhost → **Connect**
3. Trên tab preview mới mở: bấm 1 nút bất kỳ (vd. "Thêm giỏ") → quay lại panel GTM Preview
4. Tab **Tags** → kiểm tra `Zalo Pixel - Initialize` và `Zalo Pixel - Track Event` đều
   **Fired** ✓, không có tag nào **Not Fired** mà lẽ ra phải fire.
5. Tab **Variables** → chọn đúng sự kiện vừa fire (vd. `add_to_cart` hoặc `Contact`) trong
   timeline → xem giá trị thực tế của từng `DLV - zp_*` để đối chiếu với tham số mong đợi
   (bảng ở `PIXEL-EVENTS.md`).

## Bước 7 — Publish + lọc traffic bot

1. **Submit → đặt tên version (vd. "v1 — Zalo Pixel setup") → Publish.**
2. Google sẽ định kỳ tải lại container đã publish từ `gtm-msr.appspot.com` để quét
   malware — tag Zalo Pixel sẽ fire **thật** trong lượt quét đó, tạo conversion giả.
   Đây là hành vi bình thường của **mọi** container GTM, không phải lỗi của site này.
   **Lọc:** mở cả 2 trigger ở Bước 4 → **Add Exception** → biến built-in `{{Page Hostname}}`
   → điều kiện **does not equal** `gtm-msr.appspot.com`. Chi tiết:
   `zalo-pixel-gtm-template/README.md` mục "Traffic quét bot của Google".

## Bước 8 — Verify

DevTools → tab **Network** → filter `dev-log.adtima.vn`:

| Request | Khi nào xuất hiện |
|---|---|
| `GET ztracker.js` | Ngay khi tag Initialize fire (status 200) |
| `GET /tracklp?type=pageview&pId=...` | Cùng lúc — pageview tự động |
| `GET /ptrck/events?pixelId=...&url=...` | Cùng lúc — tải config webElement (không liên quan track() của GTM) |
| `GET /ptrck/log?pId=...&eId=...` | Mỗi lần dataLayer push 1 trong 17 event thành công (Pixel V2 = kind=5: **luôn** fire, không cần tạo conversion trước) |

Console:
```javascript
window.dataLayer.filter(e => e.zp_event_name)
// → mỗi phần tử có zp_event_name, value, currency, content_id, contents, ecommerce, ...
```

---

## Lưu ý quan trọng

- **Reset field giữa các event (tránh đọc nhầm giá trị cũ).** dataLayer của GTM là 1 model
  được merge dần qua từng lần push — key không được nhắc tới ở lần push sau **vẫn đọc ra
  giá trị của lần push trước** (đây là lý do convention ecommerce GA4 luôn
  `dataLayer.push({ecommerce: null})` trước mỗi event mới). `usePixel.js` đã xử lý việc
  này: mỗi lần `fire()` đều set `null` cho toàn bộ 10 field chuẩn trước, rồi mới ghi đè bằng
  params thật — vd. gọi `Contact` ngay sau `AddToCart` sẽ có `currency: null, value: null,
  content_id: null, quantity: null` tường minh thay vì vô tình giữ số liệu đơn hàng cũ.
  Nếu bạn thêm field mới vào payload, nhớ thêm luôn vào mảng `PARAM_KEYS` ở đầu file.
- **Không cấu hình trùng cơ chế.** Nếu một hành động đã được track qua GTM (dataLayer +
  tag Track Event), đừng đồng thời tạo Event Builder webElement rule (id/class/nội dung)
  cho cùng hành động đó trong Zalo Ads Manager — conversion sẽ bị đếm 2 lần. Xem
  `PIXEL-EVENTS.md` để biết id/class của từng nút — dùng để cấu hình **Click Trigger**
  trong GTM (`{{Click ID}}` / `{{Click Classes}}` built-in variables), KHÔNG dùng để cấu
  hình thêm Event Builder song song.
- **`contents` là chuỗi mã sản phẩm phân cách dấu phẩy** (vd. `'sp001,sp002'`) — đúng theo
  tài liệu zalo-ads-v2 ("Danh sách mã trang hoặc mã sản phẩm, phân cách bằng dấu phẩy",
  sự kiện dùng: `AddToWishlist`). Không phải mảng (list string hay object `{id, quantity}`
  đều sai) — khớp đúng payload thật mà `usePixel.js` push (xem `App.jsx`/
  `CheckoutModal.jsx`/`Products.jsx` các nơi gọi
  `fire('Purchase', {... contents: cart.map(i => i.id).join(',')})`).
- **Không gửi PII thô** (tên/SĐT/email người dùng nhập ở form) qua dataLayer — xem mục
  cuối `PIXEL-EVENTS.md`.
- Pixel ID trong **biến Constant `Zalo Pixel ID`** (GTM) phải trùng với `PIXEL_ID` trong
  `src/hooks/usePixel.js` — đổi 1 chỗ mà quên chỗ kia là nguyên nhân phổ biến nhất khiến
  dashboard Zalo Ads Manager không thấy conversion nào dù Network tab vẫn thấy request.
