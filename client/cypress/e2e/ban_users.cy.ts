/// <reference types="cypress" />

describe("ban_users", () => {
    beforeEach(() => {
        cy.viewport(1366, 768);
        cy.visit("/login");
        cy.fixture("admin.json").then(function (adminAccount) {
            this.adminAccount = adminAccount;

            cy.get('[data-cy="email"]').type(this.adminAccount.email);
            cy.get('[data-cy="password"]').type(this.adminAccount.password);
            cy.get('[data-cy="submit-btn"]').click();
        });

        // navigate to management page
        cy.get('[data-cy="nav-dropdown"]').click();
        cy.get('[data-cy="Manage"]').click();
        cy.get('[data-cy="User"]').click();
    });

    afterEach(() => {
        cy.get('[data-cy="nav-dropdown"]').click();
        cy.get('[data-cy="Logout"]').click();
    });

    it("success_ban_users", () => {
        cy.get('[data-cy="search-filter-input"]').type("new");
        cy.get('[data-cy="search-filter-submit-btn"]').click();
        cy.wait(5 * 1000);
        cy.get('[data-cy="table-select-all-input"]').first().check();
        cy.get('[data-cy="user-manage-btn"]').eq(1).click();
        cy.get('[data-cy="modal-confirm-btn"]').click();

        cy.get('[data-cy="toast-message"]').should(
            "have.text",
            "Accounts status updated!"
        );
    });

    it("success_unban_users", () => {
        cy.get('[data-cy="search-filter-input"]').type("new");
        cy.get('[data-cy="search-filter-submit-btn"]').click();
        cy.wait(5 * 1000);
        cy.get('[data-cy="table-select-all-input"]').first().check();
        cy.get('[data-cy="user-manage-btn"]').eq(1).click();
        cy.get('[data-cy="modal-confirm-btn"]').click();

        cy.get('[data-cy="toast-message"]').should(
            "have.text",
            "Accounts status updated!"
        );
    });
});
