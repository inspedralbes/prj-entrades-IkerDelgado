# Especificació Funcional — Sockets per a Compra d'Entrades en Temps Real

## Resum

Implementar comunicació en temps real via WebSockets (Socket.io) per a la selecció i compra concurrent d'entrades, permetent que múltiples usuaris vegin en directe l'estat dels seients.

---

## Històries d'Usuari

### HU-01: Visualització en temps real dels seients
**Com a** client autenticat,  
**vull** veure l'estat actualitzat dels seients en temps real,  
**per** saber quins estan disponibles, bloquejats o venuts sense refrescar la pàgina.

**Criteris d'acceptació:**
- [ ] Quan un altre usuari bloqueja un seient, el meu navegador mostra el canvi en menys de 1 segon.
- [ ] Quan un seient és comprat, es mostra com "sold" instantàniament per a tots.
- [ ] Quan un bloqueig expira (timeout), el seient torna a "available" per a tots.

### HU-02: Bloqueig temporal de seients
**Com a** client autenticat,  
**vull** que quan selecciono un seient, quedi bloquejat temporalment per a mi,  
**per** tenir temps de completar la compra sense que un altre me'l prengui.

**Criteris d'acceptació:**
- [ ] En seleccionar un seient, es bloqueja durant 5 minuts.
- [ ] El seient bloquejat apareix com "locked" per als altres usuaris (color taronja).
- [ ] Si deselecciono el seient manualment, es desbloqueja immediatament.
- [ ] Si passen 5 minuts sense comprar, el seient es desbloqueja automàticament.
- [ ] Si intento bloquejar un seient ja bloquejat per un altre, rebo un error clar.

### HU-03: Compra confirmada amb notificació en temps real
**Com a** client autenticat,  
**vull** que en completar una compra, tots els usuaris vegin els seients com "venuts" instantàniament,  
**per** evitar que intentin comprar seients que ja estan venuts.

**Criteris d'acceptació:**
- [ ] Després de la compra, l'API publica un event via Redis.
- [ ] El servidor Socket.io rep l'event i el reenvia a tots els clients de la sala.
- [ ] Els seients comprats es mostren com "sold" (gris, no seleccionable).

---

## Comportament Esperat — Events Socket.io

### Events del Client → Servidor

| Event | Payload | Descripció |
|---|---|---|
| `join-session` | `{ sessionId }` | L'usuari entra a la pàgina de seients d'una sessió |
| `leave-session` | `{ sessionId }` | L'usuari surt de la pàgina |
| `lock-seat` | `{ sessionId, seatStatusId, userId }` | L'usuari selecciona un seient → bloqueig temporal |
| `unlock-seat` | `{ sessionId, seatStatusId, userId }` | L'usuari deselecciona un seient → desbloqueig |

### Events del Servidor → Clients (Broadcast a la sala)

| Event | Payload | Descripció |
|---|---|---|
| `seat-locked` | `{ seatStatusId, lockedBy }` | Un seient ha estat bloquejat per un usuari |
| `seat-unlocked` | `{ seatStatusId }` | Un seient ha estat desbloquejat |
| `seat-purchased` | `{ seatStatusIds }` | Seient(s) comprat(s) definitivament |
| `lock-expired` | `{ seatStatusId }` | El bloqueig ha expirat per timeout |
| `lock-error` | `{ seatStatusId, message }` | Error: el seient ja estava bloquejat/venut |

### Events Redis (Laravel → Socket.io)

| Canal | Missatge | Origen |
|---|---|---|
| `seat-updates` | `{ event: "seat-purchased", sessionId, seatIds }` | `PurchaseController` post-compra |

---

## Flux del Sistema

```
┌──────────┐    lock-seat     ┌──────────────┐   POST /lock-seats  ┌──────────┐
│ Client A │ ───────────────► │  Socket.io   │ ──────────────────► │  Laravel  │
│ (React)  │                  │   Server     │                     │   API     │
└──────────┘                  └──────────────┘                     └──────────┘
                                    │                                    │
                               seat-locked                          Redis pub
                                    │                                    │
                                    ▼                                    ▼
                              ┌──────────┐                        ┌──────────┐
                              │ Client B │                        │  Redis   │
                              │ (React)  │ ◄──────────────────────│          │
                              └──────────┘    seat-purchased      └──────────┘
```

---

## Estats del Seient

```
  ┌───────────┐
  │ available │
  └─────┬─────┘
        │ lock-seat
        ▼
  ┌───────────┐  timeout (5min)  ┌───────────┐
  │  locked   │ ───────────────► │ available │
  └─────┬─────┘                  └───────────┘
        │ purchase
        ▼
  ┌───────────┐
  │   sold    │
  └───────────┘
```

---

## Requisits No Funcionals

- **Latència:** Els events han d'arribar als clients en menys d'1 segon.
- **Concurrència:** El sistema ha de gestionar correctament múltiples usuaris simultanis a la mateixa sessió.
- **Resiliència:** Si el servidor de sockets cau i es reinicia, els locks no queden huèrfans gràcies al scheduler de Laravel.
- **Compatibilitat:** Ha de funcionar amb l'stack Docker existent sense canvis a `docker-compose.yml` (excepte variables d'entorn si cal).
