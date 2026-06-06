/**
 * TravelMate - Firebase Realtime Database Seed Script
 * Chạy: node seed_rtdb.cjs
 */

require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Khởi tạo Firebase Admin với Realtime Database URL
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL
});

const db = admin.database();

// Base URL cho Supabase Storage
const SUPABASE_STORAGE_URL = "https://rbugosbyvqdhlmxmucuz.supabase.co/storage/v1/object/public/travel-mate-images";

const USER_ID = "FqRCu02RkLb2ZKulF5OfFBjKn4f1";
const USER_EMAIL = "buitung6705@gmail.com";

// ═══════════════════════════════════════════════════════
// 1. USERS
// ═══════════════════════════════════════════════════════
const users = {
  [USER_ID]: {
    "uid": USER_ID,
    "fullName": "Bùi Tùng",
    "email": USER_EMAIL,
    "password": "password123", // Lưu ý: thực tế password được quản lý bởi Firebase Auth
    "bio": "Đam mê khám phá những vùng đất mới 🌍 | Foodie | Travel Photographer",
    "location": "Hà Nội, Việt Nam",
    "handle": "@buitung.travels",
    "totalTrips": 5,
    "totalSpent": 23000000.0,
    "upcomingTrips": 2,
    "interests": ["BEACH", "CULTURE", "FOOD", "PHOTOGRAPHY", "BUDGET"],
    "photoURL": `${SUPABASE_STORAGE_URL}/users/avatar1.png`,
    "status": "active",
    "role": "user",
    "createdAt": Date.now() - 30 * 86400000
  }
};

// ═══════════════════════════════════════════════════════
// 2. NOTIFICATIONS
// ═══════════════════════════════════════════════════════
const notifications = {
  [USER_ID]: {
    "notif_01": {
      "id": "notif_01",
      "userId": USER_ID,
      "title": "Welcome to TravelMate! 🎉",
      "message": "Start planning your first trip and explore amazing destinations.",
      "type": "welcome",
      "timestamp": Date.now() - 10 * 86400000,
      "isRead": true
    },
    "notif_02": {
      "id": "notif_02",
      "userId": USER_ID,
      "title": "Trip starts in 3 days!",
      "message": "Your Da Lat Adventure begins soon. Don't forget to pack!",
      "type": "trip_start",
      "timestamp": Date.now() - 2 * 86400000,
      "isRead": false
    }
  }
};

// ═══════════════════════════════════════════════════════
// 3. DESTINATIONS (50 Landmarks)
// ═══════════════════════════════════════════════════════
const landmarksRaw = [
  { id: "landmark_01", name: "Chùa Một Cột", location: "Quận Ba Đình, Hà Nội", country: "Việt Nam", description: "Ngôi chùa có kiến trúc độc đáo bậc nhất Việt Nam, hình dáng như một đóa hoa sen nở trên mặt nước.", rating: 4.8, reviewCount: 15000, categoryTags: ["CULTURE", "HISTORY", "PHOTOGRAPHY"], isUnesco: false, priceLevel: 1, latitude: 21.0358, longitude: 105.8335, isPromoted: false, avgPricePerDay: 200000.0, img: "hanoi_one_pillar.jpg", category: "Culture" },
  { id: "landmark_02", name: "Vịnh Hạ Long", location: "Hạ Long, Quảng Ninh", country: "Việt Nam", description: "Kỳ quan thiên nhiên thế giới với hàng ngàn đảo đá vôi nhô lên từ mặt nước xanh ngắt.", rating: 4.9, reviewCount: 25000, categoryTags: ["NATURE", "PHOTOGRAPHY", "RELAXATION"], isUnesco: true, priceLevel: 3, latitude: 20.9101, longitude: 107.1839, isPromoted: true, avgPricePerDay: 2500000.0, img: "halong_bay.jpg", category: "Nature" },
  { id: "landmark_03", name: "Đèo Mã Pì Lèng", location: "Mèo Vạc, Hà Giang", country: "Việt Nam", description: "Một trong 'tứ đại đỉnh đèo' của Việt Nam, nhìn xuống dòng sông Nho Quế xanh biếc.", rating: 4.9, reviewCount: 8600, categoryTags: ["ADVENTURE", "NATURE", "PHOTOGRAPHY"], isUnesco: false, priceLevel: 1, latitude: 23.2384, longitude: 105.4201, isPromoted: true, avgPricePerDay: 500000.0, img: "ha_giang_ma_pi_leng.jpg", category: "Adventure" },
  { id: "landmark_04", name: "Cố đô Huế", location: "Thành phố Huế, Thừa Thiên Huế", country: "Việt Nam", description: "Quần thể di tích lịch sử triều Nguyễn với cung điện và lăng tẩm cổ kính.", rating: 4.7, reviewCount: 12000, categoryTags: ["HISTORY", "CULTURE", "PHOTOGRAPHY"], isUnesco: true, priceLevel: 2, latitude: 16.4637, longitude: 107.5909, isPromoted: false, avgPricePerDay: 800000.0, img: "hue_citadel.jpg", category: "History" },
  { id: "landmark_05", name: "Phố cổ Hội An", location: "Hội An, Quảng Nam", country: "Việt Nam", description: "Thương cảng cổ thế kỷ 17 được bảo tồn gần như nguyên vẹn với ánh đèn lồng rực rỡ.", rating: 4.9, reviewCount: 35000, categoryTags: ["CULTURE", "FOOD", "SHOPPING", "HISTORY"], isUnesco: true, priceLevel: 2, latitude: 15.8801, longitude: 108.338, isPromoted: true, avgPricePerDay: 1200000.0, img: "hoi_an.jpg", category: "Culture" },
  { id: "landmark_06", name: "Fansipan", location: "Sapa, Lào Cai", country: "Việt Nam", description: "Nóc nhà Đông Dương với độ cao 3.143m, mang đến trải nghiệm săn mây tuyệt vời.", rating: 4.8, reviewCount: 18000, categoryTags: ["ADVENTURE", "NATURE", "PHOTOGRAPHY"], isUnesco: false, priceLevel: 3, latitude: 22.3033, longitude: 103.775, isPromoted: true, avgPricePerDay: 2000000.0, img: "fansipan.jpg", category: "Adventure" },
  { id: "landmark_07", name: "Hang Sơn Đoòng", location: "Quảng Bình", country: "Việt Nam", description: "Hang động tự nhiên lớn nhất thế giới với hệ sinh thái rừng rậm ngay trong hang.", rating: 5.0, reviewCount: 1200, categoryTags: ["ADVENTURE", "NATURE", "PHOTOGRAPHY"], isUnesco: true, priceLevel: 5, latitude: 17.45, longitude: 106.2, isPromoted: true, avgPricePerDay: 15000000.0, img: "son_doong.jpg", category: "Adventure" },
  { id: "landmark_08", name: "Bãi Sao", location: "Phú Quốc, Kiên Giang", country: "Việt Nam", description: "Bãi biển đẹp nhất Phú Quốc với bãi cát trắng mịn như kem và làn nước trong xanh.", rating: 4.6, reviewCount: 15000, categoryTags: ["BEACH", "RELAXATION", "FOOD"], isUnesco: false, priceLevel: 3, latitude: 10.05, longitude: 104.03, isPromoted: false, avgPricePerDay: 2000000.0, img: "phu_quoc_sao_beach.jpg", category: "Beach" },
  { id: "landmark_09", name: "Tháp Bà Ponagar", location: "Nha Trang, Khánh Hòa", country: "Việt Nam", description: "Quần thể đền tháp Chăm Pa cổ kính tọa lạc trên một ngọn đồi nhỏ bên sông Cái.", rating: 4.5, reviewCount: 9800, categoryTags: ["HISTORY", "CULTURE", "PHOTOGRAPHY"], isUnesco: false, priceLevel: 2, latitude: 12.2654, longitude: 109.1895, isPromoted: false, avgPricePerDay: 800000.0, img: "nha_trang_ponagar.jpg", category: "History" },
  { id: "landmark_10", name: "Dinh Độc Lập", location: "Quận 1, TP. Hồ Chí Minh", country: "Việt Nam", description: "Di tích lịch sử đặc biệt, nơi chứng kiến sự kiện kết thúc chiến tranh Việt Nam.", rating: 4.6, reviewCount: 22000, categoryTags: ["HISTORY", "CULTURE", "PHOTOGRAPHY"], isUnesco: false, priceLevel: 2, latitude: 10.7769, longitude: 106.6953, isPromoted: false, avgPricePerDay: 1000000.0, img: "saigon_independence_palace.jpg", category: "History" },
  { id: "landmark_11", name: "Tam Cốc - Bích Động", location: "Ninh Bình", country: "Việt Nam", description: "Hệ thống hang động núi đá vôi và cánh đồng lúa nước tuyệt đẹp bên dòng sông Ngô Đồng.", rating: 4.8, reviewCount: 11000, categoryTags: ["NATURE", "PHOTOGRAPHY", "RELAXATION"], isUnesco: true, priceLevel: 2, latitude: 20.21, longitude: 105.91, isPromoted: true, avgPricePerDay: 900000.0, img: "ninh_binh_tam_coc.jpg", category: "Nature" },
  { id: "landmark_12", name: "Gành Đá Đĩa", location: "Tuy An, Phú Yên", country: "Việt Nam", description: "Kiệt tác thiên nhiên với hàng ngàn cột đá bazan hình lục giác xếp chồng lên nhau bên bờ biển.", rating: 4.7, reviewCount: 7500, categoryTags: ["NATURE", "PHOTOGRAPHY", "BEACH"], isUnesco: false, priceLevel: 1, latitude: 13.34, longitude: 109.3, isPromoted: false, avgPricePerDay: 600000.0, img: "phu_yen_ganh_da_dia.jpg", category: "Nature" },
  { id: "landmark_13", name: "Thung lũng Tình Yêu", location: "Đà Lạt, Lâm Đồng", country: "Việt Nam", description: "Thắng cảnh thơ mộng với đồi thông, hồ nước và những vườn hoa rực rỡ sắc màu.", rating: 4.3, reviewCount: 14000, categoryTags: ["RELAXATION", "PHOTOGRAPHY", "NATURE"], isUnesco: false, priceLevel: 2, latitude: 11.97, longitude: 108.44, isPromoted: false, avgPricePerDay: 800000.0, img: "dalat_valley_of_love.jpg", category: "Nature" },
  { id: "landmark_14", name: "Thánh địa Mỹ Sơn", location: "Duy Xuyên, Quảng Nam", country: "Việt Nam", description: "Quần thể đền đài Chăm Pa cổ kính trong một thung lũng hẹp, bao quanh bởi núi đồi.", rating: 4.6, reviewCount: 9200, categoryTags: ["HISTORY", "CULTURE", "PHOTOGRAPHY"], isUnesco: true, priceLevel: 2, latitude: 15.76, longitude: 108.12, isPromoted: false, avgPricePerDay: 700000.0, img: "my_son_sanctuary.jpg", category: "History" },
  { id: "landmark_15", name: "Chợ nổi Cái Răng", location: "Cần Thơ", country: "Việt Nam", description: "Nét văn hóa sông nước đặc trưng của miền Tây Nam Bộ với hàng trăm ghe xuồng buôn bán.", rating: 4.5, reviewCount: 11000, categoryTags: ["CULTURE", "FOOD", "PHOTOGRAPHY"], isUnesco: false, priceLevel: 1, latitude: 10.005, longitude: 105.74, isPromoted: true, avgPricePerDay: 600000.0, img: "can_tho_floating_market.jpg", category: "Culture" },
  { id: "landmark_16", name: "Mũi Cà Mau", location: "Ngọc Hiển, Cà Mau", country: "Việt Nam", description: "Điểm cực Nam trên đất liền của Tổ quốc, nơi có thể ngắm mặt trời mọc và lặn trên biển.", rating: 4.7, reviewCount: 5400, categoryTags: ["ADVENTURE", "NATURE", "HISTORY"], isUnesco: false, priceLevel: 2, latitude: 8.6, longitude: 104.7, isPromoted: true, avgPricePerDay: 1000000.0, img: "ca_mau_cape.jpg", category: "Adventure" },
  { id: "landmark_17", name: "Đảo Kỳ Co", location: "Quy Nhơn, Bình Định", country: "Việt Nam", description: "Bãi biển hoang sơ với làn nước trong vắt nhìn thấy tận đáy và dải cát trắng mịn.", rating: 4.8, reviewCount: 6800, categoryTags: ["BEACH", "NATURE", "RELAXATION"], isUnesco: false, priceLevel: 2, latitude: 13.78, longitude: 109.31, isPromoted: true, avgPricePerDay: 1200000.0, img: "quy_nhon_ky_co.jpg", category: "Beach" },
  { id: "landmark_18", name: "Vườn quốc gia Ba Vì", location: "Ba Vì, Hà Nội", country: "Việt Nam", description: "Khu bảo tồn thiên nhiên đa dạng với rừng nguyên sinh, nhà thờ đổ và đồi thông.", rating: 4.4, reviewCount: 8200, categoryTags: ["NATURE", "ADVENTURE", "RELAXATION"], isUnesco: false, priceLevel: 1, latitude: 21.08, longitude: 105.36, isPromoted: false, avgPricePerDay: 500000.0, img: "ba_vi_national_park.jpg", category: "Nature" },
  { id: "landmark_19", name: "Nhà thờ lớn Hà Nội", location: "Quận Hoàn Kiếm, Hà Nội", country: "Việt Nam", description: "Công trình kiến trúc Gothic tiêu biểu của Hà Nội, điểm đến check-in nổi tiếng.", rating: 4.6, reviewCount: 19000, categoryTags: ["CULTURE", "PHOTOGRAPHY", "HISTORY"], isUnesco: false, priceLevel: 1, latitude: 21.0288, longitude: 105.8491, isPromoted: false, avgPricePerDay: 300000.0, img: "hanoi_cathedral.jpg", category: "Culture" },
  { id: "landmark_20", name: "Cầu Vàng (Bà Nà Hills)", location: "Hòa Vang, Đà Nẵng", country: "Việt Nam", description: "Cây cầu có thiết kế ấn tượng như được nâng đỡ bởi hai bàn tay khổng lồ giữa núi rừng.", rating: 4.8, reviewCount: 42000, categoryTags: ["PHOTOGRAPHY", "NATURE", "CULTURE"], isUnesco: false, priceLevel: 4, latitude: 15.99, longitude: 107.99, isPromoted: true, avgPricePerDay: 2500000.0, img: "danang_golden_bridge.jpg", category: "Culture" },
  { id: "landmark_21", name: "Thác Bản Giốc", location: "Trùng Khánh, Cao Bằng", country: "Việt Nam", description: "Thác nước hùng vĩ nằm giữa biên giới Việt - Trung, cảnh sắc như tranh vẽ.", rating: 4.9, reviewCount: 5100, categoryTags: ["NATURE", "PHOTOGRAPHY", "ADVENTURE"], isUnesco: false, priceLevel: 2, latitude: 22.85, longitude: 106.72, isPromoted: true, avgPricePerDay: 800000.0, img: "cao_bang_ban_gioc.jpg", category: "Nature" },
  { id: "landmark_22", name: "Mù Cang Chải", location: "Yên Bái", country: "Việt Nam", description: "Những cung đường ruộng bậc thang uốn lượn như 'nấc thang lên thiên đường'.", rating: 4.9, reviewCount: 4800, categoryTags: ["NATURE", "CULTURE", "PHOTOGRAPHY"], isUnesco: false, priceLevel: 1, latitude: 21.84, longitude: 104.12, isPromoted: true, avgPricePerDay: 600000.0, img: "mu_cang_chai.jpg", category: "Nature" },
  { id: "landmark_23", name: "Đồi Cát Bay", location: "Mũi Né, Phan Thiết", country: "Việt Nam", description: "Sa mạc thu nhỏ với những đồi cát đổi màu liên tục theo hướng gió.", rating: 4.4, reviewCount: 11000, categoryTags: ["NATURE", "ADVENTURE", "PHOTOGRAPHY"], isUnesco: false, priceLevel: 1, latitude: 10.95, longitude: 108.3, isPromoted: false, avgPricePerDay: 700000.0, img: "mui_ne_sand_dunes.jpg", category: "Adventure" },
  { id: "landmark_24", name: "Chùa Hương", location: "Mỹ Đức, Hà Nội", country: "Việt Nam", description: "Quần thể văn hóa - tôn giáo lớn với nhiều đền chùa hang động linh thiêng.", rating: 4.5, reviewCount: 16000, categoryTags: ["CULTURE", "HISTORY", "NATURE"], isUnesco: false, priceLevel: 2, latitude: 20.61, longitude: 105.74, isPromoted: false, avgPricePerDay: 800000.0, img: "hanoi_perfume_pagoda.jpg", category: "Culture" },
  { id: "landmark_25", name: "Vườn quốc gia Tràm Chim", location: "Tam Nông, Đồng Tháp", country: "Việt Nam", description: "Khu bảo tồn đất ngập nước, nơi cư ngụ của nhiều loài chim quý hiếm như sếu đầu đỏ.", rating: 4.6, reviewCount: 3500, categoryTags: ["NATURE", "PHOTOGRAPHY", "RELAXATION"], isUnesco: false, priceLevel: 1, latitude: 10.6, longitude: 105.5, isPromoted: false, avgPricePerDay: 600000.0, img: "dong_thap_tram_chim.jpg", category: "Nature" },
  { id: "landmark_26", name: "Bưu điện Trung tâm Sài Gòn", location: "Quận 1, TP. Hồ Chí Minh", country: "Việt Nam", description: "Công trình kiến trúc Phục Hưng tuyệt đẹp giữa lòng thành phố hiện đại.", rating: 4.7, reviewCount: 28000, categoryTags: ["HISTORY", "CULTURE", "PHOTOGRAPHY"], isUnesco: false, priceLevel: 1, latitude: 10.7799, longitude: 106.6999, isPromoted: false, avgPricePerDay: 400000.0, img: "saigon_central_post_office.jpg", category: "History" },
  { id: "landmark_27", name: "Đèo Hải Vân", location: "Đà Nẵng - Huế", country: "Việt Nam", description: "Con đèo ven biển đẹp nhất Việt Nam với những khúc cua uốn lượn và tầm nhìn bao quát.", rating: 4.9, reviewCount: 15000, categoryTags: ["ADVENTURE", "NATURE", "PHOTOGRAPHY"], isUnesco: false, priceLevel: 1, latitude: 16.18, longitude: 108.13, isPromoted: true, avgPricePerDay: 600000.0, img: "hai_van_pass.jpg", category: "Adventure" },
  { id: "landmark_28", name: "Quần thể di tích Tràng An", location: "Ninh Bình", country: "Việt Nam", description: "Di sản hỗn hợp thế giới với cảnh quan núi đá vôi kỳ vĩ và hệ thống hang động xuyên thủy.", rating: 4.9, reviewCount: 32000, categoryTags: ["NATURE", "HISTORY", "PHOTOGRAPHY"], isUnesco: true, priceLevel: 2, latitude: 20.25, longitude: 105.89, isPromoted: true, avgPricePerDay: 1000000.0, img: "ninh_binh_trang_an.jpg", category: "Nature" },
  { id: "landmark_29", name: "Mũi Né", location: "Bình Thuận", country: "Việt Nam", description: "Làng chài yên bình bên những rặng dừa và bãi biển tuyệt đẹp.", rating: 4.5, reviewCount: 14000, categoryTags: ["BEACH", "FOOD", "PHOTOGRAPHY"], isUnesco: false, priceLevel: 2, latitude: 10.94, longitude: 108.28, isPromoted: false, avgPricePerDay: 1200000.0, img: "mui_ne_beach.jpg", category: "Beach" },
  { id: "landmark_30", name: "Bãi biển Mỹ Khê", location: "Quận Sơn Trà, Đà Nẵng", country: "Việt Nam", description: "Một trong 6 bãi biển quyến rũ nhất hành tinh do Forbes bình chọn.", rating: 4.7, reviewCount: 25000, categoryTags: ["BEACH", "RELAXATION", "FOOD"], isUnesco: false, priceLevel: 2, latitude: 16.06, longitude: 108.24, isPromoted: true, avgPricePerDay: 1500000.0, img: "danang_my_khe_beach.jpg", category: "Beach" },
  { id: "landmark_31", name: "Hồ Gươm", location: "Hà Nội", country: "Việt Nam", description: "Trái tim của thủ đô Hà Nội với Tháp Rùa cổ kính và cầu Thê Húc đỏ rực.", rating: 4.8, reviewCount: 45000, categoryTags: ["HISTORY", "CULTURE", "RELAXATION"], isUnesco: false, priceLevel: 1, latitude: 21.0285, longitude: 105.8521, isPromoted: true, avgPricePerDay: 500000.0, img: "hanoi_hoan_kiem_lake.jpg", category: "History" },
  { id: "landmark_32", name: "Nhà tù Côn Đảo", location: "Côn Đảo, Bà Rịa - Vũng Tàu", country: "Việt Nam", description: "Di tích lịch sử hào hùng và bi tráng, nơi giam giữ những người con ưu tú của dân tộc.", rating: 4.8, reviewCount: 6500, categoryTags: ["HISTORY", "CULTURE", "PHOTOGRAPHY"], isUnesco: false, priceLevel: 2, latitude: 8.68, longitude: 106.6, isPromoted: false, avgPricePerDay: 1000000.0, img: "con_dao_prison.jpg", category: "History" },
  { id: "landmark_33", name: "Côn Đảo", location: "Bà Rịa - Vũng Tàu", country: "Việt Nam", description: "Hòn đảo thiên đường với thiên nhiên hoang sơ và tâm linh sâu sắc.", rating: 4.9, reviewCount: 9000, categoryTags: ["BEACH", "NATURE", "RELAXATION"], isUnesco: false, priceLevel: 4, latitude: 8.68, longitude: 106.6, isPromoted: true, avgPricePerDay: 3000000.0, img: "con_dao_island.jpg", category: "Beach" },
  { id: "landmark_34", name: "Tòa Thánh Tây Ninh", location: "Tây Ninh", country: "Việt Nam", description: "Công trình kiến trúc độc đáo, trung tâm của đạo Cao Đài.", rating: 4.7, reviewCount: 8500, categoryTags: ["CULTURE", "HISTORY", "PHOTOGRAPHY"], isUnesco: false, priceLevel: 1, latitude: 11.3, longitude: 106.1, isPromoted: false, avgPricePerDay: 500000.0, img: "tay_ninh_cao_dai_temple.jpg", category: "Culture" },
  { id: "landmark_35", name: "Núi Bà Đen", location: "Tây Ninh", country: "Việt Nam", description: "Nóc nhà Nam Bộ với hệ thống cáp treo hiện đại và tượng Phật cao nhất châu Á.", rating: 4.8, reviewCount: 25000, categoryTags: ["CULTURE", "NATURE", "ADVENTURE"], isUnesco: false, priceLevel: 3, latitude: 11.37, longitude: 106.12, isPromoted: true, avgPricePerDay: 1200000.0, img: "tay_ninh_ba_den_mountain.jpg", category: "Adventure" },
  { id: "landmark_36", name: "Vườn quốc gia Cúc Phương", location: "Ninh Bình", country: "Việt Nam", description: "Vườn quốc gia đầu tiên của Việt Nam với hệ sinh thái đa dạng và cây chò ngàn năm.", rating: 4.7, reviewCount: 7800, categoryTags: ["NATURE", "ADVENTURE", "PHOTOGRAPHY"], isUnesco: false, priceLevel: 1, latitude: 20.3, longitude: 105.6, isPromoted: false, avgPricePerDay: 600000.0, img: "cuc_phuong_national_park.jpg", category: "Nature" },
  { id: "landmark_37", name: "Rừng tràm Trà Sư", location: "Tịnh Biên, An Giang", country: "Việt Nam", description: "Hệ sinh thái đất ngập nước đặc trưng của miền Tây với thảm bèo xanh mướt.", rating: 4.6, reviewCount: 6500, categoryTags: ["NATURE", "PHOTOGRAPHY", "RELAXATION"], isUnesco: false, priceLevel: 1, latitude: 10.56, longitude: 105.04, isPromoted: true, avgPricePerDay: 600000.0, img: "an_giang_tra_su.jpg", category: "Nature" },
  { id: "landmark_38", name: "Thác Đray Nur", location: "Đắk Lắk", country: "Việt Nam", description: "Thác nước hùng vĩ nhất Tây Nguyên, gắn liền với những truyền thuyết tình yêu.", rating: 4.7, reviewCount: 4200, categoryTags: ["NATURE", "ADVENTURE", "PHOTOGRAPHY"], isUnesco: false, priceLevel: 2, latitude: 12.5, longitude: 107.9, isPromoted: false, avgPricePerDay: 800000.0, img: "dak_lak_dray_nur.jpg", category: "Nature" },
  { id: "landmark_39", name: "Biển Hồ (Pleiku)", location: "Gia Lai", country: "Việt Nam", description: "Hồ nước ngọt trên miệng núi lửa đã tắt, được mệnh danh là 'đôi mắt Pleiku'.", rating: 4.6, reviewCount: 5100, categoryTags: ["NATURE", "RELAXATION", "PHOTOGRAPHY"], isUnesco: false, priceLevel: 1, latitude: 14.05, longitude: 108.0, isPromoted: false, avgPricePerDay: 500000.0, img: "pleiku_bien_ho.jpg", category: "Nature" },
  { id: "landmark_40", name: "Chùa Linh Ứng Bãi Bụt", location: "Quận Sơn Trà, Đà Nẵng", country: "Việt Nam", description: "Ngôi chùa nổi tiếng với tượng Phật Bà Quan Thế Âm cao nhất Việt Nam nhìn ra biển Đông.", rating: 4.8, reviewCount: 21000, categoryTags: ["CULTURE", "PHOTOGRAPHY", "RELAXATION"], isUnesco: false, priceLevel: 1, latitude: 16.1, longitude: 108.27, isPromoted: true, avgPricePerDay: 400000.0, img: "danang_linh_ung_pagoda.jpg", category: "Culture" },
  { id: "landmark_41", name: "Quần thể di tích Côn Sơn - Kiếp Bạc", location: "Chí Linh, Hải Dương", country: "Việt Nam", description: "Di tích lịch sử văn hóa gắn liền với cuộc đời của các danh nhân Nguyễn Trãi và Trần Hưng Đạo.", rating: 4.5, reviewCount: 3800, categoryTags: ["HISTORY", "CULTURE", "NATURE"], isUnesco: false, priceLevel: 1, latitude: 21.15, longitude: 106.45, isPromoted: false, avgPricePerDay: 400000.0, img: "hai_duong_con_son.jpg", category: "History" },
  { id: "landmark_42", name: "Bạch Mã (Vườn quốc gia)", location: "Thừa Thiên Huế", country: "Việt Nam", description: "Khu sinh thái đa dạng, nơi mây và núi gặp nhau.", rating: 4.7, reviewCount: 3100, categoryTags: ["NATURE", "ADVENTURE", "RELAXATION"], isUnesco: false, priceLevel: 2, latitude: 16.19, longitude: 107.85, isPromoted: false, avgPricePerDay: 900000.0, img: "bach_ma_national_park.jpg", category: "Nature" },
  { id: "landmark_43", name: "Chùa Keo", location: "Vũ Thư, Thái Bình", country: "Việt Nam", description: "Ngôi chùa cổ có gác chuông bằng gỗ tinh xảo bậc nhất Việt Nam.", rating: 4.6, reviewCount: 2800, categoryTags: ["HISTORY", "CULTURE", "PHOTOGRAPHY"], isUnesco: false, priceLevel: 1, latitude: 20.36, longitude: 106.31, isPromoted: false, avgPricePerDay: 300000.0, img: "thai_binh_keo_pagoda.jpg", category: "Culture" },
  { id: "landmark_44", name: "Khu di tích Lam Kinh", location: "Thọ Xuân, Thanh Hóa", country: "Việt Nam", description: "Kinh đô thứ hai của triều Lê sau khi thắng trận quân Minh.", rating: 4.5, reviewCount: 3200, categoryTags: ["HISTORY", "CULTURE", "PHOTOGRAPHY"], isUnesco: false, priceLevel: 1, latitude: 19.9, longitude: 105.4, isPromoted: false, avgPricePerDay: 400000.0, img: "thanh_hoa_lam_kinh.jpg", category: "History" },
  { id: "landmark_45", name: "Đảo Lý Sơn", location: "Quảng Ngãi", country: "Việt Nam", description: "Vương quốc tỏi với những miệng núi lửa tắt và nước biển trong vắt.", rating: 4.8, reviewCount: 8500, categoryTags: ["BEACH", "NATURE", "PHOTOGRAPHY"], isUnesco: false, priceLevel: 2, latitude: 15.38, longitude: 109.11, isPromoted: true, avgPricePerDay: 1000000.0, img: "quang_ngai_ly_son.jpg", category: "Beach" },
  { id: "landmark_46", name: "Chùa Tam Chúc", location: "Hà Nam", country: "Việt Nam", description: "Ngôi chùa lớn nhất thế giới với phong cảnh non nước hữu tình.", rating: 4.8, reviewCount: 35000, categoryTags: ["CULTURE", "PHOTOGRAPHY", "NATURE"], isUnesco: false, priceLevel: 3, latitude: 20.55, longitude: 105.85, isPromoted: true, avgPricePerDay: 1200000.0, img: "ha_nam_tam_chuc.jpg", category: "Culture" },
  { id: "landmark_47", name: "Bạch Đằng Giang", location: "Thủy Nguyên, Hải Phòng", country: "Việt Nam", description: "Di tích lịch sử ghi dấu ba trận chiến chống quân xâm lược phương Bắc.", rating: 4.7, reviewCount: 5800, categoryTags: ["HISTORY", "CULTURE", "RELAXATION"], isUnesco: false, priceLevel: 1, latitude: 20.95, longitude: 106.7, isPromoted: false, avgPricePerDay: 400000.0, img: "hai_phong_bach_dang.jpg", category: "History" },
  { id: "landmark_48", name: "Lăng Chủ tịch Hồ Chí Minh", location: "Ba Đình, Hà Nội", country: "Việt Nam", description: "Nơi nghỉ ngơi vĩnh hằng của Chủ tịch Hồ Chí Minh kính yêu.", rating: 4.9, reviewCount: 55000, categoryTags: ["HISTORY", "CULTURE", "PHOTOGRAPHY"], isUnesco: false, priceLevel: 1, latitude: 21.0368, longitude: 105.8347, isPromoted: true, avgPricePerDay: 300000.0, img: "hanoi_ho_chi_minh_mausoleum.jpg", category: "History" },
  { id: "landmark_49", name: "Đại Nội Huế", location: "Thành phố Huế, Thừa Thiên Huế", country: "Việt Nam", description: "Kinh đô cổ của vương triều Nguyễn với kiến trúc độc đáo.", rating: 4.8, reviewCount: 18000, categoryTags: ["HISTORY", "CULTURE", "PHOTOGRAPHY"], isUnesco: true, priceLevel: 2, latitude: 16.4674, longitude: 107.5786, isPromoted: true, avgPricePerDay: 800000.0, img: "hue_imperial_city.jpg", category: "History" },
  { id: "landmark_50", name: "Chùa Bái Đính", location: "Ninh Bình", country: "Việt Nam", description: "Quần thể chùa lớn nhất Đông Nam Á với nhiều kỷ lục Guinness.", rating: 4.8, reviewCount: 28000, categoryTags: ["CULTURE", "PHOTOGRAPHY", "NATURE"], isUnesco: true, priceLevel: 3, latitude: 20.25, longitude: 105.8, isPromoted: true, avgPricePerDay: 1500000.0, img: "ninh_binh_bai_dinh.jpg", category: "Culture" }
];

const destinations = {};
landmarksRaw.forEach(item => {
  const { img, ...rest } = item;
  destinations[item.id] = {
    ...rest,
    status: "active",
    createdAt: Date.now() - Math.floor(Math.random() * 100) * 86400000,
    updatedAt: Date.now(),
    imageUrls: [`${SUPABASE_STORAGE_URL}/destinations/${img}`]
  };
});

// ═══════════════════════════════════════════════════════
// 4. TRIPS & EXPENSES (Cho Dashboard)
// ═══════════════════════════════════════════════════════
const trips = {
  "trip_001": {
    "id": "trip_001",
    "ownerId": USER_ID,
    "ownerName": "Bùi Tùng",
    "title": "Chuyến đi Đà Lạt mộng mơ",
    "destination": "Đà Lạt",
    "budget": 5000000,
    "startDate": Date.now() + 5 * 86400000,
    "endDate": Date.now() + 10 * 86400000,
    "status": "upcoming",
    "createdAt": Date.now() - 5 * 86400000
  },
  "trip_002": {
    "id": "trip_002",
    "ownerId": USER_ID,
    "ownerName": "Bùi Tùng",
    "title": "Khám phá Vịnh Hạ Long",
    "destination": "Quảng Ninh",
    "budget": 8000000,
    "startDate": Date.now() - 15 * 86400000,
    "endDate": Date.now() - 10 * 86400000,
    "status": "completed",
    "createdAt": Date.now() - 20 * 86400000
  }
};

const expenses = {
  "exp_001": { "id": "exp_001", "tripId": "trip_002", "amount": 2500000, "category": "Transport", "title": "Vé máy bay", "date": Date.now() - 18 * 86400000 },
  "exp_002": { "id": "exp_002", "tripId": "trip_002", "amount": 3000000, "category": "Accommodation", "title": "Khách sạn 3 đêm", "date": Date.now() - 15 * 86400000 },
  "exp_003": { "id": "exp_003", "tripId": "trip_002", "amount": 1500000, "category": "Food", "title": "Ăn uống hải sản", "date": Date.now() - 12 * 86400000 }
};

// ═══════════════════════════════════════════════════════
// 5. REVIEWS
// ═══════════════════════════════════════════════════════
const reviews = {
  "rev_01": {
    "id": "rev_01",
    "placeId": "landmark_02",
    "placeName": "Vịnh Hạ Long",
    "authorUid": USER_ID,
    "authorName": "Bùi Tùng",
    "rating": 5,
    "comment": "Cảnh quan tuyệt vời, dịch vụ du thuyền rất tốt!",
    "status": "active",
    "createdAt": Date.now() - 11 * 86400000
  }
};

// ═══════════════════════════════════════════════════════
// HÀM SEED
// ═══════════════════════════════════════════════════════
async function main() {
  console.log('\n════════════════════════════════════');
  console.log('  TravelMate - Seed Realtime DB');
  console.log('════════════════════════════════════');

  try {
    const rootRef = db.ref();

    console.log('  Đang xóa dữ liệu cũ...');
    await rootRef.remove();

    console.log('  Đang tạo dữ liệu mới...');
    await rootRef.set({
      users,
      notifications,
      destinations,
      trips,
      expenses,
      reviews
    });

    console.log('\n  ✅ Seed thành công!');
    process.exit(0);
  } catch (err) {
    console.error('\n  ❌ Lỗi:', err.message);
    process.exit(1);
  }
}

main();
