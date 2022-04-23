describe('Example Test', () => {
    it('Clicks through all pages', () => {
        cy.visit('/');
        cy.wait(1000)
        cy.contains("List").click();
        cy.wait(1000)
        cy.contains("Users").click();
        cy.wait(1000)
        cy.contains("Notifi").click();
        cy.wait(1000)
        cy.contains("Settings").click();
        cy.wait(1000)
        cy.contains("Cluster").click();
    });
});
