import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { FaBuilding, FaUserTie } from "react-icons/fa";
import { Inertia } from "@inertiajs/inertia";
import React, {useState, useEffect} from "react";
import { Link } from "@inertiajs/react";

export default function Bienvenue() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 text-white px-4">
      {/* Logo & Titre */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-extrabold">Bienvenue sur <span className="text-yellow-300">DJAART CLEAN</span></h1>
        <p className="mt-2 text-lg text-gray-200">Simplifiez la gestion de votre pressing avec notre solution moderne.</p>
      </motion.div>

      {/* Carte des options */}
      <motion.div 
        className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Créer une structure */}
        <motion.div
          className="bg-white text-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FaBuilding className="text-blue-600" /> Créer une structure
          </h2>
          <p className="text-gray-600 mt-2">Lancez votre pressing avec notre plateforme et suivez facilement les commandes.</p>
          <Link 
             href="/structures" 
            className="mt-4 bg-blue-600 hover:bg-blue-700 w-full text-white py-2 px-4 rounded-lg text-center block"
          >
          S'inscrire
          </Link>
        </motion.div>

        {/* Connexion structure */}
        <motion.div
          className="bg-white text-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FaBuilding className="text-indigo-600" /> Connexion Structure
          </h2>
          <p className="text-gray-600 mt-2">Accédez à votre tableau de bord pour gérer votre pressing en toute simplicité.</p>
          <Link 
             href="/structures/login" 
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 w-full text-white py-2 px-4 rounded-lg text-center block"
          >
          Se connecter
          </Link>
        </motion.div>

        {/* Connexion Employé */}
        <motion.div
          className="bg-white text-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 cursor-pointer md:col-span-2"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FaUserTie className="text-green-600" /> Connexion Employé
          </h2>
          <p className="text-gray-600 mt-2">Accédez à votre espace employé pour suivre vos tâches et vos missions.</p>
          <Link href="/" 
          className="mt-4 bg-green-600 hover:bg-green-700 w-full text-white py-2 px-4 rounded-lg text-center block">Se connecter</Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
