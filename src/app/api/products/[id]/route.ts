import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/database";
import cloudinary from "@/lib/cloudinary";
import Product from "@/database/models/products";

/**
 * GET /api/products/[id]
 * Obtiene un producto por su ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnection();
        const { id } = await params;

        const product = await Product.findById(id).lean();

        if (!product) {
            return NextResponse.json(
                { success: false, message: "Producto no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: product,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error al obtener producto:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al obtener el producto",
                error: error instanceof Error ? error.message : "Error desconocido",
            },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/products/[id]
 * Actualiza un producto existente (próximamente con soporte para cambiar imagen)
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // TODO: Implementar actualización completa con soporte para cambiar imagen
        await dbConnection();
        await params; // Para evitar warning de unused
        
        return NextResponse.json(
            { success: false, message: "Actualización de productos próximamente" },
            { status: 501 }
        );
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al actualizar el producto",
                error: error instanceof Error ? error.message : "Error desconocido",
            },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/products/[id]
 * Elimina un producto y su imagen de Cloudinary
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnection();
        const { id } = await params;

        // Buscar el producto
        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json(
                { success: false, message: "Producto no encontrado" },
                { status: 404 }
            );
        }

        // Extraer el public_id de Cloudinary de la URL de la imagen
        // Ejemplo: https://res.cloudinary.com/.../techland/products/abc123.jpg
        // public_id sería: techland/products/abc123
        try {
            const imageUrl = product.image;
            const urlParts = imageUrl.split("/");
            const filename = urlParts[urlParts.length - 1];
            const publicId = `techland/products/${filename.split(".")[0]}`;

            // Eliminar imagen de Cloudinary
            await cloudinary.uploader.destroy(publicId);
            console.log("✅ Imagen eliminada de Cloudinary:", publicId);
        } catch (cloudinaryError) {
            console.error("⚠️ Error al eliminar imagen de Cloudinary:", cloudinaryError);
            // Continuar con la eliminación del producto aunque falle Cloudinary
        }

        // Eliminar producto de MongoDB
        await Product.findByIdAndDelete(id);

        console.log("✅ Producto eliminado de MongoDB:", id);

        return NextResponse.json(
            {
                success: true,
                message: "Producto eliminado exitosamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("❌ Error al eliminar producto:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al eliminar el producto",
                error: error instanceof Error ? error.message : "Error desconocido",
            },
            { status: 500 }
        );
    }
}