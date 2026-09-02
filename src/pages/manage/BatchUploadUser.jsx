import React, { useState } from "react";
import { Dialog, DialogBackdrop, DialogHeader, DialogPanel, DialogTitle } from "@/components/animate-ui/primitives/headless/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { pb } from "@/utils/pocketbase";
import Swal from "sweetalert2";
import { X } from "lucide-react";

export default function BatchUploadUser({ show, setShow }) {
    const [excelData, setExcelData] = useState([]);
    const [fileName, setFileName] = useState("");
    const queryClient = useQueryClient();

    const theme = localStorage.getItem('theme')

    // TanStack Mutation untuk handle upload ke PocketBase
    const uploadMutation = useMutation({
        mutationFn: async (users) => {
        const promises = users.map((user) => {
            return pb.collection("users").create({
                email: user.Email,
                emailVisibility: true,
                password: user.Password || "User12345!",
                passwordConfirm: user.Password || "User12345!",
                name: user.Nama,
                role: 'users',
                status: 'verified',
            });
        });
        // Menjalankan semua request secara paralel
        return Promise.all(promises);
        },
        onSuccess: () => {
            Swal.fire({
                icon: 'success',
                text: 'Semua user berhasil di-upload!',
            })
            setExcelData([]);
            setFileName("");
            // Refresh data user jika ada tabel user di halaman yang sama
            queryClient.invalidateQueries(["users"]);
        },
        onError: (error) => {
            console.error("Gagal mengupload user:", error);
            Swal.fire({
                icon: 'error',
                text: `Terjadi kesalahan: ${error.message}`
            })
        },
    });

    // Handle pembacaan file Excel
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();

        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: "binary" });
            const wsname = wb.SheetNames[0]; // Ambil sheet pertama
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws); // Konversi ke JSON
            setExcelData(data);
        };

        reader.readAsBinaryString(file);
    };

    // Handle submit upload
    const handleUpload = () => {
        if (excelData.length === 0) {
            alert("Silakan pilih file Excel yang valid terlebih dahulu.");
        return;
        }
        uploadMutation.mutate(excelData);
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
                    <DialogTitle className="text-xl font-bold tracking-tight">Upload Batch Users</DialogTitle>
                </DialogHeader>
                <div className="overflow-x-auto overflow-y-auto rounded-lg border border-base-content/5 custom-scrollbar flex flex-col gap-6 p-2">
                    {/* Panduan Format Excel */}
                    <div className="alert alert-info shadow-sm text-sm">
                        <div>
                        <span className="font-semibold">Format Kolom Excel:</span> Email, Nama, Password
                        </div>
                    </div>

                    {/* Input File & Tombol Aksi */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <input
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        onChange={handleFileChange}
                        className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                        defaultValue={excelData}
                        />
                        
                        <button
                        onClick={handleUpload}
                        disabled={excelData.length === 0 || uploadMutation.isPending}
                        className="btn btn-primary w-full sm:w-auto"
                        >
                        {uploadMutation.isPending ? (
                            <>
                            <span className="loading loading-spinner"></span>
                            Mengupload {excelData.length} User...
                            </>
                        ) : (
                            `Upload ${excelData.length > 0 ? excelData.length : ""} Users`
                        )}
                        </button>

                        <button className="btn btn-error" 
                        disabled={excelData < 1}
                        onClick={() => setExcelData([])}>
                            Reset
                        </button>
                    </div>

                    {/* Preview Data */}
                    {excelData.length > 0 && (
                        <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Preview Data ({fileName})</h3>
                        <div className="overflow-x-auto max-h-96 border border-base-300 rounded-lg">
                            <table className="table table-zebra table-pin-rows">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Email</th>
                                    <th>Nama</th>
                                    <th>Password</th>
                                </tr>
                            </thead>
                            <tbody>
                                {excelData.map((user, index) => (
                                <tr key={index}>
                                    <th>{index + 1}</th>
                                    <td>{user.Email || "-"}</td>
                                    <td>{user.Nama || "-"}</td>
                                    <td>{user.Password || "-"}</td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                        </div>
                    )}
                </div>
            </DialogPanel>
        </Dialog>
    );
}