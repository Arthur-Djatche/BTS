import React from "react";
import AuthCard from "@/Components/AuthCard";
import { useForm } from "@inertiajs/react";
import { FaPhone } from "react-icons/fa";
import { toast } from "react-toastify";
import { Inertia } from "@inertiajs/inertia";

export default function RequestOtpForm() {
  const { data, setData, post, processing, errors } = useForm({
    telephone: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/reset-password/send-otp", {
      onSuccess: () => {
        toast.success("OTP envoyé !");
        localStorage.setItem('resetPasswordPhone', data.telephone);
        window.location.href = "/reset-password/verify";
      },
      onError: () => toast.error("Numéro invalide ou erreur."),
    });
  };

  return (
    <AuthCard title="Mot de passe oublié">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <FaPhone className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Numéro de téléphone"
            value={data.telephone}
            onChange={(e) => setData("telephone", e.target.value)}
            className="w-full pl-10 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          {errors.identifier && <p className="text-red-500">{errors.identifier}</p>}
        </div>
        <button
          type="submit"
          disabled={processing}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
        >
          {processing ? "Envoi..." : "Envoyer OTP"}
        </button>
      </form>
    </AuthCard>
  );
}
