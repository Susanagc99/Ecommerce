'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { showToast } from '@/helpers/toast'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import styles from '../login/login.module.css'
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { t } = useLanguage()
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
      newErrors.name = t('register.errors.nameRequired')
    }

    if (!formData.email.trim()) {
      newErrors.email = t('register.errors.emailRequired')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('register.errors.emailInvalid')
    }

    if (!formData.username.trim()) {
      newErrors.username = t('register.errors.usernameRequired')
    } else if (formData.username.length < 3) {
      newErrors.username = t('register.errors.usernameShort')
    }

    if (!formData.password.trim()) {
      newErrors.password = t('register.errors.passwordRequired')
    } else if (formData.password.length < 6) {
      newErrors.password = t('register.errors.passwordShort')
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('register.errors.passwordMismatch')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      showToast.error(t('register.messages.fixErrors'))
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
        // Registration successful
        showToast.success(t('register.messages.success'), { autoClose: 2000 })

        // Auto-login after registration using AuthContext
        const sessionData = {
          id: data.user.id,
          username: data.user.username,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          isActive: data.user.isActive,
          loginTime: new Date().toISOString(),
        }

        login(sessionData)

        setTimeout(() => {
          router.push('/')
        }, 800)
      }
    } catch (error) {
      console.error('Register error:', error)
      
      // Manejar errores de axios
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.error || t('register.messages.failed')
        showToast.error(errorMessage)

        // Establecer errores específicos si los hay
        if (errorMessage.includes('Username')) {
          setErrors({ ...errors, username: errorMessage })
        } else if (errorMessage.includes('Email')) {
          setErrors({ ...errors, email: errorMessage })
        }
      } else {
        showToast.error(t('register.messages.connectionError'))
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
          <h1 className={styles.title}>{t('register.title')}</h1>
          <p className={styles.subtitle}>{t('register.subtitle')}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label={t('register.fullName')}
            type="text"
            value={formData.name}
            onChange={handleChange('name')}
            error={errors.name}
            icon={<UserIcon />}
            required
          />

          <Input
            label={t('register.email')}
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            error={errors.email}
            icon={<EnvelopeIcon />}
            required
          />

          <Input
            label={t('register.username')}
            type="text"
            value={formData.username}
            onChange={handleChange('username')}
            error={errors.username}
            icon={<UserIcon />}
            helperText={t('register.usernameHelper')}
            required
          />

          <Input
            label={t('register.password')}
            type="password"
            value={formData.password}
            onChange={handleChange('password')}
            error={errors.password}
            icon={<LockClosedIcon />}
            helperText={t('register.passwordHelper')}
            required
          />

          <Input
            label={t('register.confirmPassword')}
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
            {loading ? t('register.creating') : t('register.submitButton')}
          </Button>
        </form>

        {/* Login Link */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            {t('register.loginLink')}{' '}
            <Link href="/login" className={styles.footerLink}>
              {t('register.signIn')}
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

