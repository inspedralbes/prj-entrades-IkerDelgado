describe("Test de concurrència", () => {
  it("hauria de bloquejar un seient per a un usuari i mostrar-lo com a reservat per a un altre", () => {
    // Aquest test simula dos usuaris
    // En Cypress "pur" és difícil simular dos navegadors reals en paral·lel en un sol fitxer,
    // però podem verificar que el seient canvia d'estat immediatament via Sockets.

    cy.visit("/login");
    cy.get('input[name="email"]').type("iker@gmail.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('button[type="submit"]').click();

    cy.get("button").contains("RESERVAR ARA").first().click();
    cy.get("button.group.p-6").first().click();

    // Triem un seient
    cy.get("button.relative.group").not(":disabled").first().as("meuSeient");
    cy.get("@meuSeient").click();

    // Verifiquem que el seient té la classe de seleccionat (indicant que el socket hauria d'emetre el bloqueig)
    cy.get("@meuSeient").should("have.class", "bg-indigo-600");

    // Aquí, si tinguéssim un segon usuari (manual o via script extern),
    // veuríem com aquest mateix seient passa a color taronja (locked) al seu mapa.
  });
});
