export default function AboutPage() {
  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ 
        fontSize: '3rem', 
        fontWeight: '800',
        background: 'linear-gradient(135deg, #06B6D4, #EC4899)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        About Techland
      </h1>
      <p style={{ 
        fontSize: '1.25rem', 
        color: '#6B7280', 
        marginBottom: '3rem',
        textAlign: 'center' 
      }}>
        Your trusted destination for cutting-edge tech gadgets
      </p>

      <div style={{
        display: 'grid',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        <div style={{
          padding: '2rem',
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700',
            color: '#1F2937',
            marginBottom: '1rem'
          }}>
            🚀 Our Mission
          </h2>
          <p style={{ fontSize: '1rem', color: '#6B7280', lineHeight: '1.7' }}>
            At Techland, we're passionate about bringing you the latest and greatest tech gadgets from around the world. 
            Whether you're a gamer, a tech enthusiast, or simply looking to upgrade your digital lifestyle, 
            we have everything you need.
          </p>
        </div>

        <div style={{
          padding: '2rem',
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700',
            color: '#1F2937',
            marginBottom: '1rem'
          }}>
            ✨ Why Choose Us?
          </h2>
          <ul style={{ 
            fontSize: '1rem', 
            color: '#6B7280', 
            lineHeight: '1.7',
            listStyle: 'none',
            padding: 0
          }}>
            <li style={{ marginBottom: '0.75rem' }}>✓ Curated selection of premium tech products</li>
            <li style={{ marginBottom: '0.75rem' }}>✓ Competitive prices and exclusive deals</li>
            <li style={{ marginBottom: '0.75rem' }}>✓ Fast and reliable shipping</li>
            <li style={{ marginBottom: '0.75rem' }}>✓ 24/7 customer support</li>
            <li>✓ Secure payment and buyer protection</li>
          </ul>
        </div>
      </div>

      <div style={{
        padding: '3rem',
        background: 'linear-gradient(135deg, #F9FAFB, #EFF6FF)',
        borderRadius: '16px',
        textAlign: 'center'
      }}>
        <h2 style={{ 
          fontSize: '1.75rem', 
          fontWeight: '700',
          color: '#1F2937',
          marginBottom: '1rem'
        }}>
          Ready to explore?
        </h2>
        <p style={{ fontSize: '1rem', color: '#6B7280', marginBottom: '1.5rem' }}>
          Discover our wide range of tech gadgets and find your perfect match!
        </p>
      </div>
    </div>
  )
}

