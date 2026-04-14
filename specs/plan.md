# Pla d'Implementació — Sockets per a Compra d'Entrades en Temps Real

## Estratègia General

La implementació segueix un ordre de dependències: primer el servidor de sockets (base), després la integració backend (Laravel → Redis), i finalment la integració frontend (React → Socket.io-client).

---

## Fase 1: Correcció de Visualització (Backend & Frontend)

**Objectiu:** Assegurar que els seients es carreguen i mostren correctament abans d'afegir temps real.

### Tasques
1. **Backend** — Verificar que `SeatController` usa `event_sessions` i no `sessions` a la validació.
2. **Frontend** — Assegurar que `SeatSelection.tsx` renderitza correctament els 3 estats: `available` (blau), `locked` (taronja), `sold` (gris).

### Fitxers afectats
- `api/app/Http/Controllers/Api/SeatController.php`
- `frontend/src/pages/client/SeatSelection.tsx`

---

## Fase 2: Servidor de Sockets (`socket/index.js`)

**Objectiu:** Implementar el servidor Socket.io amb Redis pub/sub.

### Tasques
1. Crear servidor HTTP amb Express + Socket.io
2. Configurar CORS per permetre connexions des del frontend
3. Implementar sistema de sales (rooms) per sessió
4. Gestionar events del client: `join-session`, `lock-seat`, `unlock-seat`, `leave-session`
5. Subscriure al canal Redis `seat-updates` per events de Laravel
6. Broadcast d'events: `seat-locked`, `seat-unlocked`, `seat-purchased`, `lock-expired`
7. Implementar timeout de 5 minuts per locks amb `setTimeout`

### Fitxers afectats
- `socket/index.js` (reescriure completament)
- `socket/package.json` (afegir `express` si cal)

### Dependències
- `socket.io` ✅ (ja instal·lat)
- `redis` ✅ (ja instal·lat)

---

## Fase 3: Lògica de Bloqueig (Laravel API)

**Objectiu:** Crear endpoint de bloqueig i publicar events a Redis.

### Tasques
1. Crear endpoint `POST /api/lock-seats` per reservar seients temporalment
2. Modificar `PurchaseController.php` per publicar a Redis després de la compra
3. Crear comanda `seats:unlock-expired` per netejar locks caducats (> 5 min)
4. Registrar la comanda al scheduler de Laravel (cada minut)

### Fitxers afectats
- `api/routes/api.php` (nova ruta)
- `api/app/Http/Controllers/Api/PurchaseController.php` (afegir Redis::publish)
- `api/app/Http/Controllers/Api/SeatController.php` (opcional: filtrar locked)
- `api/app/Console/Commands/UnlockExpiredSeats.php` (NOU)
- `api/app/Console/Kernel.php` (registrar scheduler)

### Dependències noves
- `predis/predis` o extensió `phpredis` per Laravel (verificar configuració)

---

## Fase 4: Integració Frontend

**Objectiu:** Connectar el frontend als sockets i mostrar actualitzacions en temps real.

### Tasques
1. Instal·lar `socket.io-client` al projecte frontend
2. Crear hook `useSocket.ts` per gestionar la connexió
3. Modificar `SeatSelection.tsx`:
   - Connectar al socket en `useEffect`
   - Emetre `join-session` al carregar
   - Emetre `lock-seat` / `unlock-seat` en seleccionar/deseleccionar
   - Escoltar events i actualitzar l'estat dels seients
   - Mostrar seients bloquejats per altres amb estil taronja
4. Cleanup: desconnectar socket al desmuntar component

### Fitxers afectats
- `frontend/package.json` (nova dependència)
- `frontend/src/hooks/useSocket.ts` (NOU)
- `frontend/src/pages/client/SeatSelection.tsx` (modificar)

### Dependències noves
- `socket.io-client`

---

## Ordre d'Execució

```
Fase 1 ─► Fase 2 ─► Fase 3 ─► Fase 4
 (fixes)   (socket)  (Laravel)  (React)
```

Cada fase es valida individualment abans de passar a la següent.

---

## Riscos Identificats

| Risc | Probabilitat | Impacte | Mitigació |
|---|---|---|---|
| Race condition al bloquejar | Alta | Alt | `lockForUpdate()` a Laravel |
| Socket server cau i locks queden | Mitjana | Alt | Scheduler Laravel neteja locks cada minut |
| CORS errors entre frontend i socket | Alta | Mitjà | Configurar origins correctament |
| Redis no connecta entre contenidors | Baixa | Alt | Ja configurat a docker-compose.yml |
