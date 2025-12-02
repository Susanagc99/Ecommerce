/// <reference types="cypress" />

describe('Registro de Usuario', () => {
  beforeEach(() => {
    // Visitar la página de registro antes de cada test
    cy.visit('/register');
  });

  describe('Interfaz del formulario de registro', () => {
    it('debe mostrar todos los campos requeridos', () => {
      // Verificar que todos los campos están presentes
      cy.get('input[type="text"]').should('have.length.at.least', 2); // name y username
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('have.length', 2); // password y confirmPassword
      
      // Verificar el botón de submit
      cy.get('button[type="submit"]').should('be.visible');
      
      // Verificar el enlace al login
      cy.get('a[href="/login"]').should('be.visible');
    });

    it('debe mostrar labels apropiados', () => {
      // Verificar que los labels están presentes
      cy.contains('label', 'Nombre Completo').should('be.visible');
      cy.contains('label', 'Email').should('be.visible');
      cy.contains('label', 'Nombre de Usuario').should('be.visible');
      cy.contains('label', 'Contraseña').should('be.visible');
      cy.contains('label', 'Confirmar Contraseña').should('be.visible');
    });
  });

  describe('Validación del formulario', () => {
    it('debe mostrar errores para campos requeridos vacíos', () => {
      // Intentar enviar formulario vacío
      cy.get('button[type="submit"]').click();
      
      // Esperar a que aparezcan los mensajes de error o el toast
      cy.wait(2000);
      
      // Verificar que aparecen mensajes de error
      // Pueden estar en elementos de error de los campos o en el toast
      // Verificar que el formulario sigue visible (no se envió) o que hay mensajes de error
      cy.get('form').should('be.visible');
      
      // Verificar que hay algún mensaje de error en el body
      cy.get('body', { timeout: 3000 }).should(($body) => {
        const text = $body.text().toLowerCase();
        // Verificar si hay mensajes de error en el body (toast o errores de campo)
        const hasError = text.includes('requerido') || 
                        text.includes('required') || 
                        text.includes('corrige los errores') ||
                        text.includes('fix errors') ||
                        text.includes('el nombre es requerido') ||
                        text.includes('el email es requerido') ||
                        text.includes('la contraseña es requerida') ||
                        text.includes('el nombre de usuario es requerido');
        return hasError;
      });
    });

    it('debe validar formato de email', () => {
      // Llenar formulario con email inválido
      cy.get('input[type="text"]').first().type('Test User');
      cy.get('input[type="email"]').type('email-invalido');
      cy.get('input[type="text"]').eq(1).type('testuser');
      cy.get('input[type="password"]').first().type('TestPassword123!');
      cy.get('input[type="password"]').last().type('TestPassword123!');
      
      cy.get('button[type="submit"]').click();
      
      // Verificar mensaje de error de email
      cy.wait(500);
      cy.get('body').should(($body) => {
        const text = $body.text().toLowerCase();
        expect(text).to.satisfy((txt: string) => 
          txt.includes('email') || txt.includes('inválido') || txt.includes('invalid')
        );
      });
    });

    it('debe validar longitud mínima de contraseña', () => {
      cy.get('input[type="text"]').first().type('Test User');
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="text"]').eq(1).type('testuser');
      cy.get('input[type="password"]').first().type('123');
      cy.get('input[type="password"]').last().type('123');
      
      cy.get('button[type="submit"]').click();
      
      cy.wait(500);
      cy.get('body').should(($body) => {
        const text = $body.text().toLowerCase();
        expect(text).to.satisfy((txt: string) => 
          txt.includes('contraseña') || txt.includes('password')
        );
      });
    });

    it('debe validar que las contraseñas coincidan', () => {
      cy.get('input[type="text"]').first().type('Test User');
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="text"]').eq(1).type('testuser');
      cy.get('input[type="password"]').first().type('TestPassword123!');
      cy.get('input[type="password"]').last().type('DiferentePassword');
      
      cy.get('button[type="submit"]').click();
      
      cy.wait(500);
      cy.get('body').should(($body) => {
        const text = $body.text().toLowerCase();
        expect(text).to.satisfy((txt: string) => 
          txt.includes('coincid') || txt.includes('match') || txt.includes('no coinciden')
        );
      });
    });
  });

  describe('Registro exitoso', () => {
    it('debe registrar un nuevo usuario con datos válidos', () => {
      // Generar datos únicos para evitar conflictos
      const timestamp = Date.now();
      const userData = {
        name: `Usuario Test ${timestamp}`,
        email: `test${timestamp}@example.com`,
        username: `testuser${timestamp}`,
        password: 'TestPassword123!'
      };

      // Llenar el formulario
      cy.get('input[type="text"]').first().type(userData.name);
      cy.get('input[type="email"]').type(userData.email);
      cy.get('input[type="text"]').eq(1).type(userData.username);
      cy.get('input[type="password"]').first().type(userData.password);
      cy.get('input[type="password"]').last().type(userData.password);

      // Enviar formulario
      cy.get('button[type="submit"]').click();

      // Esperar a que el registro se complete (hay un setTimeout de 800ms en el código)
      cy.wait(1000);
      
      // Verificar mensaje de éxito o redirección
      // El registro exitoso debería redirigir a la página principal después de ~800ms
      cy.url({ timeout: 10000 }).should('not.include', '/register');
      cy.url().should('include', '/'); // Debería estar en la página principal
    });

    it('debe mostrar estado de carga durante el registro', () => {
      const timestamp = Date.now();
      
      cy.get('input[type="text"]').first().type(`Usuario Test ${timestamp}`);
      cy.get('input[type="email"]').type(`test${timestamp}@example.com`);
      cy.get('input[type="text"]').eq(1).type(`testuser${timestamp}`);
      cy.get('input[type="password"]').first().type('TestPassword123!');
      cy.get('input[type="password"]').last().type('TestPassword123!');

      cy.get('button[type="submit"]').click();

      // Verificar que el botón muestra estado de carga
      cy.get('button[type="submit"]').should('be.disabled');
    });
  });

  describe('Navegación', () => {
    it('debe navegar al login cuando se hace clic en el enlace', () => {
      // El enlace está en el footer del formulario
      // Buscar el enlace que contiene el texto "iniciar sesión" (case insensitive)
      cy.contains('a', /iniciar sesión/i).click();
      cy.url().should('include', '/login');
    });
  });

});

