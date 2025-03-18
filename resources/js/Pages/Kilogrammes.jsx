import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaBalanceScale } from "react-icons/fa";
import LayoutAdmin from "@/Layouts/LayoutAdmin";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Kilogrammes = () => {
  const { kilogrammes, structure } = usePage().props;
  const [showModal, setShowModal] = useState(false);
  const [editingKg, setEditingKg] = useState(null);
  const [kgData, setKgData] = useState({ min_kg: "", max_kg: "", tarif: "" });
  const { flash } = usePage().props; // ✅ Récupération des messages Laravel

  // ✅ Affichage des messages via Toast
  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success);
    }
    if (flash.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  const openModal = (kg = null) => {
    setEditingKg(kg);
    setKgData(kg ? { min_kg: kg.min_kg, max_kg: kg.max_kg, tarif: kg.tarif } : { min_kg: "", max_kg: "", tarif: "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingKg(null);
    setKgData({ min_kg: "", max_kg: "", tarif: "" });
  };

  const handleChange = (e) => {
    setKgData({ ...kgData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseFloat(kgData.min_kg) >= parseFloat(kgData.max_kg)) {
      alert("Le minimum de kilogrammes doit être inférieur au maximum !");
      return;
    }

    if (editingKg) {
      Inertia.put(`/kilogrammes/${editingKg.id}`, kgData, {
        onSuccess: () => closeModal(),
      });
    } else {
      Inertia.post("/kilogrammes", { ...kgData, structure_id: structure.id }, {
        onSuccess: () => closeModal(),
      });
    }
  };

  const handleDelete = (id) => {
    if (confirm("Voulez-vous vraiment supprimer cette plage de kilogrammes ?")) {
      Inertia.delete(`/kilogrammes/${id}`);
    }
  };

  return (
    <LayoutAdmin>
      <div className="mt-20 p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <FaBalanceScale /> Gestion des Tarifs par Kilogrammes
          </h1>
          <button
            onClick={() => openModal()}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaPlus className="mr-2" /> Ajouter
          </button>
        </div>

        {/* Table des kilogrammes */}
        <div className="overflow-x-auto">
          <table className="w-full mt-4 border-collapse border border-gray-300 shadow-sm rounded-lg">
            <thead className="bg-blue-100 text-gray-800">
              <tr>
                <th className="border px-6 py-3 text-left">Min (kg)</th>
                <th className="border px-6 py-3 text-left">Max (kg)</th>
                <th className="border px-6 py-3 text-left">Tarif (XAF)</th>
                <th className="border px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {kilogrammes.length > 0 ? (
                kilogrammes.map((kg) => (
                  <tr key={kg.id} className="hover:bg-gray-100 transition">
                    <td className="border px-6 py-3">{kg.min_kg} kg</td>
                    <td className="border px-6 py-3">{kg.max_kg} kg</td>
                    <td className="border px-6 py-3">{kg.tarif} XAF</td>
                    <td className="border px-6 py-3 flex justify-center gap-4">
                      <button
                        onClick={() => openModal(kg)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-full hover:bg-yellow-600 transition"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(kg.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border px-6 py-3 text-center text-gray-500">
                    Aucune plage de kilogrammes trouvée.
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
                {editingKg ? "Modifier la Plage" : "Ajouter une Plage"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Min KG */}
                <div>
                  <label className="block text-gray-700">Minimum (kg)</label>
                  <input
                    type="number"
                    name="min_kg"
                    value={kgData.min_kg}
                    onChange={handleChange}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>

                {/* Max KG */}
                <div>
                  <label className="block text-gray-700">Maximum (kg)</label>
                  <input
                    type="number"
                    name="max_kg"
                    value={kgData.max_kg}
                    onChange={handleChange}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>

                {/* Tarif */}
                <div>
                  <label className="block text-gray-700">Tarif (XAF)</label>
                  <input
                    type="number"
                    name="tarif"
                    value={kgData.tarif}
                    onChange={handleChange}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                  />
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
                    {editingKg ? "Modifier" : "Ajouter"}
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

export default Kilogrammes;
