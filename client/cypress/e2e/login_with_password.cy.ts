/// <reference types="cypress" />

describe("Login_With_Password", () => {
    beforeEach(() => {
        cy.viewport(1366, 768);
    });
    it("Access login page", () => {
        cy.viewport(1366, 768);
        cy.visit("/login");
    });

    it("required-fields", () => {
        cy.get('[data-cy="submit-btn"]').click();

        const err_msg = ["Email is required!", "Password is required!"];

        cy.get('[data-cy="error-message"]').each(($message, index) => {
            cy.wrap($message).should("have.text", err_msg[index]);
        });
    });

    it("email-validate", () => {
        cy.get('[data-cy="email"]').clear().type("baoloc_da_den_day^.^");
        const err_msg = [
            "Please input a correct email format!",
            "Password is required!",
        ];
        cy.get('[data-cy="error-message"]').each(($message, index) => {
            cy.wrap($message).should("have.text", err_msg[index]);
        });
    });

    it("password-validate", () => {
        cy.get('[data-cy="email"]').clear();
        cy.get('[data-cy="password"]').clear().type("password/");
        const err_msg = [
            "Email is required!",
            "Password must be minimum of 6 characters and can only contains uppercase, lowercase, numeric letter and some special characters: !@#$%^&*_-",
        ];
        cy.get('[data-cy="error-message"]').each(($message, index) => {
            cy.wrap($message).should("have.text", err_msg[index]);
        });
    });

    it("success", () => {
        cy.fixture("account.json").then(function (account) {
            this.account = account;

            cy.get('[data-cy="email"]').clear().type(this.account.email);
            cy.get('[data-cy="password"]').clear().type(this.account.password);
            cy.get('[data-cy="submit-btn"]').click();
        });
    });

    after(() => {
        cy.get('[data-cy="nav-dropdown"]').click();
        cy.get('[data-cy="Logout"]').click();
    });
});
