# Diagrames del Projecte - TicketHub

Aquest document conté la representació visual de la lògica del sistema.

## 1. Diagrama de Casos d'Ús
Defineix les accions que poden realitzar els diferents actors del sistema.

```mermaid
useCaseDiagram
    actor Client
    actor Admin
    
    package TicketHub {
        usecase "Iniciar Sessió / Registre" as Login
        usecase "Veure Esdeveniments" as ViewEvents
        usecase "Seleccionar Seients (Real-time)" as SelectSeats
        usecase "Finalitzar Compra" as Checkout
        usecase "Consultar les meves entrades" as MyTickets
        
        usecase "Gestionar Esdeveniments i Sessions" as ManageEvents
        usecase "Gestionar Usuaris" as ManageUsers
        usecase "Consultar Informes de Vendes" as Reports
    }
    
    Client --> Login
    Client --> ViewEvents
    Client --> SelectSeats
    Client --> Checkout
    Client --> MyTickets
    
    Admin --> Login
    Admin --> ManageEvents
    Admin --> ManageUsers
    Admin --> Reports
```

## 2. Diagrama de Seqüència (Reserva amb Sockets)
Mostra la interacció en temps real quan un usuari bloqueja un seient.

```mermaid
sequenceDiagram
    participant U1 as Usuari A (Client)
    participant F as Frontend (React)
    participant S as Servidor Socket.io
    participant L as API Laravel
    participant R as Redis
    participant U2 as Usuari B (Altres Clients)

    U1->>F: Clica sobre seient disponible
    F->>L: POST /api/seats/lock
    L->>L: Valida disponibilitat i límit (5)
    L->>R: PUBLISH 'seat-updates' {locked}
    L-->>F: 200 OK (Bloquejat)
    
    R->>S: Rep missatge de Redis
    S->>U2: EMIT 'seat-locked' (Broadcast room)
    Note over U2: El seient canvia a taronja a la seva pantalla
    
    F->>F: Inicia temporitzador 5 minuts
    
    Note over U1, U2: Després de 5 minuts sense pagar...
    S->>U1: EMIT 'lock-expired'
    S->>U2: EMIT 'seat-unlocked' (Broadcast)
```

## 3. Diagrama Entitat-Relació (ER)
Estructura de la base de dades.

```mermaid
erDiagram
    USER ||--o{ SEAT_STATUS : "reserva/compra"
    EVENT ||--o{ EVENT_SESSION : "té"
    EVENT_SESSION ||--o{ SEAT_STATUS : "té"
    SEAT ||--o{ SEAT_STATUS : "estat en sessió"
    
    USER {
        string name
        string email
        string password
        string role
    }
    
    EVENT {
        string title
        string artist
        text description
        string image
    }
    
    EVENT_SESSION {
        datetime date_time
        string venue
    }
    
    SEAT {
        string row
        integer number
        decimal price
    }
    
    SEAT_STATUS {
        enum status
        timestamp locked_at
    }
```
