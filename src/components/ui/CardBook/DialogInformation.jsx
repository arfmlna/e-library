import { Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogTitle } from '@/components/animate-ui/primitives/headless/dialog'
import BorrowRequestModal from '@/pages/pengajuan/BorrowRequestModal'
import { recordReadingHistory } from '@/utils/fetchTotalReader'
import { pb } from '@/utils/pocketbase'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BookOpen, NotepadText, Send, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const DialogInformation = ({
    title, 
    subTitle, 
    content,  
    clickId, 
    setClickId, 
    redirect, 
    download=null, 
    data
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const theme = localStorage.getItem('theme')
    const authId = pb.authStore.record.id
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: recordReadingHistory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['totalReaders', data.id] });
        },
        onError: (err) => {
            if (import.meta.env.DEV) {
                console.error("Gagal mencatat statistik membaca:", err);
            }
        }
    });

    const handleReadingAction = () => {
        if (authId && data?.id) {
            mutation.mutate({ bookId: data.id, userId: authId });
        }
    };

    return (
        <>
            { clickId.id === data.id && (
                <Dialog data-theme={theme} open={clickId.status} onClose={() => setClickId({ id: null, status: false })}>
                    <DialogBackdrop className="fixed inset-0 z-50 bg-white/50 dark:bg-black/50" />
                    <DialogPanel data-theme={theme} className="fixed bg-white dark:bg-gray-800 left-1/2 top-1/2 z-50 w-[92%] sm:w-full sm:max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-base-content/10 p-5 md:p-6 shadow-2xl">
                        <DialogHeader className="space-y-1">
                            <DialogTitle className="text-xl font-bold tracking-tight">{title}</DialogTitle>
                            <DialogDescription className="text-sm">
                                {subTitle}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-5">
                            <div className="overflow-x-auto max-h-[40vh] overflow-y-auto rounded-lg border border-base-content/5 custom-scrollbar">
                                <table className="table table-sm w-full whitespace-nowrap">
                                    {content}
                                </table>
                            </div>
                        </div>
                            <DialogFooter className="mt-2">
                                <div className="flex flex-col sm:flex-row sm:justify-end gap-2 w-full">
                                {(data?.pdfFile || data?.pdfBlob) && (
                                    <>
                                    <NavLink 
                                        to={`/flipbook/${redirect}/${data.id}`} 
                                        state={{ bookData: data }} 
                                        onClick={handleReadingAction}
                                        className="btn btn-primary btn-sm flex-1 sm:flex-none px-4 py-2 text-primary-content">
                                        <BookOpen size={15}/>
                                        Flip Book
                                    </NavLink>
                                    <NavLink 
                                        to={`/reader/${redirect}/${data.id}`} 
                                        state={{ bookData: data }}
                                        onClick={handleReadingAction}
                                        className="btn btn-outline btn-primary btn-sm flex-1 sm:flex-none px-4 py-2">
                                        <NotepadText size={15} />
                                        Reader
                                    </NavLink>
                                    {download}
                                    </>
                                )}
                                { data?.bookType !== 'digital' && (
                                    <button 
                                        className="btn btn-primary text-white btn-sm flex-1 sm:flex-none px-4 py-2"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        <Send size={15} />
                                        Ajukan Pinjam
                                    </button>
                                ) }
                                </div>
                            </DialogFooter>

                        <button 
                            onClick={() => setClickId({ id: null, status: false })}
                            className="absolute top-4 right-4 btn btn-sm btn-circle btn-ghost text-base-content/50 hover:text-base-content hover:bg-base-content/10"
                            aria-label="Close dialog"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </DialogPanel>
                    <BorrowRequestModal 
                        isOpen={isModalOpen}
                        book={data} 
                        userId={authId} 
                        onClose={() => setIsModalOpen(false)} 
                        onSuccess={() => {
                            if (import.meta.env.DEV) {
                                console.log("Pengajuan sukses diproses!");
                            }
                        }}
                    />
                </Dialog>
            ) }
        </>
    )
}

export default DialogInformation