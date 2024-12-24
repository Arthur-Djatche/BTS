import Layout from "@/Layouts/Layout";
import React, {useState} from "react";
import AjoutActeur from "./AjoutActeur";
import ListActeur from "./ListActeur";
function Admin() {
  // État pour afficher ou masquer le menu sur mobile
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  // Fonction pour gérer l'ouverture/fermeture des sous-menus
  const toggleSubMenu = (menu) => {
    if (activeMenu === menu) {
      setActiveMenu(null);
      setActiveSubMenu(null); // Réinitialiser le sous-menu si le menu principal est fermé
    } else {
      setActiveMenu(menu);
      setActiveSubMenu(null); // Réinitialiser le sous-menu
    }
  };

  // Rendu du contenu principal en fonction du menu et sous-menu sélectionnés
  const renderContent = () => {
    if (activeMenu === "employees") {
      if (activeSubMenu === "employees_list") {
        // return <ListActeur></ListActeur>;
      } else if (activeSubMenu === "employees_add") {
        return <AjoutActeur></AjoutActeur>;
      }
    } else if (activeMenu === "suppliers") {
      return <p>Gestion des fournisseurs.</p>;
    }

    return <p>Bienvenue dans le tableau de bord de l'administrateur.</p>;
  };

  return (
    <div className="flex min-h-screen">
      {/* Menu burger pour mobile */}
      <button
        className="md:hidden p-4 text-blue-600"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        {/* Icône de menu burger */}
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
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      {/* Barre latérale */}
      <div className={`fixed md:static z-50 top-0 left-0 w-64 bg-blue-600 text-white flex flex-col p-6 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <h2 className="text-2xl font-bold mb-8">BNR CLEAN - Admin</h2>

        {/* Menu Gérer Employés */}
        <div>
          <button
            onClick={() => toggleSubMenu("employees")}
            className="w-full text-left py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none"
          >
            Gérer employés
          </button>

          {/* Sous-menus pour Gérer Employés */}
          {activeMenu === "employees" && (
            <div className="ml-4 mt-2">
              <button
                onClick={() => {setActiveSubMenu("employees_list")
                                setSidebarOpen(false);
                }}
                className={`block w-full text-left py-2 px-4 rounded-md hover:bg-blue-500 ${
                  activeSubMenu === "employees_list" ? "bg-blue-500" : ""
                  
                }`
              }
              >
                Liste
              </button>
              <button
                onClick={() => {setActiveSubMenu("employees_add")
                                setSidebarOpen(false);
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
              setActiveSubMenu(null); // Pas de sous-menu pour "Gérer fournisseur"
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
        <h2 className="text-xl font-bold mb-4">Contenu</h2>
        <div className="bg-white p-4 rounded-md shadow-md">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

Admin.layout = page => <Layout children={page}/>


export default Admin;