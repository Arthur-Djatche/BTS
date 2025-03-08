import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from "react-toastify";  // ✅ Ajout de Toastify
import "react-toastify/dist/ReactToastify.css";  // ✅ Styles de Toastify

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        console.log("📄 Page demandée par Inertia :", name);
        return resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx', {eager: true})
        );
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <>
                <App {...props} />
                <ToastContainer position="top-right" autoClose={3000} />  {/* ✅ Ajout du container */}
            </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
