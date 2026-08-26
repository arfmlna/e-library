import React from 'react';

export default function CirculationForm({ formData, onChange }) {
    return (
        <div className="card bg-base-200/50 shadow-sm md:col-span-2">
            <div className="card-body">
                <h2 className="card-title text-base mb-4 font-bold uppercase tracking-wider text-primary">
                Aturan Sirkulasi Buku
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control w-full">
                    <label className="label"><span className="label-text font-semibold">Maksimal Pinjam Buku</span></label>
                    <label className="input input-bordered flex items-center gap-2">
                    <input type="number" name="max_borrow" className="grow" value={formData.max_borrow} onChange={onChange} />
                    <span className="badge badge-neutral">Buku</span>
                    </label>
                </div>
                <div className="form-control w-full">
                    <label className="label"><span className="label-text font-semibold">Durasi Pinjam</span></label>
                    <label className="input input-bordered flex items-center gap-2">
                    <input type="number" name="borrow_duration" className="grow" value={formData.borrow_duration} onChange={onChange} />
                    <span className="badge badge-neutral">Hari</span>
                    </label>
                </div>
                <div className="form-control w-full">
                    <label className="label"><span className="label-text font-semibold">Denda Keterlambatan</span></label>
                    <label className="input input-bordered flex items-center gap-2">
                    <span className="text-sm opacity-50">Rp</span>
                    <input type="number" name="penalty_fee" className="grow" value={formData.penalty_fee} onChange={onChange} />
                    <span className="badge badge-neutral">/ Hari</span>
                    </label>
                </div>
                <div className="form-control w-full">
                    <label className="label"><span className="label-text font-semibold">Batas Kuota Perpanjangan</span></label>
                    <label className="input input-bordered flex items-center gap-2">
                    <input type="number" name="extend_limit" className="grow" value={formData.extend_limit} onChange={onChange} />
                    <span className="badge badge-neutral">Kali</span>
                    </label>
                </div>
                </div>
                <div className="divider my-4"></div>
                <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                    <input type="checkbox" name="allow_offline_download" className="checkbox checkbox-primary checkbox-sm" checked={formData.allow_offline_download} onChange={onChange} />
                    <span className="label-text">Izinkan siswa mengunduh PDF untuk dibaca offline</span>
                </label>
                </div>
                <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                    <input type="checkbox" name="auto_lock_account" className="checkbox checkbox-primary checkbox-sm" checked={formData.auto_lock_account} onChange={onChange} />
                    <span className="label-text">Kunci akun otomatis jika denda kumulatif melampaui Rp 50.000</span>
                </label>
                </div>
            </div>
        </div>
    );
}