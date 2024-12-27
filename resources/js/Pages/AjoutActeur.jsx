import React from 'react';
import {useState} from "react";
import { useEffect } from 'react';

function AjoutActeur () {

    // États pour gérer les valeurs des champs
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [rolesList, setRolesList] = useState([]);

  // Effet pour initialiser les données (par exemple, liste des rôles)
  useEffect(() => {
    // Simulation de récupération des rôles depuis une API ou base de données
    const fetchRoles = async () => {
      const fetchedRoles = ["admin", "manager", "user"]; // Exemple de données
      setRolesList(fetchedRoles);
    };

    fetchRoles();
  }, []); // Exécuté une seule fois après le premier rendu

  // Fonction de soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    // Traitement des données (exemple d'affichage des valeurs dans la console)
    console.log("Données soumises :", { email, role });

    // Réinitialiser les champs après soumission
    setEmail("");
    setRole("");
  };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Ajouter un Acteur
        </h2>

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          {/* Champ Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-2"
            >
              Adresse Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="exemple@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
              value={email} // Liaison avec l'état
              onChange={(e) => setEmail(e.target.value)} // Mise à jour de l'état
            />
          </div>

          {/* Champ Rôle */}
          <div className="mb-6">
            <label
              htmlFor="role"
              className="block text-gray-700 font-semibold mb-2"
            >
              Rôle
            </label>
            <select
              id="role"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
              value={role} // Liaison avec l'état
              onChange={(e) => setRole(e.target.value)} // Mise à jour de l'état
            >
              <option value="" disabled>
                Sélectionnez un rôle
              </option>
              {rolesList.map((r, index) => (
                <option key={index} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Bouton Soumettre */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
    );
}

export default AjoutActeur;
