'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
import { showToast } from '@/lib/toast'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/context/LanguageContext'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  requireAuth?: boolean
  comingSoon?: boolean
}

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { getItemCount } = useCart()
  const [itemCount, setItemCount] = useState(0)

  // Update cart item count
  useEffect(() => {
    const updateItemCount = () => {
      setItemCount(getItemCount())
    }

    // Update on mount
    updateItemCount()

    // Listen for cart changes
    window.addEventListener('cartUpdate', updateItemCount)

    return () => {
      window.removeEventListener('cartUpdate', updateItemCount)
    }
  }, [getItemCount])

  // Close mobile menu when route changes
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
  }, [pathname, isMobileMenuOpen])

  const isActive = (path: string) => pathname === path

  const handleLogout = async () => {
    await logout()
  }

  const handleComingSoon = (label: string) => {
    showToast.info(`${label} ${t('common.comingSoon')}`, { autoClose: 2000 })
  }

  // Navigation items for Admins
  const adminNavItems: NavItem[] = [
    { href: '/dashboard', label: t('navbar.dashboard'), icon: ChartBarIcon },
  ]

  // Navigation items for Customers and unauthenticated users
  const customerNavItems: NavItem[] = [
    { href: '/shop', label: t('navbar.shop'), icon: ShoppingBagIcon, requireAuth: false },
    { href: '/favorites', label: t('navbar.favorites'), icon: HeartIcon, requireAuth: true, comingSoon: true },
    { href: '/purchases', label: t('navbar.myPurchases'), icon: TruckIcon, requireAuth: true, comingSoon: true },
    { href: '/about', label: t('navbar.about'), icon: InformationCircleIcon, requireAuth: false },
  ]

  // Determine which items to show based on user role
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
                {item.comingSoon ? (
                  <button
                    onClick={() => handleComingSoon(item.label)}
                    className={styles.navLink}
                  >
                    <Icon className={styles.navIcon} />
                    <span>{item.label}</span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`${styles.navLink} ${isActive(item.href) ? styles.active : ''
                      }`}
                  >
                    <Icon className={styles.navIcon} />
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            )
          })}
        </ul>

        {/* Right Section - Cart, User, Login */}
        <div className={styles.rightSection}>
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Cart - Only visible for Customers and unauthenticated users */}
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
                <span>{t('navbar.logout')}</span>
              </button>
            </div>
          ) : (
            <Link href="/login" className={styles.loginButton}>
              <ArrowRightStartOnRectangleIcon className={styles.icon} />
              <span>{t('navbar.login')}</span>
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
                    {item.comingSoon ? (
                      <button
                        onClick={() => handleComingSoon(item.label)}
                        className={styles.mobileNavLink}
                      >
                        <Icon className={styles.navIcon} />
                        <span>{item.label}</span>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={`${styles.mobileNavLink} ${isActive(item.href) ? styles.active : ''
                          }`}
                      >
                        <Icon className={styles.navIcon} />
                        <span>{item.label}</span>
                      </Link>
                    )}
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
                    <span>{t('navbar.logout')}</span>
                  </button>
                </>
              ) : (
                <Link href="/login" className={styles.mobileLoginButton}>
                  <ArrowRightStartOnRectangleIcon className={styles.icon} />
                  <span>{t('navbar.login')}</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

