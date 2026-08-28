import React from "react";

export default function PreviewTable({ data, fileName }) {
    if (!data || data.length === 0) return null;

    return (
        <div className="mt-8 border-t pt-6 border-base-200">
        <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-secondary">
            Pratinjau Dokumen: <span className="font-mono text-primary font-normal">{fileName}</span>
            </h3>
            <span className="badge badge-secondary badge-sm">{data.length} Baris Ditemukan</span>
        </div>

        <div className="overflow-x-auto max-h-96 border border-base-300 rounded-xl shadow-inner">
            <table className="table table-zebra table-sm table-pin-rows">
            <thead>
                <tr className="bg-base-200 text-xs">
                <th>No</th>
                <th>Kode Buku</th>
                <th>Judul Buku (Title)</th>
                <th>Penulis (Author)</th>
                <th>Tipe (BookType)</th>
                <th>Stok</th>
                <th>Kode Kategory</th>
                <th>Kode Supplier</th>
                <th>Berkas Poster</th>
                <th>Berkas PDF</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row, idx) => (
                <tr key={idx} className="text-xs">
                    <th>{idx + 1}</th>
                    <td className="font-mono font-bold text-primary bg-base-200/50">{row.previewKodeBuku}</td>
                    <td className="font-semibold text-base-content">{row.Title || "-"}</td>
                    <td>{row.Author || "-"}</td>
                    <td>
                    <span className={`badge badge-xs p-2 font-medium ${row.BookType === 'digital' ? 'badge-accent' : 'badge-neutral'}`}>
                        {row.BookType || "digital"}
                    </span>
                    </td>
                    <td className="font-mono font-semibold">{row.BookType === "digital" ? 0 : (row.Stock || 0)}</td>
                    <td className="font-mono text-gray-500">{row.KodeKategori || "00"}/{row.KodeSupplier || "00"}</td>
                    
                    <td>
                    {row.PosterName ? (
                        row.hasPoster ? (
                        <span className="text-success flex items-center gap-1">✓ <span className="text-[10px] text-gray-400 font-mono">({row.PosterName})</span></span>
                        ) : (
                        <span className="text-error font-medium">⚠️ File Hilang ({row.PosterName})</span>
                        )
                    ) : (
                        <span className="text-gray-400 italic">Tanpa Poster</span>
                    )}
                    </td>

                    {/* Status File PDF */}
                    <td>
                    {row.BookType === "digital" && row.PdfName ? (
                        row.hasPdf ? (
                            <span className="text-success flex items-center gap-1">✓ <span className="text-[10px] text-gray-400 font-mono">({row.PdfName})</span></span>
                        ) : (
                            <span className="text-error font-medium">⚠️ File Hilang ({row.PdfName})</span>
                        )
                    ) : row.BookType !== "digital" ? (
                        <span className="text-gray-400">-</span>
                    ) : (
                        <span className="text-warning italic">PDF Kosong</span>
                    )}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
}
