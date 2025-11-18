'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'
import styles from '@/styles/Navbar.module.css'
import {
  HomeIcon,
  ShoppingBagIcon,
  HeartIcon,
  ShoppingCartIcon,
  InformationCircleIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline'

// TODO: Descomentar cuando creemos los contexts
// import { useCart } from '@/context/CartContext'
// import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // TODO: Descomentar cuando creemos los contexts
  // const { getItemCount } = useCart()
  // const { user, logout, isAdmin } = useAuth()
  // const itemCount = getItemCount()
  // const isAdminUser = isAdmin()

  // Mock data mientras creamos los contexts
  const user = null
  const itemCount = 0
  const isAdminUser = false

  const isActive = (path: string) => pathname === path

  const handleLogout = () => {
    // TODO: Implementar logout cuando tengamos AuthContext
    console.log('Logout clicked')
  }

  // Navigation items
  const navItems = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/shop', label: 'Shop', icon: ShoppingBagIcon },
    { href: '/favorites', label: 'Favorites', icon: HeartIcon },
    { href: '/purchases', label: 'My Purchases', icon: ShoppingCartIcon },
    { href: '/about', label: 'About Us', icon: InformationCircleIcon },
  ]

  return (
    <>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <Logo size="md" collapsed={isCollapsed} />
        </div>

        {/* User Info */}
        {!isCollapsed && user && (
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <UserIcon className={styles.avatarIcon} />
            </div>
            <div className={styles.userDetails}>
              <p className={styles.userName}>Alex Doe</p>
              <p className={styles.userEmail}>alex.doe@example.com</p>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`${styles.navLink} ${
                      isActive(item.href) ? styles.active : ''
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className={styles.navIcon} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Cart Badge */}
        {itemCount > 0 && !isCollapsed && (
          <div className={styles.cartBadge}>
            <ShoppingCartIcon className={styles.cartIcon} />
            <div className={styles.cartInfo}>
              <span className={styles.cartLabel}>Cart Items</span>
              <span className={styles.cartCount}>{itemCount}</span>
            </div>
          </div>
        )}

        {/* Bottom Section - Login/Logout */}
        <div className={styles.bottomSection}>
          {user ? (
            <button
              onClick={handleLogout}
              className={styles.logoutButton}
              title={isCollapsed ? 'Logout' : undefined}
            >
              <ArrowRightOnRectangleIcon className={styles.navIcon} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          ) : (
            <Link
              href="/login"
              className={styles.loginButton}
              title={isCollapsed ? 'Login' : undefined}
            >
              <ArrowLeftOnRectangleIcon className={styles.navIcon} />
              {!isCollapsed && <span>Login</span>}
            </Link>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={styles.collapseToggle}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className={styles.collapseIcon}>
            {isCollapsed ? '→' : '←'}
          </span>
        </button>
      </aside>

      {/* Spacer - para que el contenido no quede debajo del sidebar */}
      <div className={`${styles.spacer} ${isCollapsed ? styles.spacerCollapsed : ''}`} />
    </>
  )
}

