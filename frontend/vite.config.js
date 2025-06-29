import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      outDir: 'public', // Must match vercel.json's distDir
      emptyOutDir: true,
      sourcemap: false, // Disable in production
      chunkSizeWarningLimit: 2000,
    },
    define: {
      'process.env': {},
    },
  };
});
