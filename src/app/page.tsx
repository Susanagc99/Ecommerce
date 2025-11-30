'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import HeroSection from '@/components/HeroSection'
import ProductGrid from '@/components/ProductGrid'
import Button from '@/components/Button'
import { getProducts } from '@/services/products'
import { useLanguage } from '@/context/LanguageContext'
import styles from './page.module.css'
import { showToast } from '@/lib/toast'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  subcategory: string
  image: string
  stock: number
  featured: boolean
}

export default function Home() {
  const { t } = useLanguage()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch featured products from API
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true)
        const response = await getProducts({ featured: true })
        if (response.success) {
          setFeaturedProducts(response.data.slice(0, 6))
        } else {
          showToast.error(t('messages.errorLoadingFeatured'))
        }
      } catch (error) {
        console.error('Error fetching featured products:', error)
        showToast.error(t('messages.errorLoadingFeatured'))
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  // Categories for quick links
  const categories = [
    { key: 'gaming', name: 'Gaming', color: '#06B6D4' },
    { key: 'smartDevices', name: 'Smart Devices', color: '#EC4899' },
    { key: 'audioVideo', name: 'Audio & Video', color: '#FBBF24' },
    { key: 'computerAccessories', name: 'Computer Accessories', color: '#8B5CF6' },
    { key: 'smartphoneAccessories', name: 'Smartphone Accessories', color: '#10B981' },
    { key: 'innovation', name: 'Innovation & Smart Gadgets', color: '#F59E0B' },
  ]

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <section className={styles.categoriesSection}>
        <div className={styles.container}>

          <div className={styles.categoriesGrid}>
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/shop?category=${encodeURIComponent(category.name)}`}
                className={styles.categoryCard}
                style={{ ['--category-color' as string]: category.color }}
              >
                <span className={styles.categoryName}>{t(`home.categories.${category.key}`)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t('home.featuredProducts')}</h2>
            <p className={styles.sectionDescription}>
              {t('home.featuredDescription')}
            </p>
          </div>

          <ProductGrid products={featuredProducts} loading={loading} />

          {!loading && (
            <div className={styles.ctaWrapper}>
              <Link href="/shop">
                <Button size="lg" variant="primary">
                  {t('home.viewAllProducts')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

    
    </div>
  )
}

