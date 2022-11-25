/// <reference types="cypress" />

describe("edit song", () => {
    beforeEach(() => {
        cy.viewport(1366, 768);
        cy.visit("/login");
        cy.fixture("admin.json").then(function (adminAccount) {
            this.adminAccount = adminAccount;

            cy.get('[data-cy="email"]').type(this.adminAccount.email);
            cy.get('[data-cy="password"]').type(this.adminAccount.password);
            cy.get('[data-cy="submit-btn"]').click();
        });

        // navigate to song manage page
        cy.get('[data-cy="nav-dropdown"]').click();
        cy.get('[data-cy="Manage"]').click();
        cy.get('[data-cy="Song"]').click();

        // navigate to song create page
        cy.get('[data-cy="search-filter-input"]')
            .type("E2E edit testing")
            .type("{enter}");

        cy.get('[data-cy="table-row"]').first().click();
    });

    afterEach(() => {
        cy.get('[data-cy="nav-dropdown"]').click();
        cy.get('[data-cy="Logout"]').click();
    });

    it("success_info_only", () => {
        // Info Input

        cy.get('[data-cy="create-song-alias"]').clear().type("edited alias");

        cy.get('[data-cy="create-song-description"]').type(
            "edited description"
        );

        cy.get('[data-cy="next-step-btn"]').click();

        // Thumbnail Input

        cy.get('[data-cy="next-step-btn"]').click();

        // Urls Input
        cy.get('[data-cy="create-song-youtube"]').clear();

        cy.get('[data-cy="next-step-btn"]').click();

        // Lyrics Input

        cy.get('[data-cy="submit-btn"]').click();

        cy.wait(10 * 1000);
    });

    it("success_thumbnail_only", () => {
        // Info Input

        cy.get('[data-cy="next-step-btn"]').click();

        // Thumbnail Input

        cy.fixture("images/post_create.jpg").as("inputFile");
        cy.get('[data-cy="create-song-thumbnail"]').selectFile(
            {
                contents: "cypress/fixtures/images/post_create.jpg",
                mimeType: "image/jpg",
            },
            {
                force: true,
                log: true,
            }
        );

        cy.get('[data-cy="next-step-btn"]').click();

        // Urls Input

        cy.get('[data-cy="next-step-btn"]').click();

        // Lyrics Input

        cy.get('[data-cy="submit-btn"]').click();

        cy.wait(10 * 1000);
    });

    it("info_field_required", () => {
        // Info Input
        cy.get('[data-cy="create-song-title"]').clear();

        cy.get('[data-cy="next-step-btn"]').click();

        const err_msg = ["Name is required!"];

        cy.get('[data-cy="error-message"]').each(($message, index) => {
            cy.wrap($message).should("have.text", err_msg[index]);
        });
    });
});
