import React from "react";
import { useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import { FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPasswordForm({ identifier }) {
  const { data, setData, post, processing, errors } = useForm({
    identifier: identifier || "",
    password: "",
    password_confirmation: "",
  });

  const submit = (e) => {
    e.preventDefault();

    post("/reset-password/reset", {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("✅ Mot de passe réinitialisé avec succès !");
      },
      onError: (errors) => {
        toast.error("❌ Une erreur est survenue lors de la réinitialisation.");
        console.error(errors);
      },
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
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Réinitialisation du mot de passe
        </h2>

        <form onSubmit={submit} className="space-y-5">
          {/* Nouveau mot de passe */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              className="w-full pl-10 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.password && (
              <p className="text-red-500 mt-2">{errors.password}</p>
            )}
          </div>

          {/* Confirmation */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={data.password_confirmation}
              onChange={(e) =>
                setData("password_confirmation", e.target.value)
              }
              className="w-full pl-10 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.password_confirmation && (
              <p className="text-red-500 mt-2">{errors.password_confirmation}</p>
            )}
          </div>

          {/* Erreur identifiant (optionnel) */}
          {errors.identifier && (
            <p className="text-red-500 text-sm">{errors.identifier}</p>
          )}

          {/* Bouton */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={processing}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-60"
          >
            {processing ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
