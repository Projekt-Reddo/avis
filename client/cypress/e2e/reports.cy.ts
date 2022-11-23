/// <reference types="cypress" />

describe("reports", () => {
    beforeEach(() => {
        cy.viewport(1366, 768);

        cy.visit("/login");
        cy.fixture("admin.json").then(function (adminAccount) {
            this.adminAccount = adminAccount;

            cy.get('[data-cy="email"]').type(this.adminAccount.email);
            cy.get('[data-cy="password"]').type(this.adminAccount.password);
            cy.get('[data-cy="submit-btn"]').click();
        });

        cy.wait(6000);

        cy.visit("/discover");
        cy.get('[data-cy="post-list-wrapper"] > :nth-child(1)').click();
    });

    it("report-post-nudity", () => {
        cy.get('[data-cy="post-options"]').click();

        cy.get('[data-cy="post-report"]').click();

        cy.get('[data-cy="report-types-list"] > :nth-child(1)').click();

        cy.get('[data-cy="report-submit-button"]').click();

        cy.get('[data-cy="toast-message"]').should(
            "contain.text",
            "Report successfully"
        );
    });

    it("report-post-other", () => {
        cy.get('[data-cy="post-options"]').click();

        cy.get('[data-cy="post-report"]').click();

        cy.get('[data-cy="report-types-list"] > :last-child').click();

        cy.get('[data-cy="report-textarea"]').type("Yoru ni Kakeru");

        cy.get('[data-cy="report-submit-button"]').click();

        cy.get('[data-cy="toast-message"]').should(
            "contain.text",
            "Report successfully"
        );
    });

    it.only("report-commend-spam", () => {
        cy.get('[data-cy="comment-textarea"]').type(
            "This comment is for testing purposes: <the comment report function>"
        );

        cy.get('[data-cy="comment-create-button"]').click();

        cy.get('[data-cy="comment-report-icon"]').last().click();

        cy.get('[data-cy="report-types-list"] > :nth-child(3)').click();

        cy.get('[data-cy="report-submit-button"]').click();

        cy.get('[data-cy="toast-message"]').should(
            "contain.text",
            "Report successfully"
        );
    });

    afterEach(() => {
        cy.get('[data-cy="nav-dropdown"]').click();
        cy.get('[data-cy="Logout"]').click();
    });
});
