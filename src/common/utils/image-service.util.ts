import * as fs from 'fs';
import * as path from 'path';

// Example for deleting an image from the local filesystem
export async function deleteImageFromStorage(imagePath: string): Promise<void> {
    try {
        // Menentukan path lengkap gambar
        const fullImagePath = path.resolve(__dirname, '..', 'uploads', imagePath);

        // Debug log untuk memastikan path gambar
        console.log('Mencoba menghapus gambar di path:', fullImagePath);

        // Mengecek apakah gambar ada
        if (fs.existsSync(fullImagePath)) {
            // Menghapus gambar dari filesystem
            fs.unlinkSync(fullImagePath);
            console.log('Gambar berhasil dihapus di path:', fullImagePath);
        } else {
            console.log('Gambar tidak ditemukan di path:', fullImagePath);  // Log jika gambar tidak ditemukan
        }
    } catch (error) {
        console.error('Terjadi kesalahan saat menghapus gambar:', error);
        throw new Error('Gagal menghapus gambar');
    }
}
