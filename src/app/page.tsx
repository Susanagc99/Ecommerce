import Link from 'next/link'
import HeroSection from '@/components/HeroSection'
import ProductGrid from '@/components/ProductGrid'
import Button from '@/components/Button'
import productsData from '@/data/products.json'
import styles from './page.module.css'

export default function Home() {
  // Get featured products
  const featuredProducts = productsData
    .filter((product) => product.featured)
    .slice(0, 6)

  // Categories for quick links
  const categories = [
    { name: 'Gaming', color: '#06B6D4' },
    { name: 'Smart Devices', color: '#EC4899' },
    { name: 'Audio & Video', color: '#FBBF24' },
    { name: 'Computer Accessories', color: '#8B5CF6' },
    { name: 'Smartphone Accessories', color: '#10B981' },
    { name: 'Innovation & Smart Gadgets', color: '#F59E0B' },
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
                <span className={styles.categoryName}>{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured products</h2>
            <p className={styles.sectionDescription}>
              Check out our top trending gadgets
            </p>
          </div>

          <ProductGrid products={featuredProducts} />

          <div className={styles.ctaWrapper}>
            <Link href="/shop">
              <Button size="lg" variant="primary">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

    
    </div>
  )
}

