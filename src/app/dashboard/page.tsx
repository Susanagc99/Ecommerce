'use client'

import { useRouter } from "next/navigation";
import { Button } from '@heroui/react';

const Dashboard = () => {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("userSession");
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-black">Dashboard</h1>
                    <Button
                        onPress={handleLogout}
                        className="bg-linear-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                        radius="full"
                    >
                        Cerrar Sesión
                    </Button>
                </div>
                
                <div className="text-gray-500 p-6 rounded-lg shadow">
                    <p>Contenido del dashboard</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;