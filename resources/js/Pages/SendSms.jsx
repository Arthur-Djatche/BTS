import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { FaPaperPlane, FaPhoneAlt, FaSms } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SendSms = ({ status, message }) => {
  const { data, setData, post, processing } = useForm({
    phone: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/send-sms", {
      onSuccess: () => toast.success("✅ SMS envoyé !"),
      onError: () => toast.error("❌ Erreur lors de l'envoi"),
    });
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
        <h1 className="text-2xl font-bold text-center text-blue-600 flex items-center gap-2">
          <FaSms /> Envoyer un SMS
        </h1>

        {status && (
          <p
            className={`mt-4 text-center text-white p-2 rounded ${
              status === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-gray-700 font-semibold">Numéro</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <FaPhoneAlt className="text-gray-500 mr-2" />
              <input
                type="text"
                value={data.phone}
                onChange={(e) => setData("phone", e.target.value)}
                className="w-full outline-none"
                placeholder="237XXXXXXXXX"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Message</label>
            <textarea
              value={data.message}
              onChange={(e) => setData("message", e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Votre message..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
            disabled={processing}
          >
            <FaPaperPlane /> Envoyer
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default SendSms;
