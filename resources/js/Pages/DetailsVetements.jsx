import React from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";

import LayoutReceptionniste from "@/Layouts/LayoutReceptionniste";

const DetailsVetements = () => {
  const { lavage } = usePage().props; // Le lavage et ses vêtements sont injectés depuis le backend

  // Met à jour l'état d'un vêtement à "Retiré"
  const handleRetirerVetement = (vetementId) => {
    if (confirm("Êtes-vous sûr de vouloir marquer ce vêtement comme retiré ?")) {
      Inertia.post(`/vetements/${vetementId}/retirer`, {}, {
        onSuccess: () => alert("Vêtement marqué comme retiré."),
      });
    }
  };

  return (
    <LayoutReceptionniste>
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">
        Détails du Lavage #{lavage.id}
      </h1>
      <h2 className="text-lg text-gray-700 mb-4">
        Client : {lavage.client.nom} ({lavage.client.email})
      </h2>
      <table className="w-full text-left border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID Vêtement</th>
            <th className="border px-4 py-2">Catégorie</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Couleur</th>
            <th className="border px-4 py-2">État</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {lavage.vetements.map((vetement) => (
            <tr key={vetement.id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{vetement.id}</td>
              <td className="border px-4 py-2">{vetement.categorie.nom}</td>
              <td className="border px-4 py-2">{vetement.type.nom}</td>
              <td className="border px-4 py-2">
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: vetement.couleur }}
                ></div>
              </td>
              <td className="border px-4 py-2">{vetement.etat}</td>
              <td className="border px-4 py-2">
                {vetement.etat === "Terminé" && (
                  <button
                    onClick={() => handleRetirerVetement(vetement.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none"
                  >
                    Retirer
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </LayoutReceptionniste>
  );
};



export default DetailsVetements;
