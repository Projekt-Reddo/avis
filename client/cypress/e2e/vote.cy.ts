/// <reference types="cypress" />

describe("vote", () => {
    beforeEach(() => {
        cy.viewport(1366, 768);
    });

    it("unauthorize_post_vote", () => {
        cy.visit("/discover");
        cy.get('[data-cy="post-upvote-btn"]').first().click();
    });

    it("unauthorize_comment_vote", () => {
        cy.get('[data-cy="post-card-content"]').first().click();
        cy.get('[data-cy="comment-upvote-btn"]').first().click();
    });

    it("post_upvote", () => {
        cy.visit("/login");
        cy.fixture("admin.json").then(function (adminAccount) {
            this.adminAccount = adminAccount;

            cy.get('[data-cy="email"]').type(this.adminAccount.email);
            cy.get('[data-cy="password"]').type(this.adminAccount.password);
            cy.get('[data-cy="submit-btn"]').click();
        });

        cy.get('[data-cy="discover-btn"]').click();
        cy.get('[data-cy="post-upvote-btn"]').first().click();
    });

    it("post_downvote", () => {
        cy.get('[data-cy="post-downvote-btn"]').first().click();
    });

    it("comment_upvote", () => {
        cy.get('[data-cy="post-card-content"]').first().click();
        cy.get('[data-cy="comment-upvote-btn"]').first().click();
    });

    it("comment_downvote", () => {
        cy.get('[data-cy="comment-downvote-btn"]').first().click();
    });
});
