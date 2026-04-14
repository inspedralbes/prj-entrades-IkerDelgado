# Manual d'Instal·lació i Configuració - TicketHub

Aquest document detalla els passos necessaris per instal·lar i posar en marxa la plataforma TicketHub.

## Requisits previs
- **Docker** i **Docker Compose** instal·lats.
- **Node.js** (v18 o superior) i **npm**.
- **PHP 8.2** o superior (si s'executa fora de Docker).
- **Composer**.

## 1. Clonar el repositori
```bash
git clone <url-del-repositori>
cd prj-entrades-IkerDelgado
```

## 2. Configuració del Backend (Laravel)
Accedeix a la carpeta `api/` i configura l'entorn:
```bash
cd api
cp .env.example .env
composer install
php artisan key:generate
```
*Nota: Assegura't que el fitxer `.env` té les credencials correctes de la base de dades (per defecte configurades per Docker).*

## 3. Aixecar els serveis amb Docker
Des de l'arrel del projecte, executa:
```bash
docker-compose up -d
```
Això aixecarà:
- **MySQL**: Base de dades.
- **Redis**: Per a la comunicació entre Laravel i el servidor de Sockets.
- **PHP/Laravel**: L'API principal.
- **Nginx**: Servidor web.

## 4. Migracions i Dades inicials
Executa les migracions i els seeders per tenir dades de prova:
```bash
docker-compose exec api php artisan migrate:fresh --seed
```

## 5. Servidor de Sockets (Node.js)
Instal·la les dependències i executa el servidor:
```bash
cd ../socket
npm install
node index.js
```
El servidor de sockets escoltarà per defecte al port **3000**.

## 6. Frontend (React + Vite)
Instal·la les dependències i inicia el servidor de desenvolupament:
```bash
cd ../frontend
npm install
npm run dev
```
La web estarà disponible a [http://localhost:5173](http://localhost:5173).

## 7. Usuaris de Prova (Seeds)
Pots entrar amb els següents usuaris preconfigurats:
- **Admin**: `admin@example.com` / `password`
- **Client**: `client@example.com` / `password`

## 8. Execució de Tests (Cypress)
Per obrir la interfície de Cypress i executar els tests:
```bash
cd frontend
npx cypress open
```
