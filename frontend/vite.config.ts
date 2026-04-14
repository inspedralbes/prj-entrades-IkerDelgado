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
    host: true, 
    port: 5173,
    allowedHosts: [
      'tickethub.daw.inspedralbes.cat'
    ],
    watch: {
      usePolling: true,
    },
    hmr: {
      host: 'tickethub.daw.inspedralbes.cat',
      clientPort: 80, // El navegador se conectará al puerto 80 (Nginx)
    },
  },
})
