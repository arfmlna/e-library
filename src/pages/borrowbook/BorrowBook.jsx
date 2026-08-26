import { pb } from '@/utils/pocketbase'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import TemplateBorrowBook from './TemplateBorrowBook'
import { useDebounce } from 'use-debounce'



export default function BorrowBook() {
  const [searchItem, setSearchItem] = useState("")
  const [page, setPage] = useState(1)

  const [searchTerm] = useDebounce(searchItem, 500)

  const { data: pinjam, refetch: refreshData } = useQuery({
    queryKey: ['pinjam', searchTerm, page],
    queryFn: async () => pb.collection('peminjaman').getList(page, 8, {
      expand: "peminjam,buku,petugas",
      sort: "-created"
    })
  })

  return (
    <TemplateBorrowBook title={"Peminjaman Buku"} fullData={pinjam} page={page} refreshData={refreshData} searchItem={searchItem} searchTerm={searchTerm} setSearchItem={setSearchItem} setPage={setPage} tb={'peminjaman'} />
  )
}
