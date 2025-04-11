import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilActeur = ({ acteur }) => {
  const { data, setData, patch, processing, errors } = useForm({
    nom: acteur.nom || "",
    prenom: acteur.prenom || "",
    email: acteur.email || "",
    telephone: acteur.telephone || "",
    current_password: "",
    new_password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Préparer les données à envoyer
    const formData = {
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      telephone: data.telephone,
      ...(data.current_password && {
        current_password: data.current_password,
        new_password: data.new_password,
      }),
    };

    patch(`/acteurs/update`, {
      data: formData,
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Profil mis à jour avec succès !");
      },
      onError: (errors) => {
        console.error(errors);
        toast.error(
          errors.message || "Erreur lors de la mise à jour du profil !"
        );
      },
    });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-10">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
          Modifier mon profil
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Nom
              </label>
              <input
                type="text"
                value={data.nom}
                onChange={(e) => setData("nom", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Votre nom"
              />
              {errors.nom && (
                <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Prénom
              </label>
              <input
                type="text"
                value={data.prenom}
                onChange={(e) => setData("prenom", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Votre prénom"
              />
              {errors.prenom && (
                <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Votre email"
              disabled
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              value={data.telephone}
              onChange={(e) => setData("telephone", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Votre numéro de téléphone"
            />
            {errors.telephone && (
              <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Changer le mot de passe
            </h2>
            <p className="text-gray-600 mb-4">
              Laissez ces champs vides pour conserver votre mot de passe actuel.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  value={data.current_password}
                  onChange={(e) => setData("current_password", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Entrez votre mot de passe actuel"
                />
                {errors.current_password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.current_password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={data.new_password}
                  onChange={(e) => setData("new_password", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Entrez votre nouveau mot de passe"
                />
                {errors.new_password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.new_password}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              disabled={processing}
            >
              {processing ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ProfilActeur;