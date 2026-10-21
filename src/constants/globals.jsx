import { pb } from "@/utils/pocketbase";
import { openDB } from "idb";
import Swal from "sweetalert2";
import { decryptBookData, encryptBlob, getEncryptionKey } from "./Cryptography";

const storeName = 'offline_books'

export const saveBookToOffline = async (book, userId) => {
    if (!userId) {
        Swal.fire({ icon: 'error', title: 'Akses Ditolak', text: 'Silakan login terlebih dahulu.' });
        return false;
    }

    try {
        const setting = await pb.collection("settings").getFirstListItem("", {
            fields: 'allow_offline_download'
        });
        if (setting.allow_offline_download === false) {
            Swal.fire({
                title: "Unduhan Dinonaktifkan!",
                text: "Mohon maaf, fitur unduhan offline sedang dimatikan oleh sistem.",
                icon: "error",
                confirmButtonText: "Mengerti",
                confirmButtonColor: "#ef4444"
            });
            return;
        }
    } catch (error) {
        if (import.meta.env.DEV) {
            console.log(error.originalError)
        }
        Swal.fire({
            title: "Gagal Ambil Data Setting!",
            text: "Gagal mengambil data setting dari server untuk membuka feature download buku offline.",
            icon: "error",
            confirmButtonText: "Mengerti",
            confirmButtonColor: "#ef4444"
        });
        return;
    }

    const dbName = `PocketBook_DB_user_${userId}`;

    const { id, kode_buku, title, author, expand, poster, pdfFile, bookType, publishDate } = book;

    Swal.fire({ 
        title: 'Mengunduh...', 
        html: `Menyimpan <b>${title}</b> dengan aman ke lokal`,
        allowOutsideClick: false, 
        didOpen: () => Swal.showLoading() 
    });

    try {
        const cryptoKey = await getEncryptionKey(userId);

        const db = await openDB(dbName, 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: 'id' });
                }
            }
        });

        const bookData = {
            id,
            kode: kode_buku,
            title,
            author,
            publishDate,
            uploader: expand?.uploader?.name || "N/A",
            publisher: expand?.supplier?.supplier || 'N/A',
            category: expand?.category ? JSON.parse(JSON.stringify(expand.category)) : null, 
            bookType: bookType || "Digital", 
            savedAt: new Date().toISOString(),
            pdfBlob: null,
            poster: null
        };

        const downloadPromises = [];

        // if (pdfFile && typeof pdfFile === 'string' && pdfFile.trim() !== '') {
        //     const fileUrl = pb.files.getURL(book, pdfFile); 

        //     downloadPromises.push(
        //         fetch(fileUrl, { mode: 'cors' })
        //             .then(async (res) => {
        //                 if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        //                 const rawBlob = await res.blob();
        //                 bookData.pdfBlob = await encryptBlob(rawBlob, cryptoKey);
        //             })
        //             .catch((e) => {
        //                 throw new Error(`Gagal mengunduh PDF: ${e.message}`);
        //             })
        //     );
        // }

        if (pdfFile && typeof pdfFile === 'string' && pdfFile.trim() !== '') {
            const fileUrl = pb.files.getURL(book, pdfFile);

            downloadPromises.push(
                fetch(fileUrl)
                    .then(async res => {
                        if (!res.ok) throw new Error(`HTTP ${res.status}`);

                        const rawBlob = await res.blob();
                        if (!rawBlob.size || rawBlob.type !== 'application/pdf') {
                            throw new Error('File yang diunduh bukan PDF yang valid.');
                        }

                        bookData.pdfBlob = await encryptBlob(rawBlob, cryptoKey);
                        if (!bookData.pdfBlob) throw new Error('Enkripsi PDF gagal.');
                    })
                    .catch(e => {
                        throw new Error(`Gagal mengunduh PDF: ${e.message}`);
                    })
            );
        }

        // 2. Proses Unduh & Enkripsi Poster
        if (poster && typeof poster === 'string' && poster.trim() !== '') {
            const posterUrl = pb.files.getURL(book, poster);

            downloadPromises.push(
                fetch(posterUrl, { mode: 'cors' })
                    .then(async (res) => {
                        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                        const rawBlob = await res.blob();
                        bookData.poster = await encryptBlob(rawBlob, cryptoKey);
                    })
                    .catch((e) => {
                        if (import.meta.env.DEV) {
                            console.error("Gagal proses Poster:", e);
                        }
                    })
            );
        }

        // Jalankan semua proses download
        if (downloadPromises.length > 0) {
            await Promise.all(downloadPromises);
        }

        // VALIDASI UTAMA: Jika pdfFile ada di database online tapi gagal diunduh ke lokal, batalkan penyimpanan.
        if (!pdfFile && !bookData.pdfBlob) {
            throw new Error("Berkas PDF gagal diproses ke penyimpanan lokal.");
        }

        // Simpan ke IndexedDB
        await db.put(storeName, bookData);

        Swal.fire({ icon: 'success', title: 'Buku Tersimpan!', timer: 1500, showConfirmButton: false });
        return true;
    } catch (error) {
        if (import.meta.env.DEV) {
            console.error("Error saat offline saving:", error);
        }
        Swal.fire({ icon: 'error', title: 'Gagal mengunduh', text: error.message });
        return false;
    }
};

export const getOfflineBooksList = async (page, perPage, searchTerm, userId) => {
  if (!userId) {
    return {
        page: page,
        perPage: perPage,
        totalItems: 0,
        totalPages: 1,
        items: []
    };
  }

  const dynamicDbName = `PocketBook_DB_user_${userId}`;

  try {
    const db = await openDB(dynamicDbName, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'id' });
            }
        }
    });

    let allBlobs = await db.getAll(storeName);

    if (searchTerm) {
        allBlobs = allBlobs.filter(book => 
            book.title && book.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    allBlobs.sort((a, b) => new Date(b.savedAt || b.created) - new Date(a.savedAt || a.created));

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedItems = allBlobs.slice(startIndex, endIndex);

    const decryptedItems = await Promise.all(
        paginatedItems.map(async (book) => {
            const updatedBook = { ...book };

            // Dekripsi Poster jika ada data biner terenkripsi
            if (book.poster) {
                // Dekripsi menjadi Blob gambar (asumsi tipe image/jpeg atau png, browser pintar membacanya otomatis)
                const posterBlob = await decryptBookData(book.poster, userId, "image/jpeg");
                if (posterBlob) {
                    // Mengubah Blob menjadi URL lokal terenkripsi (bisa langsung dimasukkan ke tag <img src="..." />)
                    updatedBook.posterUrl = URL.createObjectURL(posterBlob);
                }
            }

            if (book.pdfBlob) {
                const pdfBlobDecrypted = await decryptBookData(book.pdfBlob, userId, "application/pdf");
                if (pdfBlobDecrypted) {
                    updatedBook.pdfUrl = URL.createObjectURL(pdfBlobDecrypted);
                }
            }

            return updatedBook;
        })
    );

    return {
        page: page,
        perPage: perPage,
        totalItems: allBlobs.length,
        totalPages: Math.ceil(allBlobs.length / perPage) || 1,
        items: decryptedItems 
    };

  } catch (error) {
    if (import.meta.env.DEV) {
        console.error("Gagal mengambil daftar buku offline:", error);
    }
    return {
        page: page,
        perPage: perPage,
        totalItems: 0,
        totalPages: 1,
        items: []
    };
  }
};

export const getOfflineBookById = async (id, userId) => {
    if (!userId) {
        if (import.meta.env.DEV) {
            console.warn("userId tidak tersedia. Gagal mengambil buku offline.");
        }
        return null;
    }

    const dbName = `PocketBook_DB_user_${userId}`;

    try {
        const db = await openDB(dbName, 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: 'id' });
                }
            }
        });

        // Ambil data buku dari IndexedDB
        const book = await db.get(storeName, id);
        
        if (book) {
            const updatedBook = { ...book };

            // 1. PROSES DEKRIPSI PDF
            if (book.pdfBlob) {
                const pdfBlobDecrypted = await decryptBookData(book.pdfBlob, userId, "application/pdf");
                if (pdfBlobDecrypted) {
                    // Menghasilkan string URL 'blob:http...' untuk PDF Viewer
                    updatedBook.pdfUrl = URL.createObjectURL(pdfBlobDecrypted);
                }
            }

            // 2. PROSES DEKRIPSI POSTER
            if (book.poster) {
                const posterBlobDecrypted = await decryptBookData(book.poster, userId, "image/jpeg");
                if (posterBlobDecrypted) {
                    updatedBook.posterUrl = URL.createObjectURL(posterBlobDecrypted);
                }
            }

            return updatedBook;
        }
        if (import.meta.env.DEV) {
            console.warn(`Buku dengan ID ${id} tidak ditemukan di penyimpanan offline.`);
        }
        return null;

    } catch (error) {
        if (import.meta.env.DEV) {
            console.error("Gagal membaca atau mendekripsi dari IndexedDB:", error);
        }
        return null;
    }
};

export const removeBookFromOffline = async (bookId, userId) => {
    // 1. Validasi akun user
    if (!userId) {
        Swal.fire({ icon: 'error', title: 'Gagal', text: 'User tidak valid.' });
        return false;
    }

    // 2. Arahkan ke database spesifik milik user tersebut
    const dynamicDbName = `PocketBook_DB_user_${userId}`;
    const storeName = 'offline_books';

    try {
        const db = await openDB(dynamicDbName, 1);

        // 3. Eksekusi penghapusan berdasarkan key (id buku)
        await db.delete(storeName, bookId);

        Swal.fire({ 
            icon: 'success', 
            title: 'Berhasil Dihapus', 
            text: 'Buku telah dihapus dari penyimpanan offline.',
            timer: 1500, 
            showConfirmButton: false 
        });
        
        return true;
    } catch (error) {
        if (import.meta.env.DEV) {
            console.error("Gagal menghapus buku dari IndexedDB:", error);
        }
        Swal.fire({ icon: 'error', title: 'Gagal menghapus', text: error.message });
        return false;
    }
};
