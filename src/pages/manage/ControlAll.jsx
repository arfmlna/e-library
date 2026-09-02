import { lazy, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { pb } from '@/utils/pocketbase'
import { useDebounce } from 'use-debounce'

const TemplateControl = lazy(() => import('./TemplateControl'))

export default function ControlAll() {
    const [searchItem, setSearchItem] = useState("")
    const [page, setPage] = useState(1)

    const [searchTerm] = useDebounce(searchItem, 500)

    const { data: fullData, refetch: refreshData } = useQuery({
        queryKey: ['all', searchTerm, page], 
        queryFn: () => pb.collection('users').getList(page, 8, {
            filter: `role != "admin" ${searchTerm ? `&& name ~ "${searchTerm}"` : ""}`,
            sort: '-created',
            expand: 'verification_via_users'
        }),
        keepPreviousData: true
    });

    return (
        <>
            <TemplateControl 
            title={"data users"} 
            subtitle={"Kelola data akun siswa, petugas, hak akses, dan pelacakan aktivitas terbaru."}
            pageState={'all'}
            fullData={fullData} 
            role={pb?.authStore?.record?.role}
            refreshData={refreshData} 
            searchItem={searchItem} 
            setSearchItem={setSearchItem} 
            page={page} 
            setPage={setPage}
            searchTerm={searchTerm}
            />
        </>
    )
}
