/// <reference types="cypress" />

describe("search-text", () => {
    beforeEach(() => {
        cy.viewport(1366, 768);
        cy.visit("/");
    });

    it("no-result", { scrollBehavior: false }, () => {
        cy.get('[data-cy="text-search-header"]').scrollIntoView();

        cy.get('[data-cy="input-text-search"]')
            .clear()
            .type("fdasgjaljdgksajdgsjfdjskl")
            .type("{enter}");

        cy.get('[data-cy="error-text-search"]').should(
            "have.text",
            "No song found!"
        );
    });

    it("search-for-kataomoi", { scrollBehavior: false }, () => {
        cy.get('[data-cy="text-search-header"]').scrollIntoView();

        cy.get('[data-cy="input-text-search"]')
            .clear()
            .type("kataomoi")
            .type("{enter}");

        cy.get('[data-cy="text-search-result-item-title"]').should(
            "contain.text",
            "カタオモイ (Kataomoi)"
        );
    });

    it("search-for-không-cảm-xúc", { scrollBehavior: false }, () => {
        cy.get('[data-cy="text-search-header"]').scrollIntoView();

        cy.get('[data-cy="input-text-search"]')
            .clear()
            .type("không cảm xúc")
            .type("{enter}");

        cy.get('[data-cy="text-search-result-item-title"]').should(
            "contain.text",
            "Không Cảm Xúc"
        );
    });

    it(
        "search-for-kataomoi-by-clicking-on-search-history",
        { scrollBehavior: false },
        () => {
            // Search Kataomoi to make sure that the song appear on the 1st element of search history
            cy.get('[data-cy="text-search-header"]').scrollIntoView();

            cy.get('[data-cy="input-text-search"]')
                .clear()
                .type("kataomoi")
                .type("{enter}");

            cy.wait(3000);

            // Scroll to input -> click and then click on the first element of history
            cy.get('[data-cy="text-search-header"]').scrollIntoView();
            cy.get('[data-cy="input-text-search"]').click();
            cy.get(
                '[data-cy="text-search-search-history"] > :nth-child(1)'
            ).click();

            cy.get('[data-cy="text-search-result-item-title"]').should(
                "contain.text",
                "カタオモイ (Kataomoi)"
            );
        }
    );
});
