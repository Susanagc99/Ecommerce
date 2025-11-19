'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { toast } from 'react-toastify'
import styles from '../login/login.module.css'
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Redirigir si ya hay sesión
    const session = localStorage.getItem('userSession')
    if (session) {
      router.push('/')
    }
  }, [router])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the errors in the form', {
        position: 'top-right',
      })
      return
    }

    setLoading(true)

    try {
      // Llamar al API de registro con axios
      const { data } = await axios.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
      })

      if (data.success) {
        // Registro exitoso
        toast.success('Account created successfully!', {
          position: 'top-right',
          autoClose: 2000,
        })

        // Auto-login después del registro
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

        setTimeout(() => {
          router.push('/')
        }, 800)
      }
    } catch (error) {
      console.error('Register error:', error)
      
      // Manejar errores de axios
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.error || 'Registration failed. Please try again.'
        toast.error(errorMessage, {
          position: 'top-right',
        })

        // Establecer errores específicos si los hay
        if (errorMessage.includes('Username')) {
          setErrors({ ...errors, username: errorMessage })
        } else if (errorMessage.includes('Email')) {
          setErrors({ ...errors, email: errorMessage })
        }
      } else {
        toast.error('Connection error. Please try again.', {
          position: 'top-right',
        })
      }
    }

    setLoading(false)
  }

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value })
    // Limpiar error del campo al escribir
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>

        {/* Title */}
        <div className={styles.header}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join Techland today and start shopping</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={handleChange('name')}
            error={errors.name}
            icon={<UserIcon />}
            required
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            error={errors.email}
            icon={<EnvelopeIcon />}
            required
          />

          <Input
            label="Username"
            type="text"
            value={formData.username}
            onChange={handleChange('username')}
            error={errors.username}
            icon={<UserIcon />}
            helperText="At least 3 characters"
            required
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange('password')}
            error={errors.password}
            icon={<LockClosedIcon />}
            helperText="At least 6 characters"
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            error={errors.confirmPassword}
            icon={<LockClosedIcon />}
            required
          />

          <Button
            type="submit"
            size="lg"
            variant="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        {/* Login Link */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            Already have an account?{' '}
            <Link href="/login" className={styles.footerLink}>
              Sign in
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

