'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import { formatPrice, confirmDelete } from '@/lib/utils'
import { showToast } from '@/lib/toast'
import { useAuth } from '@/context/AuthContext'
import { createProduct } from '@/services/products'
import { CATEGORIES, type CategoryType } from '@/constants/categories'
import styles from './dashboard.module.css'
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

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

interface FormErrors {
  name?: string
  description?: string
  price?: string
  category?: string
  subcategory?: string
  file?: string
  stock?: string
  submit?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAdmin, isLoading } = useAuth()
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
    stock: '',
    featured: false,
  })
  const [file, setFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.push('/login')
      return
    }

    // Verify user is Admin
    if (!isAdmin) {
      showToast.error('Access denied. Admin only.')
      router.push('/')
      return
    }

    fetchProducts()
  }, [user, isAdmin, isLoading, router])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      if (response.ok) {
        const result = await response.json()
        setProducts(result.data || [])
      } else {
        showToast.error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      showToast.error('Error loading products')
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
        stock: product.stock.toString(),
        featured: product.featured,
      })
      setImagePreview(product.image)
      setFile(null)
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        subcategory: '',
        stock: '',
        featured: false,
      })
      setImagePreview('')
      setFile(null)
    }
    setErrors({})
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
      stock: '',
      featured: false,
    })
    setFile(null)
    setImagePreview('')
    setErrors({})
    setIsSubmitting(false)
  }

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.price) {
      newErrors.price = 'Price is required'
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be a valid number greater than or equal to 0'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (!formData.subcategory) {
      newErrors.subcategory = 'Subcategory is required'
    }

    // Validate file only if creating a new product
    if (!editingProduct && !file) {
      newErrors.file = 'You must select an image'
    } else if (file && !isValidFileType(file)) {
      newErrors.file = 'Only images are allowed (JPEG, JPG, PNG, WEBP)'
    } else if (file && file.size > 5 * 1024 * 1024) {
      newErrors.file = 'Image must not exceed 5MB'
    }

    if (formData.stock && (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0)) {
      newErrors.stock = 'Stock must be a valid number greater than or equal to 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Validar tipo de archivo
  const isValidFileType = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    return allowedTypes.includes(file.type)
  }

  // Manejar cambio de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      
      // Crear preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
      
      // Limpiar error de archivo
      if (errors.file) {
        setErrors(prev => ({ ...prev, file: undefined }))
      }
    }
  }

  // Manejar cambio de inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Limpiar subcategoría si se cambia la categoría
    if (name === 'category') {
      setFormData(prev => ({ ...prev, subcategory: '' }))
    }

    // Limpiar error del campo
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      if (editingProduct) {
        // TODO: Implement product update
        showToast.info('Product update coming soon')
      } else {
        // Create new product
        if (!file) {
          throw new Error('File not available')
        }

        const response = await createProduct({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          subcategory: formData.subcategory,
          stock: formData.stock || '0',
          featured: formData.featured,
          file,
        })

        if (response.success) {
          showToast.success('Product created successfully!')
          handleCloseModal()
          fetchProducts()
        }
      }
    } catch (error: unknown) {
      console.error('Error saving product:', error)
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } }
        setErrors({
          submit: axiosError.response?.data?.message || 'Error saving product'
        })
      } else {
        setErrors({
          submit: 'Error saving product'
        })
      }
      showToast.error('Error saving product')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    // Find product to get its name for the alert
    const product = products.find((p) => p._id === id)
    const productName = product?.name || 'this product'

    // Show confirmation dialog with SweetAlert2
    const confirmed = await confirmDelete(
      'Are you sure?',
      `You are about to delete "${productName}". This action cannot be undone!`,
      'Yes, delete it!'
    )

    if (!confirmed) return

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Show success alert with SweetAlert2
        const { default: Swal } = await import('sweetalert2')
        await Swal.fire({
          title: 'Deleted!',
          text: `"${productName}" has been deleted successfully.`,
          icon: 'success',
          confirmButtonColor: '#06B6D4',
          background: '#FFFFFF',
          color: '#1F2937',
        })
        
        fetchProducts()
      } else {
        showToast.error('Error deleting product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      showToast.error('Error deleting product')
    }
  }

  // Obtener subcategorías según la categoría seleccionada
  const getSubcategories = (category: string): readonly string[] => {
    return CATEGORIES[category as CategoryType] || []
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
                <tr key={product._id}>
                  <td>{product._id.slice(-6)}</td>
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
                        onClick={() => handleDelete(product._id)}
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
                  {/* Product Name */}
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Product Name *</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="E.g: PlayStation 5 Console"
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <p className={styles.errorText}>{errors.name}</p>
                    )}
                  </div>

                  {/* Price */}
                  <div className={styles.formGroup}>
                    <label htmlFor="price">Price (COP) *</label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="2999000"
                      min="0"
                      step="1"
                      disabled={isSubmitting}
                    />
                    {errors.price && (
                      <p className={styles.errorText}>{errors.price}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div className={styles.formGroup}>
                    <label htmlFor="category">Category *</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      <option value="">Select a category</option>
                      {Object.keys(CATEGORIES).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className={styles.errorText}>{errors.category}</p>
                    )}
                  </div>

                  {/* Subcategory */}
                  <div className={styles.formGroup}>
                    <label htmlFor="subcategory">Subcategory *</label>
                    <select
                      id="subcategory"
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      disabled={!formData.category || isSubmitting}
                    >
                      <option value="">
                        {formData.category
                          ? 'Select a subcategory'
                          : 'First select a category'}
                      </option>
                      {formData.category &&
                        getSubcategories(formData.category).map((subcat) => (
                          <option key={subcat} value={subcat}>
                            {subcat}
                          </option>
                        ))}
                    </select>
                    {errors.subcategory && (
                      <p className={styles.errorText}>{errors.subcategory}</p>
                    )}
                  </div>

                  {/* Stock */}
                  <div className={styles.formGroup}>
                    <label htmlFor="stock">Stock</label>
                    <input
                      id="stock"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="15"
                      min="0"
                      disabled={isSubmitting}
                    />
                    {errors.stock && (
                      <p className={styles.errorText}>{errors.stock}</p>
                    )}
                  </div>

                  {/* Image */}
                  <div className={styles.formGroup}>
                    <label htmlFor="file">
                      Product Image {!editingProduct && '*'}
                    </label>
                    <input
                      id="file"
                      name="file"
                      type="file"
                      onChange={handleFileChange}
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      disabled={isSubmitting}
                    />
                    <p className={styles.helpText}>
                      Formats: JPG, PNG, WEBP (max 5MB)
                    </p>
                    {file && (
                      <div className={styles.fileInfo}>
                        <p className={styles.fileName}>
                          {file.name}
                        </p>
                        <p className={styles.fileSize}>
                          Size: {(file.size / 1024 / 1024).toFixed(2)}MB
                        </p>
                      </div>
                    )}
                    {errors.file && (
                      <p className={styles.errorText}>{errors.file}</p>
                    )}
                  </div>

                  {/* Description - Full width */}
                  <div className={styles.formGroupFull}>
                    <label htmlFor="description">Description *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe the product features..."
                      rows={3}
                      disabled={isSubmitting}
                    />
                    {errors.description && (
                      <p className={styles.errorText}>{errors.description}</p>
                    )}
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className={styles.formGroupFull}>
                      <label>Preview</label>
                      <div className={styles.imagePreview}>
                        <img src={imagePreview} alt="Preview" />
                      </div>
                    </div>
                  )}

                  {/* Featured Checkbox */}
                  <div className={styles.formGroupCheckbox}>
                    <label>
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={(e) =>
                          setFormData({ ...formData, featured: e.target.checked })
                        }
                        disabled={isSubmitting}
                      />
                      <span>Featured Product</span>
                    </label>
                  </div>
                </div>

                {/* General error message */}
                {errors.submit && (
                  <div className={styles.errorAlert}>
                    <p>{errors.submit}</p>
                  </div>
                )}

                {/* Buttons */}
                <div className={styles.modalActions}>
                  <Button
                    type="button"
                    onClick={handleCloseModal}
                    variant="outline"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting
                      ? 'Saving...'
                      : editingProduct
                      ? 'Update Product'
                      : 'Create Product'}
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
