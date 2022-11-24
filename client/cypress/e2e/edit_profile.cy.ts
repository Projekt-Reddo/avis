/// <reference types="cypress" />

describe("edit profile", () => {
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
        cy.get('[data-cy="nav-dropdown"]').click();
        cy.get('[data-cy="Profile"]').click();

        // cy.visit("/user/profile");
        cy.get('[data-cy="edit-profile-btn"]').click();
    });

    afterEach(() => {
        cy.get('[data-cy="nav-dropdown"]').click();
        cy.get('[data-cy="Logout"]').click();
    });

    it("success", () => {
        cy.get('[data-cy="display-name"]').clear().type("new name");
        cy.get('[data-cy="profile-save-btn"]').click();

        cy.wait(10 * 1000);
        cy.get('[data-cy="profile-display-name"]').should(
            "have.text",
            "new name"
        );
    });

    it("fail_shortname", () => {
        cy.get('[data-cy="display-name"]').clear();
        cy.get('[data-cy="error-message"]').should(
            "have.text",
            "Name is required!"
        );
    });

    it("fail_special_char", () => {
        cy.get('[data-cy="display-name"]').clear().type("demo test @ 123");
        cy.get('[data-cy="error-message"]').should(
            "have.text",
            "Please enter valid name without invalid special characters"
        );
    });
});
