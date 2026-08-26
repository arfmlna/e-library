import { pb } from "./pocketbase";

export const fetchAuthLogs = async () => {
    try {
        return await pb.collection('auth_logs').getFullList({
            expand: 'user',
            sort: '-created', // Urutkan dari yang paling baru masuk
            fields: 'id,action,method,ip_address,created,user_agent,expand.user.name,expand.user.email'
        });
    } catch (error) {
        console.error("Gagal mengambil auth logs:", error);
        throw error;
    }
};