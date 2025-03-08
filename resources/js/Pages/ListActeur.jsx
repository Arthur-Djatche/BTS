import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSync } from "react-icons/fa";
import { usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import LayoutAdmin from "@/Layouts/LayoutAdmin";
import Layout from "@/Layouts/Layout";

function ListActeur() {
  const { acteurs } = usePage().props; // Récupérer les acteurs depuis les props d'Inertia
  const [localActeurs, setLocalActeurs] = useState(acteurs || []); // État local
  const [searchTerm, setSearchTerm] = useState(""); // État pour la barre de recherche
  const [isRefreshing, setIsRefreshing] = useState(false); // État pour l'icône de rafraîchissement


  // Fonction pour recharger les données périodiquement avec Inertia
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 500000); // Recharger toutes les 5 secondes

    return () => clearInterval(interval); // Nettoyer l'intervalle lors du démontage
  }, []);

  // Fonction pour recharger les données
  const refreshData = () => {
    setIsRefreshing(true); // Afficher l'état de rafraîchissement
    Inertia.reload({
      only: ["acteurs"],
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page) => {
        setLocalActeurs(page.props.acteurs);
        setIsRefreshing(false); // Réinitialiser l'état de rafraîchissement
      },
      onError: () => {
        setIsRefreshing(false);
      },
    });
  };

  // Fonction pour rechercher les acteurs
  const handleSearch = (event) => {
    event.preventDefault();
    Inertia.get("/Admin", { search: searchTerm }, {
      only: ["acteurs"],
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page) => {
        setLocalActeurs(page.props.acteurs);
      },
    });
  };

  // Fonction pour supprimer un acteur
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cet acteur ?");
    if (confirmDelete) {
      Inertia.delete(`/Admin/Emp/list/${id}`, {
        onSuccess: () => {
          alert("Acteur supprimé avec succès !");
          refreshData();
        },
      });
    }
  };

  const handleEdit = (id) => {
    alert(`Modifier l'acteur avec l'ID : ${id}`);
  };

  if (!localActeurs || localActeurs.length === 0) {
    return <LayoutAdmin><p className="text-center mt-6">Aucun Employé trouvé.</p></LayoutAdmin>;
  }

  return (
    <LayoutAdmin>
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Liste des Acteurs</h2>
      
      {/* Barre de recherche */}
      <form className="flex items-center w-full max-w-4xl mb-4" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Rechercher un acteur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
        >
          Rechercher
        </button>
        <button
          type="button"
          onClick={refreshData}
          className={`ml-2 p-2 rounded-full ${isRefreshing ? "animate-spin" : ""} bg-gray-200 hover:bg-gray-300`}
          title="Rafraîchir les données"
        >
          <FaSync />
        </button>
      </form>

      {/* Table des acteurs */}
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
            {localActeurs.map((acteur) => (
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
    </LayoutAdmin>
  );
}


ListActeur.layout = (page) => <Layout children={page} />;
export default ListActeur;
