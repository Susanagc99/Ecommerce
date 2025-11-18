'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import { toast } from 'react-toastify'
import styles from './dashboard.module.css'

interface UserSession {
  username: string
  name: string
  email?: string
  role: string
  isActive: boolean
  loginTime: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserSession | null>(null)

  useEffect(() => {
    const session = localStorage.getItem('userSession')
    if (!session) {
      router.push('/login')
    } else {
      setUser(JSON.parse(session))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('userSession')
    toast.success('Logged out successfully! 👋', {
      position: 'top-right',
      autoClose: 2000,
    })
    setTimeout(() => {
      router.push('/login')
    }, 500)
  }

  if (!user) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    )
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>Welcome back, {user.name}!</p>
          </div>
          <Button onClick={handleLogout} variant="outline" size="md">
            Logout
          </Button>
        </div>

        {/* User Info Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>👤 User Information</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Name:</span>
              <span className={styles.infoValue}>{user.name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Username:</span>
              <span className={styles.infoValue}>{user.username}</span>
            </div>
            {user.email && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{user.email}</span>
              </div>
            )}
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Role:</span>
              <span className={`${styles.badge} ${styles[user.role.toLowerCase()]}`}>
                {user.role}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Status:</span>
              <span className={`${styles.badge} ${styles.active}`}>
                Active
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Login Time:</span>
              <span className={styles.infoValue}>
                {new Date(user.loginTime).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>⚡ Quick Actions</h2>
          <div className={styles.actionsGrid}>
            <button
              onClick={() => router.push('/')}
              className={styles.actionCard}
            >
              <span className={styles.actionIcon}>🏠</span>
              <span className={styles.actionText}>Go to Home</span>
            </button>
            <button
              onClick={() => router.push('/shop')}
              className={styles.actionCard}
            >
              <span className={styles.actionIcon}>🛍️</span>
              <span className={styles.actionText}>Browse Shop</span>
            </button>
            <button
              onClick={() => router.push('/favorites')}
              className={styles.actionCard}
            >
              <span className={styles.actionIcon}>❤️</span>
              <span className={styles.actionText}>My Favorites</span>
            </button>
            <button
              onClick={() => router.push('/purchases')}
              className={styles.actionCard}
            >
              <span className={styles.actionIcon}>📦</span>
              <span className={styles.actionText}>My Orders</span>
            </button>
          </div>
        </div>

        {/* Coming Soon */}
        <div className={styles.comingSoon}>
          <p>🚀 More dashboard features coming soon!</p>
        </div>
      </div>
    </div>
  )
}
