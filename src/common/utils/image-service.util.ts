import * as fs from 'fs';
import * as path from 'path';

// Example for deleting an image from the local filesystem
export async function deleteImageFromStorage(imagePath: string): Promise<void> {
    try {
        // Arahkan path ke folder uploads di root proyek
        const uploadsDir = path.resolve(process.cwd(), 'uploads');
        const fullImagePath = path.join(uploadsDir, path.basename(imagePath));

        // Debug log untuk memastikan path benar
        console.log('Mencoba menghapus gambar di path:', fullImagePath);

        // Mengecek apakah gambar ada sebelum menghapus
        await fs.promises.access(fullImagePath, fs.constants.F_OK)
            .then(async () => { 
                await fs.promises.unlink(fullImagePath);
                console.log('Gambar berhasil dihapus di path:', fullImagePath);
            })
            .catch(() => {
                console.log('Gambar tidak ditemukan di path:' , fullImagePath);
            });

    } catch (error) {
        console.error('Terjadi kesalahan saat menghapus gambar:', error);
        throw new Error('Gagal menghapus gambar');
    }
}