import { pb } from "./pocketbase";

export const fetchUserProfile = async (userId) => {
    if (!userId) return null;
    try {
        return await pb.collection('user_profiles').getFirstListItem(`user = "${userId}"`);
    } catch (error) {
        if (error.status === 404) return null;
        throw error;
    }
};

export const saveUserProfile = async ({ userId, recordId, profileData }) => {
    const data = {
        user: userId,
        address: profileData.address,
        birth_date: profileData.birth_date,
        bio: profileData.bio
    };

    if (recordId) {
        return await pb.collection('user_profiles').update(recordId, data);
    } else {
        return await pb.collection('user_profiles').create(data);
    }
};
