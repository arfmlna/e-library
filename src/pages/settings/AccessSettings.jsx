import React from 'react'

export default function AccessSettings({ formData, onChange }) {
  return (
    <div className="card bg-base-200/50 shadow-sm md:col-span-2">
        <div className="card-body">
            <h2 className="card-title text-base mb-4 font-bold uppercase tracking-wider">
                Aturan Hak Akses Website
            </h2>
            <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                    <input type="checkbox" name="allow_offline_download" className="toggle toggle-primary toggle-sm" checked={formData.allow_offline_download} onChange={onChange} />
                    <span className="label-text">Izinkan siswa mengunduh PDF</span>
                </label>
            </div>
            {/* <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                    <input type="checkbox" name="auto_lock_account" className="toggle toggle-primary toggle-sm" checked={formData.auto_lock_account} onChange={onChange} />
                    <span className="label-text">Kunci akun otomatis jika denda kumulatif melampaui Rp 50.000</span>
                </label>
            </div> */}
        </div>
    </div>
  )
}
