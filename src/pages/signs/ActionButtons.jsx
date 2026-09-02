import React from 'react';
import { RefreshCcwDot, LogOut } from 'lucide-react'; // Atur sesuai icon pack Anda

export default function ActionButtons({ onRefresh, onLogout }) {
    return (
        <>
            <div className="divider opacity-50 my-1 text-[11px] uppercase tracking-wider font-semibold text-base-content/40">
                Opsi Tambahan
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    className="btn btn-outline btn-sm font-medium gap-2 border-base-300 hover:bg-base-200"
                    onClick={onRefresh}
                >
                    <RefreshCcwDot size={16} />
                    Refresh Status
                </button>
                <button
                    type="button"
                    className="btn btn-ghost btn-sm text-error font-medium gap-2 hover:bg-error/10"
                    onClick={onLogout}
                >
                    <LogOut size={16} />
                    Keluar Akun
                </button>
            </div>
        </>
    );
}
