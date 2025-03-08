import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import LayoutAdmin from "@/Layouts/LayoutAdmin";
import Layout from "@/Layouts/Layout";

const Categories = () => {
  const { categories, structure } = usePage().props;
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryData, setCategoryData] = useState({ nom: "" });

  const openModal = (category = null) => {
    setEditingCategory(category);
    setCategoryData(category ? { nom: category.nom } : { nom: "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setCategoryData({ nom: "" });
  };

  const handleChange = (e) => {
    setCategoryData({ ...categoryData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      Inertia.put(`/categories/${editingCategory.id}`, categoryData, {
        onSuccess: () => closeModal(),
      });
    } else {
      Inertia.post("/categories", { ...categoryData, structure_id: structure.id }, {
        onSuccess: () => closeModal(),
      });
    }
  };

  const handleDelete = (id) => {
    if (confirm("Voulez-vous vraiment supprimer cette catégorie ?")) {
      Inertia.delete(`/categories/${id}`);
    }
  };

  return (
    <LayoutAdmin>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-600">Gestion des Catégories</h1>
          <button
            onClick={() => openModal()}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaPlus className="mr-2" /> Ajouter
          </button>
        </div>

        {/* Table des catégories */}
        <div className="overflow-x-auto">
          <table className="w-full mt-4 border-collapse border border-gray-300 shadow-sm rounded-lg">
            <thead className="bg-blue-100 text-gray-800">
              <tr>
                <th className="border px-6 py-3 text-left">Nom</th>
                <th className="border px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-100 transition">
                    <td className="border px-6 py-3">{category.nom}</td>
                    <td className="border px-6 py-3 flex justify-center gap-4">
                      <button
                        onClick={() => openModal(category)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-full hover:bg-yellow-600 transition"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="border px-6 py-3 text-center text-gray-500">
                    Aucune catégorie trouvée.
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
                {editingCategory ? "Modifier la Catégorie" : "Ajouter une Catégorie"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    value={categoryData.nom}
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
                    {editingCategory ? "Modifier" : "Ajouter"}
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

Categories.layout = (page) => <Layout children={page} />;

export default Categories;
