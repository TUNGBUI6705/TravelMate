/**
 * TravelMate - Review & Status Update Seed Script
 * Chạy: node seed_reviews.cjs
 *
 * Script này thực hiện:
 * 1. Cập nhật status của tất cả destinations thành "active".
 * 2. Tạo dữ liệu đánh giá (reviews) mẫu dựa trên user và địa điểm thực tế.
 */

require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Khởi tạo Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.VITE_FIREBASE_DATABASE_URL
  });
}

const db = admin.database();

async function seedReviews() {
  console.log('\n════════════════════════════════════');
  console.log('  TravelMate - Seed Reviews & Status');
  console.log('════════════════════════════════════');

  try {
    // 1. Lấy dữ liệu thực tế từ Database
    console.log('  Đang đọc dữ liệu người dùng và địa điểm...');
    const usersSnapshot = await db.ref('users').get();
    const destinationsSnapshot = await db.ref('destinations').get();

    if (!usersSnapshot.exists() || !destinationsSnapshot.exists()) {
      console.error('  ❌ Lỗi: Không tìm thấy dữ liệu users hoặc destinations để thực hiện seed.');
      return;
    }

    const usersData = usersSnapshot.val();
    const destinationsData = destinationsSnapshot.val();

    const userList = Object.keys(usersData).map(uid => ({
      uid,
      fullName: usersData[uid].fullName || usersData[uid].displayName || 'Anonymous User'
    }));

    const destinationIds = Object.keys(destinationsData);

    // 2. Cập nhật Status của tất cả địa điểm thành "active"
    console.log(`  Đang cập nhật status cho ${destinationIds.length} địa điểm...`);
    const statusUpdates = {};
    destinationIds.forEach(id => {
      statusUpdates[`destinations/${id}/status`] = 'active';
    });
    await db.ref().update(statusUpdates);
    console.log('  ✅ Đã cập nhật tất cả địa điểm thành "active".');

    // 3. Tạo Reviews mẫu
    console.log('  Đang tạo dữ liệu đánh giá mẫu...');
    const reviews = {};
    const sampleComments = [
      "Địa điểm tuyệt vời, phong cảnh rất đẹp!",
      "Chuyến đi rất đáng nhớ, đồ ăn ở đây ngon tuyệt.",
      "Không gian yên tĩnh, thích hợp để nghỉ dưỡng.",
      "Dịch vụ rất tốt, người dân thân thiện.",
      "Trải nghiệm tuyệt vời, nhất định sẽ quay lại!",
      "Cảnh quan hùng vĩ, chụp ảnh rất đẹp.",
      "Một nơi đáng để khám phá cùng bạn bè.",
      "Không khí trong lành, rất thoải mái.",
      "Hơi đông đúc vào cuối tuần nhưng vẫn rất tuyệt.",
      "Kiến trúc độc đáo và mang đậm nét văn hóa."
    ];

    let reviewCounter = 1;

    // Tạo cho mỗi địa điểm ít nhất 1-3 đánh giá ngẫu nhiên
    destinationIds.forEach(placeId => {
      const placeName = destinationsData[placeId].name || destinationsData[placeId].title;
      const numReviews = Math.floor(Math.random() * 3) + 1; // 1 đến 3 reviews

      for (let i = 0; i < numReviews; i++) {
        const randomUser = userList[Math.floor(Math.random() * userList.length)];
        const reviewId = `rev_${placeId}_${reviewCounter++}`;

        reviews[reviewId] = {
          id: reviewId,
          placeId: placeId,
          placeName: placeName,
          reviewerId: randomUser.uid,
          reviewerName: randomUser.fullName,
          rating: Math.floor(Math.random() * 2) + 4, // Chỉ seed 4-5 sao cho đẹp
          comment: sampleComments[Math.floor(Math.random() * sampleComments.length)],
          status: 'approved',
          createdAt: Date.now() - Math.floor(Math.random() * 30) * 86400000 // Trong vòng 30 ngày qua
        };
      }
    });

    // 4. Lưu Reviews vào database (Sử dụng update để không đè các node khác)
    console.log(`  Đang lưu ${Object.keys(reviews).length} đánh giá mới...`);
    await db.ref('reviews').set(reviews);

    console.log('\n  ✅ HOÀN TẤT: Đã cập nhật status và seed reviews thành công!');
    process.exit(0);

  } catch (err) {
    console.error('\n  ❌ Lỗi thực thi:', err.message);
    process.exit(1);
  }
}

seedReviews();
