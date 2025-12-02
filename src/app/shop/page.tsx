'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ProductGrid from '@/components/ProductGrid'
import Pagination from '@/components/Pagination'
import Input from '@/components/Input'
import { getProducts } from '@/services/products'
import { CATEGORIES } from '@/constants/categories'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import styles from './shop.module.css'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { showToast } from '@/helpers/toast'

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

function ShopContent() {
  const router = useRouter()
  const { t } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get('category') || ''

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    page: 1,
    perPage: ITEMS_PER_PAGE,
  })

  // Redirect admin users to dashboard
  useEffect(() => {
    if (!authLoading && user?.role === 'Admin') {
      router.push('/dashboard')
    }
  }, [user, authLoading, router])

  // Get unique categories from CATEGORIES constant
  const categories = useMemo(() => {
    return [t('shop.all'), ...Object.keys(CATEGORIES)]
  }, [t])

  // Fetch products from API with server-side pagination and filtering
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        
        // Construir parámetros para la API
        const params: {
          category?: string
          search?: string
          page: number
          perPage: number
        } = {
          page: currentPage,
          perPage: ITEMS_PER_PAGE,
        }

        // Agregar filtros solo si tienen valor
        if (selectedCategory && selectedCategory !== '' && selectedCategory !== t('shop.all')) {
          params.category = selectedCategory
        }
        if (searchTerm.trim()) {
          params.search = searchTerm.trim()
        }

        const response = await getProducts(params)
        if (response.success) {
          setProducts(response.data)
          setPagination(response.pagination)
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
  }, [currentPage, selectedCategory, searchTerm, t])

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
            {t('shop.showing')} <strong>{products.length}</strong> {t('shop.of')}{' '}
            <strong>{pagination.total}</strong> {t('shop.products')}
            {selectedCategory && selectedCategory !== t('shop.all') && (
              <span className={styles.categoryBadge}> {t('shop.in')} {t(`categories.${selectedCategory}`) || selectedCategory}</span>
            )}
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 && !loading ? (
          <div className={styles.noProducts}>
            <p>{t('shop.noProducts')}</p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className={styles.shop}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  )
}

