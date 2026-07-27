"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPaw, FaCheckCircle, FaHome, FaUser } from "react-icons/fa";

export default function RegisterSuccessPage() {
  const [imgUrl, setImgUrl] = useState("");
  useEffect(() => {
    setImgUrl(localStorage.getItem("imgUrl"));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100/50 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-amber-300/30 rounded-full blur-3xl -z-10 animate-pulse-glow"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-300/20 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-md glass-card rounded-3xl shadow-2xl shadow-amber-950/10 border border-amber-200/80 overflow-hidden text-center">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white">
          <FaCheckCircle className="text-6xl mx-auto mb-3 animate-bounce" />
          <h1 className="text-2xl font-extrabold tracking-tight">Pendaftaran Berhasil!</h1>
          <p className="text-xs text-emerald-100 mt-1 font-medium">Akun & Profil Kucing Anda telah aktif</p>
        </div>

        <div className="p-8">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt="Foto Kucing"
              className="w-32 h-32 object-cover rounded-3xl mx-auto mb-6 border-4 border-amber-200 shadow-xl shadow-amber-950/10"
            />
          ) : (
            <div className="bg-amber-100 border-2 border-dashed border-amber-300 rounded-3xl w-32 h-32 mx-auto flex items-center justify-center mb-6 text-amber-500">
              <FaPaw className="text-5xl" />
            </div>
          )}

          <p className="text-slate-600 text-xs sm:text-sm mb-8 leading-relaxed">
            Selamat bergabung di CatMatch! Sekarang Anda dapat langsung masuk untuk mencari pasangan terbaik bagi kucing kesayangan Anda.
          </p>

          <div className="space-y-3">
            <Link
              href="/login"
              className="gradient-warm text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-lg shadow-rose-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <FaUser />
              <span>Masuk Akun Sekarang</span>
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 bg-white text-slate-700 hover:bg-amber-50 font-bold text-xs py-3 px-6 rounded-2xl border border-amber-200"
            >
              <FaHome />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

