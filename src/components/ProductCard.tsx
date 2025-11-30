'use client'

import { useState } from 'react'
import Image from 'next/image'
import Button from './Button'
import ProductModal, { ProductDetail } from './ProductModal'
import { formatPrice } from '@/lib/utils'
import { showToast } from '@/lib/toast'
import styles from '@/styles/ProductCard.module.css'
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

import { useCart } from '@/context/CartContext'

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  category?: string
  description?: string
  stock?: number
}

export default function ProductCard({ id, name, price, image, category, description, stock }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { addToCart } = useCart()

  const productDetail: ProductDetail = {
    id,
    name,
    price,
    image,
    category: category || 'Uncategorized',
    description: description || 'No description available.',
    stock,
  }

  const handleAddToCart = () => {
    addToCart({ id, name, price, image })
    showToast.success(`${name} added to cart!`, { autoClose: 2000 })
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsFavorite(!isFavorite)
    
    if (!isFavorite) {
      showToast.success(`${name} added to favorites!`, { autoClose: 2000 })
    } else {
      showToast.info(`${name} removed from favorites`, { autoClose: 2000 })
    }
  }

  return (
    <>
      <div className={styles.card}>
        {/* Image */}
        <div
          onClick={() => setIsModalOpen(true)}
          className={styles.imageWrapper}
          style={{ cursor: 'pointer' }}
        >
          <Image
            src={image}
            alt={name}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(e)
            }}
            className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteActive : ''}`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? (
              <HeartIconSolid className={styles.heartIcon} />
            ) : (
              <HeartIcon className={styles.heartIcon} />
            )}
          </button>

          {/* Category Badge */}
          {category && (
            <div className={styles.categoryBadge}>
              {category}
            </div>
          )}
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div
            onClick={() => setIsModalOpen(true)}
            className={styles.nameLink}
            style={{ cursor: 'pointer' }}
          >
            <h3 className={styles.name}>{name}</h3>
          </div>

        <div className={styles.footer}>
          <div className={styles.priceWrapper}>
            <span className={styles.price}>{formatPrice(price)}</span>
          </div>
          
          <Button
            onClick={handleAddToCart}
            size="sm"
            variant="primary"
            className={styles.addButton}
          >
            <ShoppingCartIcon className={styles.cartIcon} />
            Add
          </Button>
        </div>
      </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={productDetail}
      />
    </>
  )
}

