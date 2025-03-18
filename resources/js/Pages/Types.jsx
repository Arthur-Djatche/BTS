import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import LayoutAdmin from "@/Layouts/LayoutAdmin";

const Types = () => {
  const { types, structure } = usePage().props;
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [typeData, setTypeData] = useState({ nom: "", pourcentage_variation: "" });

  const openModal = (type = null) => {
    setEditingType(type);
    setTypeData(type ? { nom: type.nom, pourcentage_variation: type.pourcentage_variation } : { nom: "", pourcentage_variation: "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingType(null);
    setTypeData({ nom: "", pourcentage_variation: "" });
  };

  const handleChange = (e) => {
    setTypeData({ ...typeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingType) {
      Inertia.put(`/types/${editingType.id}`, { pourcentage_variation: typeData.pourcentage_variation }, {
        onSuccess: () => closeModal(),
      });
    } else {
      Inertia.post("/types", { ...typeData, structure_id: structure.id }, {
        onSuccess: () => closeModal(),
      });
    }
  };

  const handleDelete = (id) => {
    if (confirm("Voulez-vous vraiment supprimer ce type de vêtement ?")) {
      Inertia.delete(`/types/${id}`);
    }
  };

  return (
    <LayoutAdmin>
      <div className="mt-20 p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-600">Gestion des Types de Vêtements</h1>
          <button
            onClick={() => openModal()}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaPlus className="mr-2" /> Ajouter
          </button>
        </div>

        {/* Table des types */}
        <div className="overflow-x-auto">
          <table className="w-full mt-4 border-collapse border border-gray-300 shadow-sm rounded-lg">
            <thead className="bg-blue-100 text-gray-800">
              <tr>
                <th className="border px-6 py-3 text-left">Nom</th>
                <th className="border px-6 py-3 text-left">Variation (%)</th>
                <th className="border px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {types.length > 0 ? (
                types.map((type) => (
                  <tr key={type.id} className="hover:bg-gray-100 transition">
                    <td className="border px-6 py-3">{type.nom}</td>
                    <td className="border px-6 py-3">{type.pourcentage_variation}%</td>
                    <td className="border px-6 py-3 flex justify-center gap-4">
                      <button
                        onClick={() => openModal(type)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-full hover:bg-yellow-600 transition"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(type.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="border px-6 py-3 text-center text-gray-500">
                    Aucun type trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MODALE */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
              <h2 className="text-xl font-semibold text-blue-600 mb-4">
                {editingType ? "Modifier le Type" : "Ajouter un Type"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nom du type (Non modifiable si édition) */}
                <div>
                  <label className="block text-gray-700">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    value={typeData.nom}
                    onChange={handleChange}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
                    readOnly={!!editingType}
                  />
                </div>

                {/* Pourcentage de variation */}
                <div>
                  <label className="block text-gray-700">Pourcentage de Variation (%)</label>
                  <input
                    type="number"
                    name="pourcentage_variation"
                    value={typeData.pourcentage_variation}
                    onChange={handleChange}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    🔹 Ce pourcentage peut être négatif (ex: -10 pour réduire le prix).
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    {editingType ? "Modifier" : "Ajouter"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </LayoutAdmin>
  );
};

export default Types;
