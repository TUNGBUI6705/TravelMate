/**
 * TravelMate - Firebase Seed Script (v2)
 * Chạy: node seed_firebase.cjs
 */

require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const now   = admin.firestore.Timestamp.now();
const ago   = (n) => admin.firestore.Timestamp.fromDate(new Date(Date.now() - n * 86400000));
const later = (n) => admin.firestore.Timestamp.fromDate(new Date(Date.now() + n * 86400000));

// ═══════════════════════════════════════════════════════
// 1. USERS
//    Dùng cho: User Management (ID, Full Name, Email, Joined, Status, Action)
// ═══════════════════════════════════════════════════════
const users = [
  {
    id: 'user_001',
    uid: 'user_001',
    email: 'tung.nguyen@gmail.com',
    displayName: 'Nguyễn Văn Tùng',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tung',
    phone: '0901234567',
    role: 'user',
    status: 'active',
    bannedReason: null,
    bannedAt: null,
    stats: { totalTrips: 3, totalPlaces: 8, totalReviews: 2, totalExpense: 4500000 },
    preferences: { types: ['biển', 'núi'], budget: 'medium', travelStyle: 'couple' },
    createdAt: ago(60)
  },
  {
    id: 'user_002',
    uid: 'user_002',
    email: 'linh.tran@gmail.com',
    displayName: 'Trần Thị Linh',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=linh',
    phone: '0912345678',
    role: 'user',
    status: 'active',
    bannedReason: null,
    bannedAt: null,
    stats: { totalTrips: 1, totalPlaces: 3, totalReviews: 1, totalExpense: 1800000 },
    preferences: { types: ['thành phố', 'ẩm thực'], budget: 'low', travelStyle: 'solo' },
    createdAt: ago(30)
  },
  {
    id: 'user_003',
    uid: 'user_003',
    email: 'minh.pham@gmail.com',
    displayName: 'Phạm Quốc Minh',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=minh',
    phone: '0934567890',
    role: 'user',
    status: 'active',
    bannedReason: null,
    bannedAt: null,
    stats: { totalTrips: 2, totalPlaces: 5, totalReviews: 3, totalExpense: 3200000 },
    preferences: { types: ['núi', 'di tích'], budget: 'high', travelStyle: 'family' },
    createdAt: ago(45)
  },
  {
    id: 'user_004',
    uid: 'user_004',
    email: 'banned.user@gmail.com',
    displayName: 'Lê Văn Spam',
    photoUrl: '',
    phone: '0923456789',
    role: 'user',
    status: 'banned',
    bannedReason: 'Đăng nội dung không phù hợp, spam review',
    bannedAt: ago(5),
    stats: { totalTrips: 0, totalPlaces: 0, totalReviews: 0, totalExpense: 0 },
    preferences: { types: [], budget: 'low', travelStyle: 'solo' },
    createdAt: ago(20)
  },
  {
    id: 'user_005',
    uid: 'user_005',
    email: 'huong.nguyen@gmail.com',
    displayName: 'Nguyễn Thị Hương',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=huong',
    phone: '0945678901',
    role: 'user',
    status: 'banned',
    bannedReason: 'Vi phạm điều khoản sử dụng',
    bannedAt: ago(2),
    stats: { totalTrips: 1, totalPlaces: 2, totalReviews: 0, totalExpense: 500000 },
    preferences: { types: ['biển'], budget: 'medium', travelStyle: 'couple' },
    createdAt: ago(15)
  },
  {
    id: 'admin_001',
    uid: 'admin_001',
    email: 'admin@travelmate.vn',
    displayName: 'Admin TravelMate',
    photoUrl: '',
    phone: '0800000000',
    role: 'admin',
    status: 'active',
    bannedReason: null,
    bannedAt: null,
    stats: { totalTrips: 0, totalPlaces: 0, totalReviews: 0, totalExpense: 0 },
    preferences: { types: [], budget: 'high', travelStyle: 'solo' },
    createdAt: ago(90)
  }
];

// ═══════════════════════════════════════════════════════
// 2. PLACES
//    Dùng cho: Place Management (ID, Name, Location, Category, Status)
//    Tích hợp Google Maps / external map API attributes
// ═══════════════════════════════════════════════════════
const places = [
  {
    id: 'place_001',
    // ── Thông tin cơ bản ──────────────────────────────
    name: 'Hồ Xuân Hương',
    province: 'Lâm Đồng',
    city: 'Đà Lạt',
    type: 'hồ',                          // dùng cho filter Category
    description: 'Hồ nước ngọt nhân tạo nằm giữa trung tâm thành phố Đà Lạt, điểm tham quan nổi tiếng với không khí trong lành.',
    address: 'Trần Quốc Toản, Phường 1, Đà Lạt, Lâm Đồng',
    // ── Toạ độ (dùng hiển thị Google Maps) ───────────
    location: { lat: 11.9404, lng: 108.4383 },
    // ── Google Maps / Map API attributes ─────────────
    googleMapsUrl: 'https://maps.google.com/?q=Ho+Xuan+Huong+Da+Lat',
    googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',  // ID từ Google Places API
    googleRating: 4.5,                              // Rating từ Google
    googleTotalRatings: 1240,                       // Tổng số rating trên Google
    mapProvider: 'google',                          // "google" | "openstreetmap" | "manual"
    osmNodeId: null,                                // OpenStreetMap node ID (nếu dùng OSM)
    // ── Hình ảnh ──────────────────────────────────────
    images: [],
    coverImage: '',
    // ── Phân loại & tìm kiếm ─────────────────────────
    tags: ['hồ', 'đi bộ', 'chụp ảnh', 'chill', 'miễn phí'],
    openingHours: 'Cả ngày',
    entryFee: 0,
    // ── Thống kê nội bộ app ───────────────────────────
    stats: { avgRating: 4.5, totalReviews: 2, totalVisits: 5 },
    // ── Trạng thái (admin quản lý) ────────────────────
    status: 'active',                               // "active" | "hidden"
    createdAt: ago(80),
    updatedAt: ago(10),
    createdBy: 'admin_001'
  },
  {
    id: 'place_002',
    name: 'Bãi biển Mỹ Khê',
    province: 'Đà Nẵng',
    city: 'Đà Nẵng',
    type: 'biển',
    description: 'Một trong những bãi biển đẹp nhất Đông Nam Á với bãi cát trắng mịn dài 900m.',
    address: 'Phước Mỹ, Sơn Trà, Đà Nẵng',
    location: { lat: 16.0662, lng: 108.2476 },
    googleMapsUrl: 'https://maps.google.com/?q=My+Khe+Beach+Da+Nang',
    googlePlaceId: 'ChIJgyjOJ9bMQTERfsHLu5XAIP8',
    googleRating: 4.7,
    googleTotalRatings: 3580,
    mapProvider: 'google',
    osmNodeId: null,
    images: [],
    coverImage: '',
    tags: ['biển', 'tắm biển', 'thể thao nước', 'hoàng hôn', 'miễn phí'],
    openingHours: 'Cả ngày',
    entryFee: 0,
    stats: { avgRating: 4.7, totalReviews: 1, totalVisits: 3 },
    status: 'active',
    createdAt: ago(75),
    updatedAt: ago(20),
    createdBy: 'admin_001'
  },
  {
    id: 'place_003',
    name: 'Phố cổ Hội An',
    province: 'Quảng Nam',
    city: 'Hội An',
    type: 'di tích',
    description: 'Di sản văn hoá thế giới UNESCO với những con phố cổ đèn lồng lung linh, kiến trúc độc đáo.',
    address: 'Minh An, Hội An, Quảng Nam',
    location: { lat: 15.8800, lng: 108.3380 },
    googleMapsUrl: 'https://maps.google.com/?q=Hoi+An+Ancient+Town',
    googlePlaceId: 'ChIJX4K_s7NpQjERmPonZUwUfPM',
    googleRating: 4.8,
    googleTotalRatings: 8920,
    mapProvider: 'google',
    osmNodeId: null,
    images: [],
    coverImage: '',
    tags: ['di tích', 'đèn lồng', 'ẩm thực', 'chụp ảnh', 'UNESCO'],
    openingHours: '6:00 - 22:00',
    entryFee: 120000,
    stats: { avgRating: 4.8, totalReviews: 0, totalVisits: 2 },
    status: 'active',
    createdAt: ago(70),
    updatedAt: ago(30),
    createdBy: 'admin_001'
  },
  {
    id: 'place_004',
    name: 'Vườn quốc gia Cúc Phương',
    province: 'Ninh Bình',
    city: 'Nho Quan',
    type: 'núi',
    description: 'Vườn quốc gia lâu đời nhất Việt Nam với hệ sinh thái rừng nhiệt đới đa dạng.',
    address: 'Cúc Phương, Nho Quan, Ninh Bình',
    location: { lat: 20.2562, lng: 105.5983 },
    googleMapsUrl: 'https://maps.google.com/?q=Cuc+Phuong+National+Park',
    googlePlaceId: 'ChIJq0MrgxaFSzERFbGYjQT3PEI',
    googleRating: 4.4,
    googleTotalRatings: 650,
    mapProvider: 'google',
    osmNodeId: null,
    images: [],
    coverImage: '',
    tags: ['núi', 'rừng', 'trekking', 'cắm trại', 'thiên nhiên'],
    openingHours: '7:00 - 17:00',
    entryFee: 60000,
    stats: { avgRating: 4.3, totalReviews: 0, totalVisits: 1 },
    status: 'active',
    createdAt: ago(65),
    updatedAt: ago(40),
    createdBy: 'admin_001'
  },
  {
    id: 'place_005',
    name: 'Chợ Bến Thành',
    province: 'TP. Hồ Chí Minh',
    city: 'TP. Hồ Chí Minh',
    type: 'ẩm thực',
    description: 'Biểu tượng của Sài Gòn, nơi mua sắm và thưởng thức ẩm thực đường phố nổi tiếng.',
    address: 'Lê Lợi, Bến Thành, Quận 1, TP.HCM',
    location: { lat: 10.7725, lng: 106.6980 },
    googleMapsUrl: 'https://maps.google.com/?q=Ben+Thanh+Market+HCMC',
    googlePlaceId: 'ChIJ0T2NLikpdTERVNMHG5n3AAQ',
    googleRating: 4.2,
    googleTotalRatings: 12400,
    mapProvider: 'google',
    osmNodeId: null,
    images: [],
    coverImage: '',
    tags: ['chợ', 'ẩm thực', 'mua sắm', 'du lịch thành phố'],
    openingHours: '6:00 - 18:00',
    entryFee: 0,
    stats: { avgRating: 4.2, totalReviews: 0, totalVisits: 4 },
    status: 'hidden',
    createdAt: ago(50),
    updatedAt: ago(5),
    createdBy: 'admin_001'
  }
];

// ═══════════════════════════════════════════════════════
// 3. REVIEWS
//    Dùng cho: Review Management (Place, Reviewer, Rating, Comment, Date, Status, Action)
//    Có pending status để admin duyệt
// ═══════════════════════════════════════════════════════
const reviews = [
  {
    id: 'rev_001',
    placeId: 'place_001',
    placeName: 'Hồ Xuân Hương',
    authorUid: 'user_001',
    authorName: 'Nguyễn Văn Tùng',
    authorPhoto: '',
    rating: 5,
    comment: 'Cảnh đẹp lắm, đi dạo buổi sáng sớm rất thơ mộng. Không khí trong lành, phù hợp chụp ảnh cặp đôi.',
    photos: [],
    visitedDate: ago(9),
    status: 'visible',                             // "visible" | "hidden" | "pending"
    helpfulCount: 3,
    reportCount: 0,
    createdAt: ago(8),
    updatedAt: ago(8)
  },
  {
    id: 'rev_002',
    placeId: 'place_001',
    placeName: 'Hồ Xuân Hương',
    authorUid: 'user_002',
    authorName: 'Trần Thị Linh',
    authorPhoto: '',
    rating: 4,
    comment: 'Đẹp nhưng cuối tuần hơi đông. Nên đi sớm hoặc buổi tối để tránh đông đúc.',
    photos: [],
    visitedDate: ago(4),
    status: 'visible',
    helpfulCount: 1,
    reportCount: 0,
    createdAt: ago(3),
    updatedAt: ago(3)
  },
  {
    id: 'rev_003',
    placeId: 'place_002',
    placeName: 'Bãi biển Mỹ Khê',
    authorUid: 'user_001',
    authorName: 'Nguyễn Văn Tùng',
    authorPhoto: '',
    rating: 5,
    comment: 'Biển sạch, cát trắng mịn. Buổi sáng rất vắng và đẹp. Nước trong veo nhìn thấy đáy.',
    photos: [],
    visitedDate: ago(25),
    status: 'pending',                             // Chờ admin duyệt
    helpfulCount: 0,
    reportCount: 0,
    createdAt: ago(1),
    updatedAt: ago(1)
  },
  {
    id: 'rev_004',
    placeId: 'place_002',
    placeName: 'Bãi biển Mỹ Khê',
    authorUid: 'user_003',
    authorName: 'Phạm Quốc Minh',
    authorPhoto: '',
    rating: 3,
    comment: 'Bãi biển ok nhưng nhiều hàng rong làm phiền. Cần quản lý tốt hơn.',
    photos: [],
    visitedDate: ago(10),
    status: 'pending',
    helpfulCount: 0,
    reportCount: 0,
    createdAt: ago(2),
    updatedAt: ago(2)
  },
  {
    id: 'rev_005',
    placeId: 'place_003',
    placeName: 'Phố cổ Hội An',
    authorUid: 'user_003',
    authorName: 'Phạm Quốc Minh',
    authorPhoto: '',
    rating: 5,
    comment: 'Tuyệt vời! Buổi tối đèn lồng lung linh rất đẹp. Ẩm thực phong phú ngon.',
    photos: [],
    visitedDate: ago(20),
    status: 'hidden',                              // Admin đã ẩn
    helpfulCount: 2,
    reportCount: 3,
    createdAt: ago(18),
    updatedAt: ago(15)
  }
];

// ═══════════════════════════════════════════════════════
// 4. TRIPS
// ═══════════════════════════════════════════════════════
const trips = [
  {
    id: 'trip_001',
    ownerUid: 'user_001',
    title: 'Đà Lạt 3 ngày 2 đêm',
    description: 'Chuyến đi lãng mạn 2 người khám phá thành phố ngàn hoa',
    coverImage: '',
    startDate: ago(10),
    endDate: ago(7),
    duration: 3,
    destinations: ['Đà Lạt', 'Lâm Đồng'],
    status: 'completed',
    visibility: 'shared',
    shareCode: 'DALAT-2024',
    sharedWith: ['user_002'],
    totalBudget: 5000000,
    totalExpense: 4500000,
    memberCount: 2,
    createdAt: ago(15),
    updatedAt: ago(7)
  },
  {
    id: 'trip_002',
    ownerUid: 'user_001',
    title: 'Đà Nẵng - Hội An hè này',
    description: 'Kế hoạch khám phá miền Trung 5 ngày',
    coverImage: '',
    startDate: later(20),
    endDate: later(25),
    duration: 5,
    destinations: ['Đà Nẵng', 'Hội An'],
    status: 'planning',
    visibility: 'private',
    shareCode: null,
    sharedWith: [],
    totalBudget: 8000000,
    totalExpense: 0,
    memberCount: 2,
    createdAt: ago(3),
    updatedAt: ago(1)
  },
  {
    id: 'trip_003',
    ownerUid: 'user_002',
    title: 'Một mình ở Hà Nội',
    description: 'Solo trip khám phá thủ đô',
    coverImage: '',
    startDate: ago(5),
    endDate: ago(3),
    duration: 3,
    destinations: ['Hà Nội'],
    status: 'completed',
    visibility: 'private',
    shareCode: null,
    sharedWith: [],
    totalBudget: 2000000,
    totalExpense: 1800000,
    memberCount: 1,
    createdAt: ago(10),
    updatedAt: ago(3)
  }
];

// ═══════════════════════════════════════════════════════
// 5. EXPENSES
// ═══════════════════════════════════════════════════════
const expenses = [
  {
    id: 'exp_001',
    tripId: 'trip_001',
    ownerUid: 'user_001',
    title: 'Vé máy bay khứ hồi',
    amount: 2200000,
    category: 'di chuyển',
    date: ago(10),
    dayNumber: 1,
    note: 'Bay HCM - Đà Lạt',
    receiptUrl: null,
    paidBy: 'user_001',
    createdAt: ago(10)
  },
  {
    id: 'exp_002',
    tripId: 'trip_001',
    ownerUid: 'user_001',
    title: 'Khách sạn 2 đêm',
    amount: 1600000,
    category: 'lưu trú',
    date: ago(10),
    dayNumber: 1,
    note: '800k/đêm x 2',
    receiptUrl: null,
    paidBy: 'user_001',
    createdAt: ago(10)
  },
  {
    id: 'exp_003',
    tripId: 'trip_001',
    ownerUid: 'user_001',
    title: 'Ăn uống 3 ngày',
    amount: 450000,
    category: 'ăn uống',
    date: ago(9),
    dayNumber: 2,
    note: 'Cà phê, bánh mì, bún bò',
    receiptUrl: null,
    paidBy: 'user_001',
    createdAt: ago(9)
  },
  {
    id: 'exp_004',
    tripId: 'trip_001',
    ownerUid: 'user_001',
    title: 'Thuê xe máy',
    amount: 150000,
    category: 'di chuyển',
    date: ago(9),
    dayNumber: 2,
    note: '150k/ngày',
    receiptUrl: null,
    paidBy: 'user_001',
    createdAt: ago(9)
  },
  {
    id: 'exp_005',
    tripId: 'trip_001',
    ownerUid: 'user_001',
    title: 'Mua quà dâu tây',
    amount: 100000,
    category: 'mua sắm',
    date: ago(7),
    dayNumber: 3,
    note: '2kg dâu tây',
    receiptUrl: null,
    paidBy: 'user_001',
    createdAt: ago(7)
  }
];

// ═══════════════════════════════════════════════════════
// 6. NOTIFICATIONS
// ═══════════════════════════════════════════════════════
const notifications = [
  {
    id: 'notif_001',
    recipientUid: 'user_001',
    type: 'review_liked',
    title: 'Đánh giá của bạn được yêu thích',
    body: '3 người thấy đánh giá Hồ Xuân Hương của bạn hữu ích',
    refId: 'rev_001',
    refType: 'review',
    isRead: false,
    createdAt: ago(1)
  },
  {
    id: 'notif_002',
    recipientUid: 'user_001',
    type: 'trip_reminder',
    title: 'Chuyến đi sắp tới!',
    body: 'Đà Nẵng - Hội An còn 20 ngày nữa. Hãy hoàn thiện lịch trình nhé!',
    refId: 'trip_002',
    refType: 'trip',
    isRead: false,
    createdAt: now
  },
  {
    id: 'notif_003',
    recipientUid: 'user_002',
    type: 'trip_shared',
    title: 'Bạn được chia sẻ một chuyến đi',
    body: 'Nguyễn Văn Tùng đã chia sẻ chuyến "Đà Lạt 3 ngày 2 đêm" với bạn',
    refId: 'trip_001',
    refType: 'trip',
    isRead: true,
    createdAt: ago(15)
  }
];

// ═══════════════════════════════════════════════════════
// 7. SETTINGS — dùng cho trang Settings
//    Platform Name, Support Email, Default Language, Maintenance Mode
// ═══════════════════════════════════════════════════════
const settings = [
  {
    id: 'app_settings',
    platformName: 'TravelMate',
    supportEmail: 'support@travelmate.local',
    defaultLanguage: 'vi',                        // "vi" | "en"
    maintenanceMode: false,
    maintenanceMessage: 'Hệ thống đang bảo trì, vui lòng quay lại sau.',
    // ── Cấu hình map API ──────────────────────────────
    mapProvider: 'google',                        // "google" | "openstreetmap"
    googleMapsApiKey: '',                         // Điền API key thực vào đây
    defaultMapCenter: { lat: 16.0, lng: 108.0 }, // Trung tâm bản đồ mặc định (Việt Nam)
    defaultMapZoom: 6,
    // ── Cấu hình review ───────────────────────────────
    requireReviewApproval: true,                  // true = review cần admin duyệt
    maxPhotosPerReview: 5,
    // ── Thống kê tổng quan (auto cập nhật) ───────────
    totalUsers: 5,
    totalPlaces: 5,
    totalReviews: 5,
    blockedUsers: 2,
    pendingReviews: 2,
    updatedAt: now
  }
];

// ═══════════════════════════════════════════════════════
// HÀM SEED
// ═══════════════════════════════════════════════════════
async function seedCollection(name, data) {
  console.log(`\n  Đang tạo "${name}"...`);
  const batch = db.batch();
  data.forEach(item => {
    const { id, ...fields } = item;
    batch.set(db.collection(name).doc(id), fields);
  });
  await batch.commit();
  console.log(`  ✓ ${data.length} documents`);
}

async function main() {
  console.log('\n════════════════════════════════════');
  console.log('  TravelMate - Seed Firebase v2');
  console.log('════════════════════════════════════');
  try {
    await seedCollection('users',         users);
    await seedCollection('places',        places);
    await seedCollection('reviews',       reviews);
    await seedCollection('trips',         trips);
    await seedCollection('expenses',      expenses);
    await seedCollection('notifications', notifications);
    await seedCollection('settings',      settings);
    console.log('\n  Xong! Vào Firebase Console kiểm tra:');
    console.log('  https://console.firebase.google.com\n');
    process.exit(0);
  } catch (err) {
    console.error('\n  Lỗi:', err.message, '\n');
    process.exit(1);
  }
}

main();
