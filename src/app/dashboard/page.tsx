'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import { toast } from 'react-toastify'
import { formatPrice } from '@/lib/utils'
import styles from './dashboard.module.css'
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

interface UserSession {
  username: string
  name: string
  email?: string
  role: string
  isActive: boolean
  loginTime: string
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  subcategory: string
  image: string
  stock: number
  featured: boolean
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserSession | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    image: '',
    stock: '',
    featured: false,
  })

  useEffect(() => {
    const session = localStorage.getItem('userSession')
    if (!session) {
      router.push('/login')
    } else {
      const userData = JSON.parse(session)
      setUser(userData)
      
      // Verificar que sea Admin
      if (userData.role !== 'Admin') {
        toast.error('Access denied. Admin only.')
        router.push('/')
        return
      }
      
      fetchProducts()
    }
  }, [router])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        toast.error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Error loading products')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        subcategory: product.subcategory,
        image: product.image,
        stock: product.stock.toString(),
        featured: product.featured,
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        subcategory: '',
        image: '',
        stock: '',
        featured: false,
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      subcategory: '',
      image: '',
      stock: '',
      featured: false,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products'
      
      const method = editingProduct ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(
          editingProduct
            ? 'Product updated successfully! ✅'
            : 'Product created successfully! 🎉'
        )
        handleCloseModal()
        fetchProducts()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save product')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error('Error saving product')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Product deleted successfully! 🗑️')
        fetchProducts()
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Error deleting product')
    }
  }

  if (!user || loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    )
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Product Management</h1>
            <p className={styles.subtitle}>Manage your product inventory</p>
          </div>
          <Button onClick={() => handleOpenModal()} variant="primary" size="md">
            <PlusIcon className={styles.btnIcon} />
            Add Product
          </Button>
        </div>

        {/* Products Table */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <img
                      src={product.image}
                      alt={product.name}
                      className={styles.productImage}
                    />
                  </td>
                  <td className={styles.productName}>{product.name}</td>
                  <td>
                    <div className={styles.categoryCell}>
                      <span className={styles.category}>{product.category}</span>
                      <span className={styles.subcategory}>{product.subcategory}</span>
                    </div>
                  </td>
                  <td className={styles.price}>{formatPrice(product.price)}</td>
                  <td>
                    <span
                      className={`${styles.stock} ${
                        product.stock > 20
                          ? styles.stockHigh
                          : product.stock > 0
                          ? styles.stockMedium
                          : styles.stockLow
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        product.featured ? styles.featured : styles.notFeatured
                      }`}
                    >
                      {product.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        onClick={() => handleOpenModal(product)}
                        className={styles.editBtn}
                        title="Edit"
                      >
                        <PencilIcon className={styles.actionIcon} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className={styles.deleteBtn}
                        title="Delete"
                      >
                        <TrashIcon className={styles.actionIcon} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className={styles.modalOverlay} onClick={handleCloseModal}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={handleCloseModal} className={styles.closeBtn}>
                  <XMarkIcon className={styles.closeIcon} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Product Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Price (COP) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                      min="0"
                      step="1"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Category *</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Subcategory *</label>
                    <input
                      type="text"
                      value={formData.subcategory}
                      onChange={(e) =>
                        setFormData({ ...formData, subcategory: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Stock *</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      required
                      min="0"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Image URL *</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className={styles.formGroupFull}>
                    <label>Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      required
                      rows={3}
                    />
                  </div>

                  <div className={styles.formGroupCheckbox}>
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) =>
                          setFormData({ ...formData, featured: e.target.checked })
                        }
                      />
                      <span>Featured Product</span>
                    </label>
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <Button type="button" onClick={handleCloseModal} variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
