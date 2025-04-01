import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        port: 5173, // Ajoute le port pour éviter les conflits
        host: '192.168.1.178',
         port: 3000
    },

    build: {
        rollupOptions: {
            input: {
                'react-email': './resources/js/Pages/mail/VetementsPrets.jsx',
            },
        },
    },
});
