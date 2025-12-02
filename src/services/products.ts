import axios from "axios";

// Interface para crear producto
export interface CreateProductData {
    name: string;
    description: string;
    price: string | number;
    category: string;
    subcategory: string;
    stock?: string | number;
    featured?: boolean;
    file: File | null;
}

// Interface para actualizar producto
export interface UpdateProductData {
    name: string;
    description: string;
    price: string | number;
    category: string;
    subcategory: string;
    stock?: string | number;
    featured?: boolean;
    file?: File | null; // Opcional porque puede que no se cambie la imagen
}

// Interface para la respuesta al crear producto
export interface CreateProductResponse {
    success: boolean;
    message?: string;
    data?: {
        _id: string;
        name: string;
        description: string;
        price: number;
        category: string;
        subcategory: string;
        image: string;
        stock: number;
        featured: boolean;
        createdAt: string;
        updatedAt: string;
    };
}

// Interface para obtener productos con filtros y paginación
export interface GetProductsParams {
    category?: string;
    subcategory?: string;
    featured?: boolean;
    search?: string;
    page?: number;
    perPage?: number;
}

// Interface para la respuesta al obtener productos con paginación
export interface GetProductsResponse {
    success: boolean;
    data: Array<{
        _id: string;
        name: string;
        description: string;
        price: number;
        category: string;
        subcategory: string;
        image: string;
        stock: number;
        featured: boolean;
        createdAt: string;
        updatedAt: string;
    }>;
    pagination: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
    };
}


/**
 * Crear un nuevo producto con imagen
 * @param productData - Datos del producto incluyendo el archivo
 * @returns Promise con la respuesta del servidor
 */
export const createProduct = async (
    productData: CreateProductData
): Promise<CreateProductResponse> => {
    try {
        // Crear FormData para enviar archivo
        const formData = new FormData();
        formData.append("name", productData.name);
        formData.append("description", productData.description);
        formData.append("price", productData.price.toString());
        formData.append("category", productData.category);
        formData.append("subcategory", productData.subcategory);

        // Campos opcionales
        if (productData.stock !== undefined) {
            formData.append("stock", productData.stock.toString());
        }
        if (productData.featured !== undefined) {
            formData.append("featured", productData.featured.toString());
        }

        // Archivo
        if (productData.file) {
            formData.append("file", productData.file);
        }

        // Enviar con axios
        const response = await axios.post("/api/products", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error;
        }
        throw new Error("Error desconocido al crear producto");
    }
};

/**
 * Obtener lista de productos con filtros opcionales y paginación del servidor
 * @param params - Parámetros de búsqueda y paginación (category, subcategory, featured, search, page, perPage)
 * @returns Promise con la lista de productos y información de paginación
 */
export const getProducts = async (
    params?: GetProductsParams
): Promise<GetProductsResponse> => {
    try {
        // Construir query string
        const queryParams = new URLSearchParams();

        if (params?.category) {
            queryParams.append("category", params.category);
        }
        if (params?.subcategory) {
            queryParams.append("subcategory", params.subcategory);
        }
        if (params?.featured !== undefined) {
            queryParams.append("featured", params.featured.toString());
        }
        if (params?.search) {
            queryParams.append("search", params.search);
        }
        if (params?.page) {
            queryParams.append("page", params.page.toString());
        }
        if (params?.perPage) {
            queryParams.append("perPage", params.perPage.toString());
        }

        const queryString = queryParams.toString();
        const url = queryString ? `/api/products?${queryString}` : "/api/products";

        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error;
        }
        throw new Error("Error desconocido al obtener productos");
    }
};

/**
 * Obtener un producto por su ID
 * @param id - ID del producto
 * @returns Promise con los datos del producto
 */
export const getProductById = async (id: string) => {
    try {
        const response = await axios.get(`/api/products/${id}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error;
        }
        throw new Error("Error desconocido al obtener el producto");
    }
};

/**
 * Actualizar un producto existente
 * @param id - ID del producto a actualizar
 * @param productData - Datos del producto (file es opcional)
 * @returns Promise con la respuesta del servidor
 */
export const updateProduct = async (
    id: string,
    productData: UpdateProductData
): Promise<CreateProductResponse> => {
    try {
        // Crear FormData para enviar archivo (si existe)
        const formData = new FormData();
        formData.append("name", productData.name);
        formData.append("description", productData.description);
        formData.append("price", productData.price.toString());
        formData.append("category", productData.category);
        formData.append("subcategory", productData.subcategory);

        // Campos opcionales
        if (productData.stock !== undefined) {
            formData.append("stock", productData.stock.toString());
        }
        if (productData.featured !== undefined) {
            formData.append("featured", productData.featured.toString());
        }

        // Archivo (opcional - solo si se quiere cambiar la imagen)
        if (productData.file) {
            formData.append("file", productData.file);
        }

        // Enviar con axios
        const response = await axios.put(`/api/products/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error;
        }
        throw new Error("Error desconocido al actualizar producto");
    }
}; 