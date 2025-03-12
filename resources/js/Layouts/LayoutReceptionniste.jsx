import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import { FaHome, FaTshirt, FaList, FaBars, FaTimes, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { inertia } from "framer-motion";

function LayoutReceptionniste({ children }) {
  const { url } = usePage();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // ✅ Déconnexion
  const handleLogout = () => {
    Inertia.post("/logout");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ✅ Sidebar (Menu latéral) */}
      <aside className={`fixed md:static z-40 top-0 left-0 w-64 bg-blue-700 text-white flex flex-col p-6 h-full transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out shadow-lg`}
      >
        {/* ✅ Titre avec une icône */}
        <div className="flex items-center justify-between border-b pb-4 mb-4 mt-20">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaTshirt /> Réceptionniste
          </h2>
        </div>

        {/* ✅ Liens de Navigation */}
        <nav className="flex flex-col gap-2 flex-grow">
          <Link
            href="/receptionniste/acceuil"
            className={`flex items-center gap-3 px-4 py-3 rounded-md ${
              url === "/receptionniste/acceuil" ? "bg-blue-500" : "hover:bg-blue-500"
            }`}
          >
            <FaHome /> Accueil
          </Link>

          <Link
            href="/receptionniste/nouveau-lavage"
            className={`flex items-center gap-3 px-4 py-3 rounded-md ${
              url === "/receptionniste/nouveau-lavage" ? "bg-blue-500" : "hover:bg-blue-500"
            }`}
          >
            <FaTshirt /> Nouveau Lavage
          </Link>

          <Link
            href="/receptionniste/etat-lavage"
            className={`flex items-center gap-3 px-4 py-3 rounded-md ${
              url === "/receptionniste/etat-lavage" ? "bg-blue-500" : "hover:bg-blue-500"
            }`}
          >
            <FaList /> État Lavage
          </Link>
        </nav>

        {/* ✅ Bouton Déconnexion */}
        <div className="mt-auto pt-6">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-3 bg-red-600 px-4 py-3 rounded-md hover:bg-red-700 w-full"
          >
            <FaSignOutAlt /> Déconnexion
          </button>
        </div>
      </aside>

      {/* ✅ Contenu Principal avec Header */}
      <div className="flex flex-col flex-1 min-h-screen">
        {/* ✅ Header (Barre du haut) */}
        <div className="print:hidden fixed top-0 left-0 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md border-b border-blue-700 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* ✅ Logo ou icône de l'entreprise */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
                B
              </div>
              <h1 className="text-xl font-semibold tracking-wide">BNR CLEAN</h1>
            </div>

            {/* ✅ Icône utilisateur avec menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-white focus:outline-none hover:text-gray-200"
              >
                <FaUserCircle size={28} />
              </button>

              {/* ✅ Menu utilisateur */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                  <ul className="py-2">
                    <li>
                      <button
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => Inertia.visit('/acteurs/profil')}
                      >
                        Profil
                      </button>
                    </li>
                    <li>
                      <button
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => alert("Accéder aux paramètres")}
                      >
                        Paramètres
                      </button>
                    </li>
                    <li>
                      <button
                        className="block px-4 py-2 text-gray-700 hover:bg-red-100 w-full text-left"
                        onClick={() => setShowModal(true)}
                      >
                        Déconnexion
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ✅ Contenu Principal (Décalé sous le header) */}
        <main className="flex-1 pt-20 p-6 overflow-auto">
          {children}
        </main>
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

export default LayoutReceptionniste;
