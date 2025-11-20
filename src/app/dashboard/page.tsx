'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import { toast } from 'react-toastify'
import { formatPrice } from '@/lib/utils'
import { createProduct } from '@/services/products'
import { CATEGORIES, type CategoryType } from '@/constants/categories'
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
    stock: '',
    featured: false,
  })
  const [file, setFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        const result = await response.json()
        setProducts(result.data || [])
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
      newErrors.name = 'El nombre del producto es requerido'
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida'
    }

    if (!formData.price) {
      newErrors.price = 'El precio es requerido'
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      newErrors.price = 'El precio debe ser un número válido mayor o igual a 0'
    }

    if (!formData.category) {
      newErrors.category = 'La categoría es requerida'
    }

    if (!formData.subcategory) {
      newErrors.subcategory = 'La subcategoría es requerida'
    }

    // Validar archivo solo si estamos creando un producto nuevo
    if (!editingProduct && !file) {
      newErrors.file = 'Debes seleccionar una imagen'
    } else if (file && !isValidFileType(file)) {
      newErrors.file = 'Solo se permiten imágenes (JPEG, JPG, PNG, WEBP)'
    } else if (file && file.size > 5 * 1024 * 1024) {
      newErrors.file = 'La imagen no debe superar 5MB'
    }

    if (formData.stock && (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0)) {
      newErrors.stock = 'El stock debe ser un número válido mayor o igual a 0'
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
        // TODO: Implementar actualización de producto
        toast.info('Actualización de productos próximamente')
      } else {
        // Crear nuevo producto
        if (!file) {
          throw new Error('Archivo no disponible')
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
          toast.success('Producto creado exitosamente! 🎉')
          handleCloseModal()
          fetchProducts()
        }
      }
    } catch (error: unknown) {
      console.error('Error saving product:', error)
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } }
        setErrors({
          submit: axiosError.response?.data?.message || 'Error al guardar producto'
        })
      } else {
        setErrors({
          submit: 'Error al guardar producto'
        })
      }
      toast.error('Error al guardar producto')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Producto eliminado exitosamente! 🗑️')
        fetchProducts()
      } else {
        toast.error('Error al eliminar producto')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Error al eliminar producto')
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
                  {/* Nombre del Producto */}
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Nombre del Producto *</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ej: PlayStation 5 Console"
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <p className={styles.errorText}>{errors.name}</p>
                    )}
                  </div>

                  {/* Precio */}
                  <div className={styles.formGroup}>
                    <label htmlFor="price">Precio (COP) *</label>
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

                  {/* Categoría */}
                  <div className={styles.formGroup}>
                    <label htmlFor="category">Categoría *</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      <option value="">Selecciona una categoría</option>
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

                  {/* Subcategoría */}
                  <div className={styles.formGroup}>
                    <label htmlFor="subcategory">Subcategoría *</label>
                    <select
                      id="subcategory"
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      disabled={!formData.category || isSubmitting}
                    >
                      <option value="">
                        {formData.category
                          ? 'Selecciona una subcategoría'
                          : 'Primero selecciona una categoría'}
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

                  {/* Imagen */}
                  <div className={styles.formGroup}>
                    <label htmlFor="file">
                      Imagen del Producto {!editingProduct && '*'}
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
                      Formatos: JPG, PNG, WEBP (máximo 5MB)
                    </p>
                    {file && (
                      <div className={styles.fileInfo}>
                        <p className={styles.fileName}>
                          📄 {file.name}
                        </p>
                        <p className={styles.fileSize}>
                          Tamaño: {(file.size / 1024 / 1024).toFixed(2)}MB
                        </p>
                      </div>
                    )}
                    {errors.file && (
                      <p className={styles.errorText}>{errors.file}</p>
                    )}
                  </div>

                  {/* Description - Ocupa todo el ancho */}
                  <div className={styles.formGroupFull}>
                    <label htmlFor="description">Descripción *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe las características del producto..."
                      rows={3}
                      disabled={isSubmitting}
                    />
                    {errors.description && (
                      <p className={styles.errorText}>{errors.description}</p>
                    )}
                  </div>

                  {/* Preview de Imagen */}
                  {imagePreview && (
                    <div className={styles.formGroupFull}>
                      <label>Vista Previa</label>
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
                      <span>Producto Destacado</span>
                    </label>
                  </div>
                </div>

                {/* Mensaje de error general */}
                {errors.submit && (
                  <div className={styles.errorAlert}>
                    <p>{errors.submit}</p>
                  </div>
                )}

                {/* Botones */}
                <div className={styles.modalActions}>
                  <Button
                    type="button"
                    onClick={handleCloseModal}
                    variant="outline"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting
                      ? 'Guardando...'
                      : editingProduct
                      ? 'Actualizar Producto'
                      : 'Crear Producto'}
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
