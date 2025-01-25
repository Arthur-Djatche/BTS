import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";

function LayoutReceptionniste({ children }) {
  const { url } = usePage(); // Récupère l'URL actuelle pour savoir quelle page est active
  // Charger les états initiaux depuis les props ou définir les valeurs par défaut
    const [isSidebarOpen, setSidebarOpen] = useState(false);

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
      
      {/* Menu latéral */}
      <aside className={`fixed md:static z-50 top-0 left-0 w-80 bg-blue-600 text-white flex flex-col p-6 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-200 ease-in-out`}>
        {/* En-tête du menu */}
        <div className="p-4 border-b text-white">
          <h2 className="text-xl font-semibold">Laveur</h2>
        </div>
          <nav className="flex flex-col mt-4 bg-blue-600">
        {/* Lien vers la page "Acceuil" */}
        <Link
            href="/laveur/acceuil"
            className={`px-4 py-3 text-left rounded-md mx-2 my-1 ${
              url === "/laveur/acceuil"
                ? "bg-blue-500 text-white" // Style pour l'élément actif
                : "text-wh hover:bg-blue-500" // Style par défaut avec effet hover
            }`}
          >
            Acceuil
          </Link>
        {/* Liens de navigation */}
        
          {/* Lien vers la page "Nouveau Lavage" */}
          <Link
            href="/Laveur/Taches"
            className={`px-4 py-3 text-left rounded-md mx-2 my-1 ${
              url === "/Laveur/Taches"
                ? "bg-blue-500 text-white" // Style pour l'élément actif
                : "text-white hover:bg-blue-500" // Style par défaut avec effet hover
            }`}
          >
            Tache
          </Link>
        </nav>
      </aside>
    

      {/* Zone de contenu principal */}
      <main className="flex-1 p-6 bg-gray-50">
        {children} {/* Contenu dynamique (dépend de la page active) */}
      </main>
    </div>
  );
}

export default LayoutReceptionniste;
