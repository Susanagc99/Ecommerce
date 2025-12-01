import nodemailer from "nodemailer";

/**
 * Configuración del transporter de Nodemailer
 * Usa las variables de entorno para autenticación
 */
const createTransporter = () => {
    const userMail = process.env.MAIL_USER;
    const passMail = process.env.MAIL_PASS;

    if (!userMail || !passMail) {
        throw new Error("Email configuration is incomplete. MAIL_USER and MAIL_PASS are required.");
    }

    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: userMail,
            pass: passMail,
        },
    });
};

/**
 * Interfaz para opciones de email
 */
interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    attachments?: Array<{
        filename: string;
        content: Buffer;
    }>;
}

/**
 * Función para enviar email
 * @param options - Opciones del email (to, subject, html, attachments opcional)
 * @returns Promise con el resultado del envío
 */
export const sendEmail = async (options: EmailOptions): Promise<void> => {
    try {
        const transporter = createTransporter();
        const userMail = process.env.MAIL_USER || "";

        const mailOptions = {
            from: `"Techland" <${userMail}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
            attachments: options.attachments || [],
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email enviado exitosamente a: ${options.to}`);
    } catch (error: any) {
        console.error("Error enviando email:", error);
        throw new Error(`Error al enviar email: ${error.message}`);
    }
};

