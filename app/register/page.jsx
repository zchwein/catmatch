"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaLock,
  FaPaw,
  FaVenusMars,
  FaCalendar,
  FaPalette,
  FaPhone,
  FaHome,
  FaImage,
  FaTrash,
  FaInfoCircle,
  FaArrowLeft,
  FaCheck,
} from "react-icons/fa";
import axios from "axios";
import { getApiUrl } from "@/utils/apiConfig";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    catName: "",
    catGender: "",
    catBirthDate: "",
    catColor: "",
    catDescription: "",
    catBreed: "",
    ownerName: "",
    phoneNumber: "",
    address: "",
  });

  const [catPhoto, setCatPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      setError("File harus berupa gambar (JPG, PNG, atau GIF)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran file maksimal 2MB");
      return;
    }

    setCatPhoto(file);
    setError("");

    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  };

  const handleRemovePhoto = () => {
    setCatPhoto(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && (!formData.username || !formData.password)) {
      setError("Harap isi username dan password Anda");
      return;
    }

    if (currentStep === 2) {
      if (
        !formData.catName ||
        !formData.catGender ||
        !formData.catBirthDate ||
        !formData.catColor
      ) {
        setError("Harap isi semua data fisik kucing");
        return;
      }

      if (!catPhoto) {
        setError("Harap unggah foto kucing Anda");
        return;
      }
    }

    setError("");
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setError("");
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.ownerName || !formData.phoneNumber || !formData.address) {
      setError("Harap isi semua data lengkap pemilik");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const dataSubmit = new FormData();
      dataSubmit.append("username", formData.username);
      dataSubmit.append("password", formData.password);
      dataSubmit.append("ownerName", formData.ownerName);
      dataSubmit.append("phoneNumber", formData.phoneNumber);
      dataSubmit.append("address", formData.address);
      dataSubmit.append("catName", formData.catName);
      dataSubmit.append("catGender", formData.catGender);
      dataSubmit.append("catBirthDate", formData.catBirthDate);
      dataSubmit.append("catColor", formData.catColor);
      dataSubmit.append("catDescription", formData.catDescription);
      dataSubmit.append("catBreed", formData.catBreed);
      if (catPhoto) {
        dataSubmit.append("catPhoto", catPhoto);
      }

      const response = await axios.post(
        `${getApiUrl()}/api/users/add`,
        dataSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        localStorage.setItem("imgUrl", response.data.gambar);
        router.push("/register/success");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError(
        error.response?.data?.message ||
          "Terjadi kesalahan saat pendaftaran, silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  const catBreeds = [
    "Persian",
    "Siamese",
    "Maine Coon",
    "Ragdoll",
    "Bengal",
    "Sphynx",
    "British Shorthair",
    "Scottish Fold",
    "Abyssinian",
    "Burmese",
    "Lainnya",
  ];

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
        <div className="w-full max-w-2xl glass-card rounded-3xl shadow-2xl shadow-amber-950/10 border border-amber-200/80 overflow-hidden">
          {/* Header & Step Wizard */}
          <div className="p-6 sm:p-8 text-center border-b border-amber-100/80">
            <div className="relative w-14 h-14 rounded-2xl mx-auto overflow-hidden shadow-lg shadow-amber-500/20 mb-3 border-2 border-white">
              <Image
                src="/logo.png"
                alt="CatMatch Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Pendaftaran Komunitas CatMatch
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Buat akun & profil kucing pertama Anda dalam 3 langkah mudah
            </p>

            {/* Progress Step Bar */}
            <div className="mt-6 max-w-md mx-auto">
              <div className="flex justify-between items-center relative mb-2">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-amber-200 -z-10 -translate-y-1/2"></div>
                <div
                  className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-amber-500 to-rose-500 -z-10 -translate-y-1/2 transition-all duration-500"
                  style={{ width: `${(currentStep - 1) * 50}%` }}
                ></div>

                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-extrabold shadow-sm transition-all duration-300 ${
                      currentStep >= step
                        ? "gradient-warm text-white scale-110 shadow-md shadow-rose-500/20"
                        : "bg-white text-slate-400 border border-amber-200"
                    }`}
                  >
                    {currentStep > step ? <FaCheck /> : step}
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-[11px] font-bold text-slate-600 px-1">
                <span className={currentStep === 1 ? "text-rose-600" : ""}>1. Akun Login</span>
                <span className={currentStep === 2 ? "text-rose-600" : ""}>2. Profil Kucing</span>
                <span className={currentStep === 3 ? "text-rose-600" : ""}>3. Data Pemilik</span>
              </div>
            </div>
          </div>

          {/* Form Wizard Container */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-3.5 bg-rose-100 text-rose-800 rounded-2xl text-xs font-bold border border-rose-200 flex items-center gap-2">
                <FaInfoCircle className="text-sm shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Step 1: Akun */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                  <FaUser className="text-amber-500" /> 1. Informasi Akun Login
                </h2>

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
                      placeholder="Buat username unik"
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
                      placeholder="Buat password keamanan"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="gradient-warm text-white font-extrabold text-xs py-3 px-6 rounded-xl shadow-md shadow-rose-500/20 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Lanjut ke Data Kucing</span> <FaPaw />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Data Kucing */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                  <FaPaw className="text-amber-500" /> 2. Data Profil Kucing Pertama
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nama Kucing
                    </label>
                    <input
                      type="text"
                      name="catName"
                      value={formData.catName}
                      onChange={handleChange}
                      className="w-full p-3.5 bg-white border border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-semibold text-slate-800 shadow-xs"
                      placeholder="Nama kucing Anda"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Ras Kucing
                    </label>
                    <select
                      name="catBreed"
                      value={formData.catBreed}
                      onChange={handleChange}
                      className="w-full p-3.5 bg-white border border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-semibold text-slate-800 shadow-xs"
                    >
                      <option value="">Pilih ras kucing</option>
                      {catBreeds.map((breed) => (
                        <option key={breed} value={breed}>
                          {breed}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Jenis Kelamin
                    </label>
                    <select
                      name="catGender"
                      value={formData.catGender}
                      onChange={handleChange}
                      className="w-full p-3.5 bg-white border border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-semibold text-slate-800 shadow-xs"
                    >
                      <option value="">Pilih jenis kelamin</option>
                      <option value="jantan">Jantan ♂</option>
                      <option value="betina">Betina ♀</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      name="catBirthDate"
                      value={formData.catBirthDate}
                      onChange={handleChange}
                      className="w-full p-3.5 bg-white border border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-semibold text-slate-800 shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Warna Bulu
                    </label>
                    <input
                      type="text"
                      name="catColor"
                      value={formData.catColor}
                      onChange={handleChange}
                      className="w-full p-3.5 bg-white border border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-semibold text-slate-800 shadow-xs"
                      placeholder="Contoh: Oranye, Cream, Calico"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Deskripsi Kucing
                    </label>
                    <textarea
                      name="catDescription"
                      value={formData.catDescription}
                      onChange={handleChange}
                      className="w-full p-3.5 bg-white border border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-semibold text-slate-800 shadow-xs"
                      placeholder="Ceritakan kepribadian manja atau kebiasaan kucing Anda..."
                      rows="2"
                    ></textarea>
                  </div>
                </div>

                {/* Upload Foto */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Foto Kucing (Wajib Upload)
                  </label>
                  <div
                    className="border-2 border-dashed border-amber-300 rounded-2xl p-4 text-center cursor-pointer hover:bg-amber-50/50 transition-colors"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {previewUrl ? (
                      <div className="relative inline-block">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-h-36 rounded-xl border border-amber-200 object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePhoto();
                          }}
                          className="absolute -top-2 -right-2 bg-rose-500 text-white p-1.5 rounded-full hover:bg-rose-600 shadow-md cursor-pointer"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <FaImage className="text-3xl text-amber-500 mx-auto mb-1" />
                        <span className="text-xs font-bold text-slate-800 block">
                          Klik untuk memilih foto kucing
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Format JPG/PNG (Maks 2MB)
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 px-6 rounded-xl transition-colors cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="gradient-warm text-white font-extrabold text-xs py-3 px-6 rounded-xl shadow-md shadow-rose-500/20 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Lanjut ke Data Pemilik</span> <FaPaw />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Data Pemilik */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                  <FaUser className="text-amber-500" /> 3. Data Pemilik & Kontak WhatsApp
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Nama Lengkap Pemilik
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-amber-500 text-sm">
                        <FaUser />
                      </span>
                      <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3.5 bg-white border border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-semibold text-slate-800 shadow-xs"
                        placeholder="Nama lengkap pemilik"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Nomor Telepon (WhatsApp Aktif)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-amber-500 text-sm">
                        <FaPhone />
                      </span>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3.5 bg-white border border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-semibold text-slate-800 shadow-xs"
                        placeholder="Contoh: 081234567890"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Alamat Tempat Tinggal
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pt-3.5 text-amber-500 text-sm">
                        <FaHome />
                      </span>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3.5 bg-white border border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-semibold text-slate-800 shadow-xs"
                        placeholder="Alamat lengkap lokasi kucing..."
                        rows="2"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 px-6 rounded-xl transition-colors cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="gradient-warm text-white font-extrabold text-xs py-3 px-8 rounded-xl shadow-lg shadow-rose-500/20 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <span>Memproses Pendaftaran...</span>
                    ) : (
                      <>
                        <span>Selesaikan Pendaftaran</span> <FaPaw />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-amber-100 text-center text-xs text-slate-600 mt-6">
              Sudah memiliki akun CatMatch?{" "}
              <Link
                href="/login"
                className="text-amber-700 font-extrabold hover:underline"
              >
                Masuk disini
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

