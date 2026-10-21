import { pb } from "./pocketbase";

export const fetchLibrarySettings = async () => {
    try {
        const records = await pb.collection('settings').getFullList(1);
        return records[0] || null;
    } catch (error) {
        if (import.meta.env.DEV) {       
            console.error("Gagal memuat pengaturan:", error);
        }
        throw error;
    }
};

export const updateLibrarySettings = async ({ id, data }) => {
    try {
        return await pb.collection('settings').update(id, data);
    } catch (error) {
        if (import.meta.env.DEV) {       
            console.error(error.originalError);
        }
        throw error;
    }
};