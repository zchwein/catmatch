import { useState, useRef } from "react";
import {
  FaPaw,
  FaVenusMars,
  FaCalendar,
  FaPalette,
  FaImage,
  FaTrash,
  FaInfoCircle,
  FaTimes,
  FaSave,
} from "react-icons/fa";

const AddCatModal = ({ isOpen, onClose, onAddCat }) => {
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    gender: "",
    birthDate: "",
    color: "",
    description: "",
  });
  const [catPhoto, setCatPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.gender ||
      !formData.birthDate ||
      !formData.color
    ) {
      setError("Harap isi semua data yang diperlukan");
      return;
    }

    if (!catPhoto) {
      setError("Harap unggah foto kucing");
      return;
    }

    const newCat = {
      id: Date.now(),
      ...formData,
      age: calculateAge(formData.birthDate),
      image: catPhoto,
    };

    onAddCat(newCat);

    setFormData({
      name: "",
      breed: "",
      gender: "",
      birthDate: "",
      color: "",
      description: "",
    });
    handleRemovePhoto();
    onClose();
  };

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const months =
      (today.getFullYear() - birth.getFullYear()) * 12 +
      (today.getMonth() - birth.getMonth());
    return Math.max(1, months);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-200 animate-fadeIn">
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center pb-4 mb-6 border-b border-amber-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg">
                <FaPaw />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Tambah Profil Kucing Baru
                </h2>
                <p className="text-xs text-slate-500">Lengkapi data fisik & foto kucing kesayangan Anda</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-rose-600 bg-slate-100 p-2 rounded-xl transition-colors cursor-pointer"
            >
              <FaTimes className="text-base" />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-100 text-rose-800 rounded-2xl text-xs font-bold border border-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Kucing
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-amber-500 text-sm">
                    <FaPaw />
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-3 bg-white border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-medium text-slate-800"
                    placeholder="Masukkan nama kucing"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Ras Kucing
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-amber-500 text-sm">
                    <FaPaw />
                  </span>
                  <select
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-3 bg-white border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-medium text-slate-800 appearance-none"
                  >
                    <option value="">Pilih ras kucing</option>
                    {catBreeds.map((breed) => (
                      <option key={breed} value={breed}>
                        {breed}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Jenis Kelamin
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-amber-500 text-sm">
                    <FaVenusMars />
                  </span>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-3 bg-white border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-medium text-slate-800 appearance-none"
                  >
                    <option value="">Pilih jenis kelamin</option>
                    <option value="jantan">Jantan ♂</option>
                    <option value="betina">Betina ♀</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tanggal Lahir
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-amber-500 text-sm">
                    <FaCalendar />
                  </span>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-3 bg-white border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Warna Bulu
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-amber-500 text-sm">
                    <FaPalette />
                  </span>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-3 bg-white border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-medium text-slate-800"
                    placeholder="Contoh: Oranye, White, Black"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Deskripsi & Karakter Kucing
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-medium text-slate-800"
                  placeholder="Ceritakan sifat, kebiasaan manja, atau makanan favorit kucing Anda..."
                  rows="3"
                ></textarea>
              </div>
            </div>

            {/* Unggah Foto Kucing */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Foto Kucing (Wajib Upload)
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className="flex flex-col items-center justify-center border-2 border-dashed border-amber-300 rounded-2xl p-6 cursor-pointer hover:bg-amber-50/50 transition-colors"
                  onClick={() => fileInputRef.current.click()}
                >
                  {previewUrl ? (
                    <div className="relative w-full">
                      <img
                        src={previewUrl}
                        alt="Preview foto kucing"
                        className="max-h-44 rounded-xl mx-auto object-cover border border-amber-200"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePhoto();
                        }}
                        className="absolute -top-2 -right-2 bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 shadow-md cursor-pointer"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FaImage className="text-4xl text-amber-500 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-800">
                        Klik untuk mengunggah foto
                      </p>
                      <span className="text-[10px] text-slate-400">
                        Format JPG, PNG (Maksimal 2MB)
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

                <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80 text-xs">
                  <h3 className="font-extrabold text-amber-900 mb-2 flex items-center gap-1.5">
                    <FaInfoCircle className="text-amber-600" />
                    Panduan Foto Kualitas Terbaik
                  </h3>
                  <ul className="text-slate-600 space-y-1.5 text-[11px] list-disc pl-4">
                    <li>Gunakan foto yang memperlihatkan wajah & fisik secara utuh</li>
                    <li>Pastikan pencahayaan cukup terang & tidak buram</li>
                    <li>Foto yang menarik meningkatkan peluang respon 2x lipat!</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end items-center gap-3 pt-4 border-t border-amber-100">
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-6 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="gradient-warm text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-md hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
              >
                <FaSave /> Simpan Profil Kucing
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCatModal;

