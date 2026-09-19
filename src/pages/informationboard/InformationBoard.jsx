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
                <div className="p-2 bg-primary/10 dark:bg-slate-600 text-primary dark:text-slate-800 rounded-lg">
                    <Trophy className="text-warning animate-pulse" size={22} />
                </div>
                <h2 className="text-lg font-bold tracking-wide uppercase">Information Board</h2>
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
