/// <reference types="cypress" />

describe("mute users", () => {
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

    it("success", () => {
        cy.get('[data-cy="search-filter-input"]').type("Corn");
        cy.get('[data-cy="search-filter-submit-btn"]').click();

        cy.wait(5 * 1000);

        cy.get('[data-cy="table-select-row-input"]').first().click();
        cy.get('[data-cy="user-mute-button"]').click();

        cy.get('[data-cy="mute-pote-input"]').type("2");
        cy.get('[data-cy="mute-comment-input"]').type("2");

        cy.get('[data-cy="mute-modal-confirm-btn"]').click();

        cy.wait(5 * 1000);

        cy.get('[data-cy="toast-message"]').should(
            "have.text",
            "Accounts Muted successfully!"
        );
    });

    it("fail-negative-date", () => {
        cy.get('[data-cy="search-filter-input"]').type("Corn");
        cy.get('[data-cy="search-filter-submit-btn"]').click();

        cy.wait(5 * 1000);

        cy.get('[data-cy="table-select-row-input"]').first().click();
        cy.get('[data-cy="user-mute-button"]').click();

        cy.get('[data-cy="mute-pote-input"]').clear().type("-1");
        cy.get('[data-cy="mute-comment-input"]').clear().type("0");

        cy.get('[data-cy="mute-modal-confirm-btn"]').click();

        cy.wait(5 * 1000);

        cy.get('[data-cy="toast-message"]').should(
            "have.text",
            "Invalid Input!"
        );

        cy.get('[data-cy="mute-modal-cancel-btn"]').click();
    });

    it("fail-wrong-format", () => {
        cy.get('[data-cy="search-filter-input"]').type("Corn");
        cy.get('[data-cy="search-filter-submit-btn"]').click();

        cy.wait(5 * 1000);

        cy.get('[data-cy="table-select-row-input"]').first().click();
        cy.get('[data-cy="user-mute-button"]').click();

        cy.get('[data-cy="mute-pote-input"]').clear().type("0");
        cy.get('[data-cy="mute-comment-input"]')
            .clear()
            .type("fdsajgad.,dfgioa");

        cy.get('[data-cy="mute-modal-confirm-btn"]').click();

        cy.get('[data-cy="toast-message"]').should(
            "have.text",
            "Input values are invalid"
        );

        cy.get('[data-cy="mute-modal-cancel-btn"]').click();
    });
});
