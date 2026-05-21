'use client'

export default function LoginPage() {
  return (
    <div style={{ padding: '50px' }}>
      <h1>TEST PAGE 🔥</h1>

      <button
        onClick={() => {
          alert("BUTTON WORKS")
        }}
        style={{
          padding: '20px',
          background: 'red',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        CLICK ME
      </button>
    </div>
  )
}
