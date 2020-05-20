'use strict'

/// <reference types="cypress" />

context('socket.io-worker', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
    })

    it('creates socket.io-worker', () => {
        cy.window().should('have.property', 'wio')
    })
})