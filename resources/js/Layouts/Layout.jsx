import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

function Header({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      {/* Barre de navigation */}
      <div className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md border-b border-blue-700 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo ou icône de l'entreprise */}
          <div className="flex items-center space-x-3 ml-80">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
              B
            </div>
            <h1 className="text-xl font-semibold tracking-wide">BNR CLEAN</h1>
          </div>

          {/* Icône pour le menu utilisateur */}
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none hover:text-gray-200"
            >
              <FaUserCircle size={28} />
            </button>

            {/* Menu déroulant */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                <ul className="py-2">
                  <li>
                    <button
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => alert("Naviguer vers le profil")}
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
                      onClick={() => alert("Déconnexion")}
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

      {/* Contenu principal */}
      <main className="pt-16">{children}</main>
    </>
  );
}

export default Header;