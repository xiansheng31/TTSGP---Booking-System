export default function LoginPage() {
  return (
    <div style={{padding:'40px'}}>
      <h1>Login Page</h1>

      <div style={{
        width:'350px',
        display:'flex',
        flexDirection:'column',
        gap:'10px',
        marginTop:'20px'
      }}>
        <input
          type="email"
          placeholder="Email"
          style={{padding:'10px'}}
        />

        <input
          type="password"
          placeholder="Password"
          style={{padding:'10px'}}
        />

        <button
          style={{
            padding:'10px',
            cursor:'pointer'
          }}
        >
          Login
        </button>
      </div>
    </div>
  )
}
