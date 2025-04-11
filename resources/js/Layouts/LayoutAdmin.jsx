import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUsers,
  FaCog,
  FaList,
  FaPlus,
  FaMapMarkedAlt,
  FaSearch,
  FaSignOutAlt,
  FaUserCircle,
  FaBalanceScale,
  FaClipboardList
} from "react-icons/fa";

function LayoutAdmin({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(localStorage.getItem("activeMenu") || null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("activeMenu", activeMenu);
  }, [activeMenu]);

  const toggleMenu = () => setSidebarOpen(!isSidebarOpen);
  const toggleSubMenu = (menu) => setActiveMenu(activeMenu === menu ? null : menu);

  // ✅ Déconnexion
  const handleLogout = () => {
    Inertia.post("/logout");
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      
      {/* ✅ Bouton menu burger (Mobile) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow-md"
        onClick={toggleMenu}
      >
        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* ✅ Sidebar (Menu latéral) */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-blue-700 text-white flex flex-col p-6 transition-transform duration-300 shadow-lg ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* ✅ Titre avec icône */}
        <h2 className="mt-20 text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="bg-white text-blue-700 p-2 rounded-full">B</span>
          BNR CLEAN
        </h2>

        {/* ✅ Navigation */}
        <nav className="space-y-4 flex-1">
          <Link href="/structure/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500">
            <FaHome size={20} /> ACCUEIL
          </Link>

          {/* Gérer employés */}
          <div>
            <button
              className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-blue-500"
              onClick={() => toggleSubMenu("employees")}
            >
              <span className="flex items-center gap-3">
                <FaUsers size={20} /> Gérer employés
              </span>
              <span>{activeMenu === "employees" ? "▲" : "▼"}</span>
            </button>

            {activeMenu === "employees" && (
              <div className="ml-6 mt-2 space-y-2">
                <Link href="/Admin/Emp/list" className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-500">
                  <FaList size={16} /> Liste
                </Link>
                <Link href="/Admin/Emp/Ajout" className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-500">
                  <FaPlus size={16} /> Ajouter
                </Link>
              </div>
            )}
          </div>

          {/* Configurations */}
          <div>
            <button
              className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-blue-500"
              onClick={() => toggleSubMenu("config")}
            >
              <span className="flex items-center gap-3">
                <FaCog size={20} /> Configurations
              </span>
              <span>{activeMenu === "config" ? "▲" : "▼"}</span>
            </button>

            {activeMenu === "config" && (
              <div className="ml-6 mt-2 space-y-2">
                <Link href="/categories" className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-500">
                  <FaList size={16} /> Catégories
                </Link>
                <Link href="/types" className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-500">
                  <FaList size={16} /> Types
                </Link>
                <Link href="/kilogrammes" className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-500">
                  <FaBalanceScale size={20} /> Kilogrammages
                </Link>
                <Link href="/consignes" className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-500">
                  <FaClipboardList size={20} /> Consignes
                </Link>
                <Link href="/emplacements" className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-500">
                  <FaMapMarkedAlt size={16} /> Emplacements
                </Link>
              </div>
            )}
          </div>

          {/* Tracabilité */}
          <Link href="/tracabilite" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500">
            <FaSearch size={20} /> Tracer
          </Link>
        </nav>

        {/* ✅ Bouton de déconnexion */}
        <button
          onClick={() => setShowModal(true)}
          className="mt-auto flex items-center gap-3 p-3 rounded-lg bg-red-600 hover:bg-red-500 w-full"
        >
          <FaSignOutAlt size={20} /> Déconnexion
        </button>
      </aside>

      {/* ✅ Contenu Principal avec Header */}
      <div className="flex flex-col flex-1 h-screen">

        {/* ✅ Header */}
        <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md border-b border-blue-700 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            
            {/* ✅ Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
                B
              </div>
              <h1 className="text-xl font-semibold tracking-wide">BNR CLEAN</h1>
            </div>

            {/* ✅ Icône utilisateur avec menu */}
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none hover:text-gray-200">
                <FaUserCircle size={28} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                  <ul className="py-2">
                    <li><button className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">Profil</button></li>
                    <li><button className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">Paramètres</button></li>
                    <li><button className="block px-4 py-2 text-gray-700 hover:bg-red-100 w-full text-left" onClick={() => setShowModal(true)}>Déconnexion</button></li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ✅ Contenu Principal */}
        <main className="flex-1 overflow-auto pt-20 p-6">{children}</main>
      </div>
      {/* ✅ Modale de confirmation de déconnexion */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Confirmation de déconnexion
            </h2>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir vous déconnecter ?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none"
                onClick={() => setShowModal(false)}
              >
                Non
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                onClick={handleLogout}
              >
                Oui, déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LayoutAdmin;
