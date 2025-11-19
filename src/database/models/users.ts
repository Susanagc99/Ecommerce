import { Schema, model, models } from 'mongoose';

// Interface para TypeScript
export interface IUser {
    username: string;
    password: string;
    name: string;
    email: string;
    role: 'Admin' | 'Customer';
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// Schema de Mongoose
const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            lowercase: true,
            minlength: [3, 'Username must be at least 3 characters'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        role: {
            type: String,
            enum: ['Admin', 'Customer'],
            default: 'Customer',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true, // Agrega createdAt y updatedAt automáticamente
    }
);

// Exportar el modelo (evita recrear el modelo si ya existe)
const User = models.User || model<IUser>('User', UserSchema);

export default User;

