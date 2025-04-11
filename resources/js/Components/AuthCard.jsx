// resources/js/Components/AuthCard.jsx
import React from "react";
import { motion } from "framer-motion";

const AuthCard = ({ title, children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-green-500 p-6">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg p-8 bg-white rounded-xl shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">{title}</h2>
        {children}
      </motion.div>
    </div>
  );
};

export default AuthCard;
