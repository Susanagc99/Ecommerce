'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { showToast } from '@/lib/toast'
import Button from '@/components/Button'
import styles from './cart.module.css'
import {
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'

export default function CartPage() {
  const router = useRouter()
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart()
  const [itemCount, setItemCount] = useState(0)
  const [total, setTotal] = useState(0)

  // Update item count and total when items change
  useEffect(() => {
    setItemCount(items.reduce((sum, item) => sum + item.quantity, 0))
    setTotal(getTotalPrice())
  }, [items, getTotalPrice])

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id)
      showToast.info('Item removed from cart', { autoClose: 2000 })
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const handleRemove = (id: string, name: string) => {
    removeFromCart(id)
    showToast.success(`${name} removed from cart`, { autoClose: 2000 })
  }

  const handleClearCart = () => {
    if (items.length === 0) return

    clearCart()
    showToast.info('Cart cleared', { autoClose: 2000 })
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      showToast.error('Your cart is empty', { autoClose: 2000 })
      return
    }

    // Possible feature
    showToast.info('Checkout feature coming soon...', { autoClose: 2000 })
  }

  if (items.length === 0) {
    return (
      <div className={styles.cart}>
        <div className={styles.container}>
          <div className={styles.empty}>
            <ShoppingBagIcon className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>Your cart is empty</h2>
            <p className={styles.emptyDescription}>
              Add some products to start shopping
            </p>
            <Link href="/shop">
              <Button variant="primary" size="lg">
                <ArrowLeftIcon className={styles.backIcon} />
                Go to Shop
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.cart}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <p className={styles.subtitle}>
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          {items.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearCart}
              className={styles.clearButton}
            >
              <TrashIcon className={styles.trashIcon} />
              Clear Cart
            </Button>
          )}
        </div>

        <div className={styles.content}>
          {/* Cart Items */}
          <div className={styles.itemsSection}>
            <div className={styles.itemsList}>
              {items.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  {/* Product Image */}
                  <div className={styles.imageWrapper}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className={styles.image}
                      sizes="(max-width: 768px) 150px, 200px"
                    />
                  </div>

                  {/* Product Info */}
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemName}>
                      {item.name}
                    </h3>
                    <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className={styles.quantityControls}>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className={styles.quantityButton}
                      aria-label="Decrease quantity"
                    >
                      <MinusIcon className={styles.quantityIcon} />
                    </button>
                    <span className={styles.quantityValue}>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className={styles.quantityButton}
                      aria-label="Increase quantity"
                    >
                      <PlusIcon className={styles.quantityIcon} />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className={styles.subtotal}>
                    <p className={styles.subtotalLabel}>Subtotal</p>
                    <p className={styles.subtotalValue}>
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.id, item.name)}
                    className={styles.removeButton}
                    aria-label="Remove item"
                  >
                    <TrashIcon className={styles.removeIcon} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className={styles.summarySection}>
            <div className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Subtotal</span>
                <span className={styles.summaryValue}>{formatPrice(total)}</span>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Shipping</span>
                <span className={styles.summaryValue}>Calculated at checkout</span>
              </div>

              <div className={styles.summaryDivider} />

              <div className={styles.summaryRow}>
                <span className={styles.summaryTotalLabel}>Total</span>
                <span className={styles.summaryTotalValue}>{formatPrice(total)}</span>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleCheckout}
                className={styles.checkoutButton}
              >
                Proceed to Checkout
              </Button>

              <Link href="/shop">
                <Button variant="outline" size="md" fullWidth className={styles.continueButton}>
                  <ArrowLeftIcon className={styles.backIcon} />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
