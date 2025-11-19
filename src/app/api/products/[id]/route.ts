import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const PRODUCTS_FILE = path.join(process.cwd(), "src/data/products.json");

// GET - Obtener un producto por ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const fileContent = await fs.readFile(PRODUCTS_FILE, "utf-8");
        const products = JSON.parse(fileContent);

        const product = products.find((p: any) => p.id === params.id);

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error("Error reading product:", error);
        return NextResponse.json(
            { error: "Failed to fetch product" },
            { status: 500 }
        );
    }
}

// PUT - Actualizar un producto
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();

        // Leer productos existentes
        const fileContent = await fs.readFile(PRODUCTS_FILE, "utf-8");
        const products = JSON.parse(fileContent);

        // Encontrar el índice del producto
        const productIndex = products.findIndex((p: any) => p.id === params.id);

        if (productIndex === -1) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Actualizar el producto manteniendo el ID original
        const updatedProduct = {
            ...products[productIndex],
            ...body,
            id: params.id, // Asegurar que el ID no cambie
            price: body.price ? parseFloat(body.price) : products[productIndex].price,
            stock: body.stock ? parseInt(body.stock) : products[productIndex].stock,
        };

        products[productIndex] = updatedProduct;

        // Guardar en el archivo
        await fs.writeFile(
            PRODUCTS_FILE,
            JSON.stringify(products, null, 2),
            "utf-8"
        );

        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json(
            { error: "Failed to update product" },
            { status: 500 }
        );
    }
}

// DELETE - Eliminar un producto
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Leer productos existentes
        const fileContent = await fs.readFile(PRODUCTS_FILE, "utf-8");
        const products = JSON.parse(fileContent);

        // Filtrar el producto a eliminar
        const filteredProducts = products.filter((p: any) => p.id !== params.id);

        if (filteredProducts.length === products.length) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Guardar en el archivo
        await fs.writeFile(
            PRODUCTS_FILE,
            JSON.stringify(filteredProducts, null, 2),
            "utf-8"
        );

        return NextResponse.json(
            { message: "Product deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json(
            { error: "Failed to delete product" },
            { status: 500 }
        );
    }
}
