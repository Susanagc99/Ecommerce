export default function PurchasesPage() {
  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        fontWeight: '800',
        background: 'linear-gradient(135deg, #06B6D4, #EC4899)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '1rem'
      }}>
        My Purchases
      </h1>
      <p style={{ fontSize: '1.125rem', color: '#6B7280', marginBottom: '2rem' }}>
        Track your order history and manage your purchases
      </p>
      <div style={{
        padding: '3rem',
        background: '#F9FAFB',
        borderRadius: '16px',
        border: '1px solid #E5E7EB'
      }}>
        <p style={{ fontSize: '1rem', color: '#9CA3AF' }}>
          Coming soon! Your purchase history will be available here.
        </p>
      </div>
    </div>
  )
}

