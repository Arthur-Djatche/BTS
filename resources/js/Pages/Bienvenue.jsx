import { motion } from "framer-motion";
import { FaBuilding, FaUserTie } from "react-icons/fa";
import { Link } from "@inertiajs/react";
import React from "react";

export default function Bienvenue() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 text-white px-4">
      {/* Logo & Titre avec animation */}
      <motion.div 
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-extrabold">
          Bienvenue sur <span className="text-yellow-300">DJAART CLEAN</span>
        </h1>
        <p className="mt-2 text-lg text-gray-200">
          Simplifiez la gestion de votre pressing avec notre solution moderne.
        </p>
      </motion.div>

      {/* Cartes des options */}
      <motion.div 
        className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Créer une structure */}
        <motion.div
          className="relative bg-white text-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <div className="absolute inset-0 bg-cover bg-center rounded-2xl opacity-30" 
            style={{ backgroundImage: "url('https://source.unsplash.com/600x400/?laundry,cleaning')" }} />
          <h2 className="relative text-xl font-bold flex items-center gap-2 z-10">
            <FaBuilding className="text-blue-600" /> Créer une structure
          </h2>
          <p className="relative text-gray-600 mt-2 z-10">
            Lancez votre pressing avec notre plateforme et suivez facilement les commandes.
          </p>
          <Link 
             href="/structures" 
            className="relative mt-4 bg-blue-600 hover:bg-blue-700 w-full text-white py-2 px-4 rounded-lg text-center block z-10"
          >
          S'inscrire
          </Link>
        </motion.div>

        {/* Connexion structure */}
        <motion.div
          className="relative bg-white text-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <div className="absolute inset-0 bg-cover bg-center rounded-2xl opacity-30" 
            style={{ backgroundImage: "url('https://source.unsplash.com/600x400/?dry-cleaning,store')" }} />
          <h2 className="relative text-xl font-bold flex items-center gap-2 z-10">
            <FaBuilding className="text-indigo-600" /> Connexion Structure
          </h2>
          <p className="relative text-gray-600 mt-2 z-10">
            Accédez à votre tableau de bord pour gérer votre pressing en toute simplicité.
          </p>
          <Link 
             href="/structures/login" 
            className="relative mt-4 bg-indigo-600 hover:bg-indigo-700 w-full text-white py-2 px-4 rounded-lg text-center block z-10"
          >
          Se connecter
          </Link>
        </motion.div>

        {/* Connexion Employé */}
        <motion.div
          className="relative bg-white text-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 cursor-pointer md:col-span-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="absolute inset-0 bg-cover bg-center rounded-2xl opacity-30" 
            style={{ backgroundImage: "url('https://source.unsplash.com/600x400/?workplace,laundry')" }} />
          <h2 className="relative text-xl font-bold flex items-center gap-2 z-10">
            <FaUserTie className="text-green-600" /> Connexion Employé
          </h2>
          <p className="relative text-gray-600 mt-2 z-10">
            Accédez à votre espace employé pour suivre vos tâches et vos missions.
          </p>
          <Link href="/" 
          className="relative mt-4 bg-green-600 hover:bg-green-700 w-full text-white py-2 px-4 rounded-lg text-center block z-10">
            Se connecter
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
