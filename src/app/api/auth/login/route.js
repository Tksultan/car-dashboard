import { NextResponse } from "next/server"
import { adminUsers } from "@/app/data/adminUsers.js"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    const user = adminUsers.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = `token_${user.id}_${Date.now()}`

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
