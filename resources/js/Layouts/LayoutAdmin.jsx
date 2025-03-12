import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";

function LayoutAdmin({ children }) {
  // Charger l'état actif du menu depuis localStorage (évite la fermeture après refresh)
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(
    localStorage.getItem("activeMenu") || null
  );
  const [activeSubMenu, setActiveSubMenu] = useState(
    localStorage.getItem("activeSubMenu") || null
  );

  // 🔥 Sauvegarder automatiquement dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem("activeMenu", activeMenu);
    localStorage.setItem("activeSubMenu", activeSubMenu);
  }, [activeMenu, activeSubMenu]);

  // Fonction pour ouvrir/fermer un sous-menu
  const toggleSubMenu = (menu) => {
    if (activeMenu === menu) {
      setActiveMenu(null); // Si déjà ouvert, on le referme
      setActiveSubMenu(null);
    } else {
      setActiveMenu(menu);
      setActiveSubMenu(null); // On réinitialise le sous-menu actif
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Bouton menu burger pour mobile */}
      <button
        className="md:hidden p-4 text-blue-600"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Barre latérale */}
      <div
        className={`fixed md:static z-50 top-0 left-0 w-64 bg-blue-600 text-white flex flex-col p-6 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <h2 className="text-2xl font-bold mb-8">BNR CLEAN - Admin</h2>

        {/* Menu ACCUEIL */}
        <div className="mt-4">
          <Link
            href="/Admin/acceuil"
            className={`block w-full text-left py-2 px-4 rounded-md hover:bg-blue-500 ${
              activeMenu === "acceuil" ? "bg-blue-500" : ""
            }`}
            onClick={() => setActiveMenu("acceuil")}
          >
            ACCUEIL
          </Link>
        </div>

        {/* Menu Gérer Employés */}
        <div>
          <button
            onClick={() => toggleSubMenu("employees")}
            className={`w-full text-left py-2 px-4 rounded-md hover:bg-blue-500 ${
              activeMenu === "employees" ? "bg-blue-500" : ""
            }`}
          >
            Gérer employés
          </button>

          {/* 🔥 Sous-menu des employés (reste ouvert après clic) */}
          {activeMenu === "employees" && (
            <div className="ml-4 mt-2">
              <Link
                href="/Admin/Emp/list"
                className={`block w-full text-left py-2 px-4 rounded-md hover:bg-blue-500 ${
                  activeSubMenu === "employees_list" ? "bg-blue-500" : ""
                }`}
                onClick={() => setActiveSubMenu("employees_list")}
              >
                Liste
              </Link>
              <Link
                href="/Admin/Emp/Ajout"
                className={`block w-full text-left py-2 px-4 rounded-md hover:bg-blue-500 ${
                  activeSubMenu === "employees_add" ? "bg-blue-500" : ""
                }`}
                onClick={() => setActiveSubMenu("employees_add")}
              >
                Ajouter
              </Link>
            </div>
          )}
        </div>

        {/* Menu Gérer Fournisseurs */}
        <div className="mt-4">
          <button
            onClick={() => toggleSubMenu("suppliers")}
            className={`w-full text-left py-2 px-4 rounded-md hover:bg-blue-500 ${
              activeMenu === "suppliers" ? "bg-blue-500" : ""
            }`}
          >
            Configurations
          </button>

          {/* 🔥 Sous-menu des fournisseurs */}
          {activeMenu === "suppliers" && (
            <div className="ml-4 mt-2">
              <Link
                href="/categories"
                className={`block w-full text-left py-2 px-4 rounded-md hover:bg-blue-500 ${
                  activeSubMenu === "catégories" ? "bg-blue-500" : ""
                }`}
                onClick={() => setActiveSubMenu("catégories")}
              >
                Catégories 
              </Link>
              <Link
                href="/types"
                className={`block w-full text-left py-2 px-4 rounded-md hover:bg-blue-500 ${
                  activeSubMenu === "types" ? "bg-blue-500" : ""
                }`}
                onClick={() => setActiveSubMenu("types")}
              >
                Types
              </Link>
              <Link
                href={route("emplacements")}
                className={`block w-full text-left py-2 px-4 rounded-md hover:bg-blue-500 ${
                  activeSubMenu === "emp" ? "bg-blue-500" : ""
                }`}
                onClick={() => setActiveSubMenu("emp")}
              >
                Emplacements
              </Link>
            </div>
          )}

          {/* Menu TRACAGE */}
        <div className="mt-4">
          <Link
            href="/tracabilite"
            className={`block w-full text-left py-2 px-4 rounded-md hover:bg-blue-500 ${
              activeMenu === "tracabilite" ? "bg-blue-500" : ""
            }`}
            onClick={() => setActiveMenu("tracabilite")}
          >
            Tracer
          </Link>
        </div>
        </div>
      </div>

      {/* Zone de contenu principal */}
      <main className="flex-1 p-6 bg-gray-50">
        {children} {/* Contenu dynamique (dépend de la page active) */}
      </main>
    </div>
  );
}

export default LayoutAdmin;
