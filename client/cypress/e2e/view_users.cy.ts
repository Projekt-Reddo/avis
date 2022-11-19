/// <reference types="cypress" />

describe("view_users", () => {
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

    it("success", () => {});

    it("filter_name_success", () => {
        cy.get('[data-cy="search-filter-input"]').type("draplus");
        cy.get('[data-cy="search-filter-submit-btn"]').click();
        cy.get('[data-cy="table-row"]', {
            log: true,
        })
            .first() // row index 0
            .within(() => {
                cy.get("td")
                    .eq(2) // column index 2
                    .children()
                    .eq(-1, { log: true }) // get the container for value
                    .should("have.text", "draplus team");
            });
    });

    it("filter_name_not_found", () => {
        cy.get('[data-cy="search-filter-input"]').type("drapluss");
        cy.get('[data-cy="search-filter-submit-btn"]').click();
        cy.get('[data-cy="table-row"]', {
            log: true,
        }).should("not.exist");
    });

    it("filter_name_join_date", () => {
        cy.get('[data-cy="show-filter-btn"]').click();
        cy.get('[data-cy="filter-start-date"]').type("2022-11-07");
        cy.get('[data-cy="filter-end-date"]').type("2022-11-09");
        cy.get('[data-cy="apply-filter-btn"]').click();
    });

    it("filter_status", () => {
        cy.get('[data-cy="show-filter-btn"]').click();
        cy.get('[data-cy="toggle-Moderator"]').click();
        cy.get('[data-cy="apply-filter-btn"]').click();
    });
});
