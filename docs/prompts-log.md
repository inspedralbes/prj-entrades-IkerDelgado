# Prompts Log — Compra d'Entrades en Temps Real amb Sockets

> **Funcionalitat:** Sistema de compra de entrades amb sockets en temps real (Socket.io + Redis)  
> **Eines utilitzades:** Gemini CLI (agent), Antigravity (especificació)  
> **Data inici:** 2026-04-02

---

## Fase 0: Definició i Planificació

### Prompt #1 — Consulta inicial de viabilitat (Antigravity)
**Prompt:**
```
He de fer aquests punts per al projecte perquè m'avaluïn, què opines de que m'implementin sockets en la compra d'entrades massiva? [es va adjuntar la rúbrica completa del professor]
```
**Acció:** L'agent va validar la feature com a viable i d'alt valor per a l'entrega final.

---

### Prompt #2 — Sol·licitud de pla d'implementació (Gemini CLI)
**Prompt:**
```
necesito que me hagas un plan de implementacion de socket masivo para la hora de comprar entradas para el concierto que quiera ir, primero de todo no se ven los asientos, quiero que se vean, tambien si el cliente selecciona 2 asientos hasta que no pase a la ventana siguiente de compra no pasaria nada, cuando lo haga saldrá como ocupado, y los demás usaurios no podran escogerlo, entonces la gracia es que no haya follón en los sockets y que cada usuario compre entradas disponibles para lo que hay, la comunciacion socket de ha de hacer en la carpeta de /socket utilizando socket.io, okay? hazme un plan de implementacion de momento y tambien testing
```
**Acció:** Es va dissenyar un pla en 4 fases (Correcció d'asientos, Servidor Socket, Lògica Laravel i Integració Frontend).

---

## Fase 1: Implementació de la Base

### Prompt #3 — Implementació del servidor Socket.io
**Prompt:**
```
Lee los ficheros specs/foundations.md, specs/spec.md y specs/plan.md. Siguiendo la Fase 2 del plan (Servidor de Sockets), implementa el servidor Socket.io completo en socket/index.js. Debe:
1. Crear servidor HTTP con Express y Socket.io con CORS
2. Suscribirse al canal Redis "seat-updates" 
3. Gestionar rooms por session_id
4. Manejar los eventos del cliente: join-session, lock-seat, unlock-seat
5. Broadcast de eventos: seat-locked, seat-unlocked, seat-purchased, lock-expired
6. Auto-desbloqueo por timeout de 5 minutos
Usa las dependencias que ya están en package.json (socket.io, redis).
```
**Acció:** Es va programar `socket/index.js` amb Node.js natiu i integració amb Redis.

---

### Prompt #4 — Finestra de Checkout i Lògica de Bloqueig
**Prompt:**
```
si, tambien se habria de hacer una nueva ventana despues de seleccionar el asiento donde se pongan los datos de compra aunque sean inventados, ahi se indicará el tiempo que le queda para qeu compre la entrada, si no lo hace le devolverá al menu principal, durante ese rato esos asientos saldrán como reservados, entiendes?
```
**Acció:** Implementació de `lock/unlock` a Laravel, comando de neteja programat a Artisan i creació de `CheckoutPage.tsx` amb temporitzador.

---

## Fase 2: Correcció d'Errors i Millores

### Prompt #5 — Error de dependència socket.io-client
**Prompt:**
```
me da este error de que no pilla el socket.io-client en el contenedor de frontend, cuando lo he instalado
```
**Acció:** Instal·lació de la llibreria directament dins del contenidor Docker i reinici de Vite per sincronitzar els mòduls.

---

### Prompt #6 — Problema de desconnexió al navegar
**Prompt:**
```
he probado si van los sockets y no van ya que cuando pillo los asientos y cambio de ventana a la de compra se me desconecta de la sala cuando deberia seguir siguiendo ahi, mira Connected to socket for session: 1 useSocket.ts:24 Disconnected from socket for session: 1
```
**Acció:** Refactorització estructural del frontend creant `SocketContext.tsx` per mantenir la connexió persistent a tota l'aplicació.

---

### Prompt #7 — Error de sincronització Redis (Prefixes de Laravel)
**Prompt:**
```
siguen sir ir bien los sockets, el estado del asiento siempre sale como disponible, solo se deshabilita cuando recargo pantalla, la idea es qeu una vez el cliente vaya a la ventana de compra esos asientos saldrán como reservados, y si los compra como ocupados o no disponibles
```
**Acció:** S'ha detectat i eliminat el prefix automàtic de Redis a `api/config/database.php` i s'ha configurat broadcast immediat des del servidor de sockets.

---

### Prompt #8 — Millora visual d'estats (Color taronja per a reservats)
**Prompt:**
```
vale, ya va mas o menos, solo que el front no refleja bien los cambios que hay del socket, ya que estoy en la ventana de compra de entradas y en el otro usuario esos asientos no me deja seleccionarlos pero no salen marcados de otro color
```
**Acció:** S'han afegit els estils CSS (`bg-orange-500`) a `SeatSelection.tsx` per diferenciar visualment els seients reservats pels altres.

---

### Prompt #9 — Sol·licitud de registre complet
**Prompt:**
```
vale, ya va mas o menos, todos los prompts que te he ido mandando ponlo en prompts-logs de /docs porfa para ver cuantos prompts han hecho falta para que se haga la funcionalidad
```
**Acció:** Actualització del log amb totes les iteracions realitzades fins al moment.

---

## Resum d'Iteracions

| # | Tipus | Eina | Resultat | Descripció |
|---|---|---|---|---|
| 1 | Disseny | Antigravity | ✅ | Validació de la idea |
| 2 | Pla | Gemini CLI | ✅ | Full de ruta detallat |
| 3 | Sockets | Gemini CLI | ✅ | Servidor Node.js base |
| 4 | Backend | Gemini CLI | ✅ | Lògica de bloqueig i Checkout |
| 5 | Docker | Gemini CLI | ✅ | Fix de dependències al contenidor |
| 6 | Frontend | Gemini CLI | ✅ | Persistència amb SocketContext |
| 7 | Backend | Gemini CLI | ✅ | Fix de canals Redis (Prefixes) |
| 8 | UI/UX | Gemini CLI | ✅ | Feedback visual d'asientos reservats |

**Total de prompts:** 8 interaccions principals (més 2 de manteniment del log) per a la funcionalitat completa.
