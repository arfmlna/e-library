import { pb } from '@/utils/pocketbase';
import { BookImage, ChevronsUp, LockKeyhole, Search, Shapes, LayoutPanelTop, Wallpaper } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeInVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function LandingPage() {
  const isLogin = pb?.authStore?.isValid
  return (
    <div className="overflow-x-hidden">
      <header id='home' className="h-full md:h-screen max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInVariant} 
          className="space-y-6 text-center md:text-left"
        >
          <h1 className="bg-linear-to-r from-black to-gray-900 dark:from-white dark:to-gray-100 bg-clip-text text-transparent text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Eksplorasi Koleksi 
            <br />
            <span className="bg-linear-to-r from-black to-gray-900 dark:from-white dark:to-gray-100 bg-clip-text text-transparent">
              Dalam Satu Layanan
            </span>
          </h1>
          <p className="text-base md:text-lg text-justify text-slate-500 dark:text-gray-400 max-w-lg mx-auto md:mx-0">
            Platform perpustakaan digital untuk mempermudah pencarian, dan akses berbagai koleksi materi bacaan kapan saja secara fleksibel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-200 font-medium rounded-lg shadow-sm shadow-black dark:shadow-white transition transform hover:-translate-y-0.5">
              <NavLink to={isLogin ? '/category' : '/sign-in'}>
                Mulai Eksplorasi
              </NavLink>
            </button>
            <button className="px-6 py-3 bg-white dark:bg-black border-2 hover:bg-slate-50 dark:hover:bg-gray-700 font-medium rounded-lg shadow-sm shadow-black dark:shadow-white transition">
              <NavLink className="flex justify-center items-center gap-1" to={isLogin ? '/all-books' : '/sign-in'}>
                <Search size={20} />
                Lihat Katalog 
              </NavLink>
            </button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full filter blur-3xl w-72 h-72 mx-auto self-center"></div>
          <img 
            src="/perpus.jpeg" 
            alt="E-Library Mockup" 
            className="w-full max-w-md rounded-2xl shadow-sm shadow-black dark:shadow-white border-4 transform rotate-2 hover:rotate-0 transition-transform duration-300 object-cover aspect-[4/3]"
          />
        </motion.div>
      </header>

      <section id="about" className="h-full md:h-screen flex items-center bg-slate-100 dark:bg-gray-800/50 py-16 border-y border-slate-200 dark:border-gray-800">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInVariant}
          className="max-w-4xl mx-auto px-6 text-center space-y-4"
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Tentang ElibFour</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto text-justify">
            ElibFour adalah ruang pustaka digital yang dirancang untuk mendukung ekosistem literasi. Kami mengintegrasikan teknologi pencarian pintar guna mempermudah pengelolaan data katalog pustaka serta memperluas akses informasi bagi seluruh civitas dan pengguna.
          </p>
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-xl mx-auto text-xs font-semibold text-slate-500 dark:text-gray-400">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-black dark:border-white text-black dark:text-white flex justify-center items-center gap-2">
              <BookImage size={15} /> Katalog Terintegrasi
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-black dark:border-white text-black dark:text-white flex justify-center items-center gap-2">
              <ChevronsUp size={15} /> Pencarian Responsif
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-black dark:border-white text-black dark:text-white flex justify-center items-center gap-2">
              <LockKeyhole size={15} /> Akses Tersentralisasi
            </div>
          </div>
        </motion.div>
      </section>

      <section id="feature" className="max-w-7xl h-full md:h-screen flex items-center mx-auto px-6 py-20">
        <div className="w-full">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInVariant}
            className="text-center max-w-2xl mx-auto mb-16 space-y-3"
          >
            <h2 className="text-3xl font-bold tracking-tight">Kemudahan Layanan Kami</h2>
            <p className="text-sm md:text-base text-slate-500 dark:text-gray-400">Berbagai keunggulan sistem yang disiapkan untuk menunjang kenyamanan manajemen perpustakaan.</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeInVariant} className="p-6 rounded-xl border shadow-sm space-y-4 hover:shadow-md transition">
              <div className="flex items-center gap-2"> 
                <div className="p-2 rounded-lg border-2">
                  <Shapes size={20} /> 
                </div>
                <h1 className='font-bold text-lg'>
                  Klasifikasi Terstruktur
                </h1>
              </div>
              <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed text-justify">
                Memudahkan pemetaan materi berdasarkan tipe spesifik seperti katalog digital, buku akademik, maupun non akademik dengan filter terpadu.
              </p>
            </motion.div>
            <motion.div variants={fadeInVariant} className="p-6 rounded-xl border shadow-sm space-y-4 hover:shadow-md transition">
              <div className="flex items-center gap-2"> 
                <div className="p-2 rounded-lg border-2">
                  <LayoutPanelTop size={20} /> 
                </div>
                <h3 className="font-bold text-lg">Pencarian Fleksibel</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
                Temukan data dokumen, dokumen PDF, judul, atau nama penulis dengan cepat berkat sistem query database yang optimal.
              </p>
            </motion.div>
            <motion.div variants={fadeInVariant} className="p-6 rounded-xl border shadow-sm space-y-4 hover:shadow-md transition">
              <div className="flex items-center gap-2"> 
                <div className="p-2 rounded-lg border-2">
                  <Wallpaper size={20} /> 
                </div>
                <h3 className="font-bold text-lg">Kenyamanan Visual</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
                Dilengkapi dukungan mode gelap yang fleksibel guna memberikan kenyamanan maksimal bagi visual pengguna saat membaca.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gradient-to-b from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-900 py-12 px-6 border-t border-slate-200 dark:border-gray-800">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center space-y-6"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Siap Menjelajahi Perpustakaan Lebih Mudah?</h2>
          <p className="text-sm text-slate-500 dark:text-gray-400 max-w-md mx-auto">Masuk ke akun Anda sekarang untuk mulai mengelola atau mengakses katalog data pustaka.</p>
          <button className="px-8 py-3.5 bg-white dark:bg-black border-2 border-black dark:border-white hover:bg-gray-200 dark:hover:bg-gray-800 text-black dark:text-white font-semibold rounded-lg shadow-lg shadow-gray-500/20 transition transform hover:-translate-y-0.5">
            <NavLink to={isLogin ? "/all-books" : "/sign-in"}>
              Gunakan Layanan
            </NavLink>
          </button>
          <p className="text-xs text-slate-400 dark:text-gray-500 pt-8">&copy; {new Date().getFullYear()} ElibFour E-Library. All rights reserved.</p>
        </motion.div>
      </footer>

    </div>
  );
}