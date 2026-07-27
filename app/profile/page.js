"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaPaw,
  FaPlus,
  FaHeart,
  FaArrowLeft,
  FaPhone,
  FaMapMarkerAlt,
  FaShieldAlt,
} from "react-icons/fa";
import Cards from "@/components/Cards";
import AddCatModal from "@/components/AddCatModal";
import Navbar from "@/components/Navbar";
import axios from "axios";

const ProfilePage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [ownerData, setOwnerData] = useState({});
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pasanganKucing, setPasanganKucing] = useState([]);
  const [selectedCatId, setSelectedCatId] = useState(null);
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const catOwner = async () => {
      setLoading(true);
      try {
        const dataUser = {
          id: localStorage.getItem("userId"),
          username: localStorage.getItem("username"),
          name: localStorage.getItem("nama"),
          address: localStorage.getItem("alamat"),
          phone: localStorage.getItem("noTelp"),
        };

        setOwnerData(dataUser);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cat/owner/${dataUser.id}`
        );
        const catOwner = response.data.cat;

        if (catOwner.length > 0) {
          setSelectedCatId(catOwner[0]._id);
        }
        setCats(catOwner);
      } catch (err) {
        console.error("Error fetching cat owner data:", err);
        setError("Gagal memuat data profil. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };
    catOwner();
  }, []);

  useEffect(() => {
    const fetchPasanganKucing = async () => {
      if (selectedCatId === null) return;
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cat/perjodohan/get/${selectedCatId}`
        );
        setPasanganKucing(response.data);
      } catch (err) {
        console.error("Error fetching pasangan kucing:", err);
      }
    };

    fetchPasanganKucing();
  }, [selectedCatId]);

  const handleAddCat = async (newCat) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("name", newCat.name);
      formData.append("gender", newCat.gender);
      formData.append("breed", newCat.breed);
      formData.append("color", newCat.color);
      formData.append("description", newCat.description);
      formData.append("birthDate", newCat.birthDate);
      formData.append("ownerId", localStorage.getItem("userId"));

      if (newCat.image) {
        formData.append("catPhoto", newCat.image);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cat/add`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        setCats((prevCats) => [...prevCats, response.data.cat]);
        setShowAddCatModal(false);
      }
    } catch (err) {
      console.error("Error adding cat:", err);
      setError("Gagal menambahkan kucing. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100/50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500 mb-3"></div>
        <p className="text-amber-900 font-bold text-xs tracking-wide">Memuat Profil Pemilik...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center text-xs font-bold text-amber-900 hover:text-rose-600 bg-amber-100/80 hover:bg-amber-200 px-4 py-2 rounded-xl mb-6 transition-all duration-200 cursor-pointer border border-amber-200/60"
          >
            <FaArrowLeft className="mr-2" /> Kembali ke Beranda
          </button>

          <div className="space-y-8">
            {/* Header Profil Pemilik */}
            <div className="glass-card rounded-3xl p-6 sm:p-10 shadow-xl shadow-amber-950/5 border border-amber-200/80 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-rose-500 to-rose-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-rose-500/20 shrink-0 border-2 border-white">
                  {ownerData.name ? ownerData.name.charAt(0).toUpperCase() : <FaUser />}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      {ownerData.name || "Pemilik Kucing"}
                    </h1>
                    <span className="text-xs bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full border border-amber-300/60">
                      @{ownerData.username || "user"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-4 flex items-center justify-center sm:justify-start gap-1">
                    <FaShieldAlt className="text-amber-500" />
                    <span>Akun Pemilik Kucing Terverifikasi</span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center justify-center sm:justify-start gap-2 bg-white/80 p-3 rounded-2xl border border-amber-200/80">
                      <FaPhone className="text-amber-600" />
                      <span className="font-bold text-slate-800">{ownerData.phone || "Nomor belum diatur"}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 bg-white/80 p-3 rounded-2xl border border-amber-200/80">
                      <FaMapMarkerAlt className="text-rose-500" />
                      <span className="font-bold text-slate-800 truncate">{ownerData.address || "Alamat belum diatur"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-4 bg-rose-100 text-rose-800 rounded-2xl text-xs font-bold border border-rose-200">
                {error}
              </div>
            )}

            {/* Bagian Kucing Saya */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl shadow-amber-950/5 border border-amber-200/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-amber-100">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <FaPaw className="text-amber-500" /> Kucing Saya ({cats.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Kelola profil kucing yang Anda daftarkan di platform
                  </p>
                </div>

                <button
                  onClick={() => setShowAddCatModal(true)}
                  className="gradient-warm text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-md shadow-rose-500/20 hover:scale-105 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaPlus /> Tambah Kucing Baru
                </button>
              </div>

              {cats.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cats.map((cat) => (
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
                <div className="text-center py-10 bg-amber-50/40 rounded-2xl border border-dashed border-amber-200">
                  <FaPaw className="text-4xl text-amber-300 mx-auto mb-2" />
                  <p className="text-slate-600 font-bold text-sm mb-3">
                    Belum ada kucing yang terdaftar.
                  </p>
                  <button
                    onClick={() => setShowAddCatModal(true)}
                    className="gradient-warm text-white text-xs font-bold py-2 px-5 rounded-xl shadow-xs"
                  >
                    Tambah Kucing Pertama
                  </button>
                </div>
              )}
            </div>

            {/* Bagian Perjodohan / Matchmaking */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl shadow-amber-950/5 border border-amber-200/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-amber-100">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <FaHeart className="text-rose-500 animate-pulse" /> Status Perjodohan Kucing
                  </h2>
                  <p className="text-xs text-slate-500">
                    Cek dan kelola pengajuan perjodohan untuk kucing Anda
                  </p>
                </div>

                {cats.length > 0 && (
                  <div className="min-w-[200px]">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Filter Berdasarkan Kucing
                    </label>
                    <select
                      value={selectedCatId || ""}
                      onChange={(e) => setSelectedCatId(e.target.value)}
                      className="w-full p-2.5 bg-white border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-semibold text-slate-800 shadow-xs"
                    >
                      {cats.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          🐱 {cat.nama} ({cat.ras})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {pasanganKucing && pasanganKucing.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pasanganKucing.map((cat) => (
                    <Cards
                      key={cat._id}
                      pasangan={true}
                      selectedCat={selectedCatId}
                      cat={{
                        id: cat._id,
                        name: cat.nama,
                        breed: cat.ras,
                        age: Math.floor(
                          (Date.now() - new Date(cat.tglLahir).getTime()) /
                            (1000 * 60 * 60 * 24 * 30)
                        ),
                        status: cat.status,
                        color: cat.warna,
                        gender: cat.jenisKelamin === "jantan" ? "Jantan" : "Betina",
                        description: cat.deskripsi,
                        image: cat.foto || "/default-cat.jpg",
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-amber-50/40 rounded-2xl border border-dashed border-amber-200">
                  <FaHeart className="text-3xl text-rose-300 mx-auto mb-2" />
                  <p className="text-slate-600 font-bold text-sm">
                    Belum ada pengajuan perjodohan untuk kucing ini.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal Tambah Kucing */}
      <AddCatModal
        isOpen={showAddCatModal}
        onClose={() => setShowAddCatModal(false)}
        onAddCat={handleAddCat}
      />
    </div>
  );
};

export default ProfilePage;

