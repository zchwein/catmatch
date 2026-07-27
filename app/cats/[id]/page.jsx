"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Link from "next/link";
import {
  FaPaw,
  FaVenusMars,
  FaPalette,
  FaHome,
  FaArrowLeft,
  FaWhatsapp,
  FaDna,
  FaMars,
  FaVenus,
  FaCalendarAlt,
  FaExclamationCircle,
} from "react-icons/fa";
import axios from "axios";

const CatDetailPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { id } = useParams();
  const router = useRouter();
  const [cat, setCat] = useState(null);
  const [prediksiAnak, setPrediksiAnak] = useState(null);
  const [errorPrediksi, setErrorPrediksi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    const fetchCatData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cat/${id}`
        );
        const catData = response.data.cat;
        setCat(catData);

        const kucing1 = localStorage.getItem("selectedCat");
        const kucing2 = id;

        if (kucing1 && kucing2) {
          try {
            const prediksiRes = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/cat/prediksi`,
              { kucing1Id: kucing1, kucing2Id: kucing2 }
            );
            setPrediksiAnak(prediksiRes.data.data);
            setErrorPrediksi(null);
          } catch (err) {
            console.error("Error prediksi:", err.response?.data);
            setErrorPrediksi(
              err.response?.data?.message || "Gagal melakukan prediksi"
            );
            setPrediksiAnak(null);
          }
        }
      } catch (error) {
        console.error("Error fetching cat data:", error);
        setError("Detail profil kucing tidak ditemukan");
      } finally {
        setLoading(false);
      }
    };
    fetchCatData();
  }, [id]);

  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    if (phone.startsWith("0")) {
      return "+62" + phone.slice(1);
    }
    if (phone.startsWith("+62")) {
      return phone;
    }
    return phone;
  };

  if (!isMounted || loading || !cat) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100/50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500 mb-3"></div>
        <p className="text-amber-900 font-bold text-xs tracking-wide">Memuat Profil Kucing...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100/50 p-4">
        <div className="glass-card rounded-3xl p-8 max-w-md w-full text-center shadow-xl border border-amber-200">
          <FaExclamationCircle className="text-5xl text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Profil Tidak Ditemukan</h2>
          <p className="text-slate-600 text-sm mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="gradient-warm text-white text-xs font-bold py-3 px-8 rounded-xl shadow-md cursor-pointer"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-xs font-bold text-amber-900 hover:text-rose-600 bg-amber-100/80 hover:bg-amber-200 px-4 py-2 rounded-xl mb-6 transition-all duration-200 cursor-pointer shadow-xs border border-amber-200/60"
          >
            <FaArrowLeft className="mr-2" /> Kembali
          </button>

          {/* Main Detail Container */}
          <div className="glass-card rounded-3xl overflow-hidden shadow-2xl shadow-amber-950/5 border border-amber-200/80">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Photo Showcase (Left/Top) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-amber-100 to-rose-100 relative min-h-[350px] lg:min-h-full">
                {cat?.image ? (
                  <img
                    src={cat?.image}
                    alt={cat?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-amber-300 min-h-[350px]">
                    <FaPaw className="text-6xl mb-2" />
                    <span className="text-sm text-amber-800 font-bold">Foto Profil Kucing</span>
                  </div>
                )}
                
                {/* Floating Gender Overlay Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md backdrop-blur-md border ${
                      cat.gender === "Jantan"
                        ? "bg-sky-500/90 text-white border-sky-300/40"
                        : "bg-rose-500/90 text-white border-rose-300/40"
                    }`}
                  >
                    {cat.gender === "Jantan" ? <FaMars /> : <FaVenus />}
                    <span>{cat?.gender}</span>
                  </span>
                </div>
              </div>

              {/* Cat Profile Information (Right/Bottom) */}
              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-amber-100">
                    <div>
                      <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300/60 uppercase tracking-wider">
                        {cat?.breed}
                      </span>
                      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
                        {cat?.name}
                      </h1>
                    </div>

                    <div className="text-right bg-gradient-to-tr from-amber-50 to-rose-50 px-4 py-2 rounded-2xl border border-amber-200">
                      <span className="block text-2xl font-extrabold text-gradient-warm">
                        {cat?.age} <span className="text-xs font-bold text-slate-500">Bulan</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Umur Saat Ini</span>
                    </div>
                  </div>

                  {/* Quick Specs Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/60 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center text-sm shrink-0">
                        <FaPalette />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Warna Bulu</span>
                        <span className="font-extrabold text-xs text-slate-800 capitalize flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-slate-300 inline-block"
                            style={{ backgroundColor: cat?.color?.toLowerCase() }}
                          ></span>
                          {cat?.color}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-rose-50/60 rounded-2xl border border-rose-200/60 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-200 text-rose-800 flex items-center justify-center text-sm shrink-0">
                        <FaVenusMars />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Jenis Kelamin</span>
                        <span className="font-extrabold text-xs text-slate-800">{cat?.gender}</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/60 flex items-center gap-3 col-span-2">
                      <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center text-sm shrink-0">
                        <FaHome />
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Alamat Pemilik</span>
                        <span className="font-extrabold text-xs text-slate-800 truncate block">{cat?.ownerAddress || "Alamat belum diatur"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description Box */}
                  <div className="mb-8">
                    <h3 className="text-sm font-extrabold text-slate-900 mb-2">
                      Deskripsi & Karakter Kucing
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
                      {cat?.description || "Belum ada deskripsi karakter yang ditambahkan."}
                    </p>
                  </div>

                  {/* Genetic Offspring Predictor Card */}
                  {errorPrediksi && (
                    <div className="mb-8 p-4 border border-rose-200 rounded-2xl bg-rose-50 text-rose-800 text-xs">
                      <h4 className="font-bold text-sm mb-1 flex items-center gap-2">
                        <FaExclamationCircle /> Informasi Prediksi
                      </h4>
                      <p>{errorPrediksi}</p>
                    </div>
                  )}

                  {prediksiAnak && (
                    <div className="mb-8 p-5 border border-amber-300/80 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-100/40 shadow-inner">
                      <div className="flex items-center gap-2 mb-3">
                        <FaDna className="text-rose-500 text-lg animate-pulse" />
                        <h4 className="font-extrabold text-sm text-slate-900">
                          Laboratorium Prediksi Keturunan (Anak)
                        </h4>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                          <span className="text-[10px] text-slate-400 font-bold block">Induk Jantan</span>
                          <span className="font-extrabold text-slate-800">{prediksiAnak.indukJantan}</span>
                        </div>
                        <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                          <span className="text-[10px] text-slate-400 font-bold block">Induk Betina</span>
                          <span className="font-extrabold text-slate-800">{prediksiAnak.indukBetina}</span>
                        </div>
                        <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                          <span className="text-[10px] text-slate-400 font-bold block">Perkiraan Ras Anak</span>
                          <span className="font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md inline-block mt-0.5">{prediksiAnak.rasAnak}</span>
                        </div>
                        <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                          <span className="text-[10px] text-slate-400 font-bold block">Perkiraan Warna Anak</span>
                          <span className="font-extrabold text-rose-900 bg-rose-100 px-2 py-0.5 rounded-md inline-block mt-0.5">{prediksiAnak.warnaAnak}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* WhatsApp Contact CTA */}
                <div className="pt-4 border-t border-amber-100">
                  <Link
                    href={`https://wa.me/${formatPhoneNumber(cat?.ownerPhone)}`}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                    target="_blank"
                  >
                    <FaWhatsapp className="text-xl animate-bounce" />
                    <span>Hubungi Pemilik via WhatsApp ({cat?.ownerPhone || "Telepon"})</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CatDetailPage;

