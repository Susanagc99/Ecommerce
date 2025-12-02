import * as yup from "yup";
import { CATEGORIES } from "@/constants/categories";

// Obtener todas las categorías válidas
const validCategories = Object.keys(CATEGORIES) as string[];

// Obtener todas las subcategorías válidas
const validSubcategories = Object.values(CATEGORIES).flat();

/**
 * Schema para crear un producto
 * Valida todos los campos requeridos incluyendo el archivo de imagen
 */
export const createProductSchema = yup.object().shape({
    name: yup
        .string()
        .required("El nombre del producto es requerido")
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .trim(),

    description: yup
        .string()
        .required("La descripción es requerida")
        .trim(),

    price: yup
        .string()
        .required("El precio es requerido")
        .test("is-positive", "El precio debe ser mayor a 0", (value) => {
            if (!value) return false;
            const numValue = parseFloat(value);
            return !isNaN(numValue) && numValue > 0;
        }),

    category: yup
        .string()
        .required("La categoría es requerida")
        .oneOf(validCategories, "La categoría no es válida"),

    subcategory: yup
        .string()
        .required("La subcategoría es requerida")
        .oneOf(validSubcategories, "La subcategoría no es válida"),

    stock: yup
        .string()
        .optional()
        .test("is-non-negative", "El stock no puede ser negativo", (value) => {
            if (!value) return true; // Opcional
            const numValue = parseInt(value);
            return !isNaN(numValue) && numValue >= 0;
        }),

    featured: yup
        .string()
        .optional()
        .oneOf(["true", "false"], "El valor de featured debe ser true o false"),
});

/**
 * Schema para actualizar un producto
 * Todos los campos son opcionales excepto los que se envían
 */
export const updateProductSchema = yup.object().shape({
    name: yup
        .string()
        .optional()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .trim(),

    description: yup
        .string()
        .optional()
        .trim(),

    price: yup
        .string()
        .optional()
        .test("is-positive", "El precio debe ser mayor a 0", (value) => {
            if (!value) return true; // Opcional
            const numValue = parseFloat(value);
            return !isNaN(numValue) && numValue > 0;
        }),

    category: yup
        .string()
        .optional()
        .oneOf(validCategories, "La categoría no es válida"),

    subcategory: yup
        .string()
        .optional()
        .oneOf(validSubcategories, "La subcategoría no es válida"),

    stock: yup
        .string()
        .optional()
        .test("is-non-negative", "El stock no puede ser negativo", (value) => {
            if (!value) return true; // Opcional
            const numValue = parseInt(value);
            return !isNaN(numValue) && numValue >= 0;
        }),

    featured: yup
        .string()
        .optional()
        .oneOf(["true", "false"], "El valor de featured debe ser true o false"),
});

