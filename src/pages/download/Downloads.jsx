import { getOfflineBooksList } from '@/constants/globals';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import LayoutBook from '../books/LayoutBook';
import { useDebounce } from 'use-debounce';

const Downloads = () => {
  const [searchItem, setSearchItem] = useState("")
  const [page, setPage] = useState(1)

  const [searchTerm] = useDebounce(searchItem, 500)

  const { data: books, refetch: refreshData } = useQuery({
    queryKey: ['books', searchTerm, page],
    queryFn: () => getOfflineBooksList(page, 8, searchTerm),
    placeholderData: (previousData) => previousData,
  });

  return (
    <LayoutBook title={'Books Offline'} books={books} refreshData={refreshData} searchItem={searchItem} setSearchItem={setSearchItem} page={page} setPage={setPage} searchTerm={searchTerm} />
  );
};

export default Downloads
