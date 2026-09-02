import React from 'react';

export default function UserStatusHeader({ infoVerif, isAlreadySubmitted }) {
    return (
        <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight select-none mb-1">Verifikasi Identitas</h2>
            
            {/* Bagian Info Badge Status */}
            {(infoVerif?.status || infoVerif?.no_identitas) && (
                <div className="flex flex-wrap gap-2 justify-center my-4 select-none animate-in fade-in duration-300">
                    {infoVerif?.status && (
                        <div className={`badge font-bold uppercase p-3 tracking-wide text-xs shadow-sm ${
                            ['verified', 'terverifikasi', 'success'].includes(infoVerif.status.toLowerCase())
                                ? 'badge-success text-success-content' 
                                : 'badge-warning text-warning-content'
                        }`}>
                            {infoVerif.status}
                        </div>
                    )}
                    {infoVerif?.no_identitas && (
                        <div className="badge badge-neutral font-mono p-3 text-xs tracking-wider shadow-sm">
                            {infoVerif.no_identitas}
                        </div>
                    )}
                </div>
            )}
            
            <p className="text-sm opacity-70 mt-2">
                {isAlreadySubmitted 
                    ? "Anda sudah mengirimkan data. Anda dapat memperbaruinya jika ada kesalahan."
                    : "Lengkapi data diri Anda sebelum mengakses halaman utama."}
            </p>
        </div>
    );
}
