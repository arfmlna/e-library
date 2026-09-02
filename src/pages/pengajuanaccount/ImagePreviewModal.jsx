import React from 'react';

export default function ImagePreviewModal({ isOpen, onClose, userName, fileUrl }) {
    if (!isOpen) return null;

    return (
        <div className="modal modal-open bg-black/60 transition-opacity backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="modal-box max-w-2xl bg-base-100 p-6 rounded-2xl relative shadow-2xl">
                <button 
                    onClick={onClose} 
                    className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
                >✕</button>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <span>Berkas Bukti:</span> 
                    <span className="text-sm opacity-60 font-mono font-medium">{userName}</span>
                </h3>
                <div className="w-full max-h-[65vh] overflow-auto rounded-xl bg-base-200 border border-base-300 flex justify-center items-center">
                    <img 
                        src={fileUrl} 
                        alt="Bukti Identitas Pembesaran" 
                        className="w-full h-auto max-h-[60vh] object-contain"
                    />
                </div>
            </div>
        </div>
    );
}
