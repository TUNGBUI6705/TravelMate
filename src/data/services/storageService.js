import { supabase } from '../../config/supabase';

const BUCKET_NAME = 'Travelmate_images';

export const storageService = {
  /**
   * Tải một file lên Supabase Storage
   * @param {File} file - Đối tượng File từ input
   * @param {string} folder - Thư mục lưu trữ ('destinations', 'users', 'reviews')
   * @returns {Promise<string>} - URL công khai của file sau khi tải lên
   */
  async uploadFile(file, folder = 'general') {
    if (!file) return null;

    try {
      // 1. Tạo tên file duy nhất để tránh trùng lặp
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // 2. Thực hiện upload
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // 3. Lấy URL công khai (Public URL)
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Lỗi upload file lên Supabase:', err);
      throw new Error(`Upload thất bại: ${err.message}`);
    }
  },

  /**
   * Tải nhiều file cùng lúc
   * @param {File[]} files - Danh sách các file
   * @param {string} folder - Thư mục
   * @returns {Promise<string[]>} - Danh sách URL
   */
  async uploadMultipleFiles(files, folder = 'general') {
    if (!files || files.length === 0) return [];

    const uploadPromises = Array.from(files).map(file => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  },

  /**
   * Xóa file khỏi Supabase Storage dựa trên URL
   * @param {string} url - URL công khai của file
   */
  async deleteFile(url) {
    if (!url || !url.includes('supabase.co')) return;

    try {
      // Trích xuất path từ URL: .../public/bucket_name/folder/filename.ext
      const urlObj = new URL(url);
      const parts = urlObj.pathname.split('/');

      // Tìm vị trí của bucket name trong path
      const bucketIdx = parts.indexOf(BUCKET_NAME);
      if (bucketIdx === -1) return;

      // Lấy phần path sau bucket name
      const filePath = parts.slice(bucketIdx + 1).join('/');

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

      if (error) throw error;

      console.log(`Đã xóa file: ${filePath}`);
    } catch (err) {
      console.error('Lỗi khi xóa file trên Supabase:', err);
    }
  },

  /**
   * Xóa nhiều file dựa trên danh sách URL
   */
  async deleteMultipleFiles(urls) {
    if (!urls || urls.length === 0) return;
    const deletePromises = urls.map(url => this.deleteFile(url));
    await Promise.all(deletePromises);
  }
};
