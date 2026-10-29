import React, { lazy } from 'react';
import { useQuery } from '@tanstack/react-query';
import { pb } from '@/utils/pocketbase';
import { CalendarDays } from 'lucide-react';

const Error = lazy(() => import('@/components/ui/Error'))
const Loading = lazy(() => import('@/components/ui/Loading'))
const NotFound = lazy(() => import('@/components/ui/NotFound'))

const colorMap = {
    blue: 'bg-blue-500 text-white',
    purple: 'bg-purple-500 text-white',
    green: 'bg-green-500 text-white',
    yellow: 'bg-yellow-500 text-gray-800'
};

export default function AgendaSidebar() {
    const { data: agendas, isLoading, refetch, error } = useQuery({
        queryKey: ['agendas', 'upcoming'],
        queryFn: () => pb.collection('agendas').getList(1, 4, {
            sort: 'eventDate',
            filter: pb.filter('eventDate >= {:now}', { now: new Date() })
        })
    });

    return (
        <div className="rounded-lg shadow shadow-black dark:shadow-white p-4 bg-white dark:bg-gray-800">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg border-b pb-2 mb-3 flex items-center">
                <span className="mr-2"><CalendarDays /></span> Agenda Mendatang
            </h3>
            
            { isLoading ? <Loading variant='list' count={3} /> : error ? <Error refetch={refetch} variant='list' /> : 
            agendas.totalItems === 0 ? (
                <NotFound
                title='Data Tidak Tersedia'
                message=' '
                customAction={" "}
                />
            ) : (
                <ul className="space-y-3">
                    {agendas?.items?.map((agenda) => {
                        const dateObj = new Date(agenda?.eventDate);
                        const day = dateObj.getDate(); 
                        const month = dateObj.toLocaleDateString('id-ID', { month: 'short' }); 
                        const time = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                        const currentClass = colorMap[agenda.theme] || 'bg-gray-500 text-white'; 
                        
                        return (
                            <li key={agenda.id} className="flex space-x-3 items-start">
                                <div className={`p-2 rounded text-center min-w-[45px] ${currentClass}`}>
                                    <span className="block font-bold text-sm">{day}</span>
                                    <span className="block text-[10px] uppercase">{month}</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{agenda.title}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{agenda?.location} {time}</p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )
            }
            
        </div>
    );
}
