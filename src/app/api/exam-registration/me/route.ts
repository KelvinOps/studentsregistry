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
// TODO: In production, implement proper session/JWT authentication
function getCurrentUser(): User | null {
  // This is a mock implementation
  // In production, extract user from session/JWT token from the request
  return {
    id: "3",
    email: "student@example.com",
    role: "STUDENT",
  };
}

export async function GET(request: NextRequest) {
  try {
    const user = getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Filter registrations for the current user
    const userRegistrations = mockUserRegistrations.filter(
      reg => reg.studentId === user.id
    );

    return NextResponse.json(userRegistrations, { status: 200 });
  } catch (error) {
    console.error("Error fetching user exam registrations:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching your registrations" },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new exam registration
export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role !== "STUDENT") {
      return NextResponse.json(
        { message: "Only students can register for exams" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { examId } = body;

    if (!examId) {
      return NextResponse.json(
        { message: "Exam ID is required" },
        { status: 400 }
      );
    }

    // Check if already registered for this exam
    const existingRegistration = mockUserRegistrations.find(
      reg => reg.examId === examId && reg.studentId === user.id
    );

    if (existingRegistration) {
      return NextResponse.json(
        { message: "You are already registered for this exam" },
        { status: 409 }
      );
    }

    // Create new registration
    const newRegistration: ExamRegistration = {
      id: `reg-${Date.now()}`,
      examId,
      studentId: user.id,
      registrationDate: new Date().toISOString(),
      status: "PENDING",
      paymentStatus: "UNPAID",
    };

    mockUserRegistrations.push(newRegistration);

    return NextResponse.json(newRegistration, { status: 201 });
  } catch (error) {
    console.error("Error creating exam registration:", error);
    return NextResponse.json(
      { message: "An error occurred while registering for the exam" },
      { status: 500 }
    );
  }
}