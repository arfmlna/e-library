import { useState } from 'react'

export default function Music({ audioRef }) {
    const [play, setPlay] = useState(false)

    const handlePlay = () => {
        if (!audioRef.current) return;
         
        audioRef.current.loop = true; 
        
        if (!play) {
            audioRef.current.play().catch(err => {
                if (import.meta.env.DEV) {
                    console.error("Gagal memutar audio:", err);
                }
            });
        } else {
            audioRef.current.pause();
        }

        setPlay(!play);
    }

    return (
        <div className="">
            <button className='btn btn-neutral btn-xs' onClick={handlePlay}>
                { play ? 'Pause' : 'Play' }
            </button>
        </div>
    )
}
