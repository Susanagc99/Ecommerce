import { Schema, model, models } from 'mongoose';
import { CATEGORIES, type CategoryType, type SubcategoryType } from '@/constants/categories';

// Exportar tipos y constantes para usar en otros archivos
export { CATEGORIES, type CategoryType, type SubcategoryType };

// Interface para TypeScript
export interface IProduct {
    name: string;
    description: string;
    price: number;
    category: CategoryType;
    subcategory: SubcategoryType;
    image: string;
    stock: number;
    featured: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// Schema de Mongoose
const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre del producto es requerido'],
            trim: true,
            minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
        },
        description: {
            type: String,
            required: [true, 'La descripción es requerida'],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'El precio es requerido'],
            min: [0, 'El precio no puede ser negativo'],
        },
        category: {
            type: String,
            required: [true, 'La categoría es requerida'],
            enum: {
                values: Object.keys(CATEGORIES),
                message: '{VALUE} no es una categoría válida'
            },
        },
        subcategory: {
            type: String,
            required: [true, 'La subcategoría es requerida'],
            validate: {
                validator: function(this: IProduct, value: string) {
                    // Validar que la subcategoría pertenezca a la categoría seleccionada
                    const validSubcategories = CATEGORIES[this.category as CategoryType];
                    return validSubcategories?.includes(value as never);
                },
                message: 'La subcategoría no corresponde a la categoría seleccionada'
            }
        },
        image: {
            type: String,
            required: [true, 'La imagen es requerida'],
            trim: true,
        },
        stock: {
            type: Number,
            default: 0,
            min: [0, 'El stock no puede ser negativo'],
        },
        featured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // Agrega createdAt y updatedAt automáticamente
    }
);

// Índices para mejorar búsquedas
ProductSchema.index({ category: 1, subcategory: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ name: 'text', description: 'text' });

// Exportar el modelo (evita recrear el modelo si ya existe)
const Product = models.Product || model<IProduct>('Product', ProductSchema);

export default Product;