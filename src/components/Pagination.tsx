'use client'

import styles from '@/styles/Pagination.module.css'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxVisiblePages?: number
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const getVisiblePages = (): (number | string)[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | string)[] = []
    const halfVisible = Math.floor(maxVisiblePages / 2)

    if (currentPage <= halfVisible + 1) {
      // Near start
      for (let i = 1; i <= maxVisiblePages - 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPages)
    } else if (currentPage >= totalPages - halfVisible) {
      // Near end
      pages.push(1)
      pages.push('...')
      for (let i = totalPages - (maxVisiblePages - 2); i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Middle
      pages.push(1)
      pages.push('...')
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <div className={styles.pagination}>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${styles.button} ${styles.navButton} ${
          currentPage === 1 ? styles.disabled : ''
        }`}
        aria-label="Previous page"
      >
        <ChevronLeftIcon className={styles.icon} />
        <span className={styles.navText}>Previous</span>
      </button>

      {/* Page Numbers */}
      <div className={styles.pages}>
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                ...
              </span>
            )
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`${styles.button} ${styles.pageButton} ${
                currentPage === page ? styles.active : ''
              }`}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${styles.button} ${styles.navButton} ${
          currentPage === totalPages ? styles.disabled : ''
        }`}
        aria-label="Next page"
      >
        <span className={styles.navText}>Next</span>
        <ChevronRightIcon className={styles.icon} />
      </button>
    </div>
  )
}

