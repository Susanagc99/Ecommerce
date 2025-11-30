'use client'

import { SessionProvider } from "next-auth/react"
import 'sweetalert2/dist/sweetalert2.min.css'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { LanguageProvider } from '@/context/LanguageContext'
import ToastContainer from '@/components/ToastContainer'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <SessionProvider>
        <AuthProvider>
          <CartProvider>
            <ToastContainer />
            {children}
          </CartProvider>
        </AuthProvider>
      </SessionProvider>
    </LanguageProvider>
  )
}
