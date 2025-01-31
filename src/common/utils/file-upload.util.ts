// src/common/utils/file-upload.util.ts
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const fileUploadOptions = {
  storage: diskStorage({
    destination: './uploads', // Tentukan folder untuk menyimpan file
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname); // Ekstensi file
      const fileName = `${uuidv4()}${fileExt}`; // Nama file unik
      cb(null, fileName); // Simpan file dengan nama yang unik
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif']; // Jenis file yang diizinkan
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true); // Terima file jika sesuai filter
    } else {
      cb(new Error('Invalid file type! Only image files are allowed.'), false); // Tolak file yang tidak sesuai
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // Batas ukuran file (5MB)
  },
};