import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaClipboardList, FaRecycle } from "react-icons/fa";
import LayoutSuper from "@/Layouts/LayoutSuper";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Abonnements = () => {
  const { abonnements, abonnementsInactifs, flash } = usePage().props;

  // Toast notifications
  React.useEffect(() => {
    if (flash.success) toast.success(flash.success);
    if (flash.error) toast.error(flash.error);
  }, [flash]);

  // États des modales
  const [showModal, setShowModal] = useState(false);
  const [showTrashModal, setShowTrashModal] = useState(false);

  // État du formulaire
  const [formData, setFormData] = useState({
    nom: "",
    limite_lavages: "",
    limite_consigne: "",
    limite_categories: "",
    limite_types: "",
    prix: "",
  });

  // État de l'édition
  const [editingAbonnement, setEditingAbonnement] = useState(null);

  // Ouvrir modale d'ajout/modification
  const openModal = (abonnement = null) => {
    setEditingAbonnement(abonnement);
    setFormData(
      abonnement
        ? {
            nom: abonnement.nom,
            limite_lavages: abonnement.limite_lavages,
            limite_consigne: abonnement.limite_consigne,
            limite_categories: abonnement.limite_categories,
            limite_types: abonnement.limite_types,
            prix: abonnement.prix,
          }
        : {
            nom: "",
            limite_lavages: "",
            limite_consigne: "",
            limite_categories: "",
            limite_types: "",
            prix: "",
          }
    );
    setShowModal(true);
  };

  // Fermer modales
  const closeModal = () => {
    setShowModal(false);
    setShowTrashModal(false);
    setEditingAbonnement(null);
  };

  // Gestion des changements
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAbonnement) {
      Inertia.patch(`/abonnements/${editingAbonnement.id}`, formData, {
        onSuccess: () => closeModal(),
      });
    } else {
      Inertia.post("/abonnements", formData, {
        onSuccess: () => closeModal(),
      });
    }
  };

  // Désactiver un abonnement
  const handleDelete = (id) => {
    if (confirm("Voulez-vous vraiment désactiver cet abonnement ?")) {
      Inertia.patch(`/abonnements/${id}/disable`);
    }
  };

  // Restaurer un abonnement
  const handleRestore = (id) => {
    Inertia.patch(`/abonnements/${id}/restore`, {
      onSuccess: () => setShowTrashModal(false),
    });
  };

  return (
    <LayoutSuper>
      <div className="mt-4 md:mt-8 lg:mt-12 xl:mt-20 p-4 sm:p-6 bg-white rounded-lg shadow-md mx-2 sm:mx-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-blue-600 flex items-center gap-2">
            <FaClipboardList className="text-lg sm:text-xl" /> 
            <span className="whitespace-nowrap">Gestion des Abonnements</span>
          </h1>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={() => openModal()}
              className="flex items-center bg-blue-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <FaPlus className="mr-1 sm:mr-2" /> 
              <span>Ajouter</span>
            </button>
            <button
              onClick={() => setShowTrashModal(true)}
              className="flex items-center bg-red-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-red-700 transition text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <FaTrash className="mr-1 sm:mr-2" /> 
              <span>Corbeille</span>
            </button>
          </div>
        </div>

        {/* Tableau des abonnements - version responsive */}
        <div className="overflow-x-auto">
          <div className="min-w-full overflow-hidden">
            <table className="w-full border-collapse border border-gray-300 shadow-sm rounded-lg">
              <thead className="bg-blue-100 text-gray-800">
                <tr>
                  <th className="border px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm">Nom</th>
                  <th className="border px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm hidden sm:table-cell">Lavages</th>
                  <th className="border px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm hidden md:table-cell">Consignes</th>
                  <th className="border px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm hidden lg:table-cell">Catégories</th>
                  <th className="border px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm hidden lg:table-cell">Types</th>
                  <th className="border px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm">Prix</th>
                  <th className="border px-3 py-2 sm:px-4 sm:py-3 text-center text-xs sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {abonnements.map((abonnement) => (
                  <tr key={abonnement.id} className="hover:bg-gray-100 transition">
                    <td className="border px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm">{abonnement.nom}</td>
                    <td className="border px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm hidden sm:table-cell">{abonnement.limite_lavages}</td>
                    <td className="border px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm hidden md:table-cell">{abonnement.limite_consigne}</td>
                    <td className="border px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm hidden lg:table-cell">{abonnement.limite_categories}</td>
                    <td className="border px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm hidden lg:table-cell">{abonnement.limite_types}</td>
                    <td className="border px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm whitespace-nowrap">{abonnement.prix} FCFA</td>
                    <td className="border px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm">
                      <div className="flex justify-center gap-2 sm:gap-4">
                        <button
                          onClick={() => openModal(abonnement)}
                          className="bg-yellow-500 text-white p-1 sm:p-2 rounded-full hover:bg-yellow-600 transition"
                          aria-label="Modifier"
                        >
                          <FaEdit className="text-xs sm:text-sm" />
                        </button>
                        <button
                          onClick={() => handleDelete(abonnement.id)}
                          className="bg-red-500 text-white p-1 sm:p-2 rounded-full hover:bg-red-600 transition"
                          aria-label="Supprimer"
                        >
                          <FaTrash className="text-xs sm:text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Version mobile simplifiée */}
        <div className="sm:hidden mt-4 space-y-4">
          {abonnements.map((abonnement) => (
            <div key={abonnement.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-blue-600">{abonnement.nom}</h3>
                  <p className="text-sm">{abonnement.prix} FCFA</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(abonnement)}
                    className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition"
                    aria-label="Modifier"
                  >
                    <FaEdit className="text-xs" />
                  </button>
                  <button
                    onClick={() => handleDelete(abonnement.id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                    aria-label="Supprimer"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                <div>
                  <span className="font-semibold">Lavages:</span> {abonnement.limite_lavages}
                </div>
                <div>
                  <span className="font-semibold">Consignes:</span> {abonnement.limite_consigne}
                </div>
                <div>
                  <span className="font-semibold">Catégories:</span> {abonnement.limite_categories}
                </div>
                <div>
                  <span className="font-semibold">Types:</span> {abonnement.limite_types}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MODALE Corbeille - version responsive */}
        {showTrashModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md relative max-h-[80vh] overflow-y-auto">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
              <h2 className="text-lg sm:text-xl font-semibold text-red-600 mb-4">Abonnements désactivés</h2>
              <ul className="space-y-2">
                {abonnementsInactifs.length > 0 ? (
                  abonnementsInactifs.map((abonnement) => (
                    <li key={abonnement.id} className="flex justify-between items-center border p-2 rounded-md">
                      <span className="text-sm sm:text-base truncate">{abonnement.nom}</span>
                      <button
                        onClick={() => handleRestore(abonnement.id)}
                        className="bg-green-500 text-white p-1 sm:p-2 rounded-full hover:bg-green-600 transition"
                        aria-label="Restaurer"
                      >
                        <FaRecycle className="text-xs sm:text-sm" />
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 text-center text-sm sm:text-base">Aucun abonnement désactivé.</p>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* MODALE d'ajout/modification - version responsive */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
              <h2 className="text-lg sm:text-xl font-semibold text-blue-600 mb-4">
                {editingAbonnement ? "Modifier l'Abonnement" : "Ajouter un Abonnement"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                {Object.keys(formData).map((field) => (
                  <div key={field}>
                    <label className="block text-gray-700 text-sm sm:text-base capitalize">
                      {field.replace("_", " ")}
                    </label>
                    <input
                      type={field === "prix" || field.includes("limite") ? "number" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      required
                      disabled={editingAbonnement && field === "nom"}
                    />
                  </div>
                ))}

                <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition text-sm sm:text-base"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm sm:text-base"
                  >
                    {editingAbonnement ? "Modifier" : "Ajouter"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </LayoutSuper>
  );
};

export default Abonnements;