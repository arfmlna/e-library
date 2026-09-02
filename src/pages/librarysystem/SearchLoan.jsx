import { pb } from '@/utils/pocketbase';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Search } from 'lucide-react';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function SearchLoan({ 
  loanDetailData, 
  setLoanDetailData, 
  setIsLate 
}) {
  const [keyword, setKeyword] = useState("");
  const [inputVal, setInputVal] = useState("");
  
  const { data: loanResults = [], isFetching, isSuccess } = useQuery({
    queryKey: ["loansSearch", keyword],
    queryFn: async () => {
      const resultList = await pb.collection("loan_details").getList(1, 5, {
        expand: "book_id, loan_id, loan_id.borrower",
        filter: `status != "returned" && (
          id ~ "${keyword}" || 
          book_id.title ~ "${keyword}" || 
          loan_id.borrower.name ~ "${keyword}"
        )`,
      });
      return resultList?.items || [];
    },
    enabled: keyword.trim() !== "", // Hanya fetch jika tombol dicari ditekan
    retry: false,
  });

  const handleSelectLoan = (loan) => {
    // Format struktur data agar siap digunakan oleh komponen ReturnBook
    const formattedData = {
      id: loan.id,
      loan_id: loan.loan_id,
      book_id: loan.book_id,
      book_title: loan.expand?.book_id?.title || "Buku Tidak Diketahui",
      bookType: loan.expand?.book_id?.bookType || "physical",
      borrower_id: loan.expand?.loan_id?.borrower || "",
      borrower_name: loan.expand?.loan_id?.expand?.borrower?.name || "Anggota",
      dueDate: loan.due_date,
    };

    setLoanDetailData(formattedData);

    // Auto-check jika tanggal hari ini melewati batas due_date (Terlambat)
    // Menghilangkan jam agar kalkulasi hari keterlambatan adil
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(loan.due_date);
    dueDate.setHours(0, 0, 0, 0);

    setIsLate(today > dueDate);

    // Bersihkan pencarian untuk menutup list dropdown
    setKeyword("");
    setInputVal("");
  };

  const handleInputChange = (e) => {
    setInputVal(e.target.value);
    if (keyword) setKeyword(""); // Otomatis menutup dropdown jika mengetik ulang
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) {
      return Swal.fire("Peringatan", "Masukkan Nama, Judul Buku, atau ID Transaksi!", "warning");
    }

    setLoanDetailData(null); // Reset detail data terpilih sebelumnya
    setKeyword(inputVal.trim());
  };

  return (
    <div className="space-y-4 relative">
      <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">
        Form Pencarian Pengembalian Buku
      </h2>
      
      {/* Form Input Pencarian */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Cari berdasarkan Nama Peminjam, Judul Buku, atau ID..."
            value={inputVal}
            onChange={handleInputChange}
            className="w-full pl-9 p-2 text-xs border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder-slate-400 dark:placeholder-gray-500 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={isFetching}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 text-xs font-semibold rounded shadow-sm transition-all flex items-center justify-center min-w-[90px]"
        >
          {isFetching ? <Loader2 className="w-3 h-3 animate-spin" /> : "Cari Data"}
        </button>
      </form>

      {keyword && isSuccess && loanResults.length > 0 && (
        <div className="relative z-10 w-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-lg shadow-lg max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-gray-800">
          {loanResults.map((loan) => (
            <button
              key={loan.id}
              type="button"
              onClick={() => handleSelectLoan(loan)}
              className="w-full text-left px-4 py-2.5 text-xs hover:bg-slate-50 dark:hover:bg-gray-800 flex justify-between items-center transition-colors text-slate-900 dark:text-white"
            >
              <div className="pr-4 truncate">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {loan.expand?.loan_id?.expand?.borrower?.name || "Anggota Tanpa Nama"}
                </p>
                <p className="text-slate-500 dark:text-gray-400 truncate mt-0.5">
                  Buku: <span className="font-medium text-slate-700 dark:text-slate-300">{loan.expand?.book_id?.title}</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  ID Transaksi: {loan.id}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] font-medium text-slate-400">Batas Waktu:</p>
                <p className="font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {new Date(loan.due_date).toLocaleDateString("id-ID")}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {keyword && isSuccess && loanResults.length === 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/60 rounded-lg text-xs text-amber-800 dark:text-amber-300">
          Tidak ada data transaksi aktif yang cocok dengan kata kunci "{keyword}".
        </div>
      )}

      {loanDetailData && (
        <div className="p-4 bg-blue-50 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/50 rounded-lg text-xs space-y-1.5 text-slate-700 dark:text-gray-300 animate-fadeIn transition-colors">
          <p><strong className="text-slate-900 dark:text-white">Nama Peminjam:</strong> {loanDetailData.borrower_name}</p>
          <p><strong className="text-slate-900 dark:text-white">Judul Buku:</strong> {loanDetailData.book_title}</p>
          <p>
            <strong className="text-slate-900 dark:text-white">Tipe Buku:</strong>{' '}
            <span className="uppercase font-semibold text-indigo-600 dark:text-indigo-400">
              {loanDetailData.bookType}
            </span>
          </p>
          <p><strong className="text-slate-900 dark:text-white">Batas Waktu:</strong> {' '}
            {new Date(loanDetailData.dueDate).toLocaleDateString("id-ID")}
          </p>
        </div>
      )}
    </div>
  );
}
