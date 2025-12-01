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
    
    // 4. Esperar redirección
    cy.url({ timeout: 5000 }).should('not.include', '/register');
    
    // 5. Navegar a login si no se redirige automáticamente
    cy.visit('/login');
    
    // 6. Hacer login con las credenciales del registro
    cy.get('input[type="email"]').type(userData.email);
    cy.get('input[type="password"]').type(userData.password);
    cy.get('button[type="submit"]').click();
    
    // 7. Verificar que se inició sesión correctamente
    cy.url({ timeout: 5000 }).should('not.include', '/login');
  });

  it('debe manejar errores de login con credenciales incorrectas', () => {
    cy.visit('/login');
    
    // Intentar login con credenciales incorrectas
    cy.get('input[type="email"]').type('usuario@noexiste.com');
    cy.get('input[type="password"]').type('PasswordIncorrecto');
    cy.get('button[type="submit"]').click();
    
    // Esperar y verificar mensaje de error
    cy.wait(1000);
    // Ajusta este selector según tu implementación de mensajes de error
    cy.get('body').should('contain.text', 'error').or('contain.text', 'inválid');
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

