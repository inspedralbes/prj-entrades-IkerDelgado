# TicketHub — Plataforma de Venda d'Entrades en Temps Real

**TicketHub** és una aplicació d'alta demanda dissenyada per gestionar la venda d'entrades per a esdeveniments populars (concerts, festivals, etc.) on la competència pels seients és crítica. L'objectiu principal és oferir una experiència fluida i coherent en temps real, evitant conflictes de concurrència.

## 🚀 Tecnologies utilitzades

### Backend
- **Laravel 11 (PHP 8.4)**: API REST principal, gestió de base de dades i autenticació.
- **MySQL 8.0**: Emmagatzematge persistent de dades.
- **Redis**: Sistema de missatgeria Pub/Sub per a la comunicació entre Laravel i el servidor de Sockets.

### Sockets (Temps Real)
- **Node.js + Socket.IO**: Servidor independent per a la sincronització d'estat immediata entre tots els clients connectats.

### Frontend
- **React + Vite (TypeScript)**: Interfície d'usuari reactiva, moderna i optimitzada.
- **Tailwind CSS v4**: Estils moderns i disseny responsive.
- **Framer Motion**: Animacions suaus i feedback visual per a les accions de l'usuari.

### DevOps & Tests
- **Docker & Docker Compose**: Orquestració de contenidors per a un entorn de desenvolupament idèntic al de producció.
- **Cypress**: Tests d'integració E2E i proves de concurrència.

## 🌟 Funcionalitats clau

- **Mapa de seients en temps real**: Visualització instantània de l'estat dels seients (Lliure, Seleccionat, Reservat, Venut).
- **Bloqueig temporal de seients**: Quan un usuari selecciona un seient, aquest es bloqueja automàticament per a la resta d'usuaris durant 5 minuts.
- **Expiració automàtica**: Un "scheduler" de Laravel neteja les reserves caducades cada minut, tornant a alliberar els seients.
- **Panell d'Administració**: Estadístiques en temps real sobre ocupació, recaptació i gestió de catàleg.
- **Gestió de Concurrència**: El servidor valida cada reserva mitjançant transaccions de base de dades per assegurar que cap seient es vengui dues vegades.

## 👥 Usuaris de Prova (Seeds)

Un cop executat el seeder (`php artisan migrate:fresh --seed`), pots utilitzar aquestes credencials:

- **Client**: `iker@gmail.com` / `password123`
- **Administrador**: `admin@gmail.com` / `admin123`

## 📂 Estructura del Projecte

- `/api`: Backend Laravel.
- `/frontend`: Aplicació React.
- `/socket`: Servidor de Sockets Node.js.
- `/docker`: Configuracions de MySQL i Nginx.
- `/doc`: Diagrames de Cas d'Ús, Seqüència i ER.
- `/specs`: Especificacions i pla d'implementació.

## 🛠️ Instal·lació

Consulta el fitxer [INSTALL.md](docs/INSTALL.md) per a les instruccions detallades de configuració amb Docker.

---
**Integrant**: Iker Delgado  
**Projecte**: Transversal 2n DAW  
**Estat**: 100% Completat i Verificat.
