export default function FavoritesPage() {
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
        My favorites
      </h1>
      <p style={{ fontSize: '1.125rem', color: '#6B7280', marginBottom: '2rem' }}>
        Your favorite products will appear here
      </p>
      <div style={{
        padding: '3rem',
        background: '#F9FAFB',
        borderRadius: '16px',
        border: '1px solid #E5E7EB'
      }}>
        <p style={{ fontSize: '1rem', color: '#9CA3AF' }}>
          Coming soon! Start adding products to your favorites.
        </p>
      </div>
    </div>
  )
}

