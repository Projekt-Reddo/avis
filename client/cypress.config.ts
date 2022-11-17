import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        experimentalStudio: true, // enable Cypress Studio
        baseUrl: "http://127.0.0.1:5173",
    },
});
