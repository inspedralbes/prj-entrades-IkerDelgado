import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    host: true, // Permet l'accés des de fora del contenidor
    port: 5173,
    allowedHosts: [
      'tickethub.daw.inspedralbes.cat'
    ],
    watch: {
      usePolling: true, // Crucial per a Windows/Docker
    },
    hmr: {
      clientPort: 5173, // Assegura que el navegador sàpiga on connectar-se per a HMR
    },
  },
})
