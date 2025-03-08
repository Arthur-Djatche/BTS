import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import ErrorPopup from './ErrorPage';
import LayoutAdmin from '@/Layouts/LayoutAdmin';
import Layout from '@/Layouts/Layout';

function AjoutActeur() {

  const [showError, setShowError] = useState(false);

    const handleError = () => {
        setShowError(true);
    };

  const [rolesList, setRolesList] = useState([]);
  const { data, setData, post, processing, errors } = useForm({
    action: 'addActor',
    email: '',
    role: '',
  });

  useEffect(() => {
    const fetchRoles = async () => {
      const fetchedRoles = ["admin", "laveur", "repasseur", "receptionniste", "caissier", "recaisse"];
      setRolesList(fetchedRoles);
    };
    fetchRoles();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(data)
    post("/Admin", data, {
      action: 'addActor',
      onSuccess: () => {
        
        setData({ email: '', role: '' }); // Réinitialisation des champs
        alert("Acteur créé avec succès !");
      },
    });
  }

  return (
    <LayoutAdmin>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Ajouter un Acteur</h2>
        <form onSubmit={handleSubmit}>
        <input type="hidden" name="action" value={data.action} />
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
          </div>
          <div>
            <button
            onClick={handleError}
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
    </LayoutAdmin>
  );
}
AjoutActeur.layout = (page) => <Layout children={page}/>
export default AjoutActeur;
