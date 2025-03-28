import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import LayoutSuper from "@/Layouts/LayoutSuper";

const StructuresAbonnements = ({ structures, abonnements }) => {
  // États pour la gestion des champs du formulaire d’abonnement

  // Fonction pour gérer l’assignation d’un abonnement à une structure
  const handleAssignAbonnement = (structure, abonnementId) => {
    Inertia.patch(`/structures/${structure.id}/abonnement`, {
      abonnement_id: abonnementId,
    });
  };

  // Fonction pour activer/désactiver une structure
  const handleToggleActivation = (structure) => {
    Inertia.patch(`/structures/${structure.id}/toggle`);
  };


  return (
    <LayoutSuper>
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestion des Abonnements</h1>

        {/* Table des structures */}
        <table className="w-full text-left border-collapse border border-gray-300 shadow-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-3">Structure</th>
              <th className="border px-4 py-3">Abonnement</th>
              <th className="border px-4 py-3">Statut</th>
              <th className="border px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {structures.map((structure) => (
              <tr key={structure.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{structure.nom_structure}</td>
                <td className="border px-4 py-2">
                  <select
                    className="border p-2 rounded w-full"
                    value={structure.abonnement_id || ""}
                    onChange={(e) => handleAssignAbonnement(structure, e.target.value)}
                  >
                    <option value="">Aucun</option>
                    {abonnements.map((abonnement) => (
                      <option key={abonnement.id} value={abonnement.id}>
                        {abonnement.nom} ({abonnement.prix} FCFA)
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border px-4 py-2 text-center">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      structure.actif === "O" ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {structure.actif === "O" ? "Active" : "Désactivée"}
                  </span>
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => handleToggleActivation(structure)}
                    className={`px-3 py-1 text-white rounded ${
                      structure.actif === "O" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {structure.actif === "O" ? "Désactiver" : "Activer"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        
      </div>
    </div>
    </LayoutSuper>
  );
};

export default StructuresAbonnements;
