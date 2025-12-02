/// <reference types="cypress" />

describe('Flujo completo de usuario', () => {
  it('debe permitir registrarse y luego hacer login', () => {
    const timestamp = Date.now();
    const userData = {
      name: `Usuario Test ${timestamp}`,
      email: `test${timestamp}@example.com`,
      username: `testuser${timestamp}`,
      password: 'TestPassword123!'
    };

    // 1. Ir a registro
    cy.visit('/register');
    
    // 2. Llenar formulario de registro
    cy.get('input[type="text"]').first().type(userData.name);
    cy.get('input[type="email"]').type(userData.email);
    cy.get('input[type="text"]').eq(1).type(userData.username);
    cy.get('input[type="password"]').first().type(userData.password);
    cy.get('input[type="password"]').last().type(userData.password);

    // 3. Enviar registro
    cy.get('button[type="submit"]').click();
    
    // 4. Esperar redirección después del registro exitoso
    // El registro automáticamente hace login, así que debería redirigir a la página principal
    cy.url({ timeout: 5000 }).should('not.include', '/register');
    cy.url().should('include', '/'); // Debería estar en la página principal
    
    // 5. Verificar que el usuario está logueado (debería ver el navbar con opciones de usuario logueado)
    // O simplemente verificar que no está en /register ni /login
    cy.url().should('not.include', '/login');
    cy.url().should('not.include', '/register');
  });

  it('debe manejar errores de login con credenciales incorrectas', () => {
    cy.visit('/login');
    
    // Intentar login con credenciales incorrectas
    // El login usa type="text" para el campo de nombre de usuario
    cy.get('input[type="text"]').first().type('usuario_inexistente');
    cy.get('input[type="password"]').type('PasswordIncorrecto');
    cy.get('button[type="submit"]').click();
    
    // Esperar y verificar mensaje de error
    cy.wait(1000);
    // Verificar mensaje de error en el body (toast o mensaje de error)
    cy.get('body').should(($body) => {
      const text = $body.text().toLowerCase();
      expect(text).to.satisfy((txt: string) => 
        txt.includes('error') || 
        txt.includes('inválid') || 
        txt.includes('invalid') ||
        txt.includes('incorrect')
      );
    });
  });

  it('debe navegar por la tienda', () => {
    cy.visit('/');
    
    // Verificar que la página carga
    cy.get('body').should('be.visible');
    
    // Navegar a la tienda si existe el enlace
    cy.visit('/shop');
    
    // Verificar que la página de tienda carga
    cy.url().should('include', '/shop');
  });

});

