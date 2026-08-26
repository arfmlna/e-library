import { pb } from "@/utils/pocketbase"

export const logs = async (userId, actionType, method) => {
    let ipAddress = 'Unknown';
    try {
        const response = await fetch('/api-ipify?format=json');
        if (response.ok) {
            const data = await response.json();
            ipAddress = data.ip || 'Unknown';
        }
    } catch (ipError) {
        console.error("Gagal mengambil IP dari ipify:", ipError);
    }

    try {
        await pb.collection('auth_logs').create({
            user: userId,
            action: actionType,
            method: method,
            ip_address: ipAddress,
            user_agent: navigator.userAgent 
        })
    } catch (error) {
        console.error('logs: ', error)
    }
}