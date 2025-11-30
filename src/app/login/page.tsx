'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import axios from 'axios'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { showToast } from '@/lib/toast'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import styles from './login.module.css'
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline'


export default function LoginPage() {
  const router = useRouter()
  const { user: currentUser, login } = useAuth()
  const { t } = useLanguage()
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Redirect if already logged in
    if (currentUser) {
      router.push('/')
    }
  }, [currentUser, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!user.trim()) {
      setError(t('login.errors.emailRequired'))
      setLoading(false)
      return
    }

    if (!pass.trim()) {
      setError(t('login.errors.passwordRequired'))
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
        // Login successful - use AuthContext
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
        showToast.success(`${t('messages.welcomeBack')}, ${data.user.name}!`, { autoClose: 2000 })

        setTimeout(() => {
          router.push('/')
        }, 500)
      }
    } catch (error) {
      console.error('Login error:', error)

      // Manejar errores de axios
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.error || t('login.errors.loginError')
        setError(errorMessage)
        showToast.error(errorMessage)
      } else {
        setError(t('login.errors.loginError'))
        showToast.error(t('login.errors.loginError'))
      }
    }

    setLoading(false)
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>

        {/* Title */}
        <div className={styles.header}>
          <h1 className={styles.title}>{t('login.title')}</h1>
          <p className={styles.subtitle}>{t('login.subtitle')}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label={t('login.email')}
            type="text"
            value={user}
            onChange={(e) => {
              setUser(e.target.value)
              setError('')
            }}
            error={error && !user.trim() ? t('login.errors.emailRequired') : ''}
            icon={<UserIcon />}
            required
          />

          <Input
            label={t('login.password')}
            type="password"
            value={pass}
            onChange={(e) => {
              setPass(e.target.value)
              setError('')
            }}
            error={error && !pass.trim() ? t('login.errors.passwordRequired') : ''}
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
            {loading ? t('login.signingIn') : t('login.submitButton')}
          </Button>
        </form>

        {/* Register Link */}
        <div className={styles.divider}>
          <span>{t('login.or')}</span>
        </div>

        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className={styles.googleButton}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className={styles.googleIcon}
          />
          {t('login.signInWithGoogle')}
        </Button>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            {t('login.registerLink').split('?')[0]}?{' '}
            <Link href="/register" className={styles.footerLink}>
              {t('login.registerLink').split('?')[1] || 'Sign up'}
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
