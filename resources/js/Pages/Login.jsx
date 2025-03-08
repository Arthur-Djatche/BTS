import Layout from "@/Layouts/Layout";
import React, { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Login() {

  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',

  });

function handleSubmit (e) {
  e.preventDefault();
  console.log(data); // Vérifiez les données
  // Envoi des données au backend avec Inertia.post()
  post("/", data, {
    onError: (err) => {
      setErrors(err); // Laravel retourne les erreurs ici
    },
    onSuccess: () => {
      toast.success("Connecté avec succès !");
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
               <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Connexion Employé </h2>
       
               <form onSubmit={handleSubmit} className="space-y-5">
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
       
                 {/* Bouton de connexion */}
                 <motion.button
                   whileTap={{ scale: 0.95 }}
                   type="submit"
                   disabled={processing}
                   className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
                 >
                   {processing ? "Connexion..." : "Se Connecter"}
                 </motion.button>
       
                 {/* Lien vers l'inscription */}
                 <p className="text-center text-gray-600 mt-4">
                   Pas encore de compte ?{" "}
                   <a href="/structures" className="text-blue-600 hover:underline">
                     Créer une structure
                   </a>
                 </p>
               </form>
             </motion.div>
           </div>
    );
}

// Login.layout = page => <Layout children={page}/>


export default Login;