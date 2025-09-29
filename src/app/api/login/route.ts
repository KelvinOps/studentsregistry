// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";

// Mock user database - replace with actual database queries
const mockUsers = [
  {
    id: "1",
    email: "admin@example.com",
    password: "admin123", // In production, use hashed passwords!
    role: "ADMIN",
    firstName: "Admin",
    lastName: "User",
  },
  {
    id: "2",
    email: "staff@example.com",
    password: "staff123",
    role: "STAFF",
    firstName: "Staff",
    lastName: "Member",
  },
  {
    id: "3",
    email: "student@example.com",
    password: "student123",
    role: "STUDENT",
    firstName: "John",
    lastName: "Doe",
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user - replace with actual database query
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // In production, use proper JWT tokens and secure session management
    const userResponse = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    // Create response with user data
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: userResponse,
      },
      { status: 200 }
    );

    // In production, set secure HTTP-only cookies for session management
    // response.cookies.set("session", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "lax",
    //   maxAge: 60 * 60 * 24 * 7, // 7 days
    // });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { message: "Method not allowed" },
    { status: 405 }
  );
}