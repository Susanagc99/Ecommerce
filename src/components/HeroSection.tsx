import Link from 'next/link'
import Image from 'next/image'
import Button from './Button'
import styles from '@/styles/HeroSection.module.css'

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      {/* Background Image */}
      <div className={styles.imageWrapper}>
        <Image
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&h=1080&fit=crop"
          alt="Tech Gadgets"
          fill
          className={styles.image}
          priority
          sizes="100vw"
        />
        <div className={styles.overlay} />
      </div>

      {/* Animated shapes */}
      <div className={styles.shapes}>
        <div className={`${styles.shape} ${styles.shape1}`} />
        <div className={`${styles.shape} ${styles.shape2}`} />
        <div className={`${styles.shape} ${styles.shape3}`} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.textContent}>
              <h1 className={styles.title}>
              Find your perfect
              <br />
              <span className={styles.titleGradient}>Gadgets</span>
            </h1>
            
            <p className={styles.description}>
              Discover the latest tech gadgets and accessories. From gaming gear
              to smart devices, we have everything to elevate your tech experience.
            </p>
            
            <div className={styles.ctas}>
              <Link href="/shop">
                <Button size="md" variant="primary">
                  Shop now
                </Button>
              </Link>
              <Link href="/about">
                <Button size="md" variant="outline">
                  Learn more
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>500+</div>
                <div className={styles.statLabel}>Products</div>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <div className={styles.statNumber}>10K+</div>
                <div className={styles.statLabel}>Happy Customers</div>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <div className={styles.statNumber}>24/7</div>
                <div className={styles.statLabel}>Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

