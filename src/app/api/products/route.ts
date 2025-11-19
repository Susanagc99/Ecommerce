import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const PRODUCTS_FILE = path.join(process.cwd(), "src/data/products.json");

// GET - Obtener todos los productos
export async function GET() {
    try {
        const fileContent = await fs.readFile(PRODUCTS_FILE, "utf-8");
        const products = JSON.parse(fileContent);

        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error("Error reading products:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}
// Aplicar claudinary para subir las imagenes
// POST - Crear un nuevo producto
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validar datos requeridos
        const requiredFields = [
            "name",
            "description",
            "price",
            "category",
            "subcategory",
            "image",
            "stock",
        ];
        const missingFields = requiredFields.filter(
            (field) => !body[field] && body[field] !== 0
        );

        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `Missing required fields: ${missingFields.join(", ")}` },
                { status: 400 }
            );
        }

        // Leer productos existentes
        const fileContent = await fs.readFile(PRODUCTS_FILE, "utf-8");
        const products = JSON.parse(fileContent);

        // Generar ID único (encontrar el máximo ID actual y sumar 1)
        const maxId = products.reduce((max: number, product: any) => {
            const id = parseInt(product.id);
            return id > max ? id : max;
        }, 0);

        const newProduct = {
            id: (maxId + 1).toString(),
            name: body.name,
            description: body.description,
            price: parseFloat(body.price),
            category: body.category,
            subcategory: body.subcategory,
            image: body.image,
            stock: parseInt(body.stock),
            featured: body.featured || false,
        };

        // Agregar el nuevo producto
        products.push(newProduct);

        // Guardar en el archivo
        await fs.writeFile(
            PRODUCTS_FILE,
            JSON.stringify(products, null, 2),
            "utf-8"
        );

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
        );
    }
}
