import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { getDaysOverdue } from '@/constants/getDaysOverdue';
import { pb } from '@/utils/pocketbase';
import Swal from 'sweetalert2';

export default function FineCalculator({ isLate, bookCondition, loanDetailData }) {
  const [totalBiaya, setTotalBiaya] = useState(0);
  const daysOverdue = getDaysOverdue(loanDetailData.dueDate);

  const hasFine = isLate || bookCondition !== 'good';

  useEffect(() => {
      const calculateTotal = async () => {
      try {
        const setting = await pb.collection("settings").getFirstListItem("", {
          fields: 'penalty_fee,fee_damage,fee_lost'
        });
        let total = 0;
        if (isLate) {
          total += daysOverdue > 0 ? daysOverdue * (setting?.penalty_fee || 0) : 0
          if (bookCondition === 'damaged') {
            total += (setting?.fee_damage || 0)
          }; 
          if (bookCondition === 'lost') {
            total += (setting?.fee_lost || 0)
          };
        } else {
          if (bookCondition === 'damaged') {
            total += (setting?.fee_damage || 0)
          }; 
          if (bookCondition === 'lost') {
            total += (setting?.fee_lost || 0)
          };
        }
        setTotalBiaya(total)
      } catch {
        Swal.fire({
          icon: 'error',
          text: 'Gagal menghitung kalkulasi pembayaran!'
        })
      }
    };

    calculateTotal()
  }, [bookCondition, isLate, daysOverdue]);

  return (
    <div className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors ${
      hasFine 
        ? 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/20 dark:border-rose-900/60 dark:text-rose-200' 
        : 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-900/60 dark:text-emerald-200'
    }`}>
      <div>
        <div className="flex items-center gap-2 text-sm font-bold">
          {hasFine ? (
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          ) : (
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          )}
          <span>
            {isLate ? `Status: TERLAMBAT ${daysOverdue} HARI` : 'Status: TEPAT WAKTU'}
            {bookCondition === 'damaged' && ' + BUKU RUSAK'}
            {bookCondition === 'lost' && ' + BUKU HILANG'}
          </span>
        </div>
        <p className="text-xs opacity-75 dark:opacity-85 mt-1">
          {bookCondition === 'lost' ? 'Denda keterlambatan + Biaya ganti rugi penuh.' : 'Sanksi kalkulasi otomatis berdasarkan regulasi perpus.'}
        </p>
      </div>
      <div className="text-left md:text-right w-full md:w-auto">
        <span className="text-xs uppercase font-bold opacity-60 dark:opacity-70 block">Total Denda</span>
        <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Rp {(totalBiaya).toLocaleString('id-ID')}</span>
      </div>
    </div>
  );
}
