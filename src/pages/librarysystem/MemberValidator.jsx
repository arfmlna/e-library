import React, { useState } from 'react';
import { User, CheckCircle, X, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { pb } from '@/utils/pocketbase';
import Swal from 'sweetalert2';

export default function MemberValidator({ memberId, setMemberId }) {
  const [keyword, setKeyword] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

  const { data: members, isFetching, isSuccess } = useQuery({
    queryKey: ["membersSearch", keyword],
    queryFn: async () => {
      const resultList = await pb?.collection("users")?.getList(1, 5, {
        filter: `id ~ "${keyword}" || name ~ "${keyword}" || email ~ "${keyword}"`,
      });
      return resultList?.items || [];
    },
    enabled: keyword.length >= 2,
    retry: false,
  });


  const handleSubmit = (e) => {
    e.preventDefault();
    const inputVal = e.target.elements.memberInput.value.trim();
    if (!inputVal) return;
    
    setSelectedMember(null); // Reset pilihan sebelumnya
    setKeyword(inputVal);
  };

  const handleInputChange = () => {
    if (memberId) setMemberId("");
    if (selectedMember) setSelectedMember(null);
    if (keyword) setKeyword("");
  };

  const handleSelectMember = (member) => {
    if (member.status === 'verified') {
      setSelectedMember(member);
      setMemberId(member.id);
      setKeyword("");
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Select Member!',
        text: 'Pilih member dengan status yang sudah terverifikasi...'
      })
    }
  };

  return (
    <div className="space-y-3 relative">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase mb-2">
            ID Anggota
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-gray-500" />
            <input
              type="text"
              name="memberInput"
              placeholder="Ketik nama atau ID anggota..."
              onChange={handleInputChange}
              defaultValue={keyword}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition-colors placeholder-slate-400 dark:placeholder-gray-500"
            />
          </div>
        </div>
        <button 
          className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 font-medium text-sm py-2.5 px-4 rounded-lg border border-slate-300 dark:border-gray-700 flex justify-center items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={isFetching}
        >
          {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cek Anggota'}
        </button>
      </form>

      {keyword && isSuccess && members && members.length > 0 && (
        <div className="absolute z-10 w-full md:w-[66%] bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-lg shadow-lg max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-gray-800">
          {members.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectMember(item)}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-gray-800 flex justify-between items-center transition-colors text-slate-900 dark:text-white"
            >
              <div>
                <p className="font-medium">{item.name || "Tanpa Nama"}</p>
                <p className="text-xs text-slate-500 dark:text-gray-400">ID: {item.id}</p>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded 
                ${item.status === 'verified' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                : item.status === 'process' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
                : item.status === 'unverified' ? 'bg-slate-100 text-slate-800 dark:bg-slate-950 dark:text-slate-300' 
                : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'}`}>
                {item.status}
              </span>
            </button>
          ))}
        </div>
      )}

      {keyword && isSuccess && members && members.length === 0 && (
        <div className="p-3 bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-900/60 rounded-lg text-xs text-red-800 dark:text-red-300 flex items-center gap-2">
          <X className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span>Tidak ada anggota yang cocok dengan kata kunci "{keyword}"</span>
        </div>
      )}

      {selectedMember && (
        <div className={`p-3 rounded-lg text-xs flex items-center gap-2 transition-colors
          ${selectedMember?.status === 'verified' ? 'bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300' : 
            selectedMember?.status === 'process' ? 'bg-yellow-50 border border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-900/60 text-yellow-800 dark:text-yellow-300' : 
            selectedMember?.status === 'unverified' ? 'bg-slate-50 border border-slate-200 dark:bg-slate-950/20 dark:border-slate-900/60 text-slate-800 dark:text-slate-300' : 
            'bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-900/60 text-red-800 dark:text-red-300'} 
        `}>
          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>
            Anggota Terpilih: <strong className="text-slate-900 dark:text-white">{selectedMember?.name}</strong> | ID: <strong>{selectedMember?.id}</strong> | Status:{' '}
            { selectedMember?.status === 'verified' ? (
                <span className="bg-emerald-600 dark:bg-emerald-500 text-white px-1.5 py-0.5 rounded font-bold text-[10px]">
                  {selectedMember.status}
                </span>
              ) : selectedMember?.status === 'process' ? (
                <span className="bg-yellow-600 dark:bg-yellow-500 text-white px-1.5 py-0.5 rounded font-bold text-[10px]">
                  {selectedMember.status}
                </span>
              ) : selectedMember?.status === 'unverified' ? (
                <span className="bg-slate-600 dark:bg-slate-500 text-white px-1.5 py-0.5 rounded font-bold text-[10px]">
                  {selectedMember.status}
                </span>
              ) : (
                <span className="bg-red-600 dark:bg-red-500 text-white px-1.5 py-0.5 rounded font-bold text-[10px]">
                  {selectedMember?.status}
                </span>
              )
            }
          </span>
        </div>
      )}
    </div>
  );
}
