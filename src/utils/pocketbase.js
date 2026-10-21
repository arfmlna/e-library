import PocketBase from 'pocketbase'

const Config = {
  pocketBaseUrl: import.meta.env.VITE_POCKETBASE_URL
};

export const pb = new PocketBase(Config.pocketBaseUrl);

pb.autoCancellation(false)

pb.beforeSend = (url, options) => ({
    url,
    options: {
        ...options,
        headers: {
            ...options.headers,
            'ngrok-skip-browser-warning': 'true'
        }
    }
});

// pb.beforeSend = function (url, options) {
//     options.headers = options.headers || {};
//     options.headers['ngrok-skip-browser-warning'] = 'true';
//     return { url, options }; 
// };