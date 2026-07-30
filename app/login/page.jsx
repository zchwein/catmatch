"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaUser, FaLock, FaPaw, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { getApiUrl } from "@/utils/apiConfig";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError("Harap isi username dan password Anda");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await axios.post(
        `${getApiUrl()}/api/auth/login`,
        formData
      );
      if (response.status === 200) {
        localStorage.setItem("userId", response.data.user.id);
        localStorage.setItem("username", response.data.user.username);
        localStorage.setItem("nama", response.data.user.name);
        localStorage.setItem("alamat", response.data.user.alamat);
        localStorage.setItem("noTelp", response.data.user.noTelp);
        router.push("/");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Username atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100/50 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-amber-300/30 rounded-full blur-3xl -z-10 animate-pulse-glow"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-300/20 rounded-full blur-3xl -z-10"></div>

      <div className="p-4 sm:p-6">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-bold text-amber-900 hover:text-rose-600 bg-white/80 hover:bg-white px-4 py-2 rounded-xl transition-all duration-200 shadow-xs border border-amber-200/60"
        >
          <FaArrowLeft className="mr-2" /> Ke Beranda
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md glass-card rounded-3xl shadow-2xl shadow-amber-950/10 border border-amber-200/80 overflow-hidden">
          {/* Header Card */}
          <div className="p-8 text-center border-b border-amber-100/80">
            <div className="relative w-16 h-16 rounded-2xl mx-auto overflow-hidden shadow-lg shadow-amber-500/20 mb-3 border-2 border-white">
              <Image
                src="/logo.png"
                alt="CatMatch Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Selamat Datang Kembali!
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Masuk ke akun CatMatch untuk mengelola perjodohan kucing Anda
            </p>
          </div>

          {/* Form Login */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <div className="p-3.5 bg-rose-100 text-rose-800 rounded-2xl text-xs font-bold border border-rose-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-amber-500 text-sm">
                  <FaUser />
                </span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3.5 bg-white border border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-semibold text-slate-800 shadow-xs"
                  placeholder="Masukkan username Anda"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-amber-500 text-sm">
                  <FaLock />
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3.5 bg-white border border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-semibold text-slate-800 shadow-xs"
                  placeholder="Masukkan password Anda"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-warm text-white font-extrabold text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-rose-500/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Memproses...</span>
              ) : (
                <>
                  <FaPaw /> Masuk Akun
                </>
              )}
            </button>

            <div className="pt-4 border-t border-amber-100 text-center text-xs text-slate-600">
              Belum memiliki akun CatMatch?{" "}
              <Link
                href="/register"
                className="text-amber-700 font-extrabold hover:underline"
              >
                Daftar sekarang
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="py-4 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} CatMatch. All Rights Reserved.
      </div>
    </div>
  );
}

