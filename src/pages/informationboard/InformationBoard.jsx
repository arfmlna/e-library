import { Trophy } from 'lucide-react';
import React, { lazy, useState } from 'react';

const Announcements = lazy(() => import('./Announcements'))
const ArticlesGrid = lazy(() => import('./ArticlesGrid'))
const AgendaSidebar = lazy(() => import('./AgendaSidebar'))
const QuoteWidget = lazy(() => import('./QuoteWidget'))

export default function DashboardContainer() {
    const [showLiterature, setShowLiterature] = useState(false);

    return (
        <div className="max-w-7xl w-full mx-auto p-4 md:p-6 ">
            <div className="flex flex-row gap-3 h-full items-center my-3">
                <div className="p-2 border-2 border-black dark:border-white text-black dark:text-white rounded-lg">
                    <Trophy className="animate-accordion-down" size={20} />
                </div>
                <div className="">
                    <h2 className="text-lg font-bold tracking-wide uppercase">Information Board</h2>
                    <p className="text-xs opacity-60">Papan informasi dan jadwal kegiatan disekolah</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    <Announcements />
                    <ArticlesGrid showLiterature={showLiterature} />
                </div>
                <div className="space-y-6">
                    <AgendaSidebar />
                    <QuoteWidget 
                        showLiterature={showLiterature} 
                        setShowLiterature={setShowLiterature} 
                    />
                </div>
            </div>
        </div>
    );
}
