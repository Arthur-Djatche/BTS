import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import { FaBuilding, FaUser, FaCity, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";

const CreateStructure = () => {
  const { data, setData, post, processing, errors } = useForm({
    nom_structure: "",
    nom_admin: "",
    ville: "",
    email: "",
    telephone: "",
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/structures", {
      onSuccess: () => alert("Structure créée avec succès !"),
      onError: (errors) => console.error(errors),
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-green-500 p-6">
      <motion.div 
        initial={{ opacity: 0, y: -30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }} 
        className="w-full max-w-lg p-8 bg-white rounded-xl shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Créer une Structure</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nom de la structure */}
          <div className="relative">
            <FaBuilding className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Nom de la structure"
              value={data.nom_structure}
              onChange={(e) => setData("nom_structure", e.target.value)}
              className="w-full pl-10 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.nom_structure && <p className="text-red-500">{errors.nom_structure}</p>}
          </div>

          {/* Nom Admin */}
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Nom de l'Admin"
              value={data.nom_admin}
              onChange={(e) => setData("nom_admin", e.target.value)}
              className="w-full pl-10 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.nom_admin && <p className="text-red-500">{errors.nom_admin}</p>}
          </div>

          {/* Ville */}
          <div className="relative">
            <FaCity className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Ville"
              value={data.ville}
              onChange={(e) => setData("ville", e.target.value)}
              className="w-full pl-10 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.ville && <p className="text-red-500">{errors.ville}</p>}
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              className="w-full pl-10 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>

          {/* Téléphone */}
          <div className="relative">
            <FaPhone className="absolute left-3 top-3 text-gray-400" />
            <input
              type="tel"
              placeholder="Téléphone"
              value={data.telephone}
              onChange={(e) => setData("telephone", e.target.value)}
              className="w-full pl-10 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.telephone && <p className="text-red-500">{errors.telephone}</p>}
          </div>

          {/* Mot de passe */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Mot de passe"
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              className="w-full pl-10 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.password && <p className="text-red-500">{errors.password}</p>}
          </div>

          {/* Confirmation du mot de passe */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={data.password_confirmation}
              onChange={(e) => setData("password_confirmation", e.target.value)}
              className="w-full pl-10 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.password_confirmation && (
              <p className="text-red-500">{errors.password_confirmation}</p>
            )}
          </div>

          {/* Bouton de soumission */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={processing}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
          >
            {processing ? "En cours..." : "Créer la Structure"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateStructure;
