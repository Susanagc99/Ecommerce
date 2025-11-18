'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '@/components/Input'
import Button from '@/components/Button'
import Logo from '@/components/Logo'
import { toast } from 'react-toastify'
import styles from './login.module.css'
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline'

// Usuarios hardcoded
const usuariosHardcoded = [
  {
    username: 'susana',
    password: 'admin123',
    name: 'Susana Gutiérrez',
    email: 'susana@techland.com',
    role: 'Admin',
    isActive: true,
  },
  {
    username: 'maria',
    password: 'holi123',
    name: 'María Rodríguez',
    email: 'maria@example.com',
    role: 'Customer',
    isActive: true,
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Redirigir si ya hay sesión
    const session = localStorage.getItem('userSession')
    if (session) {
      router.push('/')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!user.trim()) {
      setError('Username is required')
      setLoading(false)
      return
    }

    if (!pass.trim()) {
      setError('Password is required')
      setLoading(false)
      return
    }

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800))

    const usuarioEncontrado = usuariosHardcoded.find(
      (u) => u.username.toLowerCase() === user.toLowerCase() && u.password === pass
    )

    if (usuarioEncontrado) {
      const sessionData = {
        username: usuarioEncontrado.username,
        name: usuarioEncontrado.name,
        email: usuarioEncontrado.email,
        role: usuarioEncontrado.role,
        isActive: usuarioEncontrado.isActive,
        loginTime: new Date().toISOString(),
      }

      localStorage.setItem('userSession', JSON.stringify(sessionData))
      
      toast.success(`Welcome back, ${usuarioEncontrado.name}! 👋`, {
        position: 'top-right',
        autoClose: 2000,
      })

      setTimeout(() => {
        router.push('/')
      }, 500)
    } else {
      setError('Invalid username or password')
      toast.error('Login failed. Please check your credentials.', {
        position: 'top-right',
      })
    }

    setLoading(false)
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        {/* Logo */}
        <div className={styles.logoWrapper}>
          <Logo size="lg" />
        </div>

        {/* Title */}
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to continue to Techland</p>
        </div>

        {/* Demo Credentials */}
        <div className={styles.demoCredentials}>
          <p className={styles.demoTitle}>🔑 Demo Credentials:</p>
          <div className={styles.demoGrid}>
            <div className={styles.demoItem}>
              <strong>Admin:</strong> susana / admin123
            </div>
            <div className={styles.demoItem}>
              <strong>Customer:</strong> maria / holi123
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Username"
            type="text"
            value={user}
            onChange={(e) => {
              setUser(e.target.value)
              setError('')
            }}
            error={error && !user.trim() ? 'Username is required' : ''}
            icon={<UserIcon />}
            required
          />

          <Input
            label="Password"
            type="password"
            value={pass}
            onChange={(e) => {
              setPass(e.target.value)
              setError('')
            }}
            error={error && !pass.trim() ? 'Password is required' : ''}
            icon={<LockClosedIcon />}
            required
          />

          {error && (
            <div className={styles.errorMessage}>
              ⚠️ {error}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            variant="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Register Link */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            Don't have an account?{' '}
            <Link href="/register" className={styles.footerLink}>
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Background Decoration */}
      <div className={styles.background}>
        <div className={styles.shape1} />
        <div className={styles.shape2} />
        <div className={styles.shape3} />
      </div>
    </div>
  )
}
