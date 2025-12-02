import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/database";
import cloudinary from "@/lib/cloudinary";
import Product from "@/database/models/products";
import { updateProductSchema } from "@/schemas/productSchemas";

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
 * Actualiza un producto existente con soporte para cambiar imagen
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnection();
        const { id } = await params;

        // Buscar el producto existente
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return NextResponse.json(
                { success: false, message: "Producto no encontrado" },
                { status: 404 }
            );
        }

        // Obtener FormData
        const formData = await request.formData();

        // Extraer campos del formulario
        const name = formData.get("name") as string | null;
        const description = formData.get("description") as string | null;
        const price = formData.get("price") as string | null;
        const category = formData.get("category") as string | null;
        const subcategory = formData.get("subcategory") as string | null;
        const stock = formData.get("stock") as string | null;
        const featured = formData.get("featured") as string | null;
        const file = formData.get("file") as File | null;

        // Preparar objeto para validación (solo campos que vienen)
        const dataToValidate: Record<string, string | undefined> = {};
        if (name) dataToValidate.name = name;
        if (description) dataToValidate.description = description;
        if (price) dataToValidate.price = price;
        if (category) dataToValidate.category = category;
        if (subcategory) dataToValidate.subcategory = subcategory;
        if (stock !== null) dataToValidate.stock = stock;
        if (featured !== null) dataToValidate.featured = featured;

        // Validar datos con Yup (solo los campos que vienen)
        try {
            await updateProductSchema.validate(dataToValidate, {
                abortEarly: false, // Validar todos los campos, no solo el primero con error
            });
        } catch (error: any) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: error.message || "Error de validación" 
                },
                { status: 400 }
            );
        }

        // Validar que al menos un campo viene para actualizar
        if (!name && !description && !price && !category && !subcategory && !stock && !featured && !file) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Debe proporcionar al menos un campo para actualizar",
                },
                { status: 400 }
            );
        }

        // Preparar datos de actualización
        const updateData: {
            name: string;
            description: string;
            price: number;
            category: string;
            subcategory: string;
            stock?: number;
            featured?: boolean;
            image?: string;
        } = {
            name,
            description,
            price: parseFloat(price),
            category,
            subcategory,
        };

        // Campos opcionales
        if (stock !== null) {
            updateData.stock = parseInt(stock) || 0;
        }
        if (featured !== null) {
            updateData.featured = featured === "true";
        }

        // Si hay nueva imagen, subirla a Cloudinary y eliminar la vieja
        if (file && file.size > 0) {
            // Validar tipo de archivo
            const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
            if (!validImageTypes.includes(file.type)) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Solo se permiten archivos de imagen (jpeg, jpg, png, webp)",
                    },
                    { status: 400 }
                );
            }

            // Convertir archivo a buffer y luego a Data URI para Cloudinary
            const buffer = await file.arrayBuffer();
            const dataUri = `data:${file.type};base64,${Buffer.from(buffer).toString("base64")}`;

            // Subir nueva imagen a Cloudinary
            const uploadResult = await cloudinary.uploader.upload(dataUri, {
                folder: "techland/products",
                resource_type: "image",
                transformation: [
                    { width: 800, height: 800, crop: "limit" },
                    { quality: "auto" },
                    { fetch_format: "auto" },
                ],
            });

            console.log("Nueva imagen subida a Cloudinary:", uploadResult.secure_url);
            updateData.image = uploadResult.secure_url;

            // Eliminar imagen antigua de Cloudinary (si existe)
            try {
                const oldImageUrl = existingProduct.image;
                if (oldImageUrl && oldImageUrl.includes("cloudinary.com")) {
                    // Extraer public_id de la URL antigua
                    const urlParts = oldImageUrl.split("/");
                    const filename = urlParts[urlParts.length - 1];
                    const publicId = `techland/products/${filename.split(".")[0]}`;

                    await cloudinary.uploader.destroy(publicId);
                    console.log("Imagen antigua eliminada de Cloudinary:", publicId);
                }
            } catch (cloudinaryError) {
                console.error("Error al eliminar imagen antigua de Cloudinary:", cloudinaryError);
                // Continuar con la actualización aunque falle la eliminación de la imagen antigua
            }
        }

        // Actualizar producto en MongoDB
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true } // new: true devuelve el documento actualizado
        );

        if (!updatedProduct) {
            return NextResponse.json(
                { success: false, message: "Error al actualizar el producto" },
                { status: 500 }
            );
        }

        console.log("✅ Producto actualizado en MongoDB:", updatedProduct._id);

        return NextResponse.json(
            {
                success: true,
                message: "Producto actualizado correctamente",
                data: updatedProduct,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("❌ Error al actualizar producto:", error);

        // Manejo específico de errores de validación de Mongoose
        if (error instanceof Error && error.name === "ValidationError") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Error de validación",
                    error: error.message,
                },
                { status: 400 }
            );
        }

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