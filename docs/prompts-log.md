# Prompts Log — Compra d'Entrades en Temps Real amb Sockets

> **Funcionalitat:** Sistema de compra de entrades amb sockets en temps real (Socket.io + Redis)  
> **Eines utilitzades:** Gemini CLI (agent), Antigravity (especificació)  
> **Data inici:** 2026-04-02

---

## Fase 0: Definició de la Funcionalitat (Especificació)

### Prompt #1 — Consulta inicial sobre la viabilitat de la feature

**Data:** 2026-04-02 15:10  
**Eina:** Antigravity  
**Prompt:**

```
He de fer aquests punts per al projecte perquè m'avaluïn, què opines de que m'implementin sockets en la compra d'entrades massiva? [es va adjuntar la rúbrica completa del professor]
```

**Resposta resumida:**  
L'agent va analitzar el projecte complet (estructura de fitxers, docker-compose.yml, PurchaseController, SeatSelection.tsx, model SeatStatus) i va confirmar que era una **feature excel·lent** perquè:

- La infraestructura ja estava preparada (Redis, servei socket buit, VITE_SOCKET_URL)
- El model SeatStatus ja tenia `locked_at` preparat
- Tocava tots els nivells (frontend, backend, socket server)

**Resultat:** ✅ Es va confirmar la feature com a adequada per a l'exercici SDD.

---

### Prompt #2 — Sol·licitud de pla d'implementació a Gemini CLI

**Data:** 2026-04-02 15:14  
**Eina:** Gemini CLI  
**Prompt:**

```
Este es el plan de implementación para el sistema de compra de entradas en tiempo real utilizando Socket.io y Redis
  para la comunicación entre el backend (Laravel) y el servidor de sockets.

  1. Plan de Implementación Técnica

  Fase 1: Corrección de Visualización (Backend & Frontend)
   * Backend: Corregir la validación en SeatController para que use la tabla event_sessions en lugar de sessions (esto
     ya lo he arreglado para que los asientos se carguen correctamente).
   * Frontend: Asegurar que SeatSelection.tsx renderice correctamente los estados:
       * available: Azul/Gris (seleccionable).
       * locked: Naranja/Gris oscuro (no seleccionable, bloqueado temporalmente).
       * sold: Gris (no seleccionable, ya vendido).

  Fase 2: Servidor de Sockets (/socket/index.js)
   * Implementar un servidor con Express, Socket.io y un suscriptor de Redis.
   * Salas (Rooms): Los usuarios se unirán a una sala basada en el ID de la sesión (session_123) al entrar en la página
     de asientos.
   * Suscripción Redis: Escuchar el canal seats_updated enviado por Laravel.
   * Broadcast: Cuando llegue un mensaje de Redis, el servidor de sockets emitirá un evento a todos los usuarios de esa
     sala específica para actualizar el estado de los asientos en sus pantallas.

  Fase 3: Lógica de Bloqueo (Laravel API)
   * Crear un nuevo endpoint POST /api/lock-seats:
       * Verifica disponibilidad de los asientos.
       * Cambia el estado a locked y guarda el user_id y locked_at.
       * Publica en Redis un mensaje con los IDs de los asientos bloqueados y el ID de la sesión.
   * Limpieza Automática: Crear un comando de Laravel (seats:unlock-expired) que se ejecute cada minuto para liberar
     asientos que lleven bloqueados más de 5 minutos sin completar la compra.

  Fase 4: Integración Frontend
   * Conectar con el servidor de sockets al cargar SeatSelection.
   * Escuchar el evento seats_updated.
   * Actualizar el estado local de seats para que los iconos de Armchair cambien de color inmediatamente para todos los
     usuarios.

  ---

  2. Plan de Testing

  Pruebas de Integración (Backend)
   * Test de Bloqueo: Simular una petición a /api/lock-seats y verificar que el estado en la base de datos cambia a
     locked.
   * Test de Conflicto: Verificar que si dos usuarios intentan bloquear el mismo asiento a la vez, el sistema devuelve
     un error 422 al segundo usuario.

  Pruebas de Sockets (Manual/Automatizado)
   * Prueba de Multi-ventana: Abrir la aplicación en dos navegadores diferentes.
   * Acción: Seleccionar asientos en el Navegador A y pasar al siguiente paso de compra.
   * Resultado esperado: El Navegador B debe ver esos asientos como "Ocupados/Bloqueados" instantáneamente sin
     refrescar la página.

  Pruebas de Estrés (Race Conditions)
   * Utilizar un script para enviar 10 peticiones simultáneas de bloqueo para el mismo asiento y confirmar que solo una
     tiene éxito.
```

**Resposta resumida:**  
Gemini va generar un pla en 4 fases:

1. Correcció de Visualització (Backend & Frontend)
2. Servidor de Sockets (socket/index.js)
3. Lògica de Bloqueig (Laravel API amb POST /api/lock-seats)
4. Integració Frontend

Inclou pla de testing amb proves d'integració, multi-ventana i stress test.

**Resultat:** ✅ Es va aprovar el pla per a implementació.

---

## Fase 1: Implementació amb IA

### Prompt #3 — [Implementació del servidor de sockets]

**Data:** 2026-04-02 HH:MM  
**Eina:** Gemini CLI  
**Prompt:**

```
Lee los ficheros specs/foundations.md, specs/spec.md y specs/plan.md.
Siguiendo la Fase 2 del plan (Servidor de Sockets), implementa el servidor Socket.io
completo en socket/index.js. Debe:
1. Crear servidor HTTP con Express y Socket.io con CORS
2. Suscribirse al canal Redis "seat-updates"
3. Gestionar rooms por session_id
4. Manejar los eventos del cliente: join-session, lock-seat, unlock-seat
5. Broadcast de eventos: seat-locked, seat-unlocked, seat-purchased, lock-expired
6. Auto-desbloqueo por timeout de 5 minutos
Usa las dependencias que ya están en package.json (socket.io, redis).

```

**Resposta resumida:**  
He completado la implementación del servidor de sockets en socket/index.js siguiendo la Fase 2 del plan.

Características implementadas:

1.  Servidor HTTP nativo: Utiliza el módulo http de Node.js para evitar dependencias externas adicionales, con
    soporte CORS abierto para el frontend.
2.  Integración con Redis:
    - Suscriptor: Escucha el canal seat-updates para recibir notificaciones desde Laravel (compras, expiraciones
      globales, etc.).
    - Forwarding: Los mensajes recibidos de Redis se reenvían automáticamente a la "room" de la sesión
      correspondiente.
3.  Gestión de Rooms: Los clientes se unen a salas específicas usando join-session enviando el sessionId.
4.  Lógica de Bloqueo en Tiempo Real:
    - lock-seat: Emite seat-locked al resto de la sala y activa un temporizador de 5 minutos.
    - unlock-seat: Emite seat-unlocked y limpia el temporizador.
    - Auto-desbloqueo: Si pasan 5 minutos sin compra, emite lock-expired.

**Errors detectats:**

- [Error 1: descriu l'error]
- [Error 2: descriu l'error]

**Resultat:** ✅/❌ [Va funcionar a la primera o va caler corregir?]

---

### Prompt #4 — [Següent pas o correcció]

**Data:** 2026-04-02 HH:MM  
**Eina:** Gemini CLI  
**Prompt:**

```
[COPIA EL PROMPT]
```

**Resposta resumida:**  
[Què va fer]

**Relació problema → canvi en el prompt:**  
[Si vas canviar el prompt per corregir un error anterior, explica per què]

**Resultat:** ✅/❌

---

<!--
PLANTILLA PER A NOUS PROMPTS (copia i enganxa per cada iteració):

### Prompt #N — [Títol descriptiu]
**Data:** YYYY-MM-DD HH:MM
**Eina:** Gemini CLI / Antigravity
**Prompt:**
```
[Prompt exacte]
```

**Resposta resumida:**
[Què va fer l'agent]

**Errors detectats:**
- [Error 1]

**Relació problema → canvi en el prompt:**
[Explicació]

**Resultat:** ✅/❌
-->

---

## Resum d'Iteracions

| #   | Tipus         | Eina        | Resultat | Observacions                   |
| --- | ------------- | ----------- | -------- | ------------------------------ |
| 1   | Especificació | Antigravity | ✅       | Validació de la feature        |
| 2   | Planificació  | Gemini CLI  | ✅       | Pla d'implementació en 4 fases |
| 3   | Implementació | Gemini CLI  | ⏳       | Pendent                        |
| ... | ...           | ...         | ...      | ...                            |
