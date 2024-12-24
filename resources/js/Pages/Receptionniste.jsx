import Layout from "@/Layouts/Layout";
import React, {useState} from "react";



function Receptionniste() {

// État pour suivre le menu actif
const [activeMenu, setActiveMenu] = useState("Enregistrer vêtements");
// État pour afficher ou masquer le menu sur mobile
const [isSidebarOpen, setSidebarOpen] = useState(false);

const [activeSubMenu, setActiveSubMenu] = useState(null);

 // Fonction pour gérer l'ouverture/fermeture des sous-menus
 const toggleSubMenu = (menu) => {
  if (activeMenu === menu) {
    setActiveMenu(null);
  } else {
    setActiveMenu(menu);
  }
};

// Contenu pour chaque menu
const renderContent = () => {
    switch (activeMenu) {
      case "Enregistrer vêtements":
        return (
          <>
            {activeSubMenu === "Ajouter" && <p>Formulaire pour ajouter un vêtement.</p>}
            {activeSubMenu === "Liste" && <p>Liste des vêtements enregistrés.</p>}
          </>
        );
      case "Effectuer retrait":
        return <p>Page pour effectuer le retrait des vêtements.</p>;
      case "État de lavage":
        return <p>Page pour voir l'état de lavage des vêtements.</p>;
      default:
        return null;
  }
};

    return (
        <>
             <div className="flex min-h-screen bg-gray-100">
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
      <div
        className={`fixed md:static z-50 top-0 left-0 w-64 bg-blue-600 text-white flex flex-col p-6 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        
        
        {/* Menus de navigation */}
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
              onClick={() => setActiveSubMenu("employees_list")}
              className={`block w-full text-left py-2 px-4 rounded-md hover:bg-blue-500 ${
                activeSubMenu === "employees_list" ? "bg-blue-500" : ""
              }`}
            >
              Liste
            </button>
            <button
              onClick={() => setActiveSubMenu("employees_add")}
              className={`block w-full text-left py-2 px-4 rounded-md hover:bg-blue-500 ${
                activeSubMenu === "employees_add" ? "bg-blue-500" : ""
              }`}
            >
              Ajouter
            </button>
          </div>
        )}
      </div>


        <button
          className={`text-left py-2 px-4 rounded-md mb-2 ${activeMenu === "Enregistrer vêtements" ? "bg-blue-500" : ""}`}
          onClick={() => {
            setActiveMenu("Enregistrer vêtements");
            setSidebarOpen(false);
          }}
        >
          Enregistrer vêtements
        </button>
        <button
          className={`text-left py-2 px-4 rounded-md mb-2 ${activeMenu === "Effectuer retrait" ? "bg-blue-500" : ""}`}
          onClick={() => {
            setActiveMenu("Effectuer retrait");
            setSidebarOpen(false);
          }}
        >
          Effectuer retrait
        </button>
        <button
          className={`text-left py-2 px-4 rounded-md ${activeMenu === "État de lavage" ? "bg-blue-500" : ""}`}
          onClick={() => {
            setActiveMenu("État de lavage");
            setSidebarOpen(false);
          }}
        >
          État de lavage
        </button>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-8 ml-0 md:ml-64">
        <h2 className="text-2xl font-bold mb-4">{activeMenu}</h2>
        <div className="bg-white p-6 rounded-md shadow-md">
          {renderContent()}
        </div>
      </div>
    </div>
        </>
    );
}

Receptionniste.layout = page => <Layout children={page}/>
 
export default Receptionniste;