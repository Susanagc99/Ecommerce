'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { toast } from 'react-toastify'
import styles from './login.module.css'
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline'


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

    try {
      // Llamar al API de login con axios
      const { data } = await axios.post('/api/auth/login', {
        username: user,
        password: pass,
      })

      if (data.success) {
        // Login exitoso
        const sessionData = {
          id: data.user.id,
          username: data.user.username,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          isActive: data.user.isActive,
          loginTime: new Date().toISOString(),
        }

        localStorage.setItem('userSession', JSON.stringify(sessionData))
        
        // Disparar evento para actualizar el Navbar
        window.dispatchEvent(new Event('userSessionUpdate'))
        
        toast.success(`Welcome back, ${data.user.name}! 👋`, {
          position: 'top-right',
          autoClose: 2000,
        })

        setTimeout(() => {
          router.push('/')
        }, 500)
      }
    } catch (error) {
      console.error('Login error:', error)

      // Manejar errores de axios
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.error || 'Invalid username or password'
        setError(errorMessage)
        toast.error(errorMessage, {
          position: 'top-right',
        })
      } else {
        setError('Connection error. Please try again.')
        toast.error('Connection error. Please try again.', {
          position: 'top-right',
        })
      }
    }

    setLoading(false)
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>

        {/* Title */}
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to continue to Techland</p>
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
            Don&apos;t have an account?{' '}
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
