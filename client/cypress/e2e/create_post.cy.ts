/// <reference types="cypress" />

describe("create post", () => {
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

        // cy.visit("/discover");
        cy.wait(5 * 1000);
    });

    afterEach(() => {
        cy.get('[data-cy="nav-dropdown"]').click();
        cy.get('[data-cy="Logout"]').click();
    });

    it("success", () => {
        cy.get('[data-cy="create-post-input"]').type("test create post");
        cy.get('[data-cy="create-post-submit-btn"]').click();

        cy.wait(10 * 1000);
        cy.get('[data-cy="post-card-content"]')
            .first({ log: true })
            .should("have.text", "test create post");
    });

    // it.only("success_file", () => {
    //     cy.wait(5 * 1000);
    //     cy.fixture("images/post_create.jpg").as("inputFile");
    //     cy.get('[data-cy="create-post-file-input"]').selectFile("@inputFile", {
    //         force: true,
    //         log: true,
    //     });
    //     cy.get('[data-cy="create-post-submit-btn"]').click();
    // });

    it("empty_content", () => {
        cy.get('[data-cy="create-post-submit-btn"]').should("be.disabled");
    });

    it("private_post", () => {
        cy.get('[data-cy="create-post-input"]').type(
            "test create private post"
        );
        cy.get(".css-tj5bde-Svg").click();
        cy.get("#react-select-2-option-1").click();
        cy.get('[data-cy="create-post-submit-btn"]').click();

        cy.wait(10 * 1000);
        cy.get('[data-cy="post-card-content"]')
            .first({ log: true })
            .should("have.text", "test create private post");
    });
});
