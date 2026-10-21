import { pb } from '@/utils/pocketbase';
import React, { useEffect, useState } from 'react';

export default function CloudStorageInfo({ value, onChange }) {
    const [storage, setStorage] = useState({ used: 0, total: 100 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGlobalStorage() {
            try {
                const result = await pb.send("/api/global-storage", {
                    method: "GET"
                });

                setStorage({
                    used: result.usedStorageGB,
                    total: result.maxStorageGB
                });
            } catch (error) {
                if (import.meta.env.DEV) {       
                    console.error("Gagal memuat kapasitas storage global:", error.message);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchGlobalStorage();
    }, []);

    const storagePercentage = Math.min((storage.used / storage.total) * 100, 100);

    return (
        <div className="card bg-base-200/50 shadow-sm">
            <div className="card-body p-5">
                <h2 className="card-title text-sm font-bold uppercase tracking-wider">Kapasitas Cloud Server</h2>
                <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                    <span>Penyimpanan E-Book</span>
                    <span className="font-bold">
                        {loading ? "Menghitung..." : `${storage.used} GB / ${storage.total} GB`}
                    </span>
                </div>
                <progress 
                className={`progress progress-primary w-full ${loading ? 'animate-pulse' : ''}`}
                value={loading ? 0 : storagePercentage}
                max="100"></progress>
                </div>
                <div className="form-control w-full mt-3">
                <label className="label p-1"><span className="label-text-alt">Batas Upload Maksimal per File</span></label>
                <select name="max_upload_size" className="select select-bordered select-sm w-full" defaultValue={value} onChange={onChange}>
                    <option value="5">5 MB (Rekomendasi)</option>
                    <option value="10">10 MB</option>
                    <option value="20">20 MB</option>
                </select>
                </div>
            </div>
        </div>
    );
}