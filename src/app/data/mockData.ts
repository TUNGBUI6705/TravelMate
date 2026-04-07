// Mock data for TravelMate Admin Dashboard

export const mockUsers = [
  { id: '001', name: 'Nguyễn Văn An', email: 'an.nguyen@email.com', joined: '2025-01-12', trips: 12, status: 'Active', avatar: null },
  { id: '002', name: 'Trần Thị Bích', email: 'bich.tran@gmail.com', joined: '2025-01-18', trips: 5, status: 'Active', avatar: null },
  { id: '003', name: 'Lê Hoàng Duy', email: 'duy.le@yahoo.com', joined: '2025-02-03', trips: 0, status: 'Banned', avatar: null },
  { id: '004', name: 'Phạm Minh Khoa', email: 'khoa.pham@hotmail.com', joined: '2025-02-10', trips: 8, status: 'Active', avatar: null },
  { id: '005', name: 'Hoàng Thu Hà', email: 'ha.hoang@email.com', joined: '2025-02-15', trips: 3, status: 'Pending', avatar: null },
  { id: '006', name: 'Võ Thị Mai', email: 'mai.vo@gmail.com', joined: '2025-02-18', trips: 15, status: 'Active', avatar: null },
  { id: '007', name: 'Đặng Quốc Hùng', email: 'hung.dang@email.com', joined: '2025-02-20', trips: 2, status: 'Active', avatar: null },
  { id: '008', name: 'Bùi Thanh Liêm', email: 'liem.bui@gmail.com', joined: '2025-02-21', trips: 0, status: 'Banned', avatar: null },
  { id: '009', name: 'Ngô Thị Lan', email: 'lan.ngo@email.com', joined: '2025-02-22', trips: 7, status: 'Active', avatar: null },
  { id: '010', name: 'Trương Minh Tâm', email: 'tam.truong@gmail.com', joined: '2025-02-23', trips: 1, status: 'Pending', avatar: null },
  { id: '011', name: 'Lý Thị Hoa', email: 'hoa.ly@email.com', joined: '2025-02-24', trips: 4, status: 'Active', avatar: null },
  { id: '012', name: 'Đinh Văn Toàn', email: 'toan.dinh@gmail.com', joined: '2025-02-24', trips: 9, status: 'Active', avatar: null },
  { id: '013', name: 'Cao Thị Yến', email: 'yen.cao@email.com', joined: '2025-02-25', trips: 0, status: 'Pending', avatar: null },
  { id: '014', name: 'Vũ Đức Mạnh', email: 'manh.vu@email.com', joined: '2025-02-25', trips: 6, status: 'Active', avatar: null },
  { id: '015', name: 'Phan Thị Thủy', email: 'thuy.phan@gmail.com', joined: '2025-02-25', trips: 11, status: 'Active', avatar: null },
];

export const mockPlaces = [
  { id: 'P001', name: 'Hội An Ancient Town', location: 'Hội An, Quảng Nam', category: 'Attraction', rating: 4.8, reviews: 1204, status: 'Published', createdBy: 'admin01', thumbnail: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=120&h=80&fit=crop' },
  { id: 'P002', name: 'Phong Nha Cave', location: 'Bố Trạch, Quảng Bình', category: 'Nature', rating: 4.9, reviews: 892, status: 'Published', createdBy: 'admin01', thumbnail: 'https://images.unsplash.com/photo-1599227538989-eb4f82a8a39c?w=120&h=80&fit=crop' },
  { id: 'P003', name: 'The Reverie Saigon', location: 'Quận 1, TP. HCM', category: 'Hotel', rating: 4.7, reviews: 543, status: 'Published', createdBy: 'admin02', thumbnail: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=120&h=80&fit=crop' },
  { id: 'P004', name: 'Bún Chả Hương Liên', location: 'Đống Đa, Hà Nội', category: 'Restaurant', rating: 4.6, reviews: 2108, status: 'Published', createdBy: 'admin01', thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&h=80&fit=crop' },
  { id: 'P005', name: 'Vincom Mega Mall', location: 'Hà Đông, Hà Nội', category: 'Shopping', rating: 4.2, reviews: 765, status: 'Published', createdBy: 'admin02', thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=120&h=80&fit=crop' },
  { id: 'P006', name: 'Sơn Đoòng Cave', location: 'Bố Trạch, Quảng Bình', category: 'Nature', rating: 5.0, reviews: 321, status: 'Draft', createdBy: 'admin01', thumbnail: 'https://images.unsplash.com/photo-1596815004716-e01a6ea9ee8a?w=120&h=80&fit=crop' },
  { id: 'P007', name: 'Nhà Hàng Ngon', location: 'Ba Đình, Hà Nội', category: 'Restaurant', rating: 4.4, reviews: 1876, status: 'Published', createdBy: 'admin03', thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=120&h=80&fit=crop' },
  { id: 'P008', name: 'Mũi Né Beach', location: 'Phan Thiết, Bình Thuận', category: 'Attraction', rating: 4.5, reviews: 654, status: 'Pending Review', createdBy: 'admin02', thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120&h=80&fit=crop' },
  { id: 'P009', name: 'Park Hyatt Saigon', location: 'Quận 1, TP. HCM', category: 'Hotel', rating: 4.8, reviews: 412, status: 'Published', createdBy: 'admin01', thumbnail: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=120&h=80&fit=crop' },
  { id: 'P010', name: 'Đà Lạt Night Market', location: 'Đà Lạt, Lâm Đồng', category: 'Shopping', rating: 4.3, reviews: 987, status: 'Published', createdBy: 'admin03', thumbnail: 'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?w=120&h=80&fit=crop' },
  { id: 'P011', name: 'Bạch Mã National Park', location: 'Phú Lộc, Thừa Thiên Huế', category: 'Nature', rating: 4.6, reviews: 234, status: 'Draft', createdBy: 'admin01', thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=120&h=80&fit=crop' },
  { id: 'P012', name: 'Long Beach Phú Quốc', location: 'Phú Quốc, Kiên Giang', category: 'Attraction', rating: 4.7, reviews: 1543, status: 'Archived', createdBy: 'admin02', thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=80&fit=crop' },
];

export const mockReviews = [
  { id: 'R001', reviewer: 'Nguyễn Văn An', reviewerId: '001', place: 'Hội An Ancient Town', placeCategory: 'Attraction', rating: 5, content: 'Tuyệt vời! Thành phố cổ đẹp như tranh vẽ, đèn lồng rực rỡ về đêm. Nhất định phải đến một lần trong đời.', date: '2025-02-10', status: 'Published' },
  { id: 'R002', reviewer: 'Trần Thị Bích', reviewerId: '002', place: 'Phong Nha Cave', placeCategory: 'Nature', rating: 5, content: 'Hang động kỳ vĩ nhất mà tôi từng thấy. Hướng dẫn viên rất nhiệt tình và chuyên nghiệp.', date: '2025-02-12', status: 'Published' },
  { id: 'R003', reviewer: 'Lê Hoàng Duy', reviewerId: '003', place: 'Nhà Hàng Ngon', placeCategory: 'Restaurant', rating: 2, content: 'Thức ăn không ngon như quảng cáo. Phục vụ chậm và thái độ kém. Sẽ không quay lại.', date: '2025-02-14', status: 'Flagged' },
  { id: 'R004', reviewer: 'Phạm Minh Khoa', reviewerId: '004', place: 'The Reverie Saigon', placeCategory: 'Hotel', rating: 5, content: 'Khách sạn sang trọng bậc nhất Sài Gòn. Dịch vụ 5 sao thực sự. Phòng rộng và view đẹp.', date: '2025-02-15', status: 'Published' },
  { id: 'R005', reviewer: 'Hoàng Thu Hà', reviewerId: '005', place: 'Bún Chả Hương Liên', placeCategory: 'Restaurant', rating: 4, content: 'Bún chả ngon, đặc biệt là quán này đã được tổng thống Obama ghé thăm. Hơi đông nhưng xứng đáng chờ.', date: '2025-02-16', status: 'Pending' },
  { id: 'R006', reviewer: 'Võ Thị Mai', reviewerId: '006', place: 'Mũi Né Beach', placeCategory: 'Attraction', rating: 4, content: 'Bãi biển đẹp, nước trong xanh. Tuy nhiên khá đông vào cuối tuần. Nên đến vào ngày thường.', date: '2025-02-17', status: 'Published' },
  { id: 'R007', reviewer: 'Đặng Quốc Hùng', reviewerId: '007', place: 'Vincom Mega Mall', placeCategory: 'Shopping', rating: 3, content: 'Trung tâm thương mại lớn nhưng giá hơi cao. Bãi đỗ xe thuận tiện.', date: '2025-02-18', status: 'Published' },
  { id: 'R008', reviewer: 'Bùi Thanh Liêm', reviewerId: '008', place: 'Park Hyatt Saigon', placeCategory: 'Hotel', rating: 1, content: 'Tệ hết sức! Phòng có mùi ẩm mốc. Sẽ kiện nếu không được hoàn tiền. Đừng đến đây!', date: '2025-02-19', status: 'Flagged' },
  { id: 'R009', reviewer: 'Ngô Thị Lan', reviewerId: '009', place: 'Đà Lạt Night Market', placeCategory: 'Shopping', rating: 4, content: 'Chợ đêm sôi động, nhiều đồ ăn ngon và quà lưu niệm độc đáo. Giá cả phải chăng.', date: '2025-02-20', status: 'Published' },
  { id: 'R010', reviewer: 'Trương Minh Tâm', reviewerId: '010', place: 'Sơn Đoòng Cave', placeCategory: 'Nature', rating: 5, content: 'Trải nghiệm không thể quên! Hang động lớn nhất thế giới, quá ấn tượng.', date: '2025-02-21', status: 'Pending' },
  { id: 'R011', reviewer: 'Lý Thị Hoa', reviewerId: '011', place: 'Long Beach Phú Quốc', placeCategory: 'Attraction', rating: 3, content: 'Bãi biển đẹp nhưng bị xây dựng nhiều quá. Mất đi vẻ hoang sơ ban đầu.', date: '2025-02-22', status: 'Hidden' },
  { id: 'R012', reviewer: 'Đinh Văn Toàn', reviewerId: '012', place: 'Hội An Ancient Town', placeCategory: 'Attraction', rating: 5, content: 'Cực kỳ đẹp và lãng mạn vào ban đêm. Chụp ảnh rất đẹp, nhất là khi thả đèn trời.', date: '2025-02-23', status: 'Published' },
];

export const userGrowthData = {
  '7days': [
    { date: '19 Feb', users: 45 }, { date: '20 Feb', users: 62 }, { date: '21 Feb', users: 38 },
    { date: '22 Feb', users: 78 }, { date: '23 Feb', users: 91 }, { date: '24 Feb', users: 55 }, { date: '25 Feb', users: 84 },
  ],
  '30days': [
    { date: '27 Jan', users: 120 }, { date: '29 Jan', users: 145 }, { date: '31 Jan', users: 98 },
    { date: '02 Feb', users: 167 }, { date: '04 Feb', users: 134 }, { date: '06 Feb', users: 201 },
    { date: '08 Feb', users: 178 }, { date: '10 Feb', users: 143 }, { date: '12 Feb', users: 221 },
    { date: '14 Feb', users: 198 }, { date: '16 Feb', users: 167 }, { date: '18 Feb', users: 234 },
    { date: '20 Feb', users: 189 }, { date: '22 Feb', users: 212 }, { date: '25 Feb', users: 247 },
  ],
  '90days': [
    { date: 'Dec', users: 1850 }, { date: 'Jan', users: 2340 }, { date: 'Feb', users: 2780 },
  ],
  '1year': [
    { date: 'Mar', users: 650 }, { date: 'Apr', users: 820 }, { date: 'May', users: 1100 },
    { date: 'Jun', users: 940 }, { date: 'Jul', users: 1350 }, { date: 'Aug', users: 1560 },
    { date: 'Sep', users: 1200 }, { date: 'Oct', users: 1780 }, { date: 'Nov', users: 1920 },
    { date: 'Dec', users: 1850 }, { date: 'Jan', users: 2340 }, { date: 'Feb', users: 2780 },
  ],
};

export const categoryDistribution = [
  { name: 'Attraction', value: 312, color: '#2196F3' },
  { name: 'Restaurant', value: 245, color: '#FF9800' },
  { name: 'Nature', value: 198, color: '#4CAF50' },
  { name: 'Hotel', value: 156, color: '#9C27B0' },
  { name: 'Shopping', value: 87, color: '#E91E63' },
  { name: 'Other', value: 26, color: '#607D8B' },
];

export const userStatusDistribution = [
  { name: 'Active', value: 10234, color: '#4CAF50' },
  { name: 'Inactive', value: 1876, color: '#9E9E9E' },
  { name: 'Banned', value: 42, color: '#F44336' },
  { name: 'Pending', value: 396, color: '#FF9800' },
];

export const monthlyGrowthData = [
  { month: 'Mar', new: 650, returning: 320 },
  { month: 'Apr', new: 820, returning: 410 },
  { month: 'May', new: 1100, returning: 580 },
  { month: 'Jun', new: 940, returning: 490 },
  { month: 'Jul', new: 1350, returning: 670 },
  { month: 'Aug', new: 1560, returning: 780 },
  { month: 'Sep', new: 1200, returning: 600 },
  { month: 'Oct', new: 1780, returning: 890 },
  { month: 'Nov', new: 1920, returning: 960 },
  { month: 'Dec', new: 1850, returning: 920 },
  { month: 'Jan', new: 2340, returning: 1170 },
  { month: 'Feb', new: 2780, returning: 1390 },
];

export const ratingDistribution = [
  { rating: '1★', count: 1240, color: '#F44336' },
  { rating: '2★', count: 2180, color: '#FF9800' },
  { rating: '3★', count: 8920, color: '#FFC107' },
  { rating: '4★', count: 18760, color: '#8BC34A' },
  { rating: '5★', count: 17202, color: '#4CAF50' },
];

export const topPlacesByReviews = [
  { name: 'Bún Chả Hương Liên', reviews: 2108, category: 'Restaurant' },
  { name: 'Nhà Hàng Ngon', reviews: 1876, category: 'Restaurant' },
  { name: 'Long Beach Phú Quốc', reviews: 1543, category: 'Attraction' },
  { name: 'Hội An Ancient Town', reviews: 1204, category: 'Attraction' },
  { name: 'Đà Lạt Night Market', reviews: 987, category: 'Shopping' },
  { name: 'Phong Nha Cave', reviews: 892, category: 'Nature' },
  { name: 'Vincom Mega Mall', reviews: 765, category: 'Shopping' },
  { name: 'Mũi Né Beach', reviews: 654, category: 'Attraction' },
];

export const recentActivity = [
  { type: 'ban', text: 'User Lê Hoàng Duy was banned for spam', time: '5 min ago', color: '#F44336' },
  { type: 'place', text: "New place 'Hội An Phố Cổ' was added", time: '12 min ago', color: '#2196F3' },
  { type: 'review', text: 'Review flagged on Nhà Hàng Ngon', time: '28 min ago', color: '#FF9800' },
  { type: 'user', text: 'New user Cao Thị Yến registered', time: '45 min ago', color: '#4CAF50' },
  { type: 'place', text: "Place 'Sơn Đoòng Cave' approved", time: '1 hr ago', color: '#4CAF50' },
];

export const adminAccounts = [
  { id: 'A001', name: 'Super Admin', email: 'superadmin@travelmate.com', role: 'Super Admin', lastLogin: '25 Feb 2026', status: 'Active' },
  { id: 'A002', name: 'Mod Linh', email: 'linh.mod@travelmate.com', role: 'Moderator', lastLogin: '24 Feb 2026', status: 'Active' },
  { id: 'A003', name: 'Analyst Minh', email: 'minh.analyst@travelmate.com', role: 'Analyst', lastLogin: '23 Feb 2026', status: 'Active' },
  { id: 'A004', name: 'Mod Hải', email: 'hai.mod@travelmate.com', role: 'Moderator', lastLogin: '20 Feb 2026', status: 'Inactive' },
];
