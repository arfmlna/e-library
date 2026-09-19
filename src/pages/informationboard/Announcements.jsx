import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { pb } from '@/utils/pocketbase';
import { formatDate } from '@/constants/dateFormat';

export default function Announcements() {
    const { data: agendaThisWeek, isLoading } = useQuery({
        queryKey: ['agendas', 'thisWeek'],
        queryFn: async () => {
            const today = new Date();
            
            const agendas = await pb.collection('agendas').getList(1, 4, {
                sort: 'eventDate',
                filter: pb.filter('eventDate >= {:now}', { now: today }) 
            });

            const latestAgendas = agendas.items || [];

            // Cari batas awal dan akhir minggu ini secara presisi tanpa merusak objek 'today'
            const firstDay = new Date(today);
            firstDay.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
            firstDay.setHours(0, 0, 0, 0);

            const lastDay = new Date(firstDay);
            lastDay.setDate(firstDay.getDate() + 6);
            lastDay.setHours(23, 59, 59, 999);

            // Perbaikan: gunakan agenda.eventDate, bukan agenda.created
            return latestAgendas.find(agenda => {
                const agendaDate = new Date(agenda.eventDate); 
                return agendaDate >= firstDay && agendaDate <= lastDay;
            }) || null;
        }
    });

    if (isLoading || !agendaThisWeek) return null;

    return (
        <div className="bg-yellow-50 dark:bg-gray-800 border-l-4 border-yellow-500 p-4 rounded-r shadow-sm flex items-center justify-between animate-fade-in">
            <div className="flex items-center space-x-3">
                <span className="text-2xl">📢</span>
                <div>
                    <h3 className="font-bold text-yellow-800 dark:text-slate-200 text-sm md:text-base">Pengumuman Penting Pekan Ini</h3>
                    <p className="text-yellow-700 dark:text-slate-300 text-xs md:text-sm">
                        {agendaThisWeek.title} akan dimulai tanggal {formatDate(agendaThisWeek.eventDate)}.
                    </p>
                </div>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded hidden md:block self-center font-medium">Latest</span>
        </div>
    );
}
