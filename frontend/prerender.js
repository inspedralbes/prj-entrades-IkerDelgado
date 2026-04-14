import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = [
  '/',
  '/privacy',
  '/terms',
  '/login'
];

const distPath = path.resolve(__dirname, 'dist');
const template = fs.readFileSync(path.resolve(distPath, 'index.html'), 'utf-8');

routes.forEach(route => {
  const folderPath = path.join(distPath, route === '/' ? '' : route);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  
  // En un SSR real, aquí inyectarías el contenido de React. 
  // Para este proyecto, lo inyectamos como "Static Prerendering".
  fs.writeFileSync(path.join(folderPath, 'index.html'), template);
  console.log(`Pre-rendered route: ${route}`);
});

console.log('SSG Build complete.');
