import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/database";
import cloudinary from "@/lib/cloudinary";
import Product from "@/database/models/products";
import { createProductSchema } from "@/lib/productSchemas";
import User from "@/database/models/users";
import { sendEmail } from "@/lib/email";
import { newProductEmailTemplate } from "@/lib/emailTemplates/newProduct";

/**
 * GET /api/products
 * Obtiene la lista de productos con filtros opcionales
 * Query params: category, subcategory, featured, search
 */
export async function GET(request: NextRequest) {
    try {
        await dbConnection();

        // Obtener parámetros de búsqueda
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const subcategory = searchParams.get("subcategory");
        const featured = searchParams.get("featured");
        const search = searchParams.get("search");

        // Construir filtros dinámicamente
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filters: any = {};

        if (category) filters.category = category;
        if (subcategory) filters.subcategory = subcategory;
        if (featured === "true") filters.featured = true;
        
        // Búsqueda por texto en name o description
        if (search) {
            filters.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        // Obtener productos de la base de datos
        const products = await Product.find(filters)
            .sort({ createdAt: -1 }) // Más recientes primero
            .lean(); // Convierte a objetos JavaScript planos (mejor performance)

        return NextResponse.json(
            {
                success: true,
                count: products.length,
                data: products,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error al obtener productos:", error);
        return NextResponse.json(
            { 
                success: false, 
                message: "Error al obtener los productos",
                error: error instanceof Error ? error.message : "Error desconocido"
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/products
 * Crea un nuevo producto con imagen en Cloudinary
 * Body: FormData con name, description, price, category, subcategory, stock, featured, file
 */
export async function POST(request: NextRequest) {
    try {
        // Obtener FormData del request
        const formData = await request.formData();

        // Extraer campos del FormData
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const price = formData.get("price") as string;
        const category = formData.get("category") as string;
        const subcategory = formData.get("subcategory") as string;
        const stock = formData.get("stock") as string;
        const featured = formData.get("featured") as string;
        const file = formData.get("file") as File;

        // Validar que el archivo existe
        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: "El archivo de imagen es requerido" 
                },
                { status: 400 }
            );
        }

        // Validar datos con Yup
        try {
            await createProductSchema.validate({
                name,
                description,
                price,
                category,
                subcategory,
                stock: stock || undefined,
                featured: featured || undefined,
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

        // Verificar que el file es válido
        if (!(file instanceof File)) {
            return NextResponse.json(
                { success: false, message: "El archivo de imagen es inválido" },
                { status: 400 }
            );
        }

        // Validar tipo de archivo (solo imágenes)
        const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!validImageTypes.includes(file.type)) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: "Solo se permiten archivos de imagen (jpeg, jpg, png, webp)" 
                },
                { status: 400 }
            );
        }

        // Convertir archivo a buffer y luego a Data URI para Cloudinary
        const buffer = await file.arrayBuffer();
        const dataUri = `data:${file.type};base64,${Buffer.from(buffer).toString("base64")}`;

        // Subir imagen a Cloudinary
        const uploadResult = await cloudinary.uploader.upload(dataUri, {
            folder: "techland/products", // Carpeta en Cloudinary
            resource_type: "image",
            transformation: [
                { width: 800, height: 800, crop: "limit" }, // Limitar tamaño
                { quality: "auto" }, // Calidad automática
                { fetch_format: "auto" } // Formato automático
            ]
        });

        console.log("✅ Imagen subida a Cloudinary:", uploadResult.secure_url);

        // Conectar a la base de datos
        await dbConnection();

        // Crear nuevo producto en MongoDB
        const newProduct = new Product({
            name,
            description,
            price: parseFloat(price),
            category,
            subcategory,
            image: uploadResult.secure_url, // URL de Cloudinary
            stock: stock ? parseInt(stock) : 0,
            featured: featured === "true",
        });

        // Guardar producto
        const savedProduct = await newProduct.save();

        console.log("✅ Producto guardado en MongoDB:", savedProduct._id);

        // Enviar notificación al admin sobre nuevo producto
        try {
            const admin = await User.findOne({ role: 'Admin' });
            if (admin && admin.email) {
                await sendEmail({
                    to: admin.email,
                    subject: 'Nuevo Producto Creado en Techland',
                    html: newProductEmailTemplate(savedProduct.name, savedProduct.price, savedProduct.category),
                });
            }
        } catch (emailError) {
            console.error('Error enviando notificación al admin:', emailError);
            // No fallar la creación del producto si el email falla
        }

        return NextResponse.json(
            {
                success: true,
                message: "Producto creado correctamente",
                data: savedProduct,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("❌ Error al crear producto:", error);
        
        // Manejo específico de errores de validación de Mongoose
        if (error instanceof Error && error.name === "ValidationError") {
            return NextResponse.json(
                { 
                    success: false, 
                    message: "Error de validación",
                    error: error.message
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { 
                success: false, 
                message: "Error interno del servidor",
                error: error instanceof Error ? error.message : "Error desconocido"
            },
            { status: 500 }
        );
    }
}