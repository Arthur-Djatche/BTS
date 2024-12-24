import React from 'react';

export default function Layout({ children }){
    return(
        <>
           <div className="mt-fixed top-0 left-0 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md border-b border-blue-700 z-50">
      {/* Conteneur centré */}
      <div className=" max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo ou icône de l'entreprise */}
        <div className="flex items-center space-x-3">
          {/* Logo fictif */}
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
            B
          </div>
          {/* Nom de l'entreprise */}
          <h1 className="text-xl font-semibold tracking-wide">BNR CLEAN</h1>
        </div>

        
      </div>
    </div>

            <main> { children }</main>
        </>
    );
}