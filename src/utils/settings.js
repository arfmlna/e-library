import { pb } from "./pocketbase";

export const getSettings = async () => {
    try {
        return await pb.collection('settings').getFirstListItem('');
    } catch (error) {
        if (import.meta.env.DEV) {       
            console.error('Gagal mengambil settings:', error);
        }
        return null;
    }
};