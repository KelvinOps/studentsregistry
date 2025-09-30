// app/students/me/route.ts
import { NextRequest, NextResponse } from "next/server";

// Type definitions
interface User {
  id: string;
  email: string;
  role: string;
}

// Mock student data
const mockStudent = {
  id: "3",
  studentId: "STU001",
  email: "student@example.com",
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: "2000-01-15",
  gender: "MALE",
  nationality: "Kenyan",
  phoneNumber: "+254712345678",
  county: "Nairobi",
  subCounty: "Westlands",
  birthCertificateNumber: "BC123456",
  departmentId: "1",
  sessionId: "1",
  registrationDate: "2024-09-01",
  status: "ACTIVE",
  role: "STUDENT",
};

// Helper to get current user from session
function getCurrentUser(_request: NextRequest): User {
  // In production, get from actual session/JWT
  return {
    id: "3",
    email: "student@example.com",
    role: "STUDENT",
  };
}

export async function GET(request: NextRequest) {
  try {
    const user = getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // In production, fetch student data from database using user.id
    if (user.role !== "STUDENT") {
      return NextResponse.json(
        { message: "Not a student account" },
        { status: 403 }
      );
    }

    return NextResponse.json(mockStudent, { status: 200 });
  } catch (error) {
    console.error("Error fetching student data:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching student data" },
      { status: 500 }
    );
  }
}