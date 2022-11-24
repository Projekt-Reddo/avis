/// <reference types="cypress" />

describe("log_out", () => {
    beforeEach(() => {
        cy.viewport(1366, 768);
    });

    it("unauthorize_log_out", () => {
        cy.visit("/discover");
        cy.get('[data-cy="register-btn"]').should("have.text",
        "Register");
    });

    it("authorize_log_out", () => {
        cy.visit("/login");
        cy.fixture("admin.json").then(function (adminAccount) {
            this.adminAccount = adminAccount;

            cy.get('[data-cy="email"]').type(this.adminAccount.email);
            cy.get('[data-cy="password"]').type(this.adminAccount.password);
            cy.get('[data-cy="submit-btn"]').click();
        });
        cy.visit("/discover");

        cy.get('[data-cy="nav-dropdown"]').first().click();

        cy.get('[data-cy="Logout"]').first().click();

        cy.get('[data-cy="register-btn"]').should("have.text",
        "Register");
    });


});