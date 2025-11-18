'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-toastify'
import Button from './Button'
import { formatPrice } from '@/lib/utils'
import styles from '@/styles/ProductCard.module.css'
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

// TODO: Descomentar cuando creemos el CartContext
// import { useCart } from '@/context/CartContext'

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  category?: string
}

export default function ProductCard({ id, name, price, image, category }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  
  // TODO: Descomentar cuando creemos CartContext
  // const { addToCart } = useCart()

  const handleAddToCart = () => {
    // TODO: Implementar cuando tengamos CartContext
    // addToCart({ id, name, price, image })
    toast.success(`${name} added to cart! 🛒`, {
      position: 'top-right',
      autoClose: 2000,
      theme: 'light',
    })
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsFavorite(!isFavorite)
    
    if (!isFavorite) {
      toast.success(`${name} added to favorites! ❤️`, {
        position: 'top-right',
        autoClose: 2000,
        theme: 'light',
      })
    } else {
      toast.info(`${name} removed from favorites`, {
        position: 'top-right',
        autoClose: 2000,
        theme: 'light',
      })
    }
  }

  return (
    <div className={styles.card}>
      {/* Image */}
      <Link href={`/product/${id}`} className={styles.imageWrapper}>
        <Image
          src={image}
          alt={name}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
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
      </Link>

      {/* Content */}
      <div className={styles.content}>
        <Link href={`/product/${id}`} className={styles.nameLink}>
          <h3 className={styles.name}>{name}</h3>
        </Link>

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
  )
}

