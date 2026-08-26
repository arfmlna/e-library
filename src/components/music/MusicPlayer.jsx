import { useLocalStorage } from "@/constants/useLocalStorage";
import { ArrowLeft, ArrowRight, Delete, Music, Pause, Play, Repeat, Search, Shuffle, Trash, X } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

const DB_NAME = "LocalMusicPlayerDB";
const STORE_NAME = "tracks";

export default function MusicPlayer({
    isOpen,
    onClose
}) {
    const [playlist, setPlaylist] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useLocalStorage('MP_volume', 0.5)
    const [currentIndex, setCurrentIndex] = useLocalStorage("MP_select_music", 0); 
    const [isShuffle, setIsShuffle] = useLocalStorage("MP_shuffle", false); 
    const [loopMode, setLoopMode] = useLocalStorage("MP_loop_mode", "ALL"); 
    const [showVolume, setShowVolume] = useState(false);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const audioRef = useRef(null);

    useEffect(() => {
        const request = indexedDB.open(DB_NAME, 1);
        
        let createdUrls = []; 
        
        request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
        }
        };

        request.onsuccess = (e) => {
            const db = e.target.result;
            const transaction = db.transaction(STORE_NAME, "readonly");
            const store = transaction.objectStore(STORE_NAME);
            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = () => {
                const savedTracks = getAllRequest.result;
                if (savedTracks.length > 0) {
                    const formatted = savedTracks.map(track => ({
                        id: track.id,
                        name: track.name,
                        url: URL.createObjectURL(track.fileData)
                    }));
                    setPlaylist(formatted);
                    const savedIndex = currentIndex < formatted.length ? currentIndex : 0;

                    setIsPlaying(false); 
                    if (audioRef.current && formatted[savedIndex]) {
                        audioRef.current.src = formatted[savedIndex].url;
                        audioRef.current.load();
                    }
                }
            };
        };
        return () => {
            createdUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, []);

    const handleFolderScan = (event) => {
        const files = Array.from(event.target.files);
        const audioFiles = files.filter((file) => file.type.startsWith("audio/"));

        if (audioFiles.length === 0) {
            alert("Tidak ditemukan file musik di dalam folder ini!");
            return;
        }

        const request = indexedDB.open(DB_NAME, 1);
        request.onsuccess = (e) => {
            const db = e.target.result;
            
            const clearTx = db.transaction(STORE_NAME, "readwrite");
            clearTx.objectStore(STORE_NAME).clear();

            clearTx.oncomplete = () => {
                const insertTx = db.transaction(STORE_NAME, "readwrite");
                const store = insertTx.objectStore(STORE_NAME);

                audioFiles.forEach((file) => {
                    store.add({ name: file.name, fileData: file });
                });

                insertTx.oncomplete = () => {
                    const formattedPlaylist = audioFiles.map((file) => ({
                        name: file.name.replace(/\.[^/.]+$/, ""),
                        url: URL.createObjectURL(file),
                    }));

                    setPlaylist(formattedPlaylist);
                    setCurrentIndex(0);
                    setIsPlaying(false);
                    setCurrentTime(0);

                    if (audioRef.current && formattedPlaylist.length > 0) {
                        audioRef.current.src = formattedPlaylist[0].url;
                        audioRef.current.load();
                    }
                };
            };
        };
    };

    const togglePlay = () => {
        if (playlist.length === 0) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch((err) => console.log("Playback diblokir:", err));
        }
        setIsPlaying(!isPlaying);
    };

    const playTrackByIndex = (index) => {
        if (!playlist[index]) return;
        setCurrentIndex(index);
        if (audioRef.current) {
            audioRef.current.src = playlist[index].url;
            audioRef.current.load();
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));;
        }
    };

    const changeTrack = (direction) => {
        if (playlist.length === 0) return;

        if (isShuffle && direction === 1) {
            const randomIndex = Math.floor(Math.random() * playlist.length);
            playTrackByIndex(randomIndex);
            return;
        }

        let newIndex = currentIndex + direction;
        if (newIndex >= playlist.length) newIndex = 0;
        if (newIndex < 0) newIndex = playlist.length - 1;

        playTrackByIndex(newIndex);
    };

    const handleTrackEnded = () => {
        if (loopMode === "ONE") {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
        } else {
            changeTrack(1);
        }
    };


    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const clearDatabase = () => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onsuccess = (e) => {
            const db = e.target.result;
            const tx = db.transaction(STORE_NAME, "readwrite");
            tx.objectStore(STORE_NAME).clear();
            setPlaylist([]);
            setCurrentIndex(0);
            setIsPlaying(false);
            setCurrentTime(0)
            setDuration(0)
            alert("Playlist lokal berhasil dihapus dari browser.");
        };
    };

    const handleVolumeChange = (event) => {
        const newVolume = parseFloat(event.target.value);
        setVolume(newVolume);
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    useEffect(() => {
        if ('mediaSession' in navigator && playlist[currentIndex]) {
            try {
                navigator.mediaSession.metadata = new window.MediaMetadata({
                    title: playlist[currentIndex].name,
                    artist: "Lokal Musik Player",
                    album: "Daftar Putar Lokal",
                    artwork: [{ src: "/sketch.png", sizes: "192x192", type: "image/png" }]
                });

                navigator.mediaSession.setActionHandler('play', () => togglePlay());
                navigator.mediaSession.setActionHandler('pause', () => togglePlay());
                navigator.mediaSession.setActionHandler('previoustrack', () => changeTrack(-1));
                navigator.mediaSession.setActionHandler('nexttrack', () => changeTrack(1));
            
                if (audioRef.current && !isNaN(audioRef.current.duration)) {
                    navigator.mediaSession.setPositionState({
                    duration: audioRef.current.duration,
                    playbackRate: audioRef.current.playbackRate || 1,
                    position: audioRef.current.currentTime || 0
                    });
                }
            } catch (error) {
            console.warn("Media Session API gagal dimuat atau tidak didukung penuh:", error);
            }
        }
    }, [currentIndex, playlist, isPlaying]);

    return (
         <div 
        className={`fixed top-0 right-0 h-full w-full max-w-sm sm:max-w-md bg-base-100 border-l border-base-300 shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${
            isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        >
        <div className="flex justify-between items-center p-4 border-b border-base-300 bg-base-200">
            <span className="font-bold flex items-center gap-2">
            <Music size={18} /> Pemutar Musik
            </span>
            <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost" title="Tutup">
            <X size={18} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
            <div className="card w-full bg-base-100 border border-base-200 shadow-sm">
            <div className="card-body gap-4 p-2 sm:p-4">
            
                <div className={`form-control w-full mt-2 grid ${playlist.length > 0 ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
                <input type="file" webkitdirectory="true" directory="true" multiple id="folder-upload" onChange={handleFolderScan} className="hidden" />
                <label htmlFor="folder-upload" className="btn btn-sm btn-neutral dark:btn-primary gap-2 text-xs h-auto py-2 cursor-pointer">
                    <Search size={12} />
                    <span className="truncate">Scan Folder</span>
                </label>
                {playlist.length > 0 && (
                    <button onClick={clearDatabase} className="btn btn-sm btn-error text-xs h-auto py-2">
                    <Trash size={12}/>
                    <span className="truncate">Hapus Cache</span>
                    </button>
                )}
                </div>

                {playlist.length > 0 ? (
                <div className="bg-base-200 rounded-box p-3 text-center mt-2">
                    <p className="font-medium text-xs line-clamp-2 px-2 h-10 min-h-[2.5rem]">
                    {playlist[currentIndex]?.name}
                    </p>

                    <div className="flex flex-row w-full gap-2 my-4 items-center">
                        <span className="text-[10px] font-mono min-w-[30px]">{formatTime(currentTime)}</span>
                        <input type="range" min="0" max={duration || 100} className="range range-primary range-xs cursor-pointer flex-1"
                            value={currentTime}
                            onChange={(e) => {
                            const newTime = parseFloat(e.target.value);
                            setCurrentTime(newTime);
                            audioRef.current.currentTime = newTime;
                            }}
                        />
                        <span className="text-[10px] font-mono min-w-[30px]">{formatTime(duration)}</span>
                    </div>

                    <div className="w-full flex justify-between items-center gap-1 mt-2 relative px-1">
                        <button className="btn btn-circle btn-xs invisible">hide</button>
                        <button onClick={() => setIsShuffle(!isShuffle)} className={`btn btn-circle btn-xs ${isShuffle ? "btn-primary" : "btn-neutral"}`} title="Acak">
                            <Shuffle size={12}/>
                        </button>
                        <button onClick={() => changeTrack(-1)} className="btn btn-circle btn-neutral btn-xs" title="Kembali"><ArrowLeft size={14} /></button>
                        <button onClick={togglePlay} className="btn btn-circle btn-neutral btn-md shadow-md" title="Mainkan">
                            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <button onClick={() => changeTrack(1)} className="btn btn-circle btn-neutral btn-xs" title="Selanjutnya"><ArrowRight size={14} /></button>
                        <button onClick={() => setLoopMode(loopMode === "ALL" ? "ONE" : "ALL")} className="btn btn-xs btn-circle btn-neutral font-bold relative" title="Ulang">
                            <Repeat size={12} /> 
                            <span className="absolute -top-1 -right-2 badge badge-primary scale-75 text-[8px] px-1">{loopMode === "ONE" ? "1" : "all"}</span>
                        </button>
                        <div className="relative flex flex-col items-center">
                            <div className={`absolute bottom-full mb-3 flex items-center justify-center h-28 w-10 bg-base-100 border border-base-300 rounded-box shadow-xl p-2 z-20 ${showVolume ? "flex" : "hidden"}`}>
                                <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange}
                                className="range range-xs cursor-pointer -rotate-90 absolute w-24 origin-center"/>
                            </div>
                            <button className={`btn btn-xs btn-circle ${showVolume ? "btn-primary" : "btn-neutral"}`}
                            onClick={() => setShowVolume(!showVolume)}>
                                {volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
                            </button>
                        </div>
                    </div>
                </div>
                ) : (
                <div className="alert alert-info text-xs mt-2 py-2">
                    <span>Silakan scan folder musik Anda.</span>
                </div>
                )}

                <div className="flex flex-col mt-2">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-xs text-base-content/80">Daftar Lagu</h3>
                    <span className="badge badge-neutral badge-sm font-mono">{playlist.length} track</span>
                </div>
                <div className="overflow-y-auto max-h-[calc(100vh-320px)] border border-base-300 rounded-box bg-base-50 p-1">
                    {playlist.length === 0 ? (
                    <p className="text-center text-xs text-base-content/40 py-8">Belum ada lagu</p>
                    ) : (
                    <ul className="menu menu-sm p-0">
                        {playlist.map((track, index) => (
                        <li key={index} className="my-0.5">
                            <button onClick={() => playTrackByIndex(index)} className={`flex justify-between rounded-lg py-2 ${index === currentIndex ? "active bg-primary text-primary-content" : ""}`}>
                            <span className="truncate pr-2 text-left flex-1 text-xs">{index + 1}. {track.name}</span>
                            </button>
                        </li>
                        ))}
                    </ul>
                    )}
                </div>
                </div>

            </div>
            </div>
        </div>
        <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate} 
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleTrackEnded}
        />
        </div>
    );
}