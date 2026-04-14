# Memòria del Projecte: Desenvolupament Guiat per Especificació (SDD)
**Funcionalitat Implementada:** Sockets per a Compra d'Entrades en Temps Real

---

## 1. Explicació de la funcionalitat
La nova funcionalitat introduïda al sistema de reserva de places de l'aplicació permet oferir selecció i bloqueig **en temps real** de les butaques ('Seats') disponibles en una determinada sessió d'esdeveniment (SeatStatus) per garantir concurrència robusta.
Atès que abans existia el problema de 'Race conditions' on diversos clients podien intentar processar reserves de butaques "aparentment" lliures d'una mateixa sala que després col·lidien al moment del checkout de pagament; aquesta solució resol el conflicte establint un canal constant via NodeJS mitjançant **WebSockets (Socket.io)** i notificacions internes via **Redis**.
Quan un client escull una butaca, el servidor envia un senyal 'broadcast' per posar l'àrea local de tots els usuaris que es troben examinant aquest mateix plànol a "reserva" (visualitzat en taronja), bloquejant la selecció concurrent d’operacions mitjançant base de dades i cronometrant un marge temporal màxim de 5 minuts (a menys que el client confirmi i transiti el Ticket al mètode pagament). Tan aviat la compra acaba, el Redis ho intercepta reportant un canvi unànime de butaca a 'Venuda' i finalment gris bloquejada a totes les instàncies mundials.

## 2. Procés seguit amb la IA
Tota la confecció s'ha estructurat guiant un model intel·ligent "AI" mitjançant els estàndards metodològics "Spec-Driven Development". 
- S'han estipulat unes fonamentacions i objectius ferms d'estil i formatatge de codi en una fase Prèvia dissenyant tres arxius fundacionals en la nova sub-estructura de capçalera `specs/` (`foundations.md`, `spec.md`, `plan.md`).
- Posteriorment, proveït del dictat estricte preconfigurat, la Inteligència Artificial ha iniciat amb mi la Fase Tècnica dissenyant autònomament tot l'entorn de Sockets Javascript de Node i Express dins la carpeta secundària externa `socket/index.js`, subscrita al container de Redis existent al fitxer Docker.
- Tot seguit, l'agent Gemini va encadenar mitjançant sub-prompts directes meves la codificació dels endpoints i rutes cap a la REST API de PHP Laravel creant controladors `SeatController@lock` utilitzant els bloquejos manuals LockForUpdate(), assegurant en paral·lel tasques Cron al Backend per buidar 'TimeOuts'.
- Com a culminació del recorregut, havent verificat el cor de peticions que bategaven pels Websockets via Redis, l'IA va connectar el Hook generat amb la interfície d'usuari a les llibreries UI al repositori Frontend on es trobaven el mapeig d'embenats. Tota aquesta successió s'ha emmagatzemat estricte a `docs/prompts-log.md`.

## 3. Principals problemes trobats
La major via d'escapatòria durant el trajecte va tenir un matís basant-se en **l'oblit per part de la intel·ligència del context global connectat de les dependències de codi extenses i micro-gestions a les eines Docker**. Malgrat proveir instruccions per separat, se li ofuscava reconèixer que les comunicacions de ports entre frontend locals (Localhost:5173) i serveis Redis portaven variables diferents empaquetades com ara la crida interna al nom del servei al Docker-Compose com `redis://redis:6379`.  
Així mateix prenent el comandament en la construcció de l'HTML (JSX reactiu), i malgrat encertar bastant en les configuracions inicials l'Agent obvià desactivar el Event-Listener amb el típic mètode Clean-Up com `socket.off()` dins de l'arquitectura d'un React-Hook, la qual cosa podia produir un petit col·lapse intern als clients en canviar massivament de rutes si les finestres es duplicaven.

## 4. Decisions preses (canvis en prompts o spec)
L'especificació fundacional va demostrar ésser perfectament robusta, la decisió inicial de prendre'm temps redactant els comportaments, restriccions, glosaris d'entitats i models esperats i transicions en fase a l'`spec.md` m'ha deslliurat per complet de refer qualsevol full de ruta, les característiques d'inici havien sigut ben encertades. Al haver elaborat diagrames previs, l'únic que he necessitat re-modular han estat **petites pinzellades concretes en les ordres textuals als Prompts de resolució i refinament de problemes**. En compte de deixar que intentès inferir el següent pas li atorgava un ordre estricte que el reconduïa recordant els detalls de la capa anterior.

## 5. Valoració crítica real
Operar integrant intel·ligència prenent les regnes directives d'una especificació formal ha suposat una eina totalment constructiva redefinint la manera tradicional que solíem escriure línies descarades per "trial and error". 
La visió de construir directrius tècniques concretes abans que permetre i empènyer un Agent LLM en modus de 'Vibe Coding' lliure (on improvisa amb suposicions sobre estructures inestables que descontrolar de seguida generant deute actiu al llarg d'escalar arquitectures), possibilita reajustar aquesta IA a ser una executadora hiper-eficient del full de ruta creat sencerament pel cervell dissenyador Humà. Això minimitza dramàticament desajustos i ens fa actuar exclusivament com a Caps d'Arquitectura limitant-nos a fer anàlisis de codi més net. Tanmateix, exigeix domini en entendre en tot moment amb màxim detall on ens trobem i quina és l'abstracció esperada de dalt a baix abans, inclús, de requerir cap ajuda a la màquina.
