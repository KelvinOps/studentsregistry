// app/api/exam-registrations/me/route.ts
import { NextRequest, NextResponse } from "next/server";

// Type definitions
interface ExamRegistration {
  id: string;
  examId: string;
  studentId: string;
  registrationDate: string;
  status: string;
  paymentStatus: string;
}

interface User {
  id: string;
  email: string;
  role: string;
}

// Mock exam registrations for the current student
const mockUserRegistrations: ExamRegistration[] = [];

// Helper to get current user
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

    return NextResponse.json(mockUserRegistrations, { status: 200 });
  } catch (error) {
    console.error("Error fetching user exam registrations:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching your registrations" },
      { status: 500 }
    );
  }
}