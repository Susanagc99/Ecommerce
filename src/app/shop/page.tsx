'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductGrid from '@/components/ProductGrid'
import Pagination from '@/components/Pagination'
import Input from '@/components/Input'
import { getProducts } from '@/services/products'
import { CATEGORIES } from '@/constants/categories'
import { useLanguage } from '@/context/LanguageContext'
import styles from './shop.module.css'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { showToast } from '@/lib/toast'

const ITEMS_PER_PAGE = 8

interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  subcategory: string
  image: string
  stock: number
  featured: boolean
}

export default function ShopPage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get('category') || ''

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl)
  const [currentPage, setCurrentPage] = useState(1)

  // Get unique categories from CATEGORIES constant
  const categories = useMemo(() => {
    return [t('shop.all'), ...Object.keys(CATEGORIES)]
  }, [t])

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await getProducts()
        if (response.success) {
          setProducts(response.data)
        } else {
          showToast.error(t('messages.errorLoadingProducts'))
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        showToast.error(t('messages.errorLoadingProducts'))
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory =
        selectedCategory === '' ||
        selectedCategory === t('shop.all') ||
        product.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [products, searchTerm, selectedCategory])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  )

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory])

  // Loading state
  if (loading) {
    return (
      <div className={styles.shop}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>{t('shop.loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.shop}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>{t('shop.title')}</h1>
          <p className={styles.subtitle}>
            {t('shop.subtitle')}
          </p>
        </div>

        {/* Filters Section */}
        <div className={styles.filtersSection}>
          {/* Search Bar */}
          <div className={styles.searchWrapper}>
            <Input
              type="text"
              placeholder={t('shop.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<MagnifyingGlassIcon />}
              className={styles.searchInput}
            />
          </div>

          {/* Categories Filter */}
          <div className={styles.categoriesFilter}>
            <label className={styles.filterLabel}>{t('shop.filterByCategory')}</label>
            <div className={styles.categoriesList}>
              {categories.map((category) => {
                // Traducir el nombre de la categoría para mostrar, pero mantener el valor original para el filtro
                const categoryKey = category === t('shop.all') ? 'all' : category
                const categoryLabel = category === t('shop.all') 
                  ? t('shop.all') 
                  : t(`categories.${category}`) || category
                
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category === t('shop.all') ? '' : category)}
                    className={`${styles.categoryButton} ${
                      (category === t('shop.all') && selectedCategory === '') ||
                      selectedCategory === category
                        ? styles.active
                        : ''
                    }`}
                  >
                    {categoryLabel}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className={styles.resultsInfo}>
          <p className={styles.resultsText}>
            {t('shop.showing')} <strong>{paginatedProducts.length}</strong> {t('shop.of')}{' '}
            <strong>{filteredProducts.length}</strong> {t('shop.products')}
            {selectedCategory && selectedCategory !== t('shop.all') && (
              <span className={styles.categoryBadge}> {t('shop.in')} {t(`categories.${selectedCategory}`) || selectedCategory}</span>
            )}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className={styles.noProducts}>
            <p>{t('shop.noProducts')}</p>
          </div>
        ) : (
          <ProductGrid products={paginatedProducts} />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  )
}

