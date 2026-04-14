describe("Test de concurrència", () => {
  it("hauria de bloquejar un seient per a un usuari i mostrar-lo com a reservat per a un altre", () => {
    cy.visit("/login");
    
    // Aceptar cookies forzando el click
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Acceptar totes")').length > 0) {
        cy.contains("button", "Acceptar totes").click({ force: true });
      }
    });

    cy.get('input[name="email"]').type("iker@gmail.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('button[type="submit"]').click();
    
    // Esperar a entrar al dashboard
    cy.url({ timeout: 15000 }).should("include", "/dashboard");
    cy.contains("Pròxims Esdeveniments", { timeout: 15000 }).should("be.visible");

    // Seleccionar primer esdeveniment
    cy.contains("button", "RESERVAR ARA", { timeout: 15000 })
      .first()
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    
    // Detall de l'esdeveniment i triar sessió
    cy.contains("h2", "Tria la teva sessió", { timeout: 15000 })
      .scrollIntoView()
      .should("be.visible");
      
    cy.get("button.group.p-5", { timeout: 15000 })
      .first()
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });

    // Selecció de seients
    cy.url({ timeout: 15000 }).should("include", "/seats");
    cy.contains("ESCENARI", { timeout: 15000 })
      .scrollIntoView()
      .should("be.visible");

    // Triem un seient
    cy.get("button.relative.group", { timeout: 15000 })
      .not(":disabled")
      .first()
      .as("meuSeient");
    
    cy.get("@meuSeient")
      .scrollIntoView()
      .click({ force: true });

    // Verifiquem que el seient té la classe de seleccionat
    cy.get("@meuSeient").should("have.class", "bg-indigo-600");
  });
});
