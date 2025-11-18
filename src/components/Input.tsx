import { InputHTMLAttributes, forwardRef } from 'react'
import styles from '@/styles/Input.module.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = '', ...props }, ref) => {
    return (
      <div className={styles.inputWrapper}>
        {label && (
          <label className={styles.label}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}
        
        <div className={styles.inputContainer}>
          {icon && <div className={styles.icon}>{icon}</div>}
          
          <input
            ref={ref}
            className={`${styles.input} ${icon ? styles.withIcon : ''} ${
              error ? styles.error : ''
            } ${className}`}
            {...props}
          />
          
          <div className={styles.underline} />
        </div>

        {error && <p className={styles.errorText}>{error}</p>}
        {helperText && !error && (
          <p className={styles.helperText}>{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input

