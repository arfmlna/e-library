import PocketBase from 'pocketbase'

export const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

pb.beforeSend = function (url, options) {
    options.headers = Object.assign({}, options.headers, {
        'ngrok-skip-browser-warning': true
    })
    return { url, options }
}