import React from "react";
import { Inertia } from "@inertiajs/inertia";
import LayoutSuper from "@/Layouts/LayoutSuper";

const StructuresAbonnements = ({ structures, abonnements }) => {
  const handleAssignAbonnement = (structure, abonnementId) => {
    Inertia.patch(`/structures/${structure.id}/abonnement`, {
      abonnement_id: abonnementId,
    });
  };

  const handleToggleActivation = (structure) => {
    Inertia.patch(`/structures/${structure.id}/toggle`);
  };

  return (
    <LayoutSuper>
      <div className="p-2 sm:p-4 bg-gray-100 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
            Gestion des Abonnements
          </h1>

          {/* Version mobile - Liste en cartes */}
          <div className="block sm:hidden space-y-3">
            {structures.map((structure) => (
              <div key={structure.id} className="bg-white p-3 rounded-lg shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-800">
                    {structure.nom_structure}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded text-xs text-white ${
                      structure.actif === "O" ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {structure.actif === "O" ? "Active" : "Désactivée"}
                  </span>
                </div>

                <div className="mb-2">
                  <label className="block text-sm text-gray-600 mb-1">
                    Abonnement
                  </label>
                  <select
                    className="w-full p-2 border rounded text-sm"
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
                </div>

                <button
                  onClick={() => handleToggleActivation(structure)}
                  className={`w-full py-2 text-white rounded text-sm ${
                    structure.actif === "O"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {structure.actif === "O" ? "Désactiver" : "Activer"}
                </button>
              </div>
            ))}
          </div>

          {/* Version desktop - Tableau */}
          <div className="hidden sm:block bg-white p-4 rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3">Structure</th>
                    <th className="p-3">Abonnement</th>
                    <th className="p-3 text-center">Statut</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {structures.map((structure) => (
                    <tr key={structure.id} className="hover:bg-gray-50 border-t">
                      <td className="p-3">{structure.nom_structure}</td>
                      <td className="p-3">
                        <select
                          className="w-full p-2 border rounded"
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
                      <td className="p-3 text-center">
                        <span
                          className={`px-3 py-1 rounded text-white ${
                            structure.actif === "O" ? "bg-green-600" : "bg-red-600"
                          }`}
                        >
                          {structure.actif === "O" ? "Active" : "Désactivée"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleToggleActivation(structure)}
                          className={`px-4 py-2 text-white rounded ${
                            structure.actif === "O"
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-green-600 hover:bg-green-700"
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
        </div>
      </div>
    </LayoutSuper>
  );
};

export default StructuresAbonnements;