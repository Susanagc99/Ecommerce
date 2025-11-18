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

  // Get categories for quick links
  const categories = [
    { name: 'Gaming', icon: '🎮', color: '#06B6D4' },
    { name: 'Smart Devices', icon: '⌚', color: '#EC4899' },
    { name: 'Audio & Video', icon: '🎧', color: '#FBBF24' },
    { name: 'Computer Accessories', icon: '⌨️', color: '#8B5CF6' },
    { name: 'Smartphone Accessories', icon: '📱', color: '#10B981' },
    { name: 'Innovation & Smart Gadgets', icon: '🤖', color: '#F59E0B' },
  ]

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Browse by Category</h2>
            <p className={styles.sectionDescription}>
              Explore our wide range of tech gadgets
            </p>
          </div>

          <div className={styles.categoriesGrid}>
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/shop?category=${encodeURIComponent(category.name)}`}
                className={styles.categoryCard}
                style={{ ['--category-color' as string]: category.color }}
              >
                <span className={styles.categoryIcon}>{category.icon}</span>
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
            <h2 className={styles.sectionTitle}>Featured Products</h2>
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

      {/* Why Choose Us Section */}
      <section className={styles.whySection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Why Choose Techland?</h2>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🚚</div>
              <h3 className={styles.featureTitle}>Fast Delivery</h3>
              <p className={styles.featureText}>
                Free shipping on orders over $50. Get your gadgets delivered fast!
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔒</div>
              <h3 className={styles.featureTitle}>Secure Payment</h3>
              <p className={styles.featureText}>
                100% secure transactions with encryption. Shop with confidence.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⭐</div>
              <h3 className={styles.featureTitle}>Quality Guaranteed</h3>
              <p className={styles.featureText}>
                Only authentic products from trusted brands. Quality you can trust.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💬</div>
              <h3 className={styles.featureTitle}>24/7 Support</h3>
              <p className={styles.featureText}>
                Our support team is always ready to help you. Contact us anytime.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

