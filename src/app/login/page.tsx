'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input, Button } from '@heroui/react';

// Usuarios hardcoded
const usuariosHardcoded = [
    {
        username: "susana",
        password: "admin123",
        name: "Susana Gutiérrez",
        role: "Admin",
        isActive: true,
    },
    {
        username: "Maria",
        password: "holi123",
        name: "María Rodríguez",
        role: "Customer",
        isActive: true,
    }
];

export default function Home() {
    const router = useRouter();
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Redirigir si ya hay sesión
        const session = localStorage.getItem("userSession");
        if (session) {
            router.push("/dashboard");
        }
    }, [router]);

    const handleClick = async () => {
        setError("");
        setLoading(true);

        if (!user.trim()) {
            setError("El usuario es requerido");
            setLoading(false);
            return;
        }

        if (!pass.trim()) {
            setError("La contraseña es requerida");
            setLoading(false);
            return;
        }

        const usuarioEncontrado = usuariosHardcoded.find(
            u => u.username === user && u.password === pass
        );

        if (usuarioEncontrado) {
            const sessionData = {
                username: usuarioEncontrado.username,
                name: usuarioEncontrado.name,
                role: usuarioEncontrado.role,
                isActive: usuarioEncontrado.isActive,
                loginTime: new Date().toISOString()
            };

            localStorage.setItem("userSession", JSON.stringify(sessionData));
            router.push("/dashboard");
        } else {
            setError("Usuario o contraseña inválidos");
        }

        setLoading(false);
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="text-2xl font-bold mb-6 text-center">Login</div>

                <Input
                    label="Username"
                    type="text"
                    value={user}
                    onChange={(e) => {
                        setUser(e.target.value);
                        setError("");
                    }}
                    isInvalid={!!error && !user.trim()}
                    className="w-full"
                />

                <Input
                    label="Password"
                    labelPlacement="inside"
                    type="password"
                    value={pass}
                    onChange={(e) => {
                        setPass(e.target.value);
                        setError("");
                    }}
                    isInvalid={!!error && !pass.trim()}
                    className="w-full"
                />

                {error && (
                    <div className="error-message mb-4 p-3 text-gray-500 rounded">
                        {error}
                    </div>
                )}

                <Button
                    onPress={handleClick}
                    className="bg-linear-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                    radius="full"
                    isLoading={loading}
                    isDisabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </Button>
            </div>
        </div>
    );
}