'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductGrid from '@/components/ProductGrid'
import Pagination from '@/components/Pagination'
import Input from '@/components/Input'
import { getProducts } from '@/services/products'
import { CATEGORIES } from '@/constants/categories'
import styles from './shop.module.css'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'

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
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get('category') || ''

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl)
  const [currentPage, setCurrentPage] = useState(1)

  // Get unique categories from CATEGORIES constant
  const categories = useMemo(() => {
    return ['All', ...Object.keys(CATEGORIES)]
  }, [])

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await getProducts()
        if (response.success) {
          setProducts(response.data)
        } else {
          toast.error('Error al cargar productos')
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        toast.error('Error al cargar productos')
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
        selectedCategory === 'All' ||
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
            <p>Cargando productos...</p>
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
          <h1 className={styles.title}>Shop all products</h1>
          <p className={styles.subtitle}>
            Discover the latest tech gadgets and accessories
          </p>
        </div>

        {/* Filters Section */}
        <div className={styles.filtersSection}>
          {/* Search Bar */}
          <div className={styles.searchWrapper}>
            <Input
              type="text"
              placeholder="Search for accessories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<MagnifyingGlassIcon />}
              className={styles.searchInput}
            />
          </div>

          {/* Categories Filter */}
          <div className={styles.categoriesFilter}>
            <label className={styles.filterLabel}>Filter by Category:</label>
            <div className={styles.categoriesList}>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
                  className={`${styles.categoryButton} ${
                    (category === 'All' && selectedCategory === '') ||
                    selectedCategory === category
                      ? styles.active
                      : ''
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className={styles.resultsInfo}>
          <p className={styles.resultsText}>
            Showing <strong>{paginatedProducts.length}</strong> of{' '}
            <strong>{filteredProducts.length}</strong> products
            {selectedCategory && selectedCategory !== 'All' && (
              <span className={styles.categoryBadge}> in {selectedCategory}</span>
            )}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className={styles.noProducts}>
            <p>No se encontraron productos.</p>
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

