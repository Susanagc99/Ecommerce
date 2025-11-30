// Format price to COP (Colombian Pesos)
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Format number with commas
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US')
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// SweetAlert2 confirm delete helper
export async function confirmDelete(
  title: string = 'Are you sure?',
  text: string = "You won't be able to revert this!",
  confirmButtonText: string = 'Yes, delete it!'
): Promise<boolean> {
  const { default: Swal } = await import('sweetalert2')
  
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#06B6D4', // primary color
    cancelButtonColor: '#EC4899',  // secondary color
    confirmButtonText,
    cancelButtonText: 'Cancel',
    background: '#FFFFFF',
    color: '#1F2937',
    allowOutsideClick: false,
    allowEscapeKey: true,
  })

  return result.isConfirmed
}



