"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import { useNotification } from "../context/NotificationContext"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth()
  const { addNotification } = useNotification()
  const router = useRouter()

  useEffect(() => {
    if (loading) return; 
  
    if (user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);
  
  
  

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await login(email, password)

    if (result.success) {
      addNotification("Login successful!", "success")
      router.push("/dashboard")
    } else {
      addNotification(result.error || "Login failed", "error")
    }

    setLoading(false)
  }

  const demoCredentials = [
    { email: "admin@carrentals.com", password: "admin123", role: "Admin" },
    { email: "manager@carrentals.com", password: "manager123", role: "Manager" },
  ]

  const fillCredentials = (email, password) => {
    setEmail(email)
    setPassword(password)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-600 mt-2">Sign in to manage car rentals</p>
        </div>

        {/* Login Form */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-medium text-gray-900 mb-3">Demo Credentials</h3>
          <div className="space-y-2">
            {demoCredentials.map((cred, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <div className="font-medium text-sm">{cred.role}</div>
                  <div className="text-xs text-gray-600">{cred.email}</div>
                </div>
                <button
                  onClick={() => fillCredentials(cred.email, cred.password)}
                  className="text-blue-600 text-sm hover:text-blue-800"
                >
                  Use
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
