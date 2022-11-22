/// <reference types="cypress" />

describe("grant role", () => {
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

        // cy.visit("/admin/user");
    });

    afterEach(() => {
        cy.get('[data-cy="nav-dropdown"]').click();
        cy.get('[data-cy="Logout"]').click();
    });

    it("sucess-promote", () => {
        cy.get('[data-cy="search-filter-input"]').type("new");
        cy.get('[data-cy="search-filter-submit-btn"]').click();
        cy.wait(5 * 1000);
        cy.get('[data-cy="table-select-all-input"]').check();
        cy.get('[data-cy="user-manage-btn"]').eq(0).click();
        cy.get('[data-cy="modal-confirm-btn"]').click();

        cy.get('[data-cy="toast-message"]').should(
            "have.text",
            "Accounts role updated!"
        );
    });

    it("sucess-demote", () => {
        cy.get('[data-cy="search-filter-input"]').type("new");
        cy.get('[data-cy="search-filter-submit-btn"]').click();
        cy.wait(5 * 1000);
        cy.get('[data-cy="table-select-all-input"]').check();
        cy.get('[data-cy="user-manage-btn"]').eq(0).click();
        cy.get('[data-cy="modal-confirm-btn"]').click();

        cy.get('[data-cy="toast-message"]').should(
            "have.text",
            "Accounts role updated!"
        );
    });

    it("fail-select-both-role", () => {
        cy.get('[data-cy="table-select-all-input"]').check();
        cy.get('[data-cy="user-manage-btn"]')
            .eq(0)
            .should("not.contain.text", "Promote User(s)");
    });
});
