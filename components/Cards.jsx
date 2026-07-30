import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { FaHeart, FaPaw, FaCheckCircle, FaTimesCircle, FaMars, FaVenus } from "react-icons/fa";
import { getCatColorStyle } from "@/utils/colorHelper";
import { getApiUrl } from "@/utils/apiConfig";

const Cards = ({
  cat: initialCat,
  textSize = "text-base",
  pasangan,
  selectedCat,
}) => {
  const cekPasangan = pasangan ? pasangan : false;
  const catIdOwner = selectedCat ? selectedCat : null;
  const [cat, setCat] = useState(initialCat);

  const handleSimpanKonfirmasi = async (status) => {
    try {
      await axios.post(`${getApiUrl()}/api/cat/perjodohan/update`, {
        kucing1: catIdOwner,
        kucing2: cat.id,
        status: status,
      });
      setCat((prev) => ({ ...prev, status: status ? "berhasil" : "gagal" }));
      window.alert("Status berhasil diperbarui");
    } catch (error) {
      console.error("Error menyimpan konfirmasi:", error);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-amber-200/60 h-full flex flex-col rounded-3xl shadow-lg shadow-amber-950/5 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1.5 group">
      {/* Gambar Kucing & Overlay Badge */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-tr from-amber-100 to-rose-100">
        {cat.image ? (
          <img
            src={cat.image}
            alt={cat.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-amber-300">
            <FaPaw className="text-5xl mb-1 animate-pulse" />
            <span className="text-xs text-amber-700 font-medium">Foto Kucing</span>
          </div>
        )}
        
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60"></div>

        {/* Gender Badge */}
        <div className="absolute top-3 right-3">
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-sm border ${
              cat.gender === "Jantan"
                ? "bg-sky-500/90 text-white border-sky-300/40"
                : "bg-rose-500/90 text-white border-rose-300/40"
            }`}
          >
            {cat.gender === "Jantan" ? <FaMars /> : <FaVenus />}
            <span>{cat.gender}</span>
          </div>
        </div>

        {/* Name Overlay in Photo */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <h3 className="font-extrabold text-xl tracking-tight drop-shadow-md truncate">
            {cat.name}
          </h3>
          <p className="text-xs text-amber-100/90 font-medium flex items-center gap-2">
            <span>{cat.breed}</span>
            <span>•</span>
            <span>{cat.age} Bulan</span>
          </p>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          {/* Match Score Display */}
          {cat.matchScore !== undefined && (
            <div className="mb-4 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-300/40 rounded-2xl p-3.5 shadow-inner">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <FaHeart className="text-rose-500 text-sm animate-pulse" /> Skor Kecocokan
                </span>
                <span className="text-sm font-extrabold text-gradient-warm">
                  {cat.matchScore}%
                </span>
              </div>
              <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                <div
                  className="gradient-warm h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${cat.matchScore}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Color Tag */}
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-600">
            <span className="text-slate-400">Warna Bulu:</span>
            <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
              <span
                className="w-3 h-3 rounded-full shadow-xs shrink-0"
                style={getCatColorStyle(cat.color)}
              ></span>
              <span className="capitalize">{cat.color}</span>
            </span>
          </div>

          {!cekPasangan && cat.description && (
            <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">
              "{cat.description}"
            </p>
          )}

          {cekPasangan && (
            <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-medium block mb-1">Status Perjodohan:</span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-md inline-block ${
                  cat.status === "pending"
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : cat.status === "berhasil"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-rose-100 text-rose-800 border border-rose-300"
                }`}
              >
                {cat.status === "pending"
                  ? "⏳ Menunggu Konfirmasi"
                  : cat.status === "berhasil"
                  ? "🎉 Berhasil Dijodohkan"
                  : "❌ Perjodohan Gagal"}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-amber-100">
          {cekPasangan && cat.status === "pending" ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                className="bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                onClick={() => handleSimpanKonfirmasi(false)}
              >
                <FaTimesCircle /> Tolak
              </button>
              <button
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1 shadow-md shadow-emerald-500/20 transition-colors cursor-pointer"
                onClick={() => handleSimpanKonfirmasi(true)}
              >
                <FaCheckCircle /> Terima
              </button>
            </div>
          ) : (
            <Link
              href={`/cats/${cat.id}`}
              className="w-full bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <span>Lihat Detail Profile</span>
              <FaPaw className="text-amber-300" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cards;

