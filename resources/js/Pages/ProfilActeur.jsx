import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilActeur = ({ acteur }) => {
  const { data, setData, patch, processing, errors } = useForm({
    nom: acteur.nom || "",
    prenom: acteur.prenom || "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    patch(`/acteurs/update`, {
      preserveScroll: true, // ✅ Évite le rechargement de la page
      onSuccess: () => {
        toast.success("Profil mis à jour avec succès !");
      },
      onError: (errors) => {
        console.error(errors);
        toast.error("Erreur lors de la mise à jour !");
      },
    });
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
        <h1 className="text-2xl font-bold text-blue-600 text-center mb-4">
          Mon Profil
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold">Nom</label>
            <input
              type="text"
              value={data.nom}
              onChange={(e) => setData("nom", e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Votre nom"
            />
            {errors.nom && <p className="text-red-500">{errors.nom}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Prénom</label>
            <input
              type="text"
              value={data.prenom}
              onChange={(e) => setData("prenom", e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Votre prénom"
            />
            {errors.prenom && <p className="text-red-500">{errors.prenom}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Nouveau Mot de Passe
            </label>
            <input
              type="password"
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Laissez vide pour ne pas changer"
            />
            {errors.password && <p className="text-red-500">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            disabled={processing}
          >
            Enregistrer les modifications
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ProfilActeur;
