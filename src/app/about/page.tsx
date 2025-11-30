'use client'

import Image from 'next/image'
import { useLanguage } from '@/context/LanguageContext'
import styles from './about.module.css'

export default function AboutPage() {
  const { t } = useLanguage()
  return (
    <div className={styles.aboutContainer}>
      {/* Hero Section - Super Dynamic */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroCircle1}></div>
          <div className={styles.heroCircle2}></div>
          <div className={styles.heroCircle3}></div>
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {t('about.heroTitle')} <span className={styles.highlight}>{t('about.heroTitleHighlight')}</span>
          </h1>
          <p className={styles.heroSubtitle}>
            {t('about.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Our Mission Section - Modern & Fun */}
      <section className={styles.missionSection}>
        <div className={styles.container}>
          <div className={styles.missionGrid}>
            {/* Content First */}
            <div className={styles.missionContent}>
              <h2 className={styles.missionTitle}>
                {t('about.missionTitle')}
              </h2>
              <p className={styles.missionText}>
                {t('about.missionText1')}
              </p>
              <p className={styles.missionText}>
                {t('about.missionText2')}
              </p>
              {/* Stats */}
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>500+</div>
                  <div className={styles.statLabel}>{t('about.stats.products')}</div>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.stat}>
                  <div className={styles.statNumber}>10K+</div>
                  <div className={styles.statLabel}>{t('about.stats.customers')}</div>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.stat}>
                  <div className={styles.statNumber}>24/7</div>
                  <div className={styles.statLabel}>{t('about.stats.support')}</div>
                </div>
              </div>
            </div>

            {/* Image with Cool Effect */}
            <div className={styles.missionImageWrapper}>
              <div className={styles.imageGlow}></div>
              <Image
                src="https://images.unsplash.com/photo-1636036769389-343bb250f013?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Gaming setup"
                fill
                className={styles.missionImage}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
