import { pb } from '@/utils/pocketbase';
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function LandingPage() {
  const isLogin = pb?.authStore?.isValid
  return (
    <div className="">
      {/* 2. HERO SECTION */}
      <header id='home' className="h-full md:h-screen max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold">
            ✨ Platform Perpustakaan Modern
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Eksplorasi Koleksi <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Dalam Satu Layanan</span>
          </h1>
          <p className="text-base md:text-lg text-slate-500 dark:text-gray-400 max-w-lg mx-auto md:mx-0">
            Platform perpustakaan digital untuk mempermudah pencarian, dan akses berbagai koleksi materi bacaan kapan saja secara fleksibel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition transform hover:-translate-y-0.5">
              <NavLink to={isLogin ? '/category' : '/sign-in'}>
                Mulai Eksplorasi
              </NavLink>
            </button>
            <button className="px-6 py-3 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700 font-medium rounded-lg shadow-sm transition">
              <NavLink to={isLogin ? '/all-books' : '/sign-in'}>
                Lihat Katalog 🔍
              </NavLink>
            </button>
          </div>
        </div>
        
        {/* Visual Ilustrasi Kanan */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full filter blur-3xl w-72 h-72 mx-auto self-center"></div>
          <img 
            src="/perpus.jpeg" 
            alt="E-Library Mockup" 
            className="w-full max-w-md rounded-2xl shadow-2xl border-4 border-white dark:border-gray-800 transform rotate-2 hover:rotate-0 transition-transform duration-300 object-cover aspect-[4/3]"
          />
        </div>
      </header>

      {/* 3. STATISTIK SECTION */}
      <section id="about" className="h-full md:h-screen flex items-center bg-slate-100 dark:bg-gray-800/50 py-16 border-y border-slate-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Tentang RuangBaca</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
            RuangBaca adalah ruang pustaka digital yang dirancang untuk mendukung ekosistem literasi. Kami mengintegrasikan teknologi pencarian pintar guna mempermudah pengelolaan data katalog pustaka serta memperluas akses informasi bagi seluruh civitas dan pengguna.
          </p>
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-xl mx-auto text-xs font-semibold text-slate-500 dark:text-gray-400">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-slate-200/60 dark:border-gray-700/60">
              📂 Katalog Terintegrasi
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-slate-200/60 dark:border-gray-700/60">
              ⚡ Pencarian Responsif
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-slate-200/60 dark:border-gray-700/60">
              🔒 Akses Tersentralisasi
            </div>
          </div>
        </div>
      </section>

      {/* 4. FITUR UNGGULAN SECTION */}
      <section id="feature" className="max-w-7xl h-full md:h-screen flex items-center mx-auto px-6 py-20">
        <div className="">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">Kemudahan Layanan Kami</h2>
            <p className="text-sm md:text-base text-slate-500 dark:text-gray-400">Berbagai keunggulan sistem yang disiapkan untuk menunjang kenyamanan manajemen perpustakaan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fitur 1 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm space-y-4 hover:shadow-md transition">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg">📱</div>
              <h3 className="font-bold text-lg">Klasifikasi Terstruktur</h3>
              <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
                Memudahkan pemetaan materi berdasarkan tipe spesifik seperti katalog digital, buku akademik, maupun non akademik dengan filter terpadu.
              </p>
            </div>
            {/* Fitur 2 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm space-y-4 hover:shadow-md transition">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">⚡</div>
              <h3 className="font-bold text-lg">Pencarian Fleksibel</h3>
              <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
                Temukan data dokumen, dokumen PDF, judul, atau nama penulis dengan cepat berkat sistem query database yang optimal.
              </p>
            </div>
            {/* Fitur 3 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm space-y-4 hover:shadow-md transition">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-lg">🌓</div>
              <h3 className="font-bold text-lg">Kenyamanan Visual</h3>
              <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
                Dilengkapi dukungan mode gelap yang fleksibel guna memberikan kenyamanan maksimal bagi visual pengguna saat membaca.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION & FOOTER */}
      <footer className="bg-gradient-to-b from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-950 py-12 px-6 border-t border-slate-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Siap Menjelajahi Perpustakaan Lebih Mudah?</h2>
          <p className="text-sm text-slate-500 dark:text-gray-400 max-w-md mx-auto">Masuk ke akun Anda sekarang untuk mulai mengelola atau mengakses katalog data pustaka.</p>
          <button className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition transform hover:-translate-y-0.5">
            <NavLink to={isLogin ? "/all-books" : "/sign-in"}>
              Gunakan Layanan
            </NavLink>
          </button>
          <p className="text-xs text-slate-400 dark:text-gray-500 pt-8">&copy; {new Date().getFullYear()} RuangBaca E-Library. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}