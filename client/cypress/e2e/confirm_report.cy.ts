/// <reference types="cypress" />

describe("confirm_reports", () => {
    beforeEach(() => {
        cy.viewport(1366, 768);
        cy.visit("/login");
        cy.fixture("admin.json").then(function (adminAccount) {
            this.adminAccount = adminAccount;

            cy.get('[data-cy="email"]').type(this.adminAccount.email);
            cy.get('[data-cy="password"]').type(this.adminAccount.password);
            cy.get('[data-cy="submit-btn"]').click();
        });

        // navigate to discover page To create new post
        cy.get('[data-cy="discover-btn"]').click();
        cy.get('[data-cy="create-post-input"]').type("test create post");
        cy.get('[data-cy="create-post-submit-btn"]').click();

        cy.wait(6 * 1000);

        // Access post detail
        cy.get('[data-cy="post-list-wrapper"] > :nth-child(1)').click();

        cy.get('[data-cy="post-options"]').click();

        cy.get('[data-cy="post-report"]').click();

        cy.get('[data-cy="report-types-list"] > :nth-child(1)').click();

        cy.get('[data-cy="report-submit-button"]').click();

        cy.wait(6 * 1000);

        // navigate to management page
        cy.get('[data-cy="nav-dropdown"]').click();
        cy.get('[data-cy="Manage"]').click();
        cy.get('[data-cy="Report"]').click();
    });

    afterEach(() => {
        cy.get('[data-cy="nav-dropdown"]').click();
        cy.get('[data-cy="Logout"]').click();
    });

    it("reject", () => {
        cy.get('[data-cy="table-select-row-input"]').first().click();

        cy.get('[data-cy="report-reject-btn"]').click();

        cy.get('[data-cy="modal-confirm-btn"]').click();
    });

    it("approve", () => {
        cy.get('[data-cy="table-select-row-input"]').first().click();

        cy.get('[data-cy="report-accept-btn"]').click();

        cy.get('[data-cy="modal-confirm-btn"]').click();
    });

    it("approve-a-rejected-report", () => {
        // reject
        cy.get('[data-cy="table-select-row-input"]').first().click();

        cy.get('[data-cy="report-reject-btn"]').click();

        cy.get('[data-cy="modal-confirm-btn"]').click();

        // approve
        cy.get('[data-cy="table-select-row-input"]').first().click();

        cy.get('[data-cy="report-accept-btn"]').click();

        cy.get('[data-cy="modal-confirm-btn"]').click();
    });
});
