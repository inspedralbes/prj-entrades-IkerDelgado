# Anàlisi del Resultat — Ús de la IA amb Desenvolupament Guiat per Especificació

> **Funcionalitat:** Compra d'entrades en temps real amb Sockets (Socket.io + Redis)  
> **Eines:** Gemini CLI (implementació), Antigravity (especificació)

---

## 1. L'agent ha seguit realment l'especificació?

<!-- 
Reflexiona sobre si la IA ha seguit les specs que vas definir a specs/spec.md.
Preguntes guia:
- Ha implementat tots els events definits (join-session, lock-seat, unlock-seat, seat-purchased)?
- Ha respectat els criteris d'acceptació de les històries d'usuari?
- Ha seguit l'ordre de fases del plan.md o ha anat per lliure?
-->

[La teva reflexió aquí]

---

## 2. Quantes iteracions han estat necessàries?

<!-- 
Usa la taula de docs/prompts-log.md per respondre.
- Quants prompts has fet servir en total?
- Quants eren de generació inicial vs correccions?
- Hi ha hagut algun pas que ha necessitat 3+ intents?
-->

[La teva reflexió aquí]

---

## 3. On falla més la IA?

<!-- 
Identifica els patrons d'error. Exemples comuns:
- Interpretació: No entén bé què vols?
- Execució: Genera codi amb bugs?
- Coherència: Canvia d'enfocament entre iteracions?
- Context: Oblida canvis anteriors?
- Configuració: Errors de CORS, Redis, Docker?
-->

[La teva reflexió aquí]

---

## 4. Has hagut de modificar l'especificació o només els prompts?

<!-- 
Diferencia entre:
- Canvis a specs/spec.md → Vol dir que l'spec original no era prou clara
- Canvis als prompts → Vol dir que la IA no interpretava bé l'spec
- Canvis a plan.md → Vol dir que l'estratègia tècnica necessitava ajustos
-->

[La teva reflexió aquí]

---

## 5. Valoració crítica

<!-- 
Sigues honest. El professor valora les reflexions reals, no les superficials.
- Creus que la IA és útil per a aquest tipus de tasca?
- Què hauries fet diferent si haguessis de repetir el procés?
- Quina és la part més difícil de treballar amb IA guiada per spec?
-->

[La teva reflexió aquí]
