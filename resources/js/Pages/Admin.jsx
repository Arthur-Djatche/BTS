import Layout from "@/Layouts/Layout";
import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import AjoutActeur from "./AjoutActeur";
import ListActeur from "./ListActeur";

function Admin(props) {
  // Charger les états initiaux depuis les props ou définir les valeurs par défaut
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(props.activeMenu || null);
  const [activeSubMenu, setActiveSubMenu] = useState(props.activeSubMenu || null);

  const toggleSubMenu = (menu) => {
    if (activeMenu === menu) {
      setActiveMenu(null);
      setActiveSubMenu(null);
    } else {
      setActiveMenu(menu);
      setActiveSubMenu(null);
    }
  };

  const handleRefresh = () => {
    Inertia.reload({
      data: { activeMenu, activeSubMenu }, // Envoie les états à Inertia
      preserveScroll: true, // Préserve la position de défilement
      preserveState: true, // Préserve l'état de la page
    });
  };

  const renderContent = () => {
    if (activeMenu === "employees") {
      if (activeSubMenu === "employees_list") {
        return <ListActeur />;
      } else if (activeSubMenu === "employees_add") {
        return <AjoutActeur />;
      }
    } else if (activeMenu === "suppliers") {
      return <p>Gestion des fournisseurs.</p>;
    } else if (activeMenu === "acceuil") {
      return <p>Bienvenue dans le tableau de bord de l'administrateur.</p>;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Menu burger pour mobile */}
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
        className={`fixed md:static z-50 top-0 left-0 w-65 bg-blue-600 text-white flex flex-col p-6 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <h2 className="text-2xl font-bold mb-8">BNR CLEAN - Admin</h2>

        {/* Menu Gérer Accueil */}
        <div className="mt-4">
          <button
            onClick={() => {
              setActiveMenu("acceuil");
              setActiveSubMenu(null);
              window.history.pushState({}, "", "/Admin/acceuil");
            }}
            className={`w-full text-left py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none ${
              activeMenu === "acceuil" ? "bg-blue-500" : ""
            }`}
          >
            ACCEUIL
          </button>
        </div>

        {/* Menu Gérer Employés */}
        <div>
          <button
            onClick={() => {
              toggleSubMenu("employees");
              window.history.pushState({}, "", "/Admin/Emp");
            }}
            className="w-full text-left py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none"
          >
            Gérer employés
          </button>

          {activeMenu === "employees" && (
            <div className="ml-4 mt-2">
              <button
                onClick={() => {
                  setActiveSubMenu("employees_list");
                  setSidebarOpen(false);
                  window.history.pushState({}, "", "/Admin/Emp/list");
                }}
                className={`block w-full text-left py-2 px-4 rounded-md hover:bg-blue-500 ${
                  activeSubMenu === "employees_list" ? "bg-blue-500" : ""
                }`}
              >
                Liste
              </button>
              <button
                onClick={() => {
                  setActiveSubMenu("employees_add");
                  setSidebarOpen(false);
                  window.history.pushState({}, "", "/Admin/Emp/Ajout");
                }}
                className={`block w-full text-left py-2 px-4 rounded-md hover:bg-blue-500 ${
                  activeSubMenu === "employees_add" ? "bg-blue-500" : ""
                }`}
              >
                Ajouter
              </button>
            </div>
          )}
        </div>

        {/* Menu Gérer Fournisseur */}
        <div className="mt-4">
          <button
            onClick={() => {
              setActiveMenu("suppliers");
              setActiveSubMenu(null);
              window.history.pushState({}, "", "/Admin/fournisseur");
            }}
            className={`w-full text-left py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none ${
              activeMenu === "suppliers" ? "bg-blue-500" : ""
            }`}
          >
            Gérer fournisseur
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold mb-4">Contenu</h2>
          {/* Bouton de rafraîchissement */}
          <button
            onClick={handleRefresh}
            className="text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582M4 4h5M4 4l5 5M20 20v-5h-.582M20 20h-5M20 20l-5-5"
              />
            </svg>
          </button>
        </div>
        <div className="bg-white p-4 rounded-md shadow-md">{renderContent()}</div>
      </div>
    </div>
  );
}

Admin.layout = (page) => <Layout children={page} />;

export default Admin;
