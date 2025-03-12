import React from "react";
import { usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";

const PageSucces = () => {
  const { lavage } = usePage().props; // Récupération des données envoyées par Inertia

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        {/* ✅ En-tête de succès */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-green-500 text-white rounded-full flex items-center justify-center text-3xl font-bold">
            ✅
          </div>
          <h1 className="text-2xl font-bold text-green-600 mt-4">
            Retrait Confirmé !
          </h1>
          <p className="text-gray-600">Le retrait du lavage a été validé avec succès.</p>
        </div>

        {/* ✅ Détails du lavage */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold text-gray-800">Détails du Lavage</h2>
          <div className="mt-2 space-y-2">
            <p>
              <span className="font-semibold">ID Lavage :</span> {lavage.id}
            </p>
            <p>
              <span className="font-semibold">Client :</span> {lavage.client.nom}
            </p>
            <p>
              <span className="font-semibold">Emplacement :</span> {lavage.emplacement.nom}
            </p>
          </div>
        </div>

        {/* ✅ Bouton Retour */}
        <div className="mt-6 text-center">
          <button
            onClick={() => Inertia.visit("/etat-lavage")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Retour à la liste des lavages
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageSucces;
