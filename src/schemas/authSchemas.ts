import * as yup from "yup";

/**
 * Schema para login
 * Valida username y password
 */
export const loginSchema = yup.object().shape({
    username: yup
        .string()
        .required("El nombre de usuario es requerido")
        .trim(),

    password: yup
        .string()
        .required("La contraseña es requerida")
        .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

/**
 * Schema para registro
 * Valida todos los campos requeridos para crear un usuario
 */
export const registerSchema = yup.object().shape({
    username: yup
        .string()
        .required("El nombre de usuario es requerido")
        .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
        .trim(),

    password: yup
        .string()
        .required("La contraseña es requerida")
        .min(6, "La contraseña debe tener al menos 6 caracteres"),

    name: yup
        .string()
        .required("El nombre es requerido")
        .trim(),

    email: yup
        .string()
        .required("El email es requerido")
        .email("Por favor proporciona un email válido")
        .trim()
        .lowercase(),
});

