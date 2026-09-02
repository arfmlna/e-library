import React, { useState } from 'react';
import TabsHeader from './TabsHeader';
import MemberValidator from './MemberValidator';
import BorrowTable from './BorrowTable';
import ChooseBook from './ChooseBook';
import ReturnBook from './ReturnBook';
import SearchLoan from './SearchLoan';

export default function LibrarySystem() {
  const [activeTab, setActiveTab] = useState('borrow');

  const [memberId, setMemberId] = useState('');
  const [bookId, setBookId] = useState('');
  const [borrowList, setBorrowList] = useState([]);
  
  const [loanDetailData, setLoanDetailData] = useState(null);
  const [bookCondition, setBookCondition] = useState('good');
  const [isLate, setIsLate] = useState(false);

  const handleAddBook = (value) => {
    const now = new Date
    if (!value || !value.id) return;
    setBorrowList([...borrowList, { 
      id: value?.id, 
      title: value?.title, 
      dueDate: now 
    }]);
    setBookId('');
  };

  const handleResetAfterReturn = () => {
    setLoanDetailData(null);
    setIsLate(false);
    setBookCondition("good");
  };

  return (
    <div className="min-h-screen w-full transition-colors duration-300">
      <div className="w-full px-0 sm:px-10 md:px-16 overflow-hidden transition-all">
        <TabsHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="p-6">
          {/* KONTEN PEMINJAMAN */}
          {activeTab === 'borrow' && (
            <div className="space-y-6">
              <MemberValidator memberId={memberId} setMemberId={setMemberId} />
              <ChooseBook memberId={memberId} bookId={bookId} setBookId={setBookId} handleAddBook={handleAddBook} borrowList={borrowList} />
              <BorrowTable memberId={memberId} setMemberId={setMemberId} list={borrowList} setList={setBorrowList} onRemove={(id) => setBorrowList(borrowList.filter(b => b.id !== id))} />
            </div>
          )}

          {/* KONTEN PENGEMBALIAN */}
          {activeTab === 'return' && (
            <div className="space-y-6 max-w-xl mx-auto">
              <SearchLoan 
                loanDetailData={loanDetailData}
                setLoanDetailData={setLoanDetailData}
                setIsLate={setIsLate}
              />
              {loanDetailData && (
                <div className="space-y-4">
                  {isLate && (
                    <p className="text-rose-600 dark:text-rose-400 font-bold text-xs bg-rose-50 dark:bg-rose-950/20 p-2 rounded border border-rose-100 dark:border-rose-900/50 animate-pulse flex items-center gap-1">
                      ⚠️ Status: Peminjam Terlambat Mengembalikan!
                    </p>
                  )}
                  
                  <ReturnBook 
                    isLate={isLate} 
                    setIsLate={setIsLate} 
                    bookCondition={bookCondition} 
                    setBookCondition={setBookCondition}
                    loanDetailData={loanDetailData}
                    onSuccess={handleResetAfterReturn}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
