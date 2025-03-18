import React, { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import LayoutAdmin from '@/Layouts/LayoutAdmin';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AjoutActeur() {
  const { success, error } = usePage().props; // Récupérer les messages envoyés depuis Laravel
  const [rolesList, setRolesList] = useState([]);

  useEffect(() => {
    if (success) toast.success(success);
    if (error) toast.error(error);
  }, [success, error])

  // Gestion du formulaire avec Inertia
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    role: '',
  });

  // Simulation du fetch des rôles (peut être remplacé par une API)
  useEffect(() => {
    const fetchedRoles = ["laveur", "repasseur", "receptionniste"];
    setRolesList(fetchedRoles);
  }, []);

  // ✅ Gestion de la soumission du formulaire
  function handleSubmit(e) {
    e.preventDefault();

    post("/ajout-acteur", {
      onSuccess: () => {
        setData({ email: '', role: '' }); // Réinitialiser les champs après succès
      },
    });
  }

  return (
    <LayoutAdmin>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Ajouter un Acteur</h2>

          {/* ✅ Affichage des messages de succès / erreur */}
          {success && <div className="p-4 mb-4 text-green-700 bg-green-200 border border-green-400 rounded">{success}</div>}
          {error && <div className="p-4 mb-4 text-red-700 bg-red-200 border border-red-400 rounded">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Adresse Email</label>
              <input
                type="email"
                id="email"
                placeholder="exemple@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="role" className="block text-gray-700 font-semibold mb-2">Rôle</label>
              <select
                id="role"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
                value={data.role}
                onChange={(e) => setData('role', e.target.value)}
              >
                <option value="" disabled>Sélectionnez un rôle</option>
                {rolesList.map((r, index) => (
                  <option key={index} value={r}>{r}</option>
                ))}
              </select>
              {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                disabled={processing}
              >
                {processing ? "Ajout en cours..." : "Ajouter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </LayoutAdmin>
  );
}


export default AjoutActeur;
