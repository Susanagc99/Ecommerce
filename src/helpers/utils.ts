// Format price to COP (Colombian Pesos)
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
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



