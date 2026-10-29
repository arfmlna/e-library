import { pb } from '@/utils/pocketbase'
import noImageProfile from '/anonim.jpg'
import { useNavigate } from 'react-router-dom'
import DarkMode from '@/components/switch/DarkMode';
import { useEffect, useState } from 'react';
import { useNetworkType } from '@/utils/NetworkType';
import { useLocalStorage } from '@/constants/useLocalStorage';
import { ArrowLeft, LogOut } from 'lucide-react';
import Swal from 'sweetalert2';

export default function UsersSettings() {
  const [textSize, setTextSize] = useState(() => {
    const savedSize = localStorage.getItem('book-text-size');
    return savedSize ? parseInt(savedSize) : 100;
  });
  
  const navigate = useNavigate()
  const network = useNetworkType();
  const [showMP, setShowMP] = useLocalStorage('showMP', true);
  const [showPointerListBook, setShowPointerListBook] = useLocalStorage('showPLB', true)

  const info = pb.authStore.record
  const image = pb.files.getURL(info, info.avatar)

  useEffect(() => {
    localStorage.setItem('book-text-size', textSize.toString());
  }, [textSize]);

  const getSizeLabel = (size) => {
    if (size <= 50) return 'Kecil';
    if (size <= 100) return 'Normal';
    if (size <= 200) return 'Besar';
    return 'Sangat Besar 🚨';
  };

  const handleLogout = () => {
      Swal.fire({
          title: "Info Logout🚪",
          text: "Yakin Ingin Keluar?",
          icon: "question",
          showConfirmButton: true,
          showDenyButton: true,
          confirmButtonText: "Ya!",
          denyButtonText: "Tidak!"
      }).then((res) => {
          if (res.isConfirmed) {
              pb.authStore.clear()
              window.location.href = "/sign-in"
          }
      })
  }

  return (
    <div className="max-w-md md:max-w-5xl mx-auto p-4 min-h-screen shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button className="btn btn-ghost btn-circle" onClick={() => navigate(-1)}>
          <ArrowLeft size={24}/>
        </button>
        <h1 className="text-xl font-bold">Pengaturan Aplikasi</h1>
      </div>
      <div className="card shadow-xl mb-6">
        <div className="card-body flex-row items-center gap-4 p-4">
          <div className="avatar">
            <div className="w-16 rounded-full ring ring-offset-2">
              <img src={image ? image : noImageProfile} alt="Avatar" />
            </div>
          </div>
          <div>
            <h2 className="font-bold text-lg">{info.name}</h2>
            <p className="text-sm text-base-content/60">{info.role}</p>
          </div>
          <button className="btn btn-outline btn-sm ml-auto" onClick={() => navigate('/profile')}>
            Edit
          </button>
        </div>
      </div>
      <div className="mb-6">
        <span className="text-xs font-semibold px-2 text-base-content/50 uppercase tracking-wider">Akun & Keamanan</span>
        <div className="bg-base-100 rounded-box shadow-sm mt-2">
          <button className="flex items-center justify-between p-4 cursor-pointer hover:bg-base-200/50 transition w-full"
          onClick={() => navigate('/change-password')}>
            <span className="text-sm font-medium">Ubah Kata Sandi</span>
            <svg xmlns="http://w3.org" className="h-5 w-5 text-base-content/40" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
          </button>
          {/* <div className="flex md:hidden items-center justify-between p-4">
            <span className="text-sm font-medium">Kunci Aplikasi (Biometrik)</span>
            <input type="checkbox" className="toggle toggle-primary toggle-sm" defaultChecked />
          </div> */}
        </div>
      </div>
      <div className="mb-6">
        <span className="text-xs font-semibold px-2 text-base-content/50 uppercase tracking-wider">Preferensi Membaca</span>
        <div className="bg-base-100 rounded-box shadow-sm mt-2 divide-y divide-base-200">
          <div className="flex items-center justify-between p-4">
            <span className="text-sm font-medium">Mode Gelap</span>
            <DarkMode />
          </div>
          <div className="flex items-center justify-between p-4">
            <span className="text-sm font-medium">Music Player</span>
            <input type="checkbox" className='toggle toggle-md' 
            defaultChecked={showMP} onChange={() => setShowMP(!showMP)} />
          </div>
          <div className="flex items-center justify-between p-4">
            <span className="text-sm font-medium">Pointer List Book</span>
            <input type="checkbox" className='toggle toggle-md' 
            defaultChecked={showPointerListBook} onChange={() => setShowPointerListBook(!showPointerListBook)} />
          </div>
          <div className="p-4">
            <div className="flex justify-between mb-2 gap-20">
              <div className="">
                <span className="text-sm font-medium">Ukuran Teks Buku</span>
                <input type="range" min="10" max="200" className="range range-xs" defaultValue={textSize} 
                onChange={(e) => setTextSize(e.target.value)} />
              </div>
              <span className="btn btn-outline btn-xs my-auto">
                {Math.round(textSize / 2)}% ({getSizeLabel(textSize)})
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className='text-sm font-medium block'>
              <h2 className='text-sm'>Detail Jaringan</h2>
              <p className='text-xs'>Tipe Jaringan (Type)</p>
              <p className='text-xs'>Kategori Kecepatan (Effective Type)</p>
              <p className='text-xs'>Estimasi Kecepatan Download</p>
            </div>
            <div className="">
              <div className="py-2">{" "}</div>
              {!network.supported && (
                <p style={{ color: 'orange' }}>
                  ⚠️ Browser Anda tidak mendukung pendeteksian tipe jaringan secara spesifik (seperti Safari).
                </p>
              )}
              <p className='text-xs'>{network.type}</p>
              <p className='text-xs'>{network.effectiveType}</p>
              <p className='text-xs'>{network.downlink ? `${network.downlink} Mbps` : 'unknown'}</p>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="mb-6">
        <span className="text-xs font-semibold px-2 text-base-content/50 uppercase tracking-wider">Notifikasi</span>
        <div className="bg-base-100 rounded-box shadow-sm mt-2 divide-y divide-base-200">
          <div className="flex items-center justify-between p-4">
            <span className="text-sm font-medium">Pengingat Batas Pengembalian</span>
            <input type="checkbox" className="toggle toggle-primary toggle-sm" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-4">
            <span className="text-sm font-medium">Rekomendasi Buku Baru</span>
            <input type="checkbox" className="toggle toggle-primary toggle-sm" />
          </div>
        </div>
      </div> */}
      <button className="btn btn-error btn-outline w-full gap-2 mt-4"
      onClick={handleLogout}>
        <LogOut size={16} absoluteStrokeWidth />
        Keluar dari Akun
      </button>
    </div>
  )
}
