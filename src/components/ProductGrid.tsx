'use client'

import ProductCard from './ProductCard'
import { useLanguage } from '@/context/LanguageContext'
import styles from '@/styles/ProductGrid.module.css'

export interface Product {
  _id: string
  name: string
  price: number
  image: string
  category?: string
  description?: string
  stock?: number
}

interface ProductGridProps {
  products: Product[]
  loading?: boolean
}

export default function ProductGrid({ products, loading = false }: ProductGridProps) {
  const { t } = useLanguage()
  
  if (loading) {
    return (
      <div className={styles.grid}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={styles.skeleton}>
            <div className={styles.skeletonImage} />
            <div className={styles.skeletonContent}>
              <div className={styles.skeletonText} />
              <div className={styles.skeletonText} />
              <div className={styles.skeletonPrice} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📦</div>
        <h3 className={styles.emptyTitle}>{t('shop.noProducts')}</h3>
        <p className={styles.emptyDescription}>
          {t('shop.noProductsDescription')}
        </p>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard
          key={product._id}
          id={product._id}
          name={product.name}
          price={product.price}
          image={product.image}
          category={product.category}
          description={product.description}
          stock={product.stock}
        />
      ))}
    </div>
  )
}

