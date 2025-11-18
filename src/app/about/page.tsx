import styles from '../page.module.css'

export default function AboutPage() {
  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #06B6D4, #EC4899)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        About Techland
      </h1>
      <p style={{
        fontSize: '1.25rem',
        color: '#6B7280',
        marginBottom: '3rem',
        textAlign: 'center'
      }}>
        Your trusted destination for cutting-edge tech gadgets
      </p>

      <div style={{
        display: 'grid',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        <div style={{
          padding: '2rem',
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1F2937',
            marginBottom: '1rem'
          }}>
            Our Mission
          </h2>
          <p style={{ fontSize: '1rem', color: '#6B7280', lineHeight: '1.7' }}>
            At Techland, we&apos;re passionate about bringing you the latest and greatest tech gadgets from around the world.
            Whether you&apos;re a gamer, a tech enthusiast, or simply looking to upgrade your digital lifestyle,
            we have everything you need.
          </p>
        </div>

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

    </div>
  )
}

