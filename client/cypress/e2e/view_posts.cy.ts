/// <reference types="cypress" />

describe("view songs", () => {
    beforeEach(() => {
        cy.viewport(1366, 768);
        cy.visit("/discover");
    });

    it("view-post-list-success", () => {
        cy.get('[data-cy="post-card"]').should("be.visible");
    });

    it("search-post-list-fail", () => {
        cy.get('[data-cy="discover-search-bar"]')
            .type("jfdsal;jgagja;gd")
            .type("{enter}");

        cy.get('[data-cy="discover-error-message"]').should(
            "contain.text",
            "No result"
        );
    });

    it("search-post-list-by-hashtag-success", () => {
        cy.get('[data-cy="hashtag-list-wrapper"] > :nth-child(1)').click();

        cy.get('[data-cy="post-card"]').should("exist");
    });

    it("view-single-post-success", () => {
        cy.get('[data-cy="post-list-wrapper"] > :nth-child(1)').click();

        cy.get('[data-cy="post-detail-wrapper"]').should("exist");
    });

    it("view-single-post-fail", () => {
        cy.visit("/discover/6377b7de0d3352dc7eb97777");

        cy.get('[data-cy="not-found"]').should("exist");
    });
});
