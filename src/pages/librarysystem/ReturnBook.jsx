import Swal from "sweetalert2";
import FineCalculator from "./FineCalculator";
import { pb } from "@/utils/pocketbase";
import { useEffect, useState } from "react";
import { getDaysOverdue } from "@/constants/getDaysOverdue";

export default function ReturnBook({ isLate, setIsLate, bookCondition, setBookCondition, loanDetailData, onSuccess }) {
    const [isPaidDirectly, setIsPaidDirectly] = useState(true); 
    const [hasFine, setHasFine] = useState(false);

    useEffect(() => {
        if (isLate || bookCondition === 'damaged' || bookCondition === 'lost') {
            setHasFine(true);
        } else {
            setHasFine(false);
        }
    }, [isLate, bookCondition]);

    const handleProcessReturn = async () => {
        if (!loanDetailData?.id) {
            return Swal.fire("Peringatan", "Data transaksi peminjaman tidak valid.", "warning");
        }

        const confirm = await Swal.fire({
            title: "Konfirmasi Pengembalian",
            text: `Apakah Anda yakin ingin mengembalikan buku dengan kondisi "${bookCondition === 'good' ? 'Bagus' : bookCondition === 'damaged' ? 'Rusak' : 'Hilang'}"?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, Selesai!",
            cancelButtonText: "Batal"
        });

        if (!confirm.isConfirmed) return;

        Swal.fire({
            title: "Menyimpan Transaksi...",
            text: "Mohon tunggu sebentar.",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        try {
            const setting = await pb.collection("settings").getFirstListItem("", {
                fields: 'penalty_fee,fee_damage,fee_lost'
            });
            const daysOverdue = getDaysOverdue(loanDetailData.dueDate);
            let fineAmount = 0;
            let fineReasons = [];

            const penaltyFee = parseInt(setting?.penalty_fee, 10) || 0;
            const feeDamage = parseInt(setting?.fee_damage, 10) || 0;
            const feeLost = parseInt(setting?.fee_lost, 10) || 0;

            if (isLate) {
                const hitungHari = daysOverdue > 0 ? daysOverdue : 1;
                fineAmount += (hitungHari * penaltyFee);
                fineReasons.push("Keterlambatan");
            }

            if (bookCondition === "damaged") {
                fineAmount += feeDamage; 
                fineReasons.push("Buku Rusak");
            } else if (bookCondition === "lost") {
                fineAmount += feeLost;
                fineReasons.push("Buku Hilang");
            }
                
            await pb.collection("loan_details").update(loanDetailData.id, {
                status: "returned",
                return_date: new Date(),
                condition_on_return: bookCondition
            });

            if (loanDetailData.bookType !== "digital" && bookCondition !== "lost") {
                try {
                    const currentBook = await pb.collection("books").getOne(loanDetailData.book_id);
                    await pb.collection("books").update(loanDetailData.book_id, {
                        stock: (currentBook.stock ?? 0) + 1
                    });
                } catch (stockErr) {
                    console.error("Gagal memperbarui stok buku:", stockErr);
                }
            }

            if (fineAmount > 0) {
                await pb.collection("fines").create({
                    loan_detail_id: loanDetailData.id,
                    borrower: loanDetailData.borrower_id,
                    amount: fineAmount,
                    reason: fineReasons.join(", "),
                    status: isPaidDirectly ? "paid" : "unpaid",
                    staff: pb?.authStore?.record?.id 
                });
            }

            const parentLoanId = loanDetailData.loan_id;
            if (parentLoanId) {
                const allDetailsInLoan = await pb.collection("loan_details").getFullList({
                    filter: `loan_id = "${parentLoanId}"`
                });

                const stillBorrowed = allDetailsInLoan.some(detail => detail.status === "borrowed");
                if (!stillBorrowed) {
                    await pb.collection("loans").update(parentLoanId, {
                        status: "completed"
                    });
                }
            }

            let successMessage = "Buku berhasil dikembalikan tepat waktu.";
            if (fineAmount > 0) {
                successMessage = isPaidDirectly 
                ? `Buku kembali. Denda Rp ${fineAmount.toLocaleString('id-ID')} LUNAS diterima oleh staf.`
                : `Buku kembali. Denda Rp ${fineAmount.toLocaleString('id-ID')} BELUM DIBAYAR (Masuk Hutang).`;
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: successMessage,
                confirmButtonColor: "#3085d6"
            });

            if (onSuccess) onSuccess();
            setIsPaidDirectly(true)

        } catch (error) {
            console.error(error.originalError);
            Swal.fire({
                icon: "error",
                title: "Transaksi Gagal",
                text: "Terjadi kesalahan sistem saat memperbarui data ke PocketBase.",
                confirmButtonColor: "#d33"
            });
        }};

    return (
        <div className="space-y-6">
            {/* Isian kondisi buku & Simulasi checkbox */}
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-gray-300 cursor-pointer select-none">
                <input 
                type="checkbox" 
                checked={isLate} 
                onChange={(e) => setIsLate(e.target.checked)} 
                className="w-4 h-4 accent-indigo-600 rounded dark:bg-gray-800 dark:border-gray-700"
                /> 
                Menerapkan Keterlambatan
            </label>
            
            <div className="flex gap-2">
                {[
                { key: 'good', label: 'Bagus', color: 'bg-emerald-500 dark:bg-emerald-600 border-emerald-600 dark:border-emerald-700' },
                { key: 'damaged', label: 'Rusak', color: 'bg-amber-500 dark:bg-amber-600 border-amber-600 dark:border-amber-700' },
                { key: 'lost', label: 'Hilang', color: 'bg-rose-500 dark:bg-rose-600 border-rose-600 dark:border-rose-700' }
                ].map((item) => (
                <button 
                    key={item.key}
                    type="button"
                    onClick={() => setBookCondition(item.key)} 
                    className={`flex-1 p-2.5 border text-xs font-semibold rounded-lg transition-all ${
                    bookCondition === item.key 
                        ? `${item.color} text-white shadow-sm` 
                        : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-slate-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                    {item.label}
                </button>
                ))}
            </div>

            <FineCalculator isLate={isLate} bookCondition={bookCondition} loanDetailData={loanDetailData} />

            {hasFine && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg space-y-2 transition-colors">
                <span className="font-bold text-amber-800 dark:text-amber-400 block text-xs">
                    💵 Opsi Pembayaran Kasir:
                </span>
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer select-none text-slate-800 dark:text-gray-300">
                    <input 
                    type="checkbox" 
                    checked={isPaidDirectly} 
                    onChange={(e) => setIsPaidDirectly(e.target.checked)} 
                    className="w-4 h-4 accent-amber-600 dark:accent-amber-500"
                    />
                    Anggota langsung membayar denda tunai ke staf (Lunas)
                </label>
                {!isPaidDirectly && (
                    <p className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">
                    * Catatan: Denda akan dicatat sebagai hutang ('unpaid').
                    </p>
                )}
                </div>
            )}

            <button
                type="button"
                onClick={handleProcessReturn}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold p-2.5 text-xs rounded-lg shadow transition-all transform active:scale-[0.98]"
            >
                Proses Pengembalian Buku
            </button>
        </div>

    )
}
