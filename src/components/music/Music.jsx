import { useEffect, useState } from 'react'

export default function Music({ audioRef }) {
    const [play, setPlay] = useState(false)

    useEffect(() => {
        // Pastikan audioRef.current sudah terdefinisi sebelum diakses
        if (audioRef.current) {
            if (play) {
                // audioRef.current.play().catch(err => {
                //     console.error("Gagal memutar audio:", err);
                // });
            } else {
                // audioRef.current.pause();
            }
        }
    }, [play, audioRef])

    const handlePlay = () => {
        if (audioRef.current) {
            // 🌟 PERBAIKAN: Gunakan properti boolean, bukan fungsi .loop()
            audioRef.current.loop = true; 
            setPlay(!play);
        }
    }

    return (
        <div className="">
            <button className='btn btn-neutral btn-xs' onClick={handlePlay}>
                { play ? 'Pause' : 'Play' }
            </button>
        </div>
    )
}
