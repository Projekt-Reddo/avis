/// <reference types="cypress" />

describe("view songs", () => {
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
        cy.get('[data-cy="Song"]').click();

        // cy.visit("/admin/song");
    });

    afterEach(() => {
        cy.get('[data-cy="nav-dropdown"]').click();
        cy.get('[data-cy="Logout"]').click();
    });

    it("success", () => {
        cy.get('[data-cy="table-row"]').should("be.visible");
    });

    it("filter_name_success", () => {
        cy.get('[data-cy="search-filter-input"]').type("demo");
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
                    .should("have.text", "Demo");
            });
    });

    it("filter_name_not_found", () => {
        cy.get('[data-cy="search-filter-input"]').type("drapluss");
        cy.get('[data-cy="search-filter-submit-btn"]').click();
        cy.get('[data-cy="table-row"]', {
            log: true,
        }).should("not.exist");
    });

    it("filter_created_date", () => {
        cy.get('[data-cy="show-filter-btn"]').click();
        cy.get('[data-cy="filter-start-date"]').eq(0).type("2022-11-13");
        cy.get('[data-cy="filter-end-date"]').eq(0).type("2022-11-16");
        cy.get('[data-cy="apply-filter-btn"]').click();

        cy.get('[data-cy="table-row"]', {
            log: true,
        })
            .first() // row index 0
            .within(() => {
                cy.get("td")
                    .eq(4) // column index 2
                    .children()
                    .eq(-1, { log: true }) // get the container for value
                    .should("have.text", "2022 Nov 15");
            });
    });
});
