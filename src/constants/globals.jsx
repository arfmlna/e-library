import { pb } from "@/utils/pocketbase";
import { openDB } from "idb";
import { createContext, useState } from "react";
import Swal from "sweetalert2";
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

export const ConfigContext = createContext()

let setConfigRef

export const ConfigProvider = ({ children }) => {
    const [config, setConfig] = useState({
        app: {
            theme: 'light'
        }
    })

    setConfigRef = setConfig

    return (
        <ConfigContext.Provider value={{ config }}>
            { children }
        </ConfigContext.Provider>
    )
}

export const updateConfig = (partialConfig) => {
  if (setConfigRef) {
    setConfigRef(prev => ({ ...prev, ...partialConfig }));  // Merge aman
  }
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'long', // Contoh: 24 Oktober 2023
        timeStyle: 'short', // Contoh: 08:30
    }).format(date);
};

export const timeAgo = (dateString) => {
  return formatDistanceToNow(new Date(dateString), { 
    addSuffix: true, 
    locale: id 
  });
};

export const logs = async (id, action, method) => {
    try {
        await pb.collection('logs').create({
            user: id,
            action: action,
            method: method
        })
    } catch (error) {
        console.error('logs: ', error)
    }
}

const dbName = 'bookStore'
const storeName = 'offline_books'

// export const saveBookToOffline = async (book) => {
//     const { id, title, author, expand, poster, collectionId, pdfFile } = book;
//     const fileUrl = `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${collectionId}/${id}/${pdfFile}`;
//     const posterUrl = `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${collectionId}/${id}/${poster}`;

//     Swal.fire({ 
//         title: 'Mengunduh...', 
//         html: `Menyimpan <b>${title}</b> ke lokal`,
//         allowOutsideClick: false, 
//         didOpen: () => Swal.showLoading() 
//     });

//     try {
//         const db = await openDB(dbName, 2, {
//             upgrade(db) {
//                 if (!db.objectStoreNames.contains(storeName)) {
//                     db.createObjectStore(storeName, {
//                         keyPath: 'id'
//                     });
//                 }
//             }
//         });

//         const [resFile, resPoster] = await Promise.all([
//             fetch(fileUrl, { mode: 'cors' }),
//             fetch(posterUrl, { mode: 'cors' })
//         ]);

//         const blobFile = await resFile.blob();
//         const blobPoster = await resPoster.blob();

//         const bookData = {
//             id,
//             title,
//             author,
//             poster: blobPoster,
//             uploader: expand?.uploader?.name || "Anonim",
//             pdfBlob: blobFile,
//             savedAt: new Date().toISOString()
//         };

//         await db.put(storeName, bookData);

//         Swal.fire({ icon: 'success', title: 'Tersimpan!', timer: 1500, showConfirmButton: false });
//         return true;
//     } catch (error) {
//         console.error(error)
//         Swal.fire({ icon: 'error', title: 'Gagal mengunduh' });
//         return false;
//     }
// };

export const saveBookToOffline = async (book) => {
    const { id, title, author, expand, poster, collectionId, pdfFile } = book;
    const fileUrl = `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${collectionId}/${id}/${pdfFile}`;
    const posterUrl = `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${collectionId}/${id}/${poster}`;

    Swal.fire({ 
        title: 'Mengunduh...', 
        html: `Menyimpan <b>${title}</b> ke lokal`,
        allowOutsideClick: false, 
        didOpen: () => Swal.showLoading() 
    });

    try {
        // 1. Cek dulu versi database saat ini di browser
        let currentDB = await openDB(dbName);
        let currentVersion = currentDB.version;
        
        // Jika object store belum ada, kita harus menaikkan versi agar fungsi upgrade berjalan
        const needsUpgrade = !currentDB.objectStoreNames.contains(storeName);
        currentDB.close(); // Selalu tutup koneksi sebelum membuka kembali dengan versi baru

        const targetVersion = needsUpgrade ? currentVersion + 1 : currentVersion;

        // 2. Buka database dengan target versi yang sesuai
        const db = await openDB(dbName, targetVersion, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: 'id' });
                }
            }
        });

        // 3. Proses unduh file (Blob)
        const [resFile, resPoster] = await Promise.all([
            fetch(fileUrl, { mode: 'cors' }),
            fetch(posterUrl, { mode: 'cors' })
        ]);

        const blobFile = await resFile.blob();
        const blobPoster = await resPoster.blob();

        const bookData = {
            id,
            title,
            author,
            poster: blobPoster,
            uploader: expand?.uploader?.name || "Anonim",
            pdfBlob: blobFile,
            savedAt: new Date().toISOString()
        };

        // 4. Simpan ke IndexedDB
        await db.put(storeName, bookData);

        Swal.fire({ icon: 'success', title: 'Tersimpan!', timer: 1500, showConfirmButton: false });
        return true;
    } catch (error) {
        console.error(error);
        Swal.fire({ icon: 'error', title: 'Gagal mengunduh', text: error.message });
        return false;
    }
};



// export const getAllOfflineBooks = async () => {
//   const db = await openDB(dbName, 2);
// //   const allIds = await db.getAllKeys(storeName);
//   const allBlobs = await db.getAll(storeName);
//   return allBlobs;
// };

export const getOfflineBooksList = async (page, perPage, searchTerm) => {
  // 1. Cek dulu versi database saat ini di browser
  let currentDB = await openDB(dbName);
  let currentVersion = currentDB.version;
  
  // Jika object store belum ada, kita harus menaikkan versi agar fungsi upgrade berjalan
  const needsUpgrade = !currentDB.objectStoreNames.contains(storeName);
  currentDB.close(); // Selalu tutup koneksi sebelum membuka kembali dengan versi baru

  const targetVersion = needsUpgrade ? currentVersion + 1 : currentVersion;

  // 2. Buka database dengan target versi yang sesuai
  const db = await openDB(dbName, targetVersion, {
      upgrade(db) {
          if (!db.objectStoreNames.contains(storeName)) {
              db.createObjectStore(storeName, { keyPath: 'id' });
          }
      }
  });

  // 3. Ambil semua data dari store yang sudah dipastikan ada
  let allBlobs = await db.getAll(storeName);

  // Filter berdasarkan searchTerm jika ada (mirip: title ~ "search")
  if (searchTerm) {
    allBlobs = allBlobs.filter(book => 
      book.title && book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Urutkan berdasarkan tanggal dibuat menurun (menggunakan properti savedAt dari fungsi simpan Anda)
  allBlobs.sort((a, b) => new Date(b.savedAt || b.created) - new Date(a.savedAt || a.created));

  // Simulasi Pagination (mirip: getList(page, 8))
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedItems = allBlobs.slice(startIndex, endIndex);

  return {
    page: page,
    perPage: perPage,
    totalItems: allBlobs.length,
    totalPages: Math.ceil(allBlobs.length / perPage || 1), // Mencegah hasil 0 jika data kosong
    items: paginatedItems 
  };
};


export const getOfflineBookById = async (id) => {
    const db = await openDB(dbName, 2);
    const data = await db.get(storeName, id);
    
    if (data) {
        return data;
    }

    console.warn(`Buku dengan ID ${id} tidak ditemukan di IDB, mengambil dari server...`);

    try {
        const serverData = await pb.collection('books').getOne(id, { requestKey: null });
        return serverData;
    } catch (error) {
        if (error.isAbort) return null;
        throw error;
    }
}