import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaClipboardList, FaRecycle } from "react-icons/fa";
import LayoutAdmin from "@/Layouts/LayoutAdmin";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Consignes = () => {
  const { consignes, structure, success, errors } = usePage().props;
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

  // État pour les modales
  const [showModal, setShowModal] = useState(false);
  const [showTrashModal, setShowTrashModal] = useState(false);

  // État pour l'édition
  const [editingConsigne, setEditingConsigne] = useState(null);
  const [consigneData, setConsigneData] = useState({
    nom: "",
    pourcentage_variation: "",
    priorite_consigne: "Classique",
    type_consigne: "Lavage_Simple",
  });

  // Ouvrir la modale d'ajout/modification
  const openModal = (consigne = null) => {
    setEditingConsigne(consigne);
    setConsigneData(
      consigne
        ? {
            nom: consigne.nom,
            priorite_consigne: consigne.priorite_consigne,
            pourcentage_variation: consigne.pourcentage_variation,
            type_consigne: consigne.type_consigne,
          }
        : { nom: "", priorite_consigne:"Classique", pourcentage_variation: "", type_consigne: "Lavage_Simple" }
    );
    setShowModal(true);
  };

  // Fermer toutes les modales
  const closeModal = () => {
    setShowModal(false);
    setShowTrashModal(false);
    setEditingConsigne(null);
    setConsigneData({ nom: "", priorite_consigne:"Classique", pourcentage_variation: "", type_consigne: "Lavage_Simple" });
  };

  // Gestion des inputs
  const handleChange = (e) => {
    setConsigneData({ ...consigneData, [e.target.name]: e.target.value });
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingConsigne) {
      Inertia.put(`/consignes/${editingConsigne.id}`, consigneData, {
        onSuccess: () => closeModal(),
      });
    } else {
      Inertia.post("/consignes", { ...consigneData, structure_id: structure.id }, {
        onSuccess: () => closeModal(),
      });
    }
  };

  // Suppression (désactivation)
  const handleDelete = (id) => {
    if (confirm("Voulez-vous vraiment désactiver cette consigne ?")) {
      Inertia.put(`/consignes/${id}/disable`)
    }
  };

  // Restauration d'une consigne
  const handleRestore = (id) => {
    Inertia.put(`/consignes/${id}/restore`, {}, {
      onSuccess: () => {setShowTrashModal(false);
      toast.success(success);
      }
    });
  };

  return (
    <LayoutAdmin>
      <div className="mt-20 p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <FaClipboardList /> Gestion des Consignes
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => openModal()}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <FaPlus className="mr-2" /> Ajouter
            </button>
            <button
              onClick={() => setShowTrashModal(true)}
              className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              <FaTrash className="mr-2" /> Corbeille
            </button>
          </div>
        </div>

        {/* Table des consignes actives */}
        <div className="overflow-x-auto">
          <table className="w-full mt-4 border-collapse border border-gray-300 shadow-sm rounded-lg">
            <thead className="bg-blue-100 text-gray-800">
              <tr>
                <th className="border px-6 py-3 text-left">Nom</th>
                <th className="border px-6 py-3 text-left">Type</th>
                <th className="border px-6 py-3 text-left">Priorite</th>
                <th className="border px-6 py-3 text-left">Variation (%)</th>
                <th className="border px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {consignes.filter(c => c.actif === 'O').map((consigne) => (
                <tr key={consigne.id} className="hover:bg-gray-100 transition">
                  <td className="border px-6 py-3">{consigne.nom}</td>
                  <td className="border px-6 py-3">{consigne.type_consigne}</td>
                  <td className="border px-6 py-3">{consigne.priorite_consigne}</td>
                  <td className="border px-6 py-3">{consigne.pourcentage_variation} %</td>
                  <td className="border px-6 py-3 flex justify-center gap-4">
                    <button
                      onClick={() => openModal(consigne)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-full hover:bg-yellow-600 transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(consigne.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODALE Corbeille */}
        {showTrashModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
              <h2 className="text-xl font-semibold text-red-600 mb-4">Consignes supprimées</h2>
              <ul className="space-y-3">
                {consignes.filter(c => c.actif === 'N').length > 0 ? (
                  consignes.filter(c => c.actif === 'N').map((consigne) => (
                    <li key={consigne.id} className="flex justify-between items-center border p-2 rounded-md">
                      <span>{consigne.nom}  {consigne.type_consigne} {consigne.priorite_consigne} {consigne.pourcentage_variation}</span>
                      <button
                        onClick={() => handleRestore(consigne.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition"
                      >
                        <FaRecycle />
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">Aucune consigne supprimée.</p>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* MODALE d'ajout/modification */}
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
                {editingConsigne ? "Modifier la Consigne" : "Ajouter une Consigne"}
              </h2>
              {/* Formulaire ici (identique à la version précédente) */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nom (modifiable en ajout, bloqué en édition) */}
                <div>
                  <label className="block text-gray-700">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    value={consigneData.nom}
                    onChange={handleChange}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={editingConsigne} // Désactivé lors de l'édition
                  />
                </div>

                {/* Type de Consigne */}
                <div>
                  <label className="block text-gray-700">Type</label>
                  <select
                    name="type_consigne"
                    value={consigneData.type_consigne}
                    onChange={handleChange}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Lavage_Simple">Lavage Simple</option>
                    <option value="Repassage_Simple">Repassage Simple</option>
                    <option value="Lavage_Repassage">Lavage + Repassage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700"> Priorité</label>
                  <select
                    name="priorite_consigne"
                    value={consigneData.priorite_consigne}
                    onChange={handleChange}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={editingConsigne} // Désactivé lors de l'édition
                  >
                    <option value="Classique">Classique</option>
                    <option value="Express"> Express</option>

                    </select>
                </div>

                {/* Pourcentage de Variation */}
                <div>
                  <label className="block text-gray-700">Variation (%)</label>
                  <input
                    type="number"
                    name="pourcentage_variation"
                    value={consigneData.pourcentage_variation}
                    onChange={handleChange}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                    required
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
                    {editingConsigne ? "Modifier" : "Ajouter"}
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

export default Consignes;
