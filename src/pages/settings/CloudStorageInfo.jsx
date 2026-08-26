import React from 'react';

export default function CloudStorageInfo({ value, onChange }) {
    return (
        <div className="card bg-base-200/50 shadow-sm">
            <div className="card-body p-5">
                <h2 className="card-title text-sm font-bold uppercase tracking-wider">Kapasitas Cloud Server</h2>
                <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                    <span>Penyimpanan E-Book</span>
                    <span className="font-bold">64 GB / 100 GB</span>
                </div>
                <progress className="progress progress-primary w-full" value="64" max="100"></progress>
                </div>
                <div className="form-control w-full mt-3">
                <label className="label p-1"><span className="label-text-alt">Batas Upload Maksimal per File</span></label>
                <select name="max_upload_size" className="select select-bordered select-sm w-full" value={value} onChange={onChange}>
                    <option value="20 MB (Rekomendasi)">20 MB (Rekomendasi)</option>
                    <option value="50 MB">50 MB</option>
                    <option value="100 MB">100 MB</option>
                </select>
                </div>
            </div>
        </div>
    );
}