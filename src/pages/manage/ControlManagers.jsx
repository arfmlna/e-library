import { lazy, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { pb } from '@/utils/pocketbase'
import { useDebounce } from 'use-debounce'

const TemplateControl = lazy(() => import('./TemplateControl'))

export default function ControlManagers() {
  const [searchItem, setSearchItem] = useState("")
  const [page, setPage] = useState(1)

  const [searchTerm] = useDebounce(searchItem, 500)

  const { data: fullData, refetch: refreshData } = useQuery({
      queryKey: ['petugas', searchTerm, page], 
      queryFn: () => pb.collection('users').getList(page, 8, {
          filter: `role = "petugas" ${searchTerm ? `&& name ~ "${searchTerm}"` : ""}`,
          sort: '-created'
      }),
      keepPreviousData: true
  });

  return (
    <>
      <TemplateControl 
      title={"data petugas"} 
      subtitle={"Kelola data akun petugas, hak akses, dan pelacakan aktivitas terbaru."}
      role={pb?.authStore?.record?.role}
      fullData={fullData} 
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
