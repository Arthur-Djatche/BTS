import React from "react";
import { useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import { FaKey } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VerifyOtpForm({ telephone }) {
  const { data, setData, post, processing, errors } = useForm({
    telephone: telephone || "",
    otp: "",
  });

  const submit = (e) => {
    e.preventDefault();

    post("/reset-password/verify-otp", {
      preserveState: true,
      onSuccess: () => {
        // Géré par le backend
      },
      onError: (errors) => {
        if (errors.otp) {
          toast.error(`❌ ${errors.otp}`);
        } else {
          console.error("Erreurs complètes:", errors);
          toast.error("❌ Erreur technique lors de la vérification");
        }
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
          Vérification du Code OTP
        </h2>

        <form onSubmit={submit} className="space-y-5">
          <div className="relative">
            <FaKey className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Entrez le code OTP (6 chiffres)"
              value={data.otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setData("otp", value);
              }}
              maxLength={6}
              className="w-full pl-10 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.otp && <p className="text-red-500 mt-2">{errors.otp}</p>}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={processing}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-70"
          >
            {processing ? "Vérification..." : "Vérifier le code"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
