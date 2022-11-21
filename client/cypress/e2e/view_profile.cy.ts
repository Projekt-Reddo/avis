/// <reference types="cypress" />

describe("view_profile", () => {
    beforeEach(() => {
        cy.viewport(1366, 768);
        cy.visit("/");
    });

    it("view_another_profile", () => {
        cy.get('[data-cy="discover-btn"]').click();
        cy.get('[data-cy="avatar-post"]').first().click();
    });

    it("view_own_profile", () => {
        cy.visit("/login");
        cy.fixture("admin.json").then(function (adminAccount) {
            this.adminAccount = adminAccount;

            cy.get('[data-cy="email"]').type(this.adminAccount.email);
            cy.get('[data-cy="password"]').type(this.adminAccount.password);
            cy.get('[data-cy="submit-btn"]').click();
        });

        cy.get('[data-cy="nav-dropdown"]').click();
        cy.get('[data-cy="Profile"]').click();
    });
});
