'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Button from './Button'
import { formatPrice } from '@/helpers/utils'
import { showToast } from '@/helpers/toast'
import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/context/LanguageContext'
import styles from '@/styles/ProductModal.module.css'
import { XMarkIcon, ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline'

export interface ProductDetail {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock?: number
}

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: ProductDetail | null
}

export default function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const { addToCart } = useCart()
  const { t } = useLanguage()

  // Función helper para traducir categoría
  const getTranslatedCategory = (cat: string) => {
    return t(`categories.${cat}`) || cat
  }

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !product) return null

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
    showToast.success(`${product.name} ${t('messages.addedToCart')}`, { autoClose: 2000 })
  }

  const handleAddToFavorites = () => {
    showToast.success(`${product.name} ${t('messages.addedToFavorites')}`, { autoClose: 2000 })
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          {/* Image Section */}
          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
            {product.category && (
              <div className={styles.categoryBadge}>
                {getTranslatedCategory(product.category)}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className={styles.detailsSection}>
            <h2 className={styles.title}>{product.name}</h2>
            
            <div className={styles.priceWrapper}>
              <span className={styles.price}>{formatPrice(product.price)}</span>
              {product.stock !== undefined && (
                <span className={styles.stock}>
                  {product.stock > 0 ? (
                    <span className={styles.inStock}>{t('product.inStock')} ({product.stock})</span>
                  ) : (
                    <span className={styles.outOfStock}>{t('product.outOfStock')}</span>
                  )}
                </span>
              )}
            </div>

            <div className={styles.description}>
              <h3 className={styles.descriptionTitle}>{t('product.description')}</h3>
              <p className={styles.descriptionText}>
                {product.description}
              </p>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <Button
                onClick={handleAddToCart}
                size="lg"
                variant="primary"
                fullWidth
                disabled={product.stock === 0}
                className={styles.addToCartButton}
              >
                <ShoppingCartIcon className={styles.actionIcon} />
                {product.stock === 0 ? t('product.outOfStock') : t('shop.addToCart')}
              </Button>
              
              <button
                onClick={handleAddToFavorites}
                className={styles.favoriteButton}
                aria-label={t('product.addToFavorites')}
              >
                <HeartIcon style={{ width: '24px', height: '24px' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

