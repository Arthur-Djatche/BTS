import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";

function ListActeur() {
  const { acteurs } = usePage().props; // Récupérer les acteurs depuis les props d'Inertia
    console.log("Données reçues :", acteurs);
  // Fonction pour supprimer un acteur
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cet acteur ?");
    if (confirmDelete) {
      Inertia.delete(`/Admin/Emp/list/${id}`, {
        onSuccess: () => {
          alert("Acteur supprimé avec succès !");
        },
        onError: (errors) => {
          console.error("Erreur :", errors);
        },
      });
    }
  };

  const handleEdit = (id) => {
    alert(`Modifier l'acteur avec l'ID : ${id}`);
  };

  

  if (!acteurs || acteurs.length === 0) {
    return <p className="text-center mt-6">Aucun acteur trouvé.</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Liste des Acteurs</h2>
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700">Nom</th>
              <th className="px-4 py-2 text-left text-gray-700">Prénom</th>
              <th className="px-4 py-2 text-left text-gray-700">Email</th>
              <th className="px-4 py-2 text-left text-gray-700">Téléphone</th>
              <th className="px-4 py-2 text-left text-gray-700">Rôle</th>
              <th className="px-4 py-2 text-center text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {acteurs.map((acteur) => (
              <tr key={acteur.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{acteur.nom}</td>
                <td className="border px-4 py-2">{acteur.prenom}</td>
                <td className="border px-4 py-2">{acteur.email}</td>
                <td className="border px-4 py-2">{acteur.telephone}</td>
                <td className="border px-4 py-2">{acteur.role}</td>
                <td className="border px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(acteur.id)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Modifier"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(acteur.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Supprimer"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListActeur;
