// app/api/exam-registrations/route.ts
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

// Mock exam registrations storage
const mockUserRegistrations: ExamRegistration[] = [];

// Helper to get current user
// TODO: Implement proper authentication with JWT/session tokens
function getCurrentUser(): User | null {
  // This is a mock implementation
  // In production, extract user from session/JWT token
  return {
    id: "3",
    email: "student@example.com",
    role: "STUDENT",
  };
}

// GET - Fetch all exam registrations for the current user
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

// POST - Create a new exam registration
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

    return NextResponse.json(
      { 
        message: "Successfully registered for exam",
        registration: newRegistration 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating exam registration:", error);
    return NextResponse.json(
      { message: "An error occurred while registering for the exam" },
      { status: 500 }
    );
  }
}

// DELETE - Cancel an exam registration
export async function DELETE(request: NextRequest) {
  try {
    const user = getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const registrationId = searchParams.get("id");

    if (!registrationId) {
      return NextResponse.json(
        { message: "Registration ID is required" },
        { status: 400 }
      );
    }

    const registrationIndex = mockUserRegistrations.findIndex(
      reg => reg.id === registrationId && reg.studentId === user.id
    );

    if (registrationIndex === -1) {
      return NextResponse.json(
        { message: "Registration not found" },
        { status: 404 }
      );
    }

    // Remove the registration
    mockUserRegistrations.splice(registrationIndex, 1);

    return NextResponse.json(
      { message: "Registration cancelled successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting exam registration:", error);
    return NextResponse.json(
      { message: "An error occurred while cancelling the registration" },
      { status: 500 }
    );
  }
}