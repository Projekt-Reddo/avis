/// <reference types="cypress" />

describe("comment", () => {
    beforeEach(() => {
        cy.viewport(1366, 768);
        cy.visit("/login");
        cy.fixture("user.json").then(function (userAccount) {
            this.userAccount = userAccount;

            cy.get('[data-cy="email"]').type(this.userAccount.email);
            cy.get('[data-cy="password"]').type(this.userAccount.password);
            cy.get('[data-cy="submit-btn"]').click();
        });

        // navigate to discover page
        cy.get('[data-cy="discover-btn"]').click();
        cy.wait(5 * 1000);

        cy.get('[data-cy="post-card-content"]').first().click();
    });

    afterEach(() => {
        cy.get('[data-cy="nav-dropdown"]').click();
        cy.get('[data-cy="Logout"]').click();
    });

    it("success", () => {
        cy.get('[data-cy="comment-textarea"]').type("test create comment");
        cy.get('[data-cy="comment-create-button"]').click();

        cy.wait(5 * 1000);
        cy.get('[data-cy="comment-card-content"]')
            .first({ log: true })
            .should("have.text", "test create comment");
    });

    it("success_upload_file", () => {
        cy.get('[data-cy="comment-textarea"]').focus();

        cy.fixture("images/post_create.jpg").as("inputFile");
        cy.get('[data-cy="create-song-track-input"]').selectFile(
            {
                contents: "cypress/fixtures/images/post_create.jpg",
                mimeType: "image/jpg",
            },
            {
                force: true,
                log: true,
            }
        );

        cy.get('[data-cy="comment-create-button"]').click();

        cy.wait(5 * 1000);
        cy.get('[data-cy="comment-card-content"]')
            .first({ log: true })
            .should("have.text", "");
    });

    it("empty_content", () => {
        cy.get('[data-cy="comment-textarea"]').type("   ");
        cy.get('[data-cy="comment-create-button"]').click();

        cy.wait(5 * 1000);
        cy.get('[data-cy="toast-message"]').should(
            "have.text",
            "Input values are invalid"
        );
    });

    it("comment_in_comment", () => {
        cy.get('[data-cy="comment-card-content"]').first().click();

        cy.get('[data-cy="comment-textarea"]').type("test create comment");
        cy.get('[data-cy="comment-create-button"]').click();

        cy.wait(5 * 1000);
        cy.get('[data-cy="comment-card-content"]')
            .eq(2)
            .first({ log: true })
            .should("have.text", "test create comment");
    });

    it("delete_comment", () => {
        cy.get('[data-cy="comment-textarea"]').type("test create comment");
        cy.get('[data-cy="comment-create-button"]').click();

        cy.wait(5 * 1000);

        cy.get('[data-cy="comment-delete-btn"]').first().click();
        cy.get('[data-cy="modal-confirm-btn"]').click();

        cy.wait(5 * 1000);

        cy.get('[data-cy="toast-message"]').should(
            "have.text",
            "Your comment was deleted"
        );
    });
});
