/* Tests using Cypress as the runner, which uses Mocha for `it()` and Chai for `expect()`*/
// https://on.cypress.io/introduction-to-cypress

describe("MenuScene", () => {
  beforeEach(() => {
    // Start out with a blank slate for each test
    cy.visit('http://localhost:8000/')
  })

  it("has minimum height of 400px", () => {
    cy.get("#game").first().invoke('height').should('gte', 400)
  });

  it("looks normal after 200ms", () => {
    cy.get("#game > canvas");
    cy.wait(200);

    if (Cypress.env("type") === "base") {
      cy.compareSnapshot("MenuScene-main");
    } else {
      cy.compareSnapshot("MenuScene-main", 0.0);
    }
  });

  it("goes to Balls Scene when clicking", () => {
    cy.get("#game > canvas").wait(500).click(300, 100).wait(5);

    if (Cypress.env("type") === "base") {
      cy.compareSnapshot("MenuScene-exit-1");
    } else {
      cy.compareSnapshot("MenuScene-exit-1", 0.1);
    }
  });

  it("goes to Pipes Scene when clicking", () => {
    cy.get("#game > canvas").wait(500).click(300, 150).wait(5);

    if (Cypress.env("type") === "base") {
      cy.compareSnapshot("MenuScene-exit-2");
    } else {
      cy.compareSnapshot("MenuScene-exit-2", 0.1);
    }
  });

  it("goes to Balls + Pipes Scene when clicking", () => {
    cy.get("#game > canvas").wait(500).click(300, 200).wait(5);

    if (Cypress.env("type") === "base") {
      cy.compareSnapshot("MenuScene-exit-3");
    } else {
      cy.compareSnapshot("MenuScene-exit-3", 0.1);
    }
  });

  it("goes to Scroll Test Scene when clicking", () => {
    cy.get("#game > canvas").wait(500).click(300, 250).wait(5);

    if (Cypress.env("type") === "base") {
      cy.compareSnapshot("MenuScene-exit-4");
    } else {
      cy.compareSnapshot("MenuScene-exit-4", 0.1);
    }
  });

  it("goes to Modal Test Scene when clicking", () => {
    cy.get("#game > canvas").wait(500).click(300, 300).wait(5);

    if (Cypress.env("type") === "base") {
      cy.compareSnapshot("MenuScene-exit-5");
    } else {
      cy.compareSnapshot("MenuScene-exit-5", 0.1);
    }
  });
});
