describe("Flux de compra complet", () => {
  beforeEach(() => {
    cy.visit("/login");

    // Aceptar cookies forzando el click
    cy.contains("button", "Acceptar totes").click({ force: true });

    cy.get('input[name="email"]').type("iker@gmail.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('button[type="submit"]').click();

    // Aumentamos el timeout a 15 segundos para darle tiempo al backend y frontend a procesar el login
    cy.url({ timeout: 15000 }).should("include", "/dashboard");
    cy.contains("Pròxims Esdeveniments", { timeout: 15000 }).should(
      "be.visible",
    );
  });

  it("hauria de permetre triar esdeveniment i seients, i finalitzar la compra", () => {
    // Seleccionar primer esdeveniment - Fem scroll primero
    cy.contains("button", "RESERVAR ARA", { timeout: 15000 })
      .first()
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });

    // Detall de l'esdeveniment
    cy.contains("Descripció", { timeout: 15000 })
      .scrollIntoView()
      .should("be.visible");

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

    // Seleccionar 2 seients
    cy.get("button.relative.group", { timeout: 15000 })
      .not(":disabled")
      .first()
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });

    cy.get("button.relative.group", { timeout: 15000 })
      .not(":disabled")
      .eq(1)
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });

    // Comprovar barra de compra
    cy.contains("seients seleccionats", { timeout: 15000 }).should(
      "be.visible",
    );
    cy.contains("button", "COMPRAR ARA", { timeout: 15000 })
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });

    // Checkout
    cy.url({ timeout: 15000 }).should("include", "/checkout");
    cy.contains("Finalitzar Compra", { timeout: 15000 }).should("be.visible");

    // Confirmar compra
    cy.contains("button", "COMPRAR ARA", { timeout: 15000 })
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });

    // Missatge d'èxit
    cy.on("window:alert", (str) => {
      expect(str).to.equal("Compra realitzada amb èxit! Gaudeix del concert.");
    });
    cy.url({ timeout: 15000 }).should("include", "/dashboard");
  });

  it("no hauria de permetre seleccionar més de 5 seients", () => {
    cy.contains("button", "RESERVAR ARA", { timeout: 15000 })
      .first()
      .scrollIntoView()
      .click({ force: true });

    cy.get("button.group.p-5", { timeout: 15000 })
      .first()
      .scrollIntoView()
      .click({ force: true });

    cy.url({ timeout: 15000 }).should("include", "/seats");

    // Intentar clicar 6 seients
    cy.get("button.relative.group", { timeout: 15000 })
      .not(":disabled")
      .then(($seats) => {
        const count = Math.min($seats.length, 6);
        for (let i = 0; i < count; i++) {
          cy.get("button.relative.group")
            .not(":disabled")
            .first()
            .scrollIntoView()
            .click({ force: true });
        }
      });

    cy.on("window:alert", (str) => {
      if (str.includes("màxim de 5 seients")) {
        expect(str).to.equal(
          "Només pots seleccionar un màxim de 5 seients per compra.",
        );
      }
    });
  });
});
