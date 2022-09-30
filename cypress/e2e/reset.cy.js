/// <reference types="Cypress"/>

describe("Checks Reset Functionality", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });
  it("types origin and destination thens resets", () => {
    cy.get('[data-cy="originInput"]').type("Delhi").type("{enter}");
    cy.get('[data-cy="destinationInput"]').type("Noida").type("{enter}");
    cy.get('[data-cy="resetBtn"]').click();
    expect(cy.get('[data-cy="originInput"]').should("be.empty"));
    expect(cy.get('[data-cy="destinationInput"]').should("be.empty"));
  });
});
