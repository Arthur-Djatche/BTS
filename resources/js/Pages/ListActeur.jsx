import React from 'react';
import {useState} from "react";
import { useEffect } from 'react';
import { FaEdit, FaTrash } from "react-icons/fa";

function ListActeur () {
    // Exemple de données initiales pour les acteurs
  const [acteurs, setActeurs] = useState([
    {
      id: 1,
      nom: "Doe",
      prenom: "John",
      email: "john.doe@example.com",
      telephone: "+123456789",
      role: "admin",
    },
    {
      id: 2,
      nom: "Smith",
      prenom: "Jane",
      email: "jane.smith@example.com",
      telephone: "+987654321",
      role: "manager",
    },
  ]);

  // Fonction pour supprimer un acteur
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cet acteur ?");
    if (confirmDelete) {
      setActeurs(acteurs.filter((acteur) => acteur.id !== id));
    }
  };

  // Fonction pour modifier un acteur (exemple avec un simple alert)
  const handleEdit = (id) => {
    alert(`Modifier l'acteur avec l'ID : ${id}`);
  };

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
                  {/* Bouton Modifier */}
                  <button
                    onClick={() => handleEdit(acteur.id)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Modifier"
                  >
                    <FaEdit />
                  </button>
                  {/* Bouton Supprimer */}
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

};

export default ListActeur;
