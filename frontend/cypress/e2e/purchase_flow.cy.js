describe("Flux de compra complet", () => {
  it("hauria de permetre iniciar sessió, triar esdeveniment i seients, i finalitzar la compra", () => {
    cy.visit("/login");

    // Iniciar sessió
    cy.get('input[name="email"]').type("iker@gmail.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('button[type="submit"]').click();

    // Dashboard
    cy.url().should("include", "/dashboard");
    cy.contains("Pròxims Esdeveniments").should("be.visible");

    // Seleccionar primer esdeveniment
    cy.get("button").contains("RESERVAR ARA").first().click();

    // Detall de l'esdeveniment
    cy.contains("Descripció").should("be.visible");
    cy.get("button").contains("Tria la teva sessió").should("be.visible");
    cy.get("button.group.p-6").first().click(); // Clicar la primera sessió

    // Selecció de seients
    cy.url().should("include", "/seats");
    cy.contains("ESCENARI").should("be.visible");

    // Seleccionar 2 seients
    cy.get("button.relative.group").not(":disabled").first().click();
    cy.get("button.relative.group").not(":disabled").eq(1).click();

    // Comprovar barra de compra
    cy.contains("seients seleccionats").should("be.visible");
    cy.get("button").contains("COMPRAR ARA").click();

    // Checkout
    cy.url().should("include", "/checkout");
    cy.contains("Finalitzar Compra").should("be.visible");
    cy.contains("Dades del Comprador").should("be.visible");

    // Confirmar compra
    cy.get("button").contains("CONFIRMAR COMPRA").click();

    // Missatge d'èxit (alert) i tornada al dashboard
    cy.on("window:alert", (str) => {
      expect(str).to.equal("Compra realitzada amb èxit! Gaudeix del concert.");
    });
    cy.url().should("include", "/dashboard");
  });

  it("no hauria de permetre seleccionar més de 5 seients", () => {
    cy.visit("/dashboard");
    cy.get("button").contains("RESERVAR ARA").first().click();
    cy.get("button.group.p-6").first().click();

    // Intentar clicar 6 seients
    for (let i = 0; i < 6; i++) {
      cy.get("button.relative.group").not(":disabled").eq(i).click();
    }

    cy.on("window:alert", (str) => {
      expect(str).to.equal(
        "Només pots seleccionar un màxim de 5 seients per compra.",
      );
    });
  });
});
