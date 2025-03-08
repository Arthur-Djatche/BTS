import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import LayoutReceptionniste from "@/Layouts/LayoutReceptionniste";
import { Inertia } from "@inertiajs/inertia";


function Header({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // État pour afficher ou non la fenêtre contextuelle
  const [showModal, setShowModal] = useState(false);

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    // Appeler la route de déconnexion via Inertia
    Inertia.post("/logout", {}, {
      onSuccess: () => {
        console.log("Utilisateur déconnecté !");
      },
      onError: (errors) => {
        console.error("Erreur lors de la déconnexion :", errors);
      },
    });
  };

  return (
    <>
      {/* Barre de navigation */}
      <div className="print:hidden fixed top-0 left-0 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md border-b border-blue-700 z-50">
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
                    {/* Bouton de déconnexion */}
      <button
        className="block px-4 py-2 text-gray-700 hover:bg-red-100 w-full text-left"
        onClick={() => setShowModal(true)} // Ouvre la fenêtre contextuelle
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

      {/* Modal de confirmation */}
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
              {/* Bouton Annuler */}
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none"
                onClick={() => setShowModal(false)} // Ferme la modal
              >
                Non
              </button>
              {/* Bouton Confirmer */}
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                onClick={handleLogout} // Appelle la fonction de déconnexion
              >
                Oui, déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
Header.layout = (page) => <LayoutReceptionniste children={page} />;

export default Header;