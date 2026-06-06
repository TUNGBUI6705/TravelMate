import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { storageService } from '../../data/services/storageService';

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  onDeleteSuccess?: () => void;
  currentImageUrl?: string;
  folder?: string;
  label?: string;
  aspectRatio?: string;
}

export default function ImageUpload({
  onUploadSuccess,
  onDeleteSuccess,
  currentImageUrl,
  folder = 'general',
  label = 'Ảnh đại diện',
  aspectRatio = '16/9'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra kích thước file (ví dụ < 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File quá lớn. Vui lòng chọn file dưới 5MB.');
      return;
    }

    try {
      setIsUploading(true);
      const url = await storageService.uploadFile(file, folder);
      onUploadSuccess(url);
    } catch (error: any) {
      alert('Lỗi upload: ' + error.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentImageUrl) return;

    if (window.confirm('Bạn có chắc chắn muốn xóa ảnh này?')) {
      try {
        await storageService.deleteFile(currentImageUrl);
        if (onDeleteSuccess) onDeleteSuccess();
      } catch (error: any) {
        alert('Lỗi khi xóa: ' + error.message);
      }
    }
  };

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {label && <label style={{ fontSize: 14, fontWeight: 600, color: '#344155' }}>{label}</label>}

      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: aspectRatio,
          borderRadius: 8,
          border: '2px dashed #d9e0ea',
          backgroundColor: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isUploading ? 'not-allowed' : 'pointer',
          overflow: 'hidden',
          transition: 'all 0.2s'
        }}
      >
        {currentImageUrl ? (
          <>
            <img
              src={currentImageUrl}
              alt="Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {!isUploading && (
              <button
                onClick={handleDelete}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  padding: 6,
                  color: '#ef4444',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <X size={16} />
              </button>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: 20 }}>
            {isUploading ? (
              <Loader2 size={24} className="animate-spin" color="#1d4ed8" />
            ) : (
              <>
                <Upload size={24} color="#647087" style={{ marginBottom: 8 }} />
                <p style={{ margin: 0, fontSize: 14, color: '#647087' }}>Click để tải ảnh lên</p>
              </>
            )}
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}
