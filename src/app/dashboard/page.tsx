'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import { formatPrice, confirmDelete } from '@/lib/utils'
import { showToast } from '@/lib/toast'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { createProduct, updateProduct } from '@/services/products'
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
  const { t } = useLanguage()
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
      showToast.error(t('messages.accessDenied'))
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
        showToast.error(t('messages.failedToFetch'))
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      showToast.error(t('messages.errorLoadingProducts'))
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
      newErrors.name = t('dashboard.validation.nameRequired')
    } else if (formData.name.trim().length < 3) {
      newErrors.name = t('dashboard.validation.nameMinLength')
    }

    if (!formData.description.trim()) {
      newErrors.description = t('dashboard.validation.descriptionRequired')
    }

    if (!formData.price) {
      newErrors.price = t('dashboard.validation.priceRequired')
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      newErrors.price = t('dashboard.validation.priceInvalid')
    }

    if (!formData.category) {
      newErrors.category = t('dashboard.validation.categoryRequired')
    }

    if (!formData.subcategory) {
      newErrors.subcategory = t('dashboard.validation.subcategoryRequired')
    }

    // Validate file only if creating a new product
    if (!editingProduct && !file) {
      newErrors.file = t('dashboard.validation.imageRequired')
    } else if (file && !isValidFileType(file)) {
      newErrors.file = t('dashboard.validation.imageTypeInvalid')
    } else if (file && file.size > 5 * 1024 * 1024) {
      newErrors.file = t('dashboard.validation.imageSizeInvalid')
    }

    if (formData.stock && (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0)) {
      newErrors.stock = t('dashboard.validation.stockInvalid')
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
        // Update existing product
        const response = await updateProduct(editingProduct._id, {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          subcategory: formData.subcategory,
          stock: formData.stock || '0',
          featured: formData.featured,
          file: file || null, // Opcional: solo se envía si hay nueva imagen
        })

        if (response.success) {
          handleCloseModal()
          fetchProducts()
          
          // Show success alert with SweetAlert2 after closing modal
          const { default: Swal } = await import('sweetalert2')
          await Swal.fire({
            title: t('messages.productUpdated'),
            icon: 'success',
            confirmButtonColor: '#06B6D4',
            background: '#FFFFFF',
            color: '#1F2937',
          })
        }
      } else {
        // Create new product
        if (!file) {
          throw new Error(t('dashboard.validation.fileNotAvailable'))
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
          handleCloseModal()
          fetchProducts()
        
          
          const { default: Swal } = await import('sweetalert2')
          await Swal.fire({
            title: t('messages.productCreated'),
            icon: 'success',
            confirmButtonColor: '#06B6D4',
            background: '#FFFFFF',
            color: '#1F2937',
          })
        }
      }
    } catch (error: unknown) {
      console.error('Error saving product:', error)
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } }
        setErrors({
          submit: axiosError.response?.data?.message || t('dashboard.validation.errorSaving')
        })
      } else {
        setErrors({
          submit: t('dashboard.validation.errorSaving')
        })
      }
      showToast.error(t('messages.errorSavingProduct'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    // Find product to get its name for the alert
    const product = products.find((p) => p._id === id)
    const productName = product?.name || t('dashboard.delete.thisProduct')

    // Show confirmation dialog with SweetAlert2
    const confirmed = await confirmDelete(
      t('dashboard.delete.confirmTitle'),
      `${t('dashboard.delete.confirmMessage')} "${productName}". ${t('dashboard.delete.confirmMessageEnd')}`,
      t('dashboard.delete.confirmButton')
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
          title: t('dashboard.delete.successTitle'),
          text: `"${productName}" ${t('dashboard.delete.successMessage')}`,
          icon: 'success',
          confirmButtonColor: '#06B6D4',
          background: '#FFFFFF',
          color: '#1F2937',
        })
        
        fetchProducts()
      } else {
        showToast.error(t('messages.errorDeletingProduct'))
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      showToast.error(t('messages.errorDeletingProduct'))
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
            <h1 className={styles.title}>{t('dashboard.title')}</h1>
            <p className={styles.subtitle}>{t('dashboard.subtitle')}</p>
          </div>
          <Button onClick={() => handleOpenModal()} variant="primary" size="md">
            <PlusIcon className={styles.btnIcon} />
            {t('dashboard.addProduct')}
          </Button>
        </div>

        {/* Products Table */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('dashboard.table.id')}</th>
                <th>{t('dashboard.table.image')}</th>
                <th>{t('dashboard.table.name')}</th>
                <th>{t('dashboard.table.category')}</th>
                <th>{t('dashboard.table.price')}</th>
                <th>{t('dashboard.table.stock')}</th>
                <th>{t('dashboard.table.featured')}</th>
                <th>{t('dashboard.table.actions')}</th>
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
                      {product.featured ? t('dashboard.table.yes') : t('dashboard.table.no')}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        onClick={() => handleOpenModal(product)}
                        className={styles.editBtn}
                        title={t('dashboard.table.edit')}
                      >
                        <PencilIcon className={styles.actionIcon} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className={styles.deleteBtn}
                        title={t('dashboard.table.delete')}
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
                <h2>{editingProduct ? t('dashboard.form.editProduct') : t('dashboard.form.addNewProduct')}</h2>
                <button onClick={handleCloseModal} className={styles.closeBtn}>
                  <XMarkIcon className={styles.closeIcon} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                  {/* Product Name */}
                  <div className={styles.formGroup}>
                    <label htmlFor="name">{t('dashboard.form.productNameLabel')}</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t('dashboard.form.productNamePlaceholder')}
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <p className={styles.errorText}>{errors.name}</p>
                    )}
                  </div>

                  {/* Price */}
                  <div className={styles.formGroup}>
                    <label htmlFor="price">{t('dashboard.form.priceLabel')}</label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder={t('dashboard.form.pricePlaceholder')}
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
                    <label htmlFor="category">{t('dashboard.form.categoryLabel')}</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      <option value="">{t('dashboard.form.selectCategory')}</option>
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
                    <label htmlFor="subcategory">{t('dashboard.form.subcategoryLabel')}</label>
                    <select
                      id="subcategory"
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      disabled={!formData.category || isSubmitting}
                    >
                      <option value="">
                        {formData.category
                          ? t('dashboard.form.selectSubcategory')
                          : t('dashboard.form.firstSelectCategory')}
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
                    <label htmlFor="stock">{t('dashboard.form.stockLabel')}</label>
                    <input
                      id="stock"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder={t('dashboard.form.stockPlaceholder')}
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
                      {t('dashboard.form.imageLabel')} {!editingProduct && '*'}
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
                      {t('dashboard.form.imageFormats')}
                    </p>
                    {file && (
                      <div className={styles.fileInfo}>
                        <p className={styles.fileName}>
                          {file.name}
                        </p>
                        <p className={styles.fileSize}>
                          {t('dashboard.form.size')} {(file.size / 1024 / 1024).toFixed(2)}MB
                        </p>
                      </div>
                    )}
                    {errors.file && (
                      <p className={styles.errorText}>{errors.file}</p>
                    )}
                  </div>

                  {/* Description - Full width */}
                  <div className={styles.formGroupFull}>
                    <label htmlFor="description">{t('dashboard.form.descriptionLabel')}</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder={t('dashboard.form.descriptionPlaceholder')}
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
                      <label>{t('dashboard.form.preview')}</label>
                      <div className={styles.imagePreview}>
                        <img src={imagePreview} alt={t('dashboard.form.preview')} />
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
                      <span>{t('dashboard.form.featuredLabel')}</span>
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
                    {t('dashboard.form.cancel')}
                  </Button>
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting
                      ? t('dashboard.form.saving')
                      : editingProduct
                      ? t('dashboard.form.updateProduct')
                      : t('dashboard.form.createProduct')}
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
