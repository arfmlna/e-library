import React from 'react';
import { Trash2 } from 'lucide-react';
import { pb } from '@/utils/pocketbase';
import { formatDate } from '@/constants/dateFormat';
import Swal from 'sweetalert2';

export default function BorrowTable({ memberId, setMemberId, list, setList, onRemove }) {
  
  const handleCheckOut = async () => {
    if (!memberId) {
      return Swal.fire({
        icon: 'warning',
        title: 'Akses Ditolak',
        text: 'Pilih atau cek anggota terlebih dahulu!',
        confirmButtonColor: '#3085d6'
      });
    }
    if (list.length === 0) {
      return Swal.fire({
        icon: 'warning',
        title: 'Keranjang Kosong',
        text: 'Keranjang buku masih kosong!',
        confirmButtonColor: '#3085d6'
      });
    }

    const confirmCheckout = await Swal.fire({
      title: 'Konfirmasi Peminjaman',
      text: `Apakah Anda yakin ingin memproses ${list.length} buku ini?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Proses!',
      cancelButtonText: 'Batal'
    });

    if (!confirmCheckout.isConfirmed) return;

    Swal.fire({
      title: 'Memproses Transaksi...',
      text: 'Mohon tunggu sebentar.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const loanRecord = await pb.collection('loans').create({
        borrower: memberId,
        staff: pb?.authStore?.record?.id,
        loan_date: new Date(),
        status: 'borrowed',
      });

      const detailPromises = list.map(async (book) => {
        const dueDateObj = new Date(book?.dueDate || new Date());
        dueDateObj.setDate(dueDateObj.getDate() + 7);

        const createDetail = pb.collection('loan_details').create({
          loan_id: loanRecord?.id,
          book_id: book?.id,
          due_date: dueDateObj,
          staff: pb?.authStore?.record?.id,
          status: 'borrowed'
        });

        let updateStock = Promise.resolve();
        if (book.bookType !== "digital") {
          try {
            const currentBook = await pb.collection('books').getOne(book.id);
            const currentStock = currentBook.stock ?? 0;
            if (currentStock > 0) {
              updateStock = pb.collection('books').update(book.id, {
                stock: currentStock - 1
              });
            }
          } catch (err) {
            console.error(`Gagal update stok buku ID ${book.id}:`, err);
          }
      }
      return Promise.all([createDetail, updateStock])
      });

      await Promise.all(detailPromises);

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Transaksi Peminjaman Berhasil Disimpan!',
        timer: 2000,
        showConfirmButton: false
      });
      setList([]);
      setMemberId('');
      
    } catch (error) {
      console.error("Detail Error Kolom Loans:", error.originalError?.data);
      Swal.fire({
        icon: 'error',
        title: 'Transaksi Gagal',
        text: 'Terjadi kesalahan saat menyimpan data ke database.',
        confirmButtonColor: '#d33'
      });
    } 
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase">
        Keranjang Buku ({list.length})
      </label>
      <div className="border border-slate-200 dark:border-gray-700 rounded-lg overflow-x-auto bg-white dark:bg-gray-900 transition-colors">
        <table className="w-full text-left border-collapse text-sm table">
          <thead>
            <tr className="bg-slate-50 dark:bg-gray-800/50 border-b border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 text-xs font-semibold">
              <th className="p-3 w-12 text-center">No</th>
              <th className="p-3">Kode</th>
              <th className="p-3">Judul Buku</th>
              <th className="p-3">Tgl Kembali</th>
              <th className="p-3 w-16 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
            {list.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-400 dark:text-gray-500 text-xs">
                  Belum ada buku yang dimasukkan.
                </td>
              </tr>
            ) : (
              list.map((book, index) => (
                <tr key={book.id} className="hover:bg-slate-50/80 dark:hover:bg-gray-800/40 text-slate-700 dark:text-gray-300 transition-colors">
                  <td className="p-3 text-center text-slate-400 dark:text-gray-500 font-medium">{index + 1}</td>
                  <td className="p-3 font-mono text-xs font-bold text-slate-900 dark:text-white">{book.id}</td>
                  <td className="p-3">{book.title}</td>
                  <td className="p-3 text-slate-500 dark:text-gray-400 font-medium text-xs">{formatDate(book.dueDate)}</td>
                  <td className="p-3 text-center">
                    <button 
                      onClick={() => onRemove(book.id)} 
                      className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 p-1 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {list.length > 0 && (
        <div className="flex justify-end">
          <button 
            className="btn btn-sm btn-success px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded transition-colors" 
            onClick={handleCheckOut}
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}
