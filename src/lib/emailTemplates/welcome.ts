/**
 * Template de email de bienvenida para nuevos usuarios
 */
export const welcomeEmailTemplate = (userName: string): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #06B6D4 0%, #EC4899 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9fafb;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #06B6D4 0%, #EC4899 100%);
            color: white !important;
            padding: 12px 30px;
            text-decoration: none !important;
            border-radius: 5px;
            margin-top: 20px;
          }
          .button:link,
          .button:visited,
          .button:hover,
          .button:active {
            color: white !important;
            text-decoration: none !important;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            color: #6b7280;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>¡Bienvenido a Techland!</h1>
        </div>
        <div class="content">
          <h2>Hola ${userName},</h2>
          <p>¡Estamos emocionados de tenerte en nuestra comunidad!</p>
          <p>En Techland encontrarás los mejores gadgets tecnológicos y accesorios para elevar tu experiencia tech.</p>
          <p>Explora nuestra tienda y descubre productos increíbles:</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/shop" class="button">Explorar Tienda</a>
          <p style="margin-top: 30px;">Si tienes alguna pregunta, no dudes en contactarnos.</p>
          <p>¡Que disfrutes tu experiencia en Techland!</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Techland. Todos los derechos reservados.</p>
        </div>
      </body>
    </html>
  `;
};
