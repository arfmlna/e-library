import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import JSZip from "jszip";
import Swal from "sweetalert2";
import PreviewTable from "./PreviewTable";
import { parseZipContent, fetchIdByCode } from "./bookUploadService";
import { pb } from "@/utils/pocketbase";
import { Dialog, DialogBackdrop, DialogHeader, DialogPanel, DialogTitle } from "@/components/animate-ui/primitives/headless/dialog";
import { X } from "lucide-react";

export default function BatchZipUploadBook({ refreshData, setOpenToggle, show, setShow }) {
    const [excelData, setExcelData] = useState([]);
    const [fileName, setFileName] = useState("");
    const [zipFiles, setZipFiles] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const queryClient = useQueryClient();
    const theme = localStorage.getItem('theme')

    // Handle ketika admin memilih berkas ZIP (Triger Preview)
    const handleFileChange = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            const parsedData = await parseZipContent(files[0]);
            setFileName(files[0].name);
            setZipFiles(files[0]);
            setExcelData(parsedData);
        } catch (error) {
            Swal.fire("Error", error.message || "Gagal membaca struktur file ZIP.", "error");
        }
    };

    const uploadMutation = useMutation({
    mutationFn: async () => {
        const zip = new JSZip();
        const unzipped = await zip.loadAsync(zipFiles);
        
        const totalData = excelData.length;
        let indexData = 1;

        for (const book of excelData) {
        Swal.update({
            text: `Mengunggah buku ke database... (${indexData}/${totalData} data)`
        });

        const formData = new FormData();
        const bookType = book.BookType || "digital";
        const katKode = String(book.KodeKategori || "00").padStart(2, "0");
        const supKode = String(book.KodeSupplier || "00").padStart(2, "0");

        const realSupplierId = await fetchIdByCode("supplier", supKode);
        const realCategoryId = await fetchIdByCode("category", katKode);

        formData.append("kode_buku", book.previewKodeBuku);
        formData.append("title", book.Title || "");
        formData.append("author", book.Author || "");
        formData.append("supplier", realSupplierId); 
        formData.append("category", realCategoryId); 
        formData.append("bookType", bookType);
        formData.append("publishDate", new Date().toISOString());
        formData.append("uploader", pb?.authStore?.record?.id || "");
        formData.append("stock", (bookType === "academic" || bookType === "nonacademic") ? (book.Stock || 0) : 0);

        if (book.PosterName && unzipped.files[book.PosterName]) {
            const posterBlob = await unzipped.files[book.PosterName].async("blob");
            formData.append("poster", posterBlob, book.PosterName);
        }

        if (book.PdfName && unzipped.files[book.PdfName] && bookType === "digital") {
            const pdfBlob = await unzipped.files[book.PdfName].async("blob");
            formData.append("pdfFile", pdfBlob, book.PdfName);
        }

        await pb.collection('books').create(formData);
        
        indexData++;
        }
    },
    onMutate: () => {
        setIsProcessing(true);
        Swal.fire({
        title: "Memproses Batch Upload",
        text: "Menghubungkan ke server...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        });
    },
    onSuccess: () => {
        setIsProcessing(false);
        Swal.fire({ 
        icon: "success", 
        title: "Berhasil!", 
        text: "Seluruh buku berbasis counter kombinasi sukses disimpan tanpa bentrok.", 
        timer: 2000, 
        showConfirmButton: false 
        });
        setExcelData([]);
        setFileName("");
        setZipFiles(null);
        if (refreshData) refreshData();
        if (setOpenToggle) setOpenToggle(false);
        queryClient.invalidateQueries(['books']);
    },
    onError: (error) => {
        setIsProcessing(false);
        Swal.fire({ 
        icon: "error", 
        title: "Gagal Mengunggah", 
        text: error.message || "Terjadi duplikasi data kode buku pada server." 
        });
    },
    });


    const handleBatchSubmit = (e) => {
        e.preventDefault();
        if (excelData.length === 0) return Swal.fire("Error", "Silakan pilih berkas ZIP yang valid!", "error");
        uploadMutation.mutate();
    };

    return (
        <Dialog open={show} onClose={() => setShow(false)}>
            <DialogBackdrop className="fixed inset-0 z-50 bg-white/50 dark:bg-black/50" />
            <DialogPanel data-theme={theme} className="fixed bg-white dark:bg-gray-800 left-1/2 top-1/2 z-50 w-[92%] md:w-4xl -translate-x-1/2 -translate-y-1/2 rounded-xl border border-base-content/10 p-5 md:p-6 shadow-2xl">
                <div className="flex justify-end w-full">
                    <button className="btn btn-circle btn-neutral btn-sm"
                    onClick={() => setShow(false)}>
                        <X size={15} />
                    </button>
                </div>
                <DialogHeader className="space-y-1">
                    <DialogTitle className="text-xl font-bold tracking-tight">Upload Batch Books</DialogTitle>
                </DialogHeader>
                <div className="overflow-x-auto overflow-y-auto rounded-lg border border-base-content/5 custom-scrollbar flex flex-col gap-6 p-2">
                    <p className="text-xs text-base-content/60">
                        Pilih file bungkusan <strong>.zip</strong> berisi file Excel beserta file lampirannya untuk memuat pratinjau data.
                    </p>
                    
                    <form onSubmit={handleBatchSubmit} className="space-y-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                        <input 
                            type="file" 
                            accept=".zip" 
                            onChange={handleFileChange}
                            disabled={isProcessing}
                            className="file-input file-input-bordered file-input-primary w-full max-w-xs" 
                        />
                        <button 
                            type="submit" 
                            disabled={isProcessing || excelData.length === 0} 
                            className="btn btn-primary w-full sm:w-auto"
                        >
                            {isProcessing ? "Menyimpan..." : `Simpan ${excelData.length > 0 ? excelData.length : ""} Buku`}
                        </button>
                        </div>
                    </form>
                    <PreviewTable data={excelData} fileName={fileName} />
                </div>
            </DialogPanel>
        </Dialog>
    );
}
