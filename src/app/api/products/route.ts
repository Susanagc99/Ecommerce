import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/database";
import cloudinary from "@/lib/cloudinary";
import Product from "@/database/models/products";
import { createProductSchema } from "@/schemas/productSchemas";

/**
 * GET /api/products
 * Obtiene la lista de productos con filtros opcionales y paginación del servidor
 * Query params: category, subcategory, featured, search, page, perPage
 */
export async function GET(request: NextRequest) {
    try {
        await dbConnection();

        // Obtener parámetros de búsqueda y paginación
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const subcategory = searchParams.get("subcategory");
        const featured = searchParams.get("featured");
        const search = searchParams.get("search");
        const page = parseInt(searchParams.get("page") || "1");
        const perPage = parseInt(searchParams.get("perPage") || "8");

        // Validar parámetros de paginación
        const validPage = Math.max(1, page);
        const validPerPage = Math.max(1, Math.min(100, perPage)); // Máximo 100 por página

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

        // Contar total de documentos que coinciden con el filtro
        const total = await Product.countDocuments(filters);

        // Calcular skip para paginación
        const skip = (validPage - 1) * validPerPage;

        // Obtener productos paginados de la base de datos
        // IMPORTANTE: sort debe ir ANTES de skip y limit para paginación consistente
        // Usamos _id como sort secundario para garantizar orden estable
        const products = await Product.find(filters)
            .sort({ createdAt: -1, _id: -1 }) // Más recientes primero, _id para orden estable
            .skip(skip)
            .limit(validPerPage)
            .lean(); // Convierte a objetos JavaScript planos (mejor performance)

        // Calcular total de páginas
        const totalPages = Math.ceil(total / validPerPage);

        return NextResponse.json(
            {
                success: true,
                data: products,
                pagination: {
                    page: validPage,
                    perPage: validPerPage,
                    total,
                    totalPages,
                },
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

        console.log("Imagen subida a Cloudinary:", uploadResult.secure_url);

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

        console.log("Producto guardado en MongoDB:", savedProduct._id);

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