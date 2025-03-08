import React from "react";
import LayoutAdmin from "@/Layouts/LayoutAdmin";
import Layout from "@/Layouts/Layout";

function Admin() {
  return (
    <LayoutAdmin>
      
      {/* Titre principal de la page */}
      <h1 className="text-2xl font-bold text-blue-600">Dashboard Admin</h1>
      <p className="mt-2 text-gray-600">
        Bienvenue ! Consultez un aperçu des lavages en cours ou accédez rapidement aux fonctionnalités principales.
      </p>

      {/* Statistiques rapides */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Carte 1 : Lavages en cours */}
        <div className="bg-white rounded shadow-md p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700">Lavages en cours</h2>
          <p className="text-3xl font-bold text-blue-600 mt-4">15</p>
        </div>

        {/* Carte 2 : Lavages terminés */}
        <div className="bg-white rounded shadow-md p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700">Lavages terminés</h2>
          <p className="text-3xl font-bold text-green-600 mt-4">30</p>
        </div>

        {/* Carte 3 : Nouveaux clients */}
        <div className="bg-white rounded shadow-md p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700">Nouveaux clients</h2>
          <p className="text-3xl font-bold text-blue-600 mt-4">5</p>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-700">Actions rapides</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          {/* Bouton "Nouveau Lavage" */}
          <a
            href="/Laveur/Taches"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Liste des taches
          </a>

        
        </div>
      </div>
    </LayoutAdmin>
  );
}

Admin.layout = (page) => <Layout children={page}/>

export default Admin;
