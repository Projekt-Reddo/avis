/// <reference types="cypress" />

describe("delete song", () => {
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
        cy.get('[data-cy="create-song-btn"]').click();
    });

    afterEach(() => {
        cy.get('[data-cy="nav-dropdown"]').click();
        cy.get('[data-cy="Logout"]').click();
    });

    it("success", () => {
        // Track Input
        cy.fixture("audios/akuma.mp3").as("inputFile");
        cy.get('[data-cy="create-song-track-input"]').selectFile(
            {
                contents: "cypress/fixtures/audios/akuma.mp3",
                mimeType: "audio/mp3",
            },
            {
                force: true,
                log: true,
            }
        );

        cy.get('[data-cy="next-step-btn"]').click();

        // Info Input

        cy.get('[data-cy="create-song-title"]').type(
            "this song is for delete testing purpose"
        );

        cy.get('[data-cy="create-song-alias"]').type("test alias");

        cy.get('[data-cy="create-song-description"]').type("test description");

        cy.get("#genres").click();
        cy.get("#genres").contains("JPop").click();

        cy.get("#artists").click();

        cy.wait(1 * 1000);

        cy.get("#artists").contains("Hanser").click();

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
        cy.get('[data-cy="create-song-youtube"]').type(
            "https://www.youtube.com/watch?v=JAipIA-N9sQ&list=WL&index=6"
        );
        // cy.get('[data-cy="create-song-spotify"]').type(
        //     "https://www.youtube.com/watch?v=JAipIA-N9sQ&list=WL&index=6"
        // );
        // cy.get('[data-cy="create-song-soundcloud"]').type(
        //     "https://www.youtube.com/watch?v=JAipIA-N9sQ&list=WL&index=6"
        // );

        cy.get('[data-cy="next-step-btn"]').click();

        // Lyrics Input

        cy.get('[data-cy="submit-btn"]').click();

        cy.wait(10 * 1000);

        cy.get('[data-cy="toast-message"]').click();

        // Return to view song
        cy.get('[data-cy="Song"]').click();

        cy.get('[data-cy="search-filter-input"]').type(
            "this song is for delete testing purpose"
        );
        cy.get('[data-cy="search-filter-submit-btn"]').click();

        cy.get('[data-cy="table-select-row-input"]').first().click();

        cy.get('[data-cy="user-delete-btn"]').click();

        cy.get('[data-cy="modal-confirm-btn"]').click();

        cy.get('[data-cy="toast-message"]').should(
            "have.text",
            "Song deleted successfully!"
        );
    });
});
