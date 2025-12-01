/**
 * Template de email de notificación al admin cuando se crea un nuevo producto
 */
export const newProductEmailTemplate = (productName: string, productPrice: number, category: string): string => {
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
          .product-info {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #06B6D4;
          }
          .product-info p {
            margin: 10px 0;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #06B6D4 0%, #EC4899 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
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
          <h1>Nuevo Producto Creado 📦</h1>
        </div>
        <div class="content">
          <h2>Hola Admin,</h2>
          <p>Se ha creado un nuevo producto en Techland:</p>
          <div class="product-info">
            <p><strong>Nombre:</strong> ${productName}</p>
            <p><strong>Precio:</strong> $${productPrice.toFixed(2)}</p>
            <p><strong>Categoría:</strong> ${category}</p>
          </div>
          <p>Puedes ver y gestionar todos los productos desde el dashboard:</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" class="button">Ir al Dashboard</a>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Techland. Todos los derechos reservados.</p>
        </div>
      </body>
    </html>
  `;
};

