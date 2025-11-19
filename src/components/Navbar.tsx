'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import styles from '@/styles/Navbar.module.css'
import {
  HeartIcon,
  ShoppingCartIcon,
  ShoppingBagIcon,
  TruckIcon,
  InformationCircleIcon,
  UserIcon,
  ArrowRightEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'

// TODO: Descomentar cuando creemos los contexts
// import { useCart } from '@/context/CartContext'

interface UserSession {
  id: string
  username: string
  name: string
  email: string
  role: 'Admin' | 'Customer'
  isActive: boolean
  loginTime: string
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<UserSession | null>(null)

  // TODO: Descomentar cuando creemos CartContext
  // const { getItemCount } = useCart()
  // const itemCount = getItemCount()
  
  const itemCount = 0

  // Leer usuario del localStorage
  useEffect(() => {
    const loadUser = () => {
      const sessionData = localStorage.getItem('userSession')
      if (sessionData) {
        try {
          const parsedUser = JSON.parse(sessionData)
          setUser(parsedUser)
        } catch (error) {
          console.error('Error parsing user session:', error)
          localStorage.removeItem('userSession')
        }
      }
    }

    loadUser()

    // Escuchar cambios en el localStorage
    window.addEventListener('storage', loadUser)
    window.addEventListener('userSessionUpdate', loadUser)

    return () => {
      window.removeEventListener('storage', loadUser)
      window.removeEventListener('userSessionUpdate', loadUser)
    }
  }, [])

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const isActive = (path: string) => pathname === path

  const handleLogout = () => {
    localStorage.removeItem('userSession')
    setUser(null)
    
    toast.info('You have been logged out successfully', {
      position: 'top-right',
      autoClose: 2000,
    })
    
    router.push('/login')
  }

  // Navigation items para Admins
  const adminNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: ChartBarIcon },
  ]

  // Navigation items para Customers y usuarios no autenticados
  const customerNavItems = [
    { href: '/shop', label: 'Shop', icon: ShoppingBagIcon, requireAuth: false },
    { href: '/favorites', label: 'Favorites', icon: HeartIcon, requireAuth: true },
    { href: '/purchases', label: 'My Purchases', icon: TruckIcon, requireAuth: true },
    { href: '/about', label: 'About Us', icon: InformationCircleIcon, requireAuth: false },
  ]

  // Determinar qué items mostrar según el rol del usuario
  const visibleNavItems = user?.role === 'Admin' 
    ? adminNavItems 
    : customerNavItems.filter(item => !item.requireAuth || user)

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>Techland</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className={styles.navList}>
          {visibleNavItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${
                    isActive(item.href) ? styles.active : ''
                  }`}
                >
                  <Icon className={styles.navIcon} />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Right Section - Cart, User, Login */}
        <div className={styles.rightSection}>
          {/* Cart - Solo visible para Customers y no autenticados */}
          {user?.role !== 'Admin' && (
            <Link href="/cart" className={styles.cartButton}>
              <ShoppingCartIcon className={styles.icon} />
              {itemCount > 0 && (
                <span className={styles.cartBadge}>{itemCount}</span>
              )}
            </Link>
          )}

          {/* User Menu */}
          {user ? (
            <div className={styles.userMenu}>
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  <UserIcon className={styles.icon} />
                </div>
                <div className={styles.userDetails}>
                  <span className={styles.userName}>{user.username}</span>
                  <span className={styles.userRole}>{user.role}</span>
                </div>
              </div>
              <button onClick={handleLogout} className={styles.logoutButton}>
                <ArrowRightEndOnRectangleIcon className={styles.icon} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link href="/login" className={styles.loginButton}>
              <ArrowRightStartOnRectangleIcon className={styles.icon} />
              <span>Login</span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={styles.mobileMenuToggle}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className={styles.icon} />
            ) : (
              <Bars3Icon className={styles.icon} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <ul className={styles.mobileNavList}>
              {visibleNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`${styles.mobileNavLink} ${
                        isActive(item.href) ? styles.active : ''
                      }`}
                    >
                      <Icon className={styles.navIcon} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* Mobile User Section */}
            <div className={styles.mobileUserSection}>
              {user ? (
                <>
                  <div className={styles.mobileUserInfo}>
                    <UserIcon className={styles.icon} />
                    <div>
                      <p className={styles.userName}>{user.username}</p>
                      <p className={styles.userRole}>{user.role}</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className={styles.mobileLogoutButton}>
                    <ArrowRightEndOnRectangleIcon className={styles.icon} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link href="/login" className={styles.mobileLoginButton}>
                  <ArrowRightStartOnRectangleIcon className={styles.icon} />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

