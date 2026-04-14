# Anàlisi del Resultat — Ús de la IA amb Desenvolupament Guiat per Especificació

> **Funcionalitat:** Compra d'entrades en temps real amb Sockets (Socket.io + Redis)  
> **Eines:** Gemini CLI (implementació), Antigravity (especificació)

---

## 1. L'agent ha seguit realment l'especificació?

# Anàlisi del Resultat — Ús de la IA amb Desenvolupament Guiat per Especificació

> **Funcionalitat:** Compra d'entrades en temps real amb Sockets (Socket.io + Redis)  
> **Eines:** Gemini CLI (implementació), Antigravity (especificació)

---

## 1. L'agent ha seguit realment l'especificació?

Sí, l'agent ha seguit fidelment les especificacions tècniques dissenyades sota els fitxers arrel dictats a l'inici.  
Ha construït tot el servidor de Node.js atenent als "esdeveniments programats dictats a l'especificació" com `join-session`, `seat-locked` i la connexió automàtica de les pub-sub rooms de Socket.io. Les pautes del frontend imposades en la memòria, per identificar clarament colors taronges, o grisos i botons deshabilitats per no ocasionar errors entre multitasques de venedors al client, també han estat acatades minuciosament a mesura que s'aprofundia als diferents fitxers implicats (React, Laravel i Sockets NodeJS).

---

## 2. Quantes iteracions han estat necessàries?

En global s'han requerit un voltant de unes 6-7 respostes i iteracions completament desglossades al fitxer `prompts-log.md`.
Les iteracions inclouen 2 inicials de Planificació formal per estipular de cap a peus què havia de donar el mètode OpenSpec. Subseqüentment, les iteracions implementatives de la IA de codificació mitjançant el CLI de Gemini s'han estirat en 4 parts príncipals del Backend/Frontend, culminant amb alguna reflexió mínima on m'ha sigut necessari incidir amb lleus recordatoris formals sobre on eren importats els mètodes globals.

---

## 3. On falla més la IA?

Certament l'intel·ligència artificial mostra signes generalistes de debilitat respectant l'enorme cascada i interconnexió d'objectes prefabricats del meu codi antic. Dins l'apartat de **l'anàlisi de coherència global o context global** en un repo exten, la IA pot pecar de reinventar funcions i de trencar alguna sintaxi o import pre-connectat on oblida el que ha fet fases enrere, per tant he hagut d'actuar en qualitat de Cap d'Enginyeria monitorant l''oversight', guiant que fés netejes escrupuloses com el recurs de `socket.off('...')` utilitzats per l'event listener, assegurant que no causava fuites de rendiment en loop durant el react render cycle.

---

## 4. Has hagut de modificar l'especificació o només els prompts?

No m'ha fet falta refer ni resoldre l'especificació en sí; atès que les bases documentals de comportament (`foundations.md`, `plan.md` , `spec.md`) eren suficientment clares i consistents des de l'inici, dissenyades previ a codificar ni escriure cap línia al codi central.
Més aviat, les variacions de decisions i el pivotatge cap als encerts només s'ha portat localment alterant i dirigint en "Els Prompts" d'implementadors concrets; reforçant o exigint al llarg de l'execució com l'agent havia d'acoblar tot previament estipulat dins els paràmetres locals actualitzats de l'aplicació.

---

## 5. Valoració crítica

Aplicar metodologies Spec-Driven Development (SDD) per guiar agents LLM obre les portes a reestructura la nostra intervenció com i en tant que enginyers de codi tradicionals a passar completament a ser integradors holístics, dissenyadors arquitectes i directors de planificació de Software. 
Mentre l'enfocament general (per exemple simple "vibe coding") acostuma a resultar un desastre per crear projectes estables perquè l’agent desconeix del passat i pren suposicions de manera erràtica creant deute tecno-lògic massiu, el SDD converteix a la IA en una executora incansable que es cenyeix estrictament a una estructura robusta predissenyada, mitigant completament el risc de derives fatals i desajustos en l'aplicació. Com gènesi i procediment educatiu considero altament important adquirir competències per modelar entorns des de "Dalt" que codificar d’arrel "baixa". L'habilitat primària s'ha transferit irremeiablement de "saber com fer codi" a "saber com expressar la precisió, l'abstracció i la funcionalitat esperada" com a recurs inavaluable en l'estàndard formatiu global del segle XXI.
