import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { pb } from '@/utils/pocketbase'
import TemplateControl from './TemplateControl'
import { useDebounce } from 'use-debounce'

export default function ControlStudents() {
  const [searchItem, setSearchItem] = useState("")
  const [page, setPage] = useState(1)

  const [searchTerm] = useDebounce(searchItem, 500)

  const { data: fullData, refetch: refreshData } = useQuery({
      queryKey: ['petugas', searchTerm, page], 
      queryFn: () => pb.collection('users').getList(page, 8, {
          filter: `role = "users" ${searchTerm ? `&& name ~ "${searchTerm}"` : ""}`,
          sort: '-created'
      }),
      keepPreviousData: true
  });

  return (
    <>
      <TemplateControl title={"siswa"} fullData={fullData} refreshData={refreshData} searchItem={searchItem} setSearchItem={setSearchItem} page={page} setPage={setPage} searchTerm={searchTerm} />
    </>
  )
}
