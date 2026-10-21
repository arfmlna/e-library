import React from 'react';

export default function CirculationForm({ formData, onChange }) {
    return (
        <div className="card bg-base-200/50 shadow-sm md:col-span-2 h-full">
            <div className="card-body">
                <h2 className="card-title text-base mb-4 font-bold uppercase tracking-wider">
                Aturan Sirkulasi Buku
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control w-full">
                    <label className="label"><span className="label-text font-semibold">Maksimal Pinjam Buku</span></label>
                    <label className="input input-bordered flex items-center gap-2">
                    <input type="number" name="max_borrow" className="grow" value={formData?.max_borrow} onChange={onChange} />
                    <span className="badge badge-neutral">Buku</span>
                    </label>
                </div>
                <div className="form-control w-full">
                    <label className="label"><span className="label-text font-semibold">Durasi Pinjam</span></label>
                    <label className="input input-bordered flex items-center gap-2">
                    <input type="number" name="borrow_duration" className="grow" value={formData?.borrow_duration} onChange={onChange} />
                    <span className="badge badge-neutral">Hari</span>
                    </label>
                </div>
                <div className="form-control w-full">
                    <label className="label"><span className="label-text font-semibold">Denda Keterlambatan</span></label>
                    <label className="input input-bordered flex items-center gap-2">
                    <span className="text-sm opacity-50">Rp</span>
                    <input type="number" name="penalty_fee" className="grow" value={formData?.penalty_fee} onChange={onChange} />
                    <span className="badge badge-neutral">/ Hari</span>
                    </label>
                </div>
                <div className="form-control w-full">
                    <label className="label"><span className="label-text font-semibold">Denda Kerusakan</span></label>
                    <label className="input input-bordered flex items-center gap-2">
                    <span className="text-sm opacity-50">Rp</span>
                    <input type="number" name="fee_damage" className="grow" value={formData?.fee_damage} onChange={onChange} />
                    <span className="badge badge-neutral">/ Hari</span>
                    </label>
                </div>
                <div className="form-control w-full">
                    <label className="label"><span className="label-text font-semibold">Denda Kehilangan</span></label>
                    <label className="input input-bordered flex items-center gap-2">
                    <span className="text-sm opacity-50">Rp</span>
                    <input type="number" name="fee_lost" className="grow" value={formData?.fee_lost} onChange={onChange} />
                    <span className="badge badge-neutral">/ Hari</span>
                    </label>
                </div>
                <div className="invisible"></div>
            </div>
            </div>
        </div>
    );
}