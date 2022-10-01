describe("Distance and duration calculator", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });
  it("types origin and destination thens checks distance", () => {
    cy.get('[data-cy="originInput"]')
      .type("Delhi", { delay: 400 })
      .type("{enter}", { delay: 400 });
    cy.get('[data-cy="destinationInput"]')
      .type("Noida", { delay: 400 })
      .type("{enter}", { delay: 400 });
    cy.get('[data-cy="calculateBtn"]').click();
    expect(cy.get('[data-cy="distanceText"]').should("have.length.gte", 1));
  });
  it("types origin and destination thens checks duration", () => {
    cy.get('[data-cy="originInput"]')
      .type("Delhi", { delay: 400 })
      .type("{enter}", { delay: 400 });
    cy.get('[data-cy="destinationInput"]')
      .type("Noida", { delay: 400 })
      .type("{enter}", { delay: 400 });
    cy.get('[data-cy="calculateBtn"]').click();
    expect(cy.get('[data-cy="durationText"]').should("have.length.gte", 1));
  });
});
