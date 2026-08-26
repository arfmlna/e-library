import React from 'react';

export default function TabNavigation({ activeTab, setActiveTab, countRequests, countLoans }) {
    return (
        <div role="tablist" className="tabs flex-row tabs-box bg-base-200 dark:bg-base-300 mb-6 w-fit">
            <button 
                role="tab" 
                className={`tab ${activeTab === 'pengajuan' ? 'tab-active !bg-primary !text-white' : ''} font-medium`}
                onClick={() => setActiveTab('pengajuan')}
            >
                Status Pengajuan ({countRequests})
            </button>
            <button 
                role="tab" 
                className={`tab ${activeTab === 'riwayat' ? 'tab-active !bg-primary !text-white' : ''} font-medium`}
                onClick={() => setActiveTab('riwayat')}
            >
                Riwayat Pinjam ({countLoans})
            </button>
        </div>
    );
}