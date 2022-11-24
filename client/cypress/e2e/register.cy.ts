/// <reference types="cypress" />

describe("register", () => {
    beforeEach(() => {
        cy.viewport(1366, 768);
        cy.visit("/");
        cy.get('[data-cy="register-btn"]').click();
    });

    it("required-fields", () => {
        cy.get('[data-cy="submit-btn"]').click();

        const err_msg = [
            "Name is required!",
            "Email is required!",
            "Password is required!",
        ];

        cy.get('[data-cy="error-message"]').each(($message, index) => {
            cy.wrap($message).should("have.text", err_msg[index]);
        });
    });

    it("name-validate", () => {
        cy.get('[data-cy="name"]').clear().type("yotsuba@");
        cy.get('[data-cy="error-message"]').should(
            "have.text",
            "Please enter valid name without invalid special characters"
        );

        cy.get('[data-cy="name"]').clear().type("yotsu");
        cy.get('[data-cy="error-message"]').should(
            "have.text",
            "Name must be minimum of 6 characters"
        );
    });

    it("email-validate", () => {
        cy.get('[data-cy="email"]').clear().type("yotsuba@@gmail.com");
        cy.get('[data-cy="error-message"]').should(
            "have.text",
            "Please input a correct email format!"
        );
    });

    it("password-validate", () => {
        cy.get('[data-cy="password"]').clear().type("password/");
        cy.get('[data-cy="error-message"]').should(
            "have.text",
            "Password must be minimum of 6 characters and can only contains uppercase, lowercase, numeric letter and some special characters: !@#$%^&*_-"
        );

        cy.get('[data-cy="password"]').clear().type("pass");
        cy.get('[data-cy="error-message"]').should(
            "have.text",
            "Password must be minimum of 6 characters and can only contains uppercase, lowercase, numeric letter and some special characters: !@#$%^&*_-"
        );
    });

    it("success", () => {
        cy.get('[data-cy="name"]').type("yotsuba");
        cy.get('[data-cy="email"]').type("yotsuba@gmail.com");
        cy.get('[data-cy="password"]').type("12345678");
        cy.get('[data-cy="submit-btn"]').click();

        cy.get('[data-cy="email-verify"]').should(
            "have.text",
            "Verify your Email"
        );
    });

    it("existed-account", () => {
        cy.get('[data-cy="name"]').type("yotsuba");
        cy.get('[data-cy="email"]').type("yotsuba@gmail.com");
        cy.get('[data-cy="password"]').type("12345678");
        cy.get('[data-cy="submit-btn"]').click();

        cy.get('[data-cy="toast-message"]').should(
            "have.text",
            "Email already in use!"
        );
    });
});
