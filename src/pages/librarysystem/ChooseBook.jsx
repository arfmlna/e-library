import React, { useState } from 'react';
import { CheckCircle, X, Loader2, Book, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { pb } from '@/utils/pocketbase';

export default function ChooseBook({ memberId, bookId, setBookId, handleAddBook, borrowList = [] }) {
  const [status, setStatus] = useState({ success: false, msg: "" });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [inputVal, setInputVal] = useState(""); 

  const { data: searchResults = [], isFetching, isSuccess } = useQuery({
    queryKey: ["booksSearch", searchKeyword],
    queryFn: async () => {
      const conditions = []
      if (searchKeyword) {
        const searchConditions = [
          pb.filter("title ~ {:keyword}", { keyword: searchKeyword }),
          pb.filter("kode_buku ~ {:keyword}", { keyword: searchKeyword }),
          pb.filter("author ~ {:keyword}", { keyword: searchKeyword })
        ];
        conditions.push(`(${searchConditions.join(" || ")})`);
      }

      const finalFilterString = conditions.join(" && ");
        const resultList = await pb.collection("books").getList(1, 5, {
          filter: finalFilterString,
        });
        return resultList?.items || [];
    },
    enabled: searchKeyword !== "",
    retry: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    setStatus({ success: false, msg: "" });
    setSearchKeyword(inputVal.trim());
  };


  const handleSelectBook = (book) => {
    if (borrowList.some(item => item.id?.toLowerCase() === book.id?.toLowerCase())) {
      setSearchKeyword("");
      return setStatus({ success: false, msg: `Buku "${book.title}" sudah di keranjang!` });
    }

    if (book.bookType === "digital") {
      setSearchKeyword("");
      return setStatus({ success: false, msg: `Buku "${book.title}" gagal ditambahkan karena berbentuk ${book.bookType}` });
    }

    if (book.stock <= 0) {
      setSearchKeyword("");
      return setStatus({ success: false, msg: `Buku "${book.title}" gagal ditambahkan, stock habis` });
    }

    setBookId(book.id);
    handleAddBook(book);
    setStatus({ success: true, msg: book.title });
    
    setSearchKeyword("");
    setInputVal("");
  };


  const handleInputChange = (e) => {
    setInputVal(e.target.value);
    if (status.msg) setStatus({ success: false, msg: "" });
    if (searchKeyword) setSearchKeyword("");
  };

  return (
    <div className="space-y-3 relative">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase mb-2">
            Cari Buku (Judul / Kode / Penulis)
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-gray-500" />
            <input
              type="text"
              value={inputVal}
              placeholder="Ketik judul, kode buku, atau penulis..."
              onChange={handleInputChange}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition-colors placeholder-slate-400 dark:placeholder-gray-500"
            />
          </div>
        </div>
        <button 
          type="submit" 
          disabled={isFetching || !memberId} 
          className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium text-sm py-2.5 rounded-lg disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-gray-800 disabled:text-slate-600 dark:disabled:text-gray-500 flex justify-center items-center transition-colors"
        >
          {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cari Buku'}
        </button>
      </form>

      {searchKeyword && isSuccess && searchResults.length > 0 && (
        <div className="absolute z-10 w-full md:w-[66%] bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-lg shadow-lg max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-gray-800">
          {searchResults.map((book) => (
            <button
              key={book.id}
              type="button"
              onClick={() => handleSelectBook(book)}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-gray-800 flex justify-between items-center transition-colors text-slate-900 dark:text-white"
            >
              <div className="pr-4 truncate">
                <p className="font-medium truncate">{book.title}</p>
                <p className="text-xs text-slate-500 dark:text-gray-400 truncate">
                  {book.author ? `Penulis: ${book.author}` : 'No Author'} | Kode: {book.kode_buku || book.id}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${book.bookType === 'digital' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'}`}>
                  {book.bookType?.toUpperCase() || 'FISIK'}
                </span>
                <span className="text-[10px] text-slate-400">Stok: {book.stock ?? 0}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {searchKeyword && isSuccess && searchResults.length === 0 && (
        <div className="p-3 bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-900/60 rounded-lg text-xs text-red-800 dark:text-red-400 flex items-center gap-2">
          <X className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span>Buku dengan kata kunci "{searchKeyword}" tidak ditemukan</span>
        </div>
      )}

      {status.msg && (
        <div className={`p-3 border text-xs rounded-lg flex items-center gap-2 transition-colors ${
          status.success 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-400' 
            : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400'
        }`}>
          {status.success ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <X className="w-4 h-4 text-red-600 dark:text-red-400" />
          )}
          <span>{status.success ? `Buku Berhasil Ditambahkan: ${status.msg}` : status.msg}</span>
        </div>
      )}
    </div>
  );
}
