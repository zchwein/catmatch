/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Cards from "../components/Cards";
import Navbar from "../components/Navbar";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { getCatColorStyle } from "@/utils/colorHelper";
import { getApiUrl } from "@/utils/apiConfig";
import {
  FaHeart,
  FaSearch,
  FaFilter,
  FaRedo,
  FaPaw,
  FaInfoCircle,
  FaStar,
  FaCrown,
  FaPlus,
  FaShieldAlt,
} from "react-icons/fa";

const CatMatch = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [userID, setUserID] = useState(null);
  const [userCats, setUserCats] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [recommendedCats, setRecommendedCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [allCats, setAllCats] = useState([]);
  const [filteredAllCats, setFilteredAllCats] = useState([]);
  const [filters, setFilters] = useState({
    breed: "",
    minAge: "",
    maxAge: "",
    search: "",
  });
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fetchData = async () => {
      setLoading(true);
      const userID = localStorage.getItem("userId");
      setUserID(userID);
      try {
        if (userID) {
          const userCatsRes = await axios.get(
            `${getApiUrl()}/api/cat/owner/${userID}`
          );
          const userCatsData = userCatsRes.data.cat;
          setUserCats(userCatsData);
          const kucingDipilih = localStorage.getItem("selectedCat");

          if (kucingDipilih) {
            setSelectedCat(kucingDipilih);
          } else if (userCatsData.length > 0) {
            localStorage.setItem("selectedCat", userCatsData[0]._id);
            setSelectedCat(userCatsData[0]._id);
          }
        }

        const allCatsRes = await axios.get(`${getApiUrl()}/api/cat/`);
        setAllCats(allCatsRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userID]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (selectedCat) {
        setRecommendLoading(true);
        try {
          const res = await axios.get(
            `${getApiUrl()}/api/cat/recommended/${selectedCat}`
          );
          setRecommendedCats(res.data);
        } catch (error) {
          console.error("Failed to fetch recommendations:", error);
        } finally {
          setRecommendLoading(false);
        }
      }
    };

    fetchRecommendations();
  }, [selectedCat]);

  useEffect(() => {
    const filtered = allCats.filter((cat) => {
      if (filters.breed && cat.ras !== filters.breed) return false;

      const age = Math.floor(
        (Date.now() - new Date(cat.tglLahir).getTime()) /
        (1000 * 60 * 60 * 24 * 30)
      );

      if (filters.minAge && age < parseInt(filters.minAge)) return false;
      if (filters.maxAge && age > parseInt(filters.maxAge)) return false;

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !cat.nama.toLowerCase().includes(searchLower) &&
          !cat.ras.toLowerCase().includes(searchLower) &&
          !cat.warna.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      return true;
    });

    setFilteredAllCats(filtered);
  }, [filters, allCats]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeCat = (value) => {
    localStorage.setItem("selectedCat", value);
    setSelectedCat(value);
  };

  const resetFilters = () => {
    setFilters({
      breed: "",
      minAge: "",
      maxAge: "",
      search: "",
    });
  };

  const catBreeds = [...new Set(allCats.map((cat) => cat.ras))];

  if (!isMounted || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100/50">
        <div className="relative w-16 h-16 mb-4">
          <div className="animate-ping absolute inset-0 rounded-full bg-rose-400 opacity-75"></div>
          <div className="relative rounded-full h-16 w-16 bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-xl">
            <FaPaw className="text-2xl animate-bounce" />
          </div>
        </div>
        <p className="text-amber-900 font-bold text-sm tracking-wide animate-pulse">
          Memuat CatMatch...
        </p>
      </div>
    );
  }

  const activeSelectedCatObj = userCats.find((c) => c._id === selectedCat);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Hero Section Banner */}
        <section className="relative overflow-hidden pt-8 pb-12 md:py-16">
          {/* Ambient Glowing Orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-300/30 rounded-full blur-3xl -z-10 animate-pulse-glow"></div>
          <div className="absolute top-10 right-1/4 w-96 h-96 bg-rose-300/20 rounded-full blur-3xl -z-10"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="glass-card rounded-3xl p-8 md:p-12 shadow-2xl shadow-amber-900/5 border border-amber-200/60 relative">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 text-amber-900 text-xs font-bold mb-6 border border-amber-300/60 shadow-xs">
                  <FaStar className="text-amber-600" />
                  <span>Platform Perjodohan Kucing #1 di Indonesia</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                  Temukan <span className="text-gradient-warm">Pasangan Ideal</span> Untuk Kucing Kesayangan
                </h1>

                <p className="text-slate-600 text-base md:text-lg mb-8 leading-relaxed">
                  Gabung dengan komunitas tercinta. Cari jodoh ras sejenis atau silangan cantik dengan kalkulasi skor genetik & kesehatan otomatis.
                </p>

                {/* Stats Counter Pills */}
                <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto pt-4 border-t border-amber-200/60">
                  <div className="text-center">
                    <span className="block text-2xl md:text-3xl font-extrabold text-amber-600">98%</span>
                    <span className="text-xs text-slate-500 font-medium">Akurasi Match</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-2xl md:text-3xl font-extrabold text-rose-500">
                      {loading ? "..." : `${allCats.length}+`}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Kucing Terdaftar</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-2xl md:text-3xl font-extrabold text-amber-700">100%</span>
                    <span className="text-xs text-slate-500 font-medium">Safe & Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Konten Utama */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 space-y-10">
          {userID ? (
            <>
              {/* Card Pilih Kucing Anda */}
              <div className="glass-card rounded-3xl p-6 md:p-8 shadow-xl shadow-amber-900/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-amber-100">
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                      <FaCrown className="text-amber-500" />
                      <span>Kucing Milik Anda</span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Pilih profil kucing Anda untuk mulai mencari rekomendasi pasangan yang cocok
                    </p>
                  </div>

                  {userCats.length > 0 && (
                    <Link
                      href="/profile"
                      className="inline-flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200/80 text-amber-900 text-xs font-bold px-4 py-2.5 rounded-xl border border-amber-300/60 transition-colors"
                    >
                      <FaPlus /> Kelola Kucing Saya
                    </Link>
                  )}
                </div>

                {userCats.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Pilih Kucing Aktif
                      </label>
                      <select
                        value={selectedCat || ""}
                        onChange={(e) => handleChangeCat(e.target.value)}
                        className="w-full p-3.5 bg-white border border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold text-sm text-slate-800 shadow-sm"
                      >
                        {userCats.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            🐱 {cat.nama} ({cat.ras})
                          </option>
                        ))}
                      </select>
                    </div>

                    {activeSelectedCatObj && (
                      <div className="md:col-span-2 bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-amber-100/30 rounded-2xl p-5 border border-amber-200/80 flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden relative shadow-md shrink-0 border-2 border-white">
                          {activeSelectedCatObj.foto ? (
                            <img
                              src={activeSelectedCatObj.foto}
                              alt={activeSelectedCatObj.nama}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-amber-200 flex items-center justify-center text-amber-700">
                              <FaPaw className="text-2xl" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                            <span className="font-extrabold text-lg text-slate-900">
                              {activeSelectedCatObj.nama}
                            </span>
                            <span className="text-xs bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                              {activeSelectedCatObj.ras}
                            </span>
                          </div>
                          <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs text-slate-600">
                            <span>
                              <strong>Kelamin:</strong>{" "}
                              {activeSelectedCatObj.jenisKelamin === "jantan"
                                ? "Jantan ♂"
                                : "Betina ♀"}
                            </span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1.5">
                              <strong>Warna:</strong> {activeSelectedCatObj.warna}
                              <span
                                className="w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-xs"
                                style={getCatColorStyle(activeSelectedCatObj.warna)}
                              ></span>
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-amber-50/50 rounded-2xl border border-dashed border-amber-300">
                    <FaPaw className="text-4xl text-amber-300 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-800 text-base mb-1">
                      Belum Ada Kucing Terdaftar
                    </h3>
                    <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
                      Daftarkan kucing pertama Anda untuk membuka rekomendasi kecocokan secara otomatis
                    </p>
                    <Link
                      href="/profile"
                      className="gradient-warm text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-md inline-flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                      <FaPlus /> Tambah Kucing Sekarang
                    </Link>
                  </div>
                )}
              </div>

              {/* Rekomendasi Pasangan Teratas */}
              {selectedCat && userCats.length > 0 && (
                <div className="glass-card rounded-3xl p-6 md:p-8 shadow-xl shadow-amber-900/5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-amber-100">
                    <div>
                      <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <FaHeart className="text-rose-500 animate-pulse" />
                        <span>Rekomendasi Pasangan Terbaik</span>
                      </h2>
                      <p className="text-xs text-slate-500">
                        Hasil kalkulasi kecocokan otomatis berdasarkan genetik, umur, dan ras
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        document.getElementById("info-modal").showModal()
                      }
                      className="text-xs text-amber-700 font-bold bg-amber-100 hover:bg-amber-200 px-3.5 py-2 rounded-xl border border-amber-300/60 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FaInfoCircle className="text-amber-600" />
                      <span>Cara Hitung Kecocokan</span>
                    </button>
                  </div>

                  {recommendLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-500 mb-3"></div>
                      <span className="text-xs font-bold text-amber-800">
                        Memproses rekomendasi kecocokan genetik...
                      </span>
                    </div>
                  ) : recommendedCats.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recommendedCats.map((cat) => (
                        <Cards
                          key={cat._id}
                          cat={{
                            id: cat._id,
                            name: cat.nama,
                            breed: cat.ras,
                            age:
                              cat.age ||
                              Math.floor(
                                (Date.now() - new Date(cat.tglLahir).getTime()) /
                                (1000 * 60 * 60 * 24 * 30)
                              ),
                            color: cat.warna,
                            gender:
                              cat.jenisKelamin === "jantan" ? "Jantan" : "Betina",
                            description: cat.deskripsi,
                            image: cat.foto || "/default-cat.jpg",
                            matchScore: cat.matchScore,
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-amber-50/50 rounded-2xl">
                      <p className="text-slate-600 text-sm">
                        Belum ada rekomendasi pasangan yang cocok untuk kucing Anda saat ini.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Banner Pengunjung Belum Login */
            <div className="glass-card rounded-3xl p-8 md:p-12 text-center shadow-xl shadow-amber-900/5 relative overflow-hidden">
              <div className="max-w-xl mx-auto relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 mx-auto flex items-center justify-center text-white text-2xl shadow-lg shadow-rose-500/20 mb-4">
                  <FaPaw />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
                  Mulai Temukan Pasangan Kucingmu
                </h2>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  Daftarkan akun gratis untuk mengunggah profil kucing Anda dan menikmati kalkulasi kecocokan ras otomatis.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/login"
                    className="gradient-warm text-white font-bold text-sm px-8 py-3 rounded-xl shadow-lg shadow-rose-500/20 hover:scale-105 transition-transform"
                  >
                    Masuk Akun
                  </Link>
                  <Link
                    href="/register"
                    className="bg-white border-2 border-amber-400 text-amber-900 font-bold text-sm px-8 py-3 rounded-xl hover:bg-amber-50 transition-colors"
                  >
                    Daftar Sekarang
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Gallery Semua Kucing Tersedia */}
          <div className="glass-card rounded-3xl p-6 md:p-8 shadow-xl shadow-amber-900/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-amber-100">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Jelajahi Semua Kucing Tersedia
                </h2>
                <p className="text-xs text-slate-500">
                  Temukan berbagai ras kucing berkualitas dari komunitas pecinta kucing terpercaya
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${showFilter
                    ? "bg-amber-600 text-white border-amber-600 shadow-md"
                    : "bg-amber-100 text-amber-900 border-amber-300/60 hover:bg-amber-200"
                    }`}
                >
                  <FaFilter />
                  <span>Filter Pencarian</span>
                </button>
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                >
                  <FaRedo />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-500">
                <FaSearch />
              </div>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Cari berdasarkan nama kucing, ras (misal: Persian, Bengal), atau warna..."
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium text-slate-800 shadow-xs"
              />
            </div>

            {/* Expandable Filter Box */}
            {showFilter && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-5 bg-gradient-to-r from-amber-500/10 to-rose-500/10 rounded-2xl border border-amber-200/80">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Filter Ras
                  </label>
                  <select
                    name="breed"
                    value={filters.breed}
                    onChange={handleFilterChange}
                    className="w-full p-2.5 bg-white border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-semibold text-slate-800"
                  >
                    <option value="">Semua Ras Kucing</option>
                    {catBreeds.map((breed) => (
                      <option key={breed} value={breed}>
                        {breed}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Umur Minimal (Bulan)
                  </label>
                  <input
                    type="number"
                    name="minAge"
                    value={filters.minAge}
                    onChange={handleFilterChange}
                    placeholder="Contoh: 3"
                    min="0"
                    className="w-full p-2.5 bg-white border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Umur Maksimal (Bulan)
                  </label>
                  <input
                    type="number"
                    name="maxAge"
                    value={filters.maxAge}
                    onChange={handleFilterChange}
                    placeholder="Contoh: 24"
                    min="0"
                    className="w-full p-2.5 bg-white border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>
            )}

            {/* Grid Kartu Kucing */}
            {filteredAllCats.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {filteredAllCats.map((cat) => (
                  <Cards
                    key={cat._id}
                    cat={{
                      id: cat._id,
                      name: cat.nama,
                      breed: cat.ras,
                      age: Math.floor(
                        (Date.now() - new Date(cat.tglLahir).getTime()) /
                        (1000 * 60 * 60 * 24 * 30)
                      ),
                      color: cat.warna,
                      gender: cat.jenisKelamin === "jantan" ? "Jantan" : "Betina",
                      description: cat.deskripsi,
                      image: cat.foto || "/default-cat.jpg",
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-amber-50/40 rounded-2xl border border-dashed border-amber-200">
                <FaSearch className="text-3xl text-amber-300 mx-auto mb-2" />
                <p className="text-slate-600 font-bold text-sm">
                  Tidak ada kucing yang sesuai dengan filter pencarian Anda.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-3 text-xs font-bold text-amber-700 underline cursor-pointer"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Modal Info Perhitungan Kecocokan */}
        <dialog id="info-modal" className="modal">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-amber-200 animate-fadeIn">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg">
                  <FaInfoCircle />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">
                    Kalkulasi Skor Kecocokan
                  </h3>
                  <span className="text-xs text-amber-700 font-semibold">
                    Algoritma Matchmaking Genetik
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Skor kecocokan dihitung secara otomatis oleh sistem menggunakan pembobotan parameter berikut:
              </p>

              <div className="space-y-2.5 text-xs mb-6">
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex justify-between items-center">
                  <span className="font-bold text-slate-800">1. Jenis Kelamin Berbeda</span>
                  <span className="font-extrabold text-amber-700 bg-amber-200 px-2 py-0.5 rounded-md">40 Poin</span>
                </div>
                <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 flex justify-between items-center">
                  <span className="font-bold text-slate-800">2. Ras Sama / Mirip</span>
                  <span className="font-extrabold text-rose-700 bg-rose-200 px-2 py-0.5 rounded-md">30 Poin</span>
                </div>
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex justify-between items-center">
                  <span className="font-bold text-slate-800">3. Selisih Umur Ideal</span>
                  <span className="font-extrabold text-amber-700 bg-amber-200 px-2 py-0.5 rounded-md">20 Poin</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-800">4. Kesamaan Warna Bulu</span>
                  <span className="font-extrabold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-md">10 Poin</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic mb-6">
                Total skor maksimal adalah 100%. Semakin tinggi skor kecocokan, semakin tinggi peluang keberhasilan perjodohan.
              </p>

              <div className="flex justify-end">
                <form method="dialog">
                  <button className="gradient-warm text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-md hover:scale-105 transition-transform cursor-pointer">
                    Mengerti & Tutup
                  </button>
                </form>
              </div>
            </div>
          </div>
        </dialog>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-12 pb-8 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-amber-400">
                <Image src="/logo.png" alt="CatMatch" fill className="object-cover" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white">CatMatch</span>
                <p className="text-xs text-slate-400">Komunitas & Platform Matchmaking Kucing</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-400">
              <Link href="/" className="hover:text-amber-400 transition-colors">Beranda</Link>
              <Link href="/login" className="hover:text-amber-400 transition-colors">Masuk</Link>
              <Link href="/register" className="hover:text-amber-400 transition-colors">Daftar Akun</Link>
            </div>
          </div>

          <div className="pt-6 text-center text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} CatMatch. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CatMatch;

