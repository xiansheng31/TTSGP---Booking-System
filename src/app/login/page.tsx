'use client'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-[400px]">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Login Page
        </h1>

        <input
          type="text"
          placeholder="Email"
          className="w-full p-3 border rounded mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded mb-6"
        />

        <button
          type="button"
          onClick={() => {
            alert('Button clicked')
            console.log('BUTTON WORKING')
          }}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 cursor-pointer"
        >
          Login
        </button>

      </div>
    </div>
  )
}
