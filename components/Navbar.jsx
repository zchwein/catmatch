"use client";

import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();
  const [username, setUsername] = useState(null);
  const [nama, setNama] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setUsername(localStorage.getItem("username"));
    setNama(localStorage.getItem("nama"));
  }, []);

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("imgUrl");
    localStorage.removeItem("nama");
    localStorage.removeItem("alamat");
    localStorage.removeItem("noTelp");
    localStorage.removeItem("selectedCat");
    router.push("/");
    window.location.reload();
  };

  return (
    <header className="sticky top-3 z-50 px-4 max-w-7xl mx-auto w-full">
      <nav className="glass-nav rounded-2xl shadow-xl shadow-amber-950/5 px-4 md:px-6 py-3 transition-all duration-300">
        <div className="flex justify-between items-center">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300 border border-amber-200">
              <Image
                src="/logo.png"
                alt="CatMatch Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Cat<span className="text-gradient-warm">Match</span>
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                Paw Matchmaking Community
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-3">
            {!isMounted ? (
              <div className="w-24 h-8 rounded-xl bg-amber-100/50 animate-pulse"></div>
            ) : !username ? (
              <>
                <Link
                  href="/login"
                  className="text-slate-700 hover:text-amber-600 font-semibold px-4 py-2 rounded-xl transition duration-200 flex items-center text-sm gap-2 hover:bg-amber-100/50"
                >
                  <FaSignInAlt className="text-amber-500 text-base" />
                  <span>Masuk</span>
                </Link>

                <Link
                  href="/register"
                  className="bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-rose-500/20 hover:shadow-lg hover:shadow-rose-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
                >
                  <FaUserPlus className="text-base" />
                  <span>Daftar Gratis</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2.5 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 text-amber-950 px-4 py-2 rounded-xl text-sm font-semibold transition duration-200 group"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {nama ? nama.charAt(0).toUpperCase() : <FaUser />}
                  </div>
                  <span className="max-w-[120px] truncate">{nama || username}</span>
                </Link>

                <button
                  onClick={logout}
                  className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 p-2.5 rounded-xl transition duration-200 cursor-pointer"
                  title="Keluar"
                >
                  <FaSignOutAlt className="text-lg" />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

