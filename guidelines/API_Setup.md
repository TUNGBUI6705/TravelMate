## API Setup Guide - TravelMate

### 1. OpenTripMap API

**Mục đích:** Tìm kiếm địa điểm du lịch, bảo tàng, nhà hàng, v.v.

**Bước 1: Lấy API Key**
1. Vào https://opentripmap.com/product
2. Cuộn xuống tìm "Get your API key"
3. Click "Generate API Key" 
4. Chọn plan (Free plan có sẵn)
5. Nhập email và click "Get Key"
6. Kiểm tra email để lấy API key

**Bước 2: Thêm vào file environment**

Tạo file `.env.local` trong root project:

```bash
VITE_OPENTRIPMAP_API_KEY=your_api_key_here
VITE_FOURSQUARE_API_KEY=your_foursquare_api_key_here
```

**Test API:**
```bash
https://api.opentripmap.com/0.3/en/places/radius?apikey=YOUR_KEY&lat=21.0285&lon=105.8542&radius=5000&kinds=restaurants
```

---

### 2. Foursquare API

**Mục đích:** Lấy rating, tips, photos từ Foursquare

**Bước 1: Tạo tài khoản & App**
1. Vào https://foursquare.com/developers
2. Click "Create app"
3. Đăng nhập/Sign up with Google/GitHub
4. Điền thông tin project
5. Agree terms and create app
6. Copy `Personal Access Token` từ mục "Authentication"

**Bước 2: Thêm vào .env.local**

```bash
VITE_FOURSQUARE_API_KEY=your_personal_access_token_here
```

**Test API:**
```bash
curl -s -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.foursquare.com/v3/places/search?ll=21.0285,105.8542&limit=10"
```

---

### 3. OpenStreetMap (Leaflet)

**Mục đích:** Hiển thị bản đồ tương tác

**Tự động:** 
- Leaflet được load từ CDN trong `MapComponent.tsx`
- Tile layer từ OpenStreetMap (free, không cần API key)
- Không cần cấu hình thêm

---

### 4. Firestore (Local Reviews)

**Mục đích:** Người dùng viết review cá nhân

**Cấu hình:**
- Đã setup trong `src/config/firebase.ts`
- Sử dụng Firebase Authentication & Firestore

**Firestore Collection Structure:**
```
reviews/
  {docId}
    placeId: string
    userId: string
    userName: string
    rating: number (1-5)
    text: string
    createdAt: timestamp
    updatedAt: timestamp
```

---

## File Configuration

### `.env.local` (Create this file):
```
VITE_OPENTRIPMAP_API_KEY=abc123def456
VITE_FOURSQUARE_API_KEY=fsq_bearer_token_xyz
```

### Vite Config (vite.config.ts):
- Đã tự động support `.env.*` files
- Tự động load vào `import.meta.env`

---

## Cách sử dụng trong code

### OpenTripMap Service:
```typescript
import { openTripMapService } from "../../data/services/openTripMapService";

const places = await openTripMapService.searchPlaces(lat, lon, radius, kinds);
const details = await openTripMapService.getPlaceDetails(xid);
```

### Foursquare Service:
```typescript
import { foursquareService } from "../../data/services/foursquareService";

const places = await foursquareService.searchPlaces(lat, lon, query, limit);
const tips = await foursquareService.getTips(placeId, limit);
const photos = await foursquareService.searchPhotos(placeId, limit);
```

### Map Component:
```typescript
import { MapComponent } from "../components/maps/MapComponent";

<MapComponent
  lat={21.0285}
  lon={105.8542}
  zoom={15}
  markers={[
    { id: "1", lat: 21.0285, lon: 105.8542, name: "Place Name" }
  ]}
  onMarkerClick={(id) => console.log("Clicked:", id)}
  style={{ height: "500px" }}
/>
```

---

## Common Issues

### 1. API Key returns 401/403
- Kiểm tra API key đã đúng trong .env.local
- Restart dev server sau khi thêm .env
- Foursquare: Personal Access Token, không phải API Key

### 2. Location permission denied
- Browser popup yêu cầu cấp quyền location
- Allow quyền để load API places
- Nếu đã từ chối, reset trong Settings

### 3. CORS Error
- OpenTripMap & Foursquare API hỗ trợ CORS từ browser
- Không cần proxy
- Kiểm tra console logs

### 4. Leaflet map không hiển thị
- Kiểm tra network tab - CDN có load không
- Kiểm tra browser console
- Có thể do ad blocker chặn CDN

---

## API Rate Limits

| API | Free Limit | Note |
|-----|-----------|------|
| OpenTripMap | 1 req/sec | Per IP |
| Foursquare | 99,500/day | Per app |
| Leaflet | Unlimited | Open source |
| Firestore | 50K read/day | Free tier |

---

## Troubleshooting

### Dev Server không nhìn thấy env variables:
```bash
# Restart dev server
npm run dev

# Hoặc
Ctrl+C rồi "npm run dev"
```

### Environment variables không load:
- Tên phải bắt đầu bằng VITE_
- File phải là .env.local (not .env)
- Reload page sau khi thêm env

### API trả về dữ liệu nhưng không hiển thị:
- Kiểm tra browser DevTools Console
- Kiểm tra Network tab - API responses
- Kiểm tra component render logic

---

## Tips

1. **Caching:** Implement Redux/Context để cache API responses tránh call API quá nhiều
2. **Pagination:** Các API hỗ trợ paginate, implement nếu load nhiều dữ liệu
3. **Error Handling:** Console logs đã có, nên kiểm tra trước khi deploy
4. **Testing:** Dùng Postman/Insomnia để test API trước implement
