export const validateFileSize = (file, maxSizeMB) => {
  if (!file) {
    return { isValid: false, error: "Tidak ada file yang dipilih." };
  }

  const maxSizeInBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeInBytes) {
    return {
      isValid: false,
      error: `Ukuran file terlalu besar! Maksimal ${maxSizeMB} MB.`,
    };
  }

  return { isValid: true, error: null };
};
