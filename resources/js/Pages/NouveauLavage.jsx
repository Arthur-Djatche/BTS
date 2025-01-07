import React from "react";
import LayoutReceptionniste from "@/Layouts/LayoutReceptionniste";
import Layout from "@/Layouts/Layout";

function NouveauLavage() {
  return (
    
    <LayoutReceptionniste>
      <h1 className="text-2xl font-bold text-gray-800">Nouveau Lavage</h1>
      <p className="mt-4 text-gray-600">
        Utilisez ce formulaire pour enregistrer un nouveau lavage.
      </p>
      {/* Formulaire de création de lavage */}
      <form className="mt-6 bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700">Nom du client</label>
          <input
            type="text"
            className="w-full mt-2 p-3 border border-gray-300 rounded"
            placeholder="Entrez le nom du client"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Type de vêtement</label>
          <input
            type="text"
            className="w-full mt-2 p-3 border border-gray-300 rounded"
            placeholder="Entrez le type de vêtement"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Service demandé</label>
          <input
            type="text"
            className="w-full mt-2 p-3 border border-gray-300 rounded"
            placeholder="Entrez le service demandé"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Enregistrer
        </button>
      </form>
    </LayoutReceptionniste>
  );
}


NouveauLavage.layout = (page) => <Layout children={page}/>

export default NouveauLavage;
