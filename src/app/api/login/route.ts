// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";

// Define proper types for users
interface BaseUser {
  id: string;
  email: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
}

interface AdminUser extends BaseUser {
  role: "ADMIN";
}

interface StaffUser extends BaseUser {
  role: "STAFF";
}

interface StudentUser extends BaseUser {
  role: "STUDENT";
  studentId: string;
  department: string;
}

type User = AdminUser | StaffUser | StudentUser;

// Enhanced mock user database with Kenyan student names
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    password: "admin123",
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
  // Students with Kenyan names
  {
    id: "3",
    email: "wanjiku.kamau@student.ac.ke",
    password: "student123",
    role: "STUDENT",
    firstName: "Wanjiku",
    lastName: "Kamau",
    studentId: "STU001",
    department: "Computer Science",
  },
  {
    id: "4",
    email: "omondi.otieno@student.ac.ke",
    password: "student123",
    role: "STUDENT",
    firstName: "Omondi",
    lastName: "Otieno",
    studentId: "STU002",
    department: "Engineering",
  },
  {
    id: "5",
    email: "akinyi.odhiambo@student.ac.ke",
    password: "student123",
    role: "STUDENT",
    firstName: "Akinyi",
    lastName: "Odhiambo",
    studentId: "STU003",
    department: "Business",
  },
  {
    id: "6",
    email: "njoroge.mwangi@student.ac.ke",
    password: "student123",
    role: "STUDENT",
    firstName: "Njoroge",
    lastName: "Mwangi",
    studentId: "STU004",
    department: "Computer Science",
  },
  {
    id: "7",
    email: "chemutai.kiprop@student.ac.ke",
    password: "student123",
    role: "STUDENT",
    firstName: "Chemutai",
    lastName: "Kiprop",
    studentId: "STU005",
    department: "Medicine",
  },
  {
    id: "8",
    email: "mutua.kioko@student.ac.ke",
    password: "student123",
    role: "STUDENT",
    firstName: "Mutua",
    lastName: "Kioko",
    studentId: "STU006",
    department: "Engineering",
  },
  {
    id: "9",
    email: "daniel.wandera@student.ac.ke",
    password: "student123",
    role: "STUDENT",
    firstName: "Wairimu",
    lastName: "Githinji",
    studentId: "STU007",
    department: "Law",
  },
  {
    id: "10",
    email: "simon.sifuna@student.ac.ke",
    password: "student123",
    role: "STUDENT",
    firstName: "Kibet",
    lastName: "Rotich",
    studentId: "STU008",
    department: "Computer Science",
  },
  
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Build response based on user type
    const baseResponse = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    // Type guard to check if user is a student
    const userResponse = user.role === "STUDENT" 
      ? {
          ...baseResponse,
          studentId: user.studentId,
          department: user.department,
        }
      : baseResponse;

    return NextResponse.json(
      {
        message: "Login successful",
        user: userResponse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Method not allowed" },
    { status: 405 }
  );
}