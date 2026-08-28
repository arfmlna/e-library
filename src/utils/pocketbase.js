import PocketBase from 'pocketbase'

const Config = {
  pocketBaseUrl: import.meta.env.VITE_POCKETBASE_URL
};

export const pb = new PocketBase(Config.pocketBaseUrl);
pb.autoCancellation(false)