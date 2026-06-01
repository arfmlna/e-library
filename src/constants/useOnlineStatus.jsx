import { useSyncExternalStore } from 'react';

// 1. Buat fungsi subscribe untuk mendengarkan perubahan status browser
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  
  // Fungsi pembersih otomatis (cleanup)
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

// 2. Buat fungsi untuk mengambil data status saat ini dari sistem
function getSnapshot() {
  return navigator.onLine;
}

const useOnlineStatus = () => {
  // 3. Gunakan useSyncExternalStore agar React mensinkronkan status internet secara native
  return useSyncExternalStore(subscribe, getSnapshot);
};

export default useOnlineStatus;
