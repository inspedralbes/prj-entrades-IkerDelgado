# Foundations — Compra d'Entrades en Temps Real amb Sockets

## Contexte del Projecte

**Projecte:** Sistema de venda d'entrades per a esdeveniments (concerts).  
**Stack tecnològic:**
- **Backend:** Laravel 11 (PHP) amb Sanctum per autenticació
- **Frontend:** React + TypeScript (Vite)
- **Base de dades:** MySQL 8.0
- **Servidor de sockets:** Node.js amb Socket.io
- **Comunicació inter-serveis:** Redis (pub/sub)
- **Contenidors:** Docker Compose

### Estat Actual

El sistema permet als usuaris:
- Registrar-se i iniciar sessió
- Veure esdeveniments i sessions disponibles
- Seleccionar seients i comprar entrades

**Problema identificat:** La selecció i compra de seients és completament estàtica. Quan múltiples usuaris accedeixen simultàniament a la mateixa sessió, no tenen visibilitat sobre les accions dels altres. Això genera:
- **Race conditions:** Dos usuaris poden intentar comprar el mateix seient.
- **Experiència d'usuari pobre:** No hi ha feedback en temps real.
- **Frustració:** L'usuari descobreix que el seient "disponible" ja no ho és només al moment de la compra.

## Objectius

1. **Sincronització en temps real:** Tots els usuaris d'una mateixa sessió veuen els canvis d'estat dels seients instantàniament.
2. **Bloqueig temporal:** Quan un usuari selecciona un seient, aquest queda bloquejat temporalment (5 min) per evitar conflictes.
3. **Feedback visual immediat:** Diferenciar visualment entre seients disponibles, bloquejats per altres usuaris, i venuts.
4. **Robustesa:** Gestionar desconnexions, timeouts i race conditions.

## Restriccions Tècniques

- **Infraestructura existent:** S'ha d'usar l'stack actual (Laravel + React + Docker). No es pot canviar el framework.
- **Redis obligatori:** El `docker-compose.yml` ja configura Redis com a puente entre Laravel i Socket.io. S'ha d'usar per a la comunicació entre serveis.
- **Servei de sockets existent:** El directori `socket/` ja existeix amb Socket.io i Redis com a dependències al `package.json`. Cal implementar-lo, no crear-lo de zero.
- **Model de dades:** El model `SeatStatus` ja té el camp `locked_at` preparat per a bloqueig temporal.
- **Compatibilitat:** El frontend ja té `VITE_SOCKET_URL` definit a l'entorn.

## Actors

| Actor | Rol |
|---|---|
| Client autenticat | Selecciona i compra seients |
| Admin | Gestiona esdeveniments i sessions |
| Servidor Socket.io | Gestiona la comunicació en temps real entre clients |
| Redis | Canal de comunicació entre Laravel i Socket.io |
| Laravel API | Gestiona la lògica de negoci (compra, bloqueig) |

## Glossari

- **Sessió:** Una data/hora concreta d'un esdeveniment (un concert pot tenir múltiples sessions).
- **Seient (Seat):** Butaca física amb fila i número.
- **SeatStatus:** Estat d'un seient per a una sessió concreta (available, locked, sold).
- **Lock/Bloqueig:** Reserva temporal d'un seient mentre l'usuari decideix si el compra.
- **Room/Sala:** Agrupació de connexions Socket.io per sessió (tots els usuaris mirant la mateixa sessió estan a la mateixa sala).
