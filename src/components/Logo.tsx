import Link from 'next/link'
import styles from '@/styles/Logo.module.css'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  collapsed?: boolean
}

export default function Logo({ size = 'md', collapsed = false }: LogoProps) {
  return (
    <Link href="/" className={`${styles.logo} ${styles[size]}`}>
      {/* Icon/Symbol */}
      <div className={styles.iconWrapper}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.icon}
        >
          {/* Circuit board inspired T letter */}
          <path
            d="M8 8 L32 8 L32 12 L22 12 L22 32 L18 32 L18 12 L8 12 Z"
            fill="url(#gradient1)"
          />
          {/* Tech dots */}
          <circle cx="10" cy="20" r="2" fill="url(#gradient2)" />
          <circle cx="30" cy="20" r="2" fill="url(#gradient2)" />
          <circle cx="20" cy="28" r="2" fill="url(#gradient3)" />
          
          {/* Gradients */}
          <defs>
            <linearGradient id="gradient1" x1="8" y1="8" x2="32" y2="32">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#0891B2" />
            </linearGradient>
            <linearGradient id="gradient3" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#DB2777" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Name */}
      {!collapsed && (
        <div className={styles.brandName}>
          <span className={styles.tech}>Tech</span>
          <span className={styles.land}>land</span>
        </div>
      )}
    </Link>
  )
}

