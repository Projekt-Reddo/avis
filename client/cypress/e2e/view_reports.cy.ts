/// <reference types="cypress" />

describe("view_reports", () => {
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
        cy.get('[data-cy="Report"]').click();
    });

    afterEach(() => {
        cy.get('[data-cy="nav-dropdown"]').click();
        cy.get('[data-cy="Logout"]').click();
    });

    it("success", () => {});

    it("filter_post_report", () => {
        cy.get('[data-cy="show-filter-btn"]').click();
        cy.get('[data-cy="filter-post-report"]').click();
        cy.get('[data-cy="search-filter-submit-btn"]').click();
    });

    it("filter_type_report", () => {
        cy.get('[data-cy="show-filter-btn"]').click();
        cy.get('[data-cy="Violence"]').click();
        cy.get('[data-cy="search-filter-submit-btn"]').click();
    });

    it("filter_date_report", () => {
        cy.get('[data-cy="show-filter-btn"]').click();
        cy.get('[data-cy="filter-start-date"]').type("2022-11-07");
        cy.get('[data-cy="filter-end-date"]').type("2022-11-21");
        cy.get('[data-cy=search-filter-submit-btn"]').click();
    });
});
