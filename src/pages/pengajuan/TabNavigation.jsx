import React from 'react';

export default function TabNavigation({ activeTab, setActiveTab, countRequests, countLoans }) {
    return (
        <div role="tablist" className="tabs flex-row tabs-box mb-6 w-fit">
            <button 
                role="tab" 
                className={`tab ${activeTab === 'pengajuan' ? 'tab-active !bg-black !text-white dark:!bg-white dark:!text-black' : ''} font-medium`}
                onClick={() => setActiveTab('pengajuan')}
            >
                Status Pengajuan ({countRequests})
            </button>
            <button 
                role="tab" 
                className={`tab ${activeTab === 'riwayat' ? 'tab-active !bg-black !text-white dark:!bg-white dark:!text-black' : ''} font-medium`}
                onClick={() => setActiveTab('riwayat')}
            >
                Riwayat Pinjam ({countLoans})
            </button>
        </div>
    );
}